import { useRef, useEffect, useCallback } from 'react'
import { useSimStore } from '../../store/useSimStore'
import { computePhaseDurations } from '../../data/cardiac-timing'

const WIDTH = 500
const HEIGHT = 280
const MARGIN = { top: 10, right: 10, bottom: 25, left: 45 }
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom

/**
 * Wiggers diagram — the classic stacked chart showing:
 * - Aortic pressure (red)
 * - Left ventricular pressure (blue)
 * - Left atrial pressure (purple)
 * - Ventricular volume (green, lower)
 * - ECG (green, top strip)
 * - Phase markers with vertical lines
 * - Current position cursor
 */

// Pressure curves (normalized 0-1 over one cycle, approximate)
function aorticPressure(t: number): number {
  // ~80 diastolic, ~120 systolic
  if (t < 0.12) return 0.6 // diastole
  if (t < 0.18) return 0.6 + (t - 0.12) / 0.06 * 0.4 // rapid rise
  if (t < 0.35) return 1.0 - (t - 0.18) / 0.17 * 0.15 // plateau-ish
  if (t < 0.48) return 0.85 - (t - 0.35) / 0.13 * 0.1 // dicrotic notch area
  return 0.65 + Math.sin((t - 0.48) / 0.52 * Math.PI * 0.5) * 0.05 // slow decline
}

function lvPressure(t: number): number {
  if (t < 0.12) return 0.05 + t / 0.12 * 0.03 // end diastole
  if (t < 0.18) return 0.08 + (t - 0.12) / 0.06 * 0.92 // isovolumetric contraction
  if (t < 0.35) return 1.0 - (t - 0.18) / 0.17 * 0.05 // ejection peak
  if (t < 0.45) return 0.95 - (t - 0.35) / 0.1 * 0.85 // isovolumetric relaxation
  return 0.1 - (t - 0.45) / 0.55 * 0.05 // diastole
}

function laPressure(t: number): number {
  // a wave, c wave, v wave pattern
  if (t < 0.08) return 0.08 + Math.sin(t / 0.08 * Math.PI) * 0.05 // a wave
  if (t < 0.15) return 0.08 + (t - 0.08) / 0.07 * 0.03 // c wave
  if (t < 0.4) return 0.11 + (t - 0.15) / 0.25 * 0.07 // v wave rise
  if (t < 0.5) return 0.18 - (t - 0.4) / 0.1 * 0.1 // y descent
  return 0.08
}

function ventricularVolume(t: number): number {
  // ~130mL end diastolic, ~60mL end systolic
  if (t < 0.12) return 0.95 + t / 0.12 * 0.05 // atrial kick fills to max
  if (t < 0.18) return 1.0 // isovolumetric — constant
  if (t < 0.35) return 1.0 - (t - 0.18) / 0.17 * 0.55 // rapid ejection
  if (t < 0.45) return 0.45 // end systolic + isovolumetric
  if (t < 0.65) return 0.45 + (t - 0.45) / 0.2 * 0.4 // rapid filling
  return 0.85 + (t - 0.65) / 0.35 * 0.1 // slow filling
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

    // Phase divisions
    let accumulated = 0
    ctx.strokeStyle = 'rgba(180, 175, 165, 0.08)'
    ctx.lineWidth = 0.5
    ctx.font = '8px "IBM Plex Mono", monospace'
    ctx.fillStyle = 'rgba(180, 175, 165, 0.25)'
    ctx.textAlign = 'center'

    for (let i = 0; i < durations.length; i++) {
      const x = MARGIN.left + (accumulated / cycleDuration) * PLOT_W
      accumulated += durations[i]
      ctx.beginPath()
      ctx.moveTo(x, MARGIN.top)
      ctx.lineTo(x, HEIGHT - MARGIN.bottom)
      ctx.stroke()
      const midX = MARGIN.left + ((accumulated - durations[i] / 2) / cycleDuration) * PLOT_W
      ctx.fillText(`P${i + 1}`, midX, HEIGHT - 8)
    }

    // Y-axis labels
    ctx.fillStyle = 'rgba(180, 175, 165, 0.3)'
    ctx.textAlign = 'right'
    ctx.font = '7px "IBM Plex Mono", monospace'
    ctx.fillText('120', MARGIN.left - 4, MARGIN.top + 12)
    ctx.fillText('80', MARGIN.left - 4, MARGIN.top + PLOT_H * 0.35)
    ctx.fillText('mmHg', MARGIN.left - 4, MARGIN.top + PLOT_H * 0.55)
    ctx.fillText('Vol', MARGIN.left - 4, MARGIN.top + PLOT_H * 0.8)

    // Draw curves
    const drawCurve = (fn: (t: number) => number, color: string, yOffset: number, yScale: number) => {
      ctx.strokeStyle = color
      ctx.lineWidth = 1.2
      ctx.beginPath()
      for (let px = 0; px < PLOT_W; px++) {
        const t = px / PLOT_W
        const val = fn(t)
        const x = MARGIN.left + px
        const y = MARGIN.top + yOffset + (1 - val) * yScale
        if (px === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Pressure curves (top 60% of plot)
    const pressureH = PLOT_H * 0.55
    drawCurve(aorticPressure, '#E05050', 0, pressureH)      // Aortic — red
    drawCurve(lvPressure, '#5080E0', 0, pressureH)           // LV — blue
    drawCurve(laPressure, '#A060C0', 0, pressureH)           // LA — purple

    // Volume curve (bottom 30%)
    const volumeOffset = PLOT_H * 0.65
    const volumeH = PLOT_H * 0.3
    drawCurve(ventricularVolume, '#50A060', volumeOffset, volumeH)

    // Current position cursor
    const cursorX = MARGIN.left + cycleProgress * PLOT_W
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(cursorX, MARGIN.top)
    ctx.lineTo(cursorX, HEIGHT - MARGIN.bottom)
    ctx.stroke()
    ctx.setLineDash([])

    // Cursor dot
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(cursorX, MARGIN.top + 4, 3, 0, Math.PI * 2)
    ctx.fill()

    // Legend
    ctx.font = '7px "IBM Plex Mono", monospace'
    const legends = [
      { label: 'Aortic', color: '#E05050' },
      { label: 'LV', color: '#5080E0' },
      { label: 'LA', color: '#A060C0' },
      { label: 'Volume', color: '#50A060' },
    ]
    let lx = MARGIN.left
    legends.forEach(({ label, color }) => {
      ctx.fillStyle = color
      ctx.fillRect(lx, MARGIN.top + 2, 8, 2)
      ctx.fillStyle = 'rgba(180, 175, 165, 0.5)'
      ctx.textAlign = 'left'
      ctx.fillText(label, lx + 10, MARGIN.top + 6)
      lx += 55
    })

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
