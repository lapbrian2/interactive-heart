import { useRef, useMemo, useEffect } from 'react'
import { useSimStore } from '../store/useSimStore'

/**
 * Enhanced heart sound synthesis — S1, S2 with realistic frequency content.
 *
 * S1 ("lub"): Two components — mitral (M1) + tricuspid (T1) closure
 *   Low frequency 25-45Hz + mid 50-100Hz, duration 150ms
 *   M1 precedes T1 by 20ms
 *
 * S2 ("dub"): Two components — aortic (A2) + pulmonary (P2) closure
 *   Higher frequency 50-80Hz, shorter duration 100ms
 *   A2 precedes P2 by 30ms (physiological splitting)
 */

let audioCtx: AudioContext | null = null

if (typeof window !== 'undefined') {
  (window as any).__audioContexts = (window as any).__audioContexts || []
}

function getCtx(): AudioContext | null {
  if (audioCtx) return audioCtx
  try {
    audioCtx = new AudioContext();
    (window as any).__audioContexts.push(audioCtx)
    return audioCtx
  } catch { return null }
}

function playComponent(
  ctx: AudioContext,
  freq: number,
  duration: number,
  gain: number,
  delay: number,
  freqEnd?: number
) {
  const now = ctx.currentTime + delay

  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, now)
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(freq * 3, now)

  g.gain.setValueAtTime(gain, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + duration)

  osc.connect(filter)
  filter.connect(g)
  g.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + duration + 0.01)
}

function playS1() {
  const ctx = getCtx()
  if (!ctx || ctx.state === 'suspended') return

  // M1 — mitral component (first, louder)
  playComponent(ctx, 40, 0.14, 0.25, 0, 22)
  playComponent(ctx, 80, 0.1, 0.12, 0, 45)

  // T1 — tricuspid component (20ms later, quieter)
  playComponent(ctx, 35, 0.12, 0.15, 0.02, 20)
  playComponent(ctx, 70, 0.08, 0.08, 0.02, 40)
}

function playS2() {
  const ctx = getCtx()
  if (!ctx || ctx.state === 'suspended') return

  // A2 — aortic component (first)
  playComponent(ctx, 60, 0.09, 0.18, 0, 35)
  playComponent(ctx, 110, 0.06, 0.08, 0, 55)

  // P2 — pulmonary component (30ms later — physiological splitting)
  playComponent(ctx, 55, 0.08, 0.12, 0.03, 32)
  playComponent(ctx, 95, 0.05, 0.06, 0.03, 48)
}

export function useHeartSounds() {
  const lastPhaseRef = useRef('P7')

  useEffect(() => {
    const initAudio = () => {
      getCtx()
      window.removeEventListener('click', initAudio)
      window.removeEventListener('keydown', initAudio)
    }
    window.addEventListener('click', initAudio, { once: true })
    window.addEventListener('keydown', initAudio, { once: true })
    return () => {
      window.removeEventListener('click', initAudio)
      window.removeEventListener('keydown', initAudio)
    }
  }, [])

  useMemo(() => {
    return useSimStore.subscribe(
      (s) => s.currentPhase,
      (phase) => {
        const prev = lastPhaseRef.current
        lastPhaseRef.current = phase

        if (phase === 'P2' && prev !== 'P2') playS1()
        if (phase === 'P5' && prev !== 'P5') playS2()
      }
    )
  }, [])
}
