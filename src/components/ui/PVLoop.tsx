import { useRef, useEffect, useCallback } from 'react'
import { useSimStore } from '../../store/useSimStore'
import { computePhaseDurations } from '../../data/cardiac-timing'

const WIDTH = 280
const HEIGHT = 240
const M = { top: 20, right: 16, bottom: 28, left: 44 }
const PW = WIDTH - M.left - M.right
const PH = HEIGHT - M.top - M.bottom

/**
 * Pressure-Volume Loop — the single most diagnostic diagram in cardiology.
 *
 * X-axis: LV volume (mL) — 50 to 130
 * Y-axis: LV pressure (mmHg) — 0 to 140
 *
 * The loop traces counter-clockwise:
 * A → B: Isovolumetric contraction (vertical rise, constant volume)
 * B → C: Ejection (pressure rises then falls, volume decreases)
 * C → D: Isovolumetric relaxation (vertical drop, constant volume)
 * D → A: Filling (pressure low, volume increases)
 *
 * The area inside the loop = stroke work (mechanical energy per beat).
 * ESPVR (end-systolic pressure-volume relationship) = contractility line
 * EDPVR (end-diastolic pressure-volume relationship) = compliance curve
 */

// Generate PV loop points for one cycle
function generatePVLoop(numPoints: number): { v: number; p: number }[] {
  const points: { v: number; p: number }[] = []

  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints

    let vol: number
    let press: number

    // Phase A→B: Isovolumetric contraction (t: 0.12-0.18)
    // Volume constant at ~120, pressure rises 8→120
    if (t < 0.12) {
      // Filling (D→A): volume rises, pressure low
      const p = t / 0.12
      vol = 50 + p * 70 // 50→120
      press = 2 + p * p * 8 // exponential compliance curve (EDPVR)
    } else if (t < 0.18) {
      // Isovolumetric contraction (A→B): vertical line up
      const p = (t - 0.12) / 0.06
      vol = 120
      press = 10 + p * p * 110 // 10→120
    } else if (t < 0.47) {
      // Ejection (B→C): volume decreases, pressure peaks then falls
      const p = (t - 0.18) / 0.29
      vol = 120 - p * 70 // 120→50
      // Pressure: rises slightly, peaks, then falls along ESPVR
      if (p < 0.3) {
        press = 120 + p * 10 // slight overshoot to peak
      } else {
        press = 130 - (p - 0.3) * (130 - 90) / 0.7 // decline along ESPVR
      }
    } else if (t < 0.55) {
      // Isovolumetric relaxation (C→D): vertical line down
      const p = (t - 0.47) / 0.08
      vol = 50
      press = 90 * (1 - p * p) // quadratic fall
    } else {
      // Filling (D→A): this wraps to the start
      const p = (t - 0.55) / 0.45
      vol = 50 + p * 70
      press = 2 + p * p * 8
    }

    points.push({ v: vol, p: press })
  }

  return points
}

function scaleX(vol: number): number {
  return M.left + ((vol - 40) / 100) * PW
}

function scaleY(press: number): number {
  return M.top + (1 - press / 140) * PH
}

