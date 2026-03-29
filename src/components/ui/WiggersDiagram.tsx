import { useRef, useEffect, useCallback } from 'react'
import { useSimStore } from '../../store/useSimStore'
import { computePhaseDurations } from '../../data/cardiac-timing'

const WIDTH = 500
const HEIGHT = 280
const M = { top: 20, right: 12, bottom: 28, left: 48 }
const PW = WIDTH - M.left - M.right
const PH = HEIGHT - M.top - M.bottom

/**
 * Medically accurate Wiggers diagram curves.
 * Based on standard Wiggers diagram values:
 * - LV pressure: 8 → 120 → 8 mmHg
 * - Aortic pressure: 80 → 120 → 80 mmHg (with dicrotic notch)
 * - LA pressure: 5-15 mmHg (a, c, v waves)
 * - LV volume: 120 → 50 → 120 mL
 *
 * All curves use normalized time (0-1) across one cardiac cycle.
 * Phase boundaries are marked with vertical lines.
 */

// LV Pressure (mmHg) — 0 to 120 range
function lvPressure(t: number): number {
  // P1 (0-0.12): end-diastolic, slight rise from atrial kick
  if (t < 0.12) return 8 + (t / 0.12) * 4
  // P2 (0.12-0.18): isovolumetric contraction — steep rise
  if (t < 0.18) {
    const p = (t - 0.12) / 0.06
    return 12 + p * p * 108 // quadratic rise for sharp upstroke
  }
  // P3 (0.18-0.31): rapid ejection — peak plateau
  if (t < 0.31) {
    const p = (t - 0.18) / 0.13
    return 120 - p * 5 // slight decline from peak
  }
  // P4 (0.31-0.47): reduced ejection — declining
  if (t < 0.47) {
    const p = (t - 0.31) / 0.16
    return 115 - p * 15
  }
  // P5 (0.47-0.55): isovolumetric relaxation — steep fall
  if (t < 0.55) {
    const p = (t - 0.47) / 0.08
    return 100 * (1 - p * p) // quadratic fall
  }
  // P6-P7 (0.55-1.0): diastole — low
  const p = (t - 0.55) / 0.45
  return 5 + p * 3
}

// Aortic Pressure (mmHg) — 80 to 120 range
function aorticPressure(t: number): number {
  // P1-P2 (0-0.18): diastolic — slowly declining
  if (t < 0.18) return 80 - (t / 0.18) * 2
  // P3 onset: aortic valve opens — rapid rise
  if (t < 0.22) {
    const p = (t - 0.18) / 0.04
    return 78 + p * 42 // rapid rise to systolic
  }
  // P3 (0.22-0.31): systolic plateau
  if (t < 0.31) {
    const p = (t - 0.22) / 0.09
    return 120 - p * 8
  }
  // P4 (0.31-0.47): declining
  if (t < 0.47) {
    const p = (t - 0.31) / 0.16
    return 112 - p * 22
  }
  // P5 onset: DICROTIC NOTCH — aortic valve closure
  if (t < 0.50) {
    const p = (t - 0.47) / 0.03
    if (p < 0.5) return 90 - p * 12 // brief dip
    return 84 + (p - 0.5) * 8 // bounce back
  }
  // P5-P7: diastolic decline
  const p = (t - 0.50) / 0.50
  return 88 - p * 8
}

// LA Pressure (mmHg) — 5 to 15 range (a, c, v waves)
function laPressure(t: number): number {
  // a wave (P1): atrial contraction
  if (t < 0.12) {
    const p = t / 0.12
    return 8 + Math.sin(p * Math.PI) * 4 // a wave peak ~12
  }
  // x descent + c wave (P2)
  if (t < 0.20) {
    const p = (t - 0.12) / 0.08
    return 8 - p * 3 + Math.sin(p * Math.PI) * 2 // c wave
  }
  // v wave build (P3-P4): atrium filling passively
  if (t < 0.47) {
    const p = (t - 0.20) / 0.27
    return 7 + p * 8 // v wave rising to ~15
  }
  // y descent (P5-P6): mitral opens, atrium empties
  if (t < 0.65) {
    const p = (t - 0.47) / 0.18
    return 15 - p * 10 // sharp drop
  }
  // P7: equilibrium
  const p = (t - 0.65) / 0.35
  return 5 + p * 3
}

