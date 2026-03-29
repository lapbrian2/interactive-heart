import { useRef, useEffect, useCallback } from 'react'
import { useSimStore } from '../../store/useSimStore'
import { computePhaseDurations } from '../../data/cardiac-timing'

const WIDTH = 400
const HEIGHT = 100
const BASELINE_Y = HEIGHT * 0.6
const SCROLL_SPEED = 80

function ecgValue(cycleElapsed: number, phaseDurations: number[]): number {
  const p1End = phaseDurations[0]
  const p2End = p1End + phaseDurations[1]
  const p3End = p2End + phaseDurations[2]
  const p4End = p3End + phaseDurations[3]

  if (cycleElapsed < p1End) {
    const t = cycleElapsed / p1End
    return Math.sin(t * Math.PI) * 8
  }

  if (cycleElapsed < p2End) {
    const t = (cycleElapsed - p1End) / phaseDurations[1]
    if (t < 0.2) return -5 * (t / 0.2)
    if (t < 0.5) return -5 + 45 * ((t - 0.2) / 0.3)
    if (t < 0.8) return 40 - 50 * ((t - 0.5) / 0.3)
    return -10 + 10 * ((t - 0.8) / 0.2)
  }

  if (cycleElapsed > p3End && cycleElapsed < p4End) {
    const t = (cycleElapsed - p3End) / phaseDurations[3]
    return Math.sin(t * Math.PI) * 12
  }

  return 0
}

export function ECGTrace() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bufferRef = useRef<number[]>(new Array(WIDTH).fill(0))
  const writeIndexRef = useRef(0)
  const lastTimeRef = useRef(0)
  const rafRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = useSimStore.getState()
    const now = performance.now()
    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1)
    lastTimeRef.current = now

    const durations = computePhaseDurations(state.bpm)
    const pixelsToAdvance = Math.max(1, Math.round(dt * SCROLL_SPEED))

    for (let i = 0; i < pixelsToAdvance; i++) {
      bufferRef.current[writeIndexRef.current % WIDTH] = ecgValue(
        state.cycleElapsed,
        durations
      )
      writeIndexRef.current++
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 0.5
    for (let y = 0; y < HEIGHT; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(WIDTH, y)
      ctx.stroke()
    }

    // Waveform
    ctx.strokeStyle = '#4caf50'
    ctx.lineWidth = 1.5
    ctx.beginPath()

    const readStart = writeIndexRef.current
    for (let x = 0; x < WIDTH; x++) {
      const idx = (readStart + x) % WIDTH
      const y = BASELINE_Y - bufferRef.current[idx]
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    rafRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    lastTimeRef.current = performance.now()
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      className="ecg-canvas"
      aria-label="Real-time ECG trace"
    />
  )
}