export function PVLoop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const loopPoints = useRef(generatePVLoop(200))

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = useSimStore.getState()
    const durations = computePhaseDurations(state.bpm)
    const cycleDuration = durations.reduce((a, b) => a + b, 0)
    const progress = state.cycleElapsed / cycleDuration

    // Background
    ctx.fillStyle = 'rgba(10, 12, 18, 0.95)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Grid
    ctx.strokeStyle = 'rgba(180, 175, 165, 0.04)'
    ctx.lineWidth = 0.5
    for (const p of [20, 40, 60, 80, 100, 120]) {
      const y = scaleY(p)
      ctx.beginPath()
      ctx.moveTo(M.left, y)
      ctx.lineTo(WIDTH - M.right, y)
      ctx.stroke()
    }
    for (const v of [60, 80, 100, 120]) {
      const x = scaleX(v)
      ctx.beginPath()
      ctx.moveTo(x, M.top)
      ctx.lineTo(x, M.top + PH)
      ctx.stroke()
    }

    // Axes labels
    ctx.fillStyle = 'rgba(180, 175, 165, 0.25)'
    ctx.font = '7px "IBM Plex Mono", monospace'
    ctx.textAlign = 'right'
    for (const p of [0, 40, 80, 120]) {
      ctx.fillText(p.toString(), M.left - 4, scaleY(p) + 3)
    }
    ctx.textAlign = 'center'
    for (const v of [60, 80, 100, 120]) {
      ctx.fillText(v.toString(), scaleX(v), HEIGHT - 8)
    }

    // Axis titles
    ctx.fillStyle = 'rgba(180, 175, 165, 0.15)'
    ctx.font = '7px "IBM Plex Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('LV Volume (mL)', M.left + PW / 2, HEIGHT - 1)
    ctx.save()
    ctx.translate(8, M.top + PH / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('LV Pressure (mmHg)', 0, 0)
    ctx.restore()

    // EDPVR line (compliance curve) — dashed
    ctx.strokeStyle = 'rgba(180, 175, 165, 0.12)'
    ctx.lineWidth = 0.8
    ctx.setLineDash([3, 4])
    ctx.beginPath()
    for (let v = 40; v <= 140; v += 2) {
      const p = 2 + ((v - 40) / 100) * ((v - 40) / 100) * 12
      const x = scaleX(v)
      const y = scaleY(p)
      if (v === 40) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // ESPVR line (contractility) — dashed
    ctx.strokeStyle = 'rgba(180, 175, 165, 0.12)'
    ctx.setLineDash([3, 4])
    ctx.beginPath()
    ctx.moveTo(scaleX(20), scaleY(0))
    ctx.lineTo(scaleX(50), scaleY(130))
    ctx.stroke()
    ctx.setLineDash([])

    // PV Loop — the main curve
    const pts = loopPoints.current
    ctx.strokeStyle = '#CC6644'
    ctx.lineWidth = 1.8
    ctx.beginPath()
    for (let i = 0; i < pts.length; i++) {
      const x = scaleX(pts[i].v)
      const y = scaleY(pts[i].p)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()

    // Fill the loop area with subtle color (stroke work)
    ctx.fillStyle = 'rgba(204, 102, 68, 0.06)'
    ctx.fill()

    // Current position dot on the loop
    const currentIdx = Math.floor(progress * pts.length) % pts.length
    const current = pts[currentIdx]
    const cx = scaleX(current.v)
    const cy = scaleY(current.p)

    // Glow
    ctx.beginPath()
    ctx.arc(cx, cy, 6, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(204, 102, 68, 0.3)'
    ctx.fill()

    // Dot
    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#CC6644'
    ctx.fill()

    // Value label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '7px "IBM Plex Mono", monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`${Math.round(current.p)}mmHg`, cx + 8, cy - 2)
    ctx.fillText(`${Math.round(current.v)}mL`, cx + 8, cy + 8)

    // Corner labels for key points
    ctx.fillStyle = 'rgba(180, 175, 165, 0.3)'
    ctx.font = '7px "IBM Plex Mono", monospace'
    // EDV (bottom right of loop)
    ctx.textAlign = 'right'
    ctx.fillText('EDV', scaleX(122), scaleY(5))
    // ESV (bottom left of loop)
    ctx.textAlign = 'left'
    ctx.fillText('ESV', scaleX(48), scaleY(5))
    // Peak (top of loop)
    ctx.textAlign = 'center'
    ctx.fillText('Peak Systole', scaleX(85), scaleY(132))

    // Title
    ctx.fillStyle = 'rgba(180, 175, 165, 0.4)'
    ctx.font = '8px "IBM Plex Mono", monospace'
    ctx.textAlign = 'left'
    ctx.fillText('PRESSURE-VOLUME LOOP', M.left, M.top - 6)

    // Stroke work label
    ctx.fillStyle = 'rgba(204, 102, 68, 0.3)'
    ctx.font = '7px "IBM Plex Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Stroke Work', scaleX(85), scaleY(65))

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
      className="pv-canvas"
      aria-label="Pressure-Volume loop diagram"
    />
  )
}