// LV Volume (mL) — 50 to 120 range
function lvVolume(t: number): number {
  // P1 (0-0.12): atrial kick — final filling
  if (t < 0.12) {
    const p = t / 0.12
    return 110 + p * 10 // 110 → 120 (EDV)
  }
  // P2 (0.12-0.18): isovolumetric — constant
  if (t < 0.18) return 120
  // P3 (0.18-0.31): rapid ejection — steep drop
  if (t < 0.31) {
    const p = (t - 0.18) / 0.13
    return 120 - p * 50 // 120 → 70 (70% of SV)
  }
  // P4 (0.31-0.47): reduced ejection — slower drop
  if (t < 0.47) {
    const p = (t - 0.31) / 0.16
    return 70 - p * 20 // 70 → 50 (ESV)
  }
  // P5 (0.47-0.55): isovolumetric relaxation — constant
  if (t < 0.55) return 50
  // P6 (0.55-0.68): rapid filling — steep rise
  if (t < 0.68) {
    const p = (t - 0.55) / 0.13
    return 50 + p * 45 // 50 → 95 (75% of filling)
  }
  // P7 (0.68-1.0): diastasis — slow filling
  const p = (t - 0.68) / 0.32
  return 95 + p * 15 // 95 → 110
}

// Scale value to pixel Y position
function scaleY(value: number, min: number, max: number, yTop: number, yHeight: number): number {
  return yTop + (1 - (value - min) / (max - min)) * yHeight
}

export function WiggersDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = useSimStore.getState()
    const durations = computePhaseDurations(state.bpm)
    const cycleDuration = durations.reduce((a, b) => a + b, 0)
    const cycleProgress = state.cycleElapsed / cycleDuration

    // Background
    ctx.fillStyle = 'rgba(10, 12, 18, 0.95)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Pressure section (top 55%)
    const pressH = PH * 0.52
    const pressTop = M.top
    // Volume section (bottom 35%)
    const volH = PH * 0.32
    const volTop = M.top + PH * 0.62

    // Phase boundary lines + labels
    let acc = 0
    ctx.textAlign = 'center'
    for (let i = 0; i < durations.length; i++) {
      const x = M.left + (acc / cycleDuration) * PW
      acc += durations[i]
      // Vertical line
      ctx.strokeStyle = 'rgba(180, 175, 165, 0.06)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(x, M.top)
      ctx.lineTo(x, HEIGHT - M.bottom)
      ctx.stroke()
      // Phase label
      const midX = M.left + ((acc - durations[i] / 2) / cycleDuration) * PW
      ctx.fillStyle = 'rgba(180, 175, 165, 0.2)'
      ctx.font = '8px "IBM Plex Mono", monospace'
      ctx.fillText(`P${i + 1}`, midX, HEIGHT - 10)
    }

    // Y-axis labels
    ctx.fillStyle = 'rgba(180, 175, 165, 0.25)'
    ctx.textAlign = 'right'
    ctx.font = '8px "IBM Plex Mono", monospace'
    ctx.fillText('120', M.left - 5, pressTop + 10)
    ctx.fillText('80', M.left - 5, scaleY(80, 0, 130, pressTop, pressH))
    ctx.fillText('0', M.left - 5, pressTop + pressH - 2)
    ctx.fillStyle = 'rgba(180, 175, 165, 0.15)'
    ctx.font = '7px "IBM Plex Mono", monospace'
    ctx.fillText('mmHg', M.left - 5, pressTop + pressH + 12)
    ctx.fillText('mL', M.left - 5, volTop + volH + 12)
    ctx.fillText('120', M.left - 5, volTop + 8)
    ctx.fillText('50', M.left - 5, volTop + volH - 2)

    // Horizontal grid lines (pressure)
    ctx.strokeStyle = 'rgba(180, 175, 165, 0.04)'
    ctx.lineWidth = 0.5
    for (const val of [40, 80, 120]) {
      const y = scaleY(val, 0, 130, pressTop, pressH)
      ctx.beginPath()
      ctx.moveTo(M.left, y)
      ctx.lineTo(WIDTH - M.right, y)
      ctx.stroke()
    }

    // Draw curves
    const drawCurve = (fn: (t: number) => number, color: string, min: number, max: number, yTop: number, yH: number, lineWidth: number) => {
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      for (let px = 0; px <= PW; px++) {
        const t = px / PW
        const val = fn(t)
        const x = M.left + px
        const y = scaleY(val, min, max, yTop, yH)
        if (px === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Pressure curves
    drawCurve(aorticPressure, '#E05050', 0, 130, pressTop, pressH, 1.5) // Aortic — red
    drawCurve(lvPressure, '#5080E0', 0, 130, pressTop, pressH, 1.5)      // LV — blue
    drawCurve(laPressure, '#A060C0', 0, 130, pressTop, pressH, 1.0)      // LA — purple

    // Volume curve
    drawCurve(lvVolume, '#40A855', 40, 130, volTop, volH, 1.5) // Volume — green

    // Current position cursor — vertical line
    const cursorX = M.left + cycleProgress * PW
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 1
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    ctx.moveTo(cursorX, M.top)
    ctx.lineTo(cursorX, HEIGHT - M.bottom)
    ctx.stroke()
    ctx.setLineDash([])

    // Cursor dots on each curve
    const dotSize = 3
    const drawDot = (fn: (t: number) => number, color: string, min: number, max: number, yTop: number, yH: number) => {
      const val = fn(cycleProgress)
      const y = scaleY(val, min, max, yTop, yH)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(cursorX, y, dotSize, 0, Math.PI * 2)
      ctx.fill()
      // Value label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '8px "IBM Plex Mono", monospace'
      ctx.textAlign = 'left'
      ctx.fillText(Math.round(val).toString(), cursorX + 6, y + 3)
    }

    drawDot(lvPressure, '#5080E0', 0, 130, pressTop, pressH)
    drawDot(aorticPressure, '#E05050', 0, 130, pressTop, pressH)
    drawDot(lvVolume, '#40A855', 40, 130, volTop, volH)

    // Legend
    ctx.font = '8px "IBM Plex Mono", monospace'
    ctx.textAlign = 'left'
    const legends = [
      { label: 'Aortic', color: '#E05050', x: M.left },
      { label: 'LV', color: '#5080E0', x: M.left + 65 },
      { label: 'LA', color: '#A060C0', x: M.left + 110 },
      { label: 'Volume', color: '#40A855', x: M.left + 150 },
    ]
    legends.forEach(({ label, color, x }) => {
      ctx.fillStyle = color
      ctx.fillRect(x, M.top - 12, 12, 2)
      ctx.fillStyle = 'rgba(180, 175, 165, 0.45)'
      ctx.fillText(label, x + 15, M.top - 8)
    })

    // Valve event markers on x-axis
    ctx.font = '6px "IBM Plex Mono", monospace'
    ctx.fillStyle = 'rgba(180, 175, 165, 0.2)'
    ctx.textAlign = 'center'
    // S1 at ~0.12 (AV valves close)
    const s1X = M.left + 0.12 * PW
    ctx.fillText('S1', s1X, HEIGHT - 18)
    // Aortic opens at ~0.18
    const aoX = M.left + 0.18 * PW
    ctx.fillText('AV\u2191', aoX, HEIGHT - 18)
    // S2 at ~0.47 (semilunar close)
    const s2X = M.left + 0.47 * PW
    ctx.fillText('S2', s2X, HEIGHT - 18)
    // Mitral opens at ~0.55
    const moX = M.left + 0.55 * PW
    ctx.fillText('MV\u2191', moX, HEIGHT - 18)

    rafRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      className="wiggers-canvas"
      aria-label="Wiggers diagram — pressure, volume, and ECG over one cardiac cycle"
    />
  )
}
