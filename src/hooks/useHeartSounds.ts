import { useRef, useMemo, useEffect } from 'react'
import { useSimStore } from '../store/useSimStore'

/**
 * Synthesizes S1 ("lub") and S2 ("dub") heart sounds using Web Audio API.
 * S1 plays at P2 onset (AV valve closure).
 * S2 plays at P5 onset (semilunar valve closure).
 *
 * Uses oscillators + filters to approximate real heart sound frequencies:
 * S1: ~25-45 Hz, longer duration, lower pitch
 * S2: ~50-70 Hz, shorter duration, higher pitch
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (audioCtx) return audioCtx
  try {
    audioCtx = new AudioContext()
    return audioCtx
  } catch {
    return null
  }
}

function playHeartSound(type: 'S1' | 'S2') {
  const ctx = getAudioContext()
  if (!ctx) return
  if (ctx.state === 'suspended') ctx.resume()

  const now = ctx.currentTime

  // Oscillator for the thump
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  filter.type = 'lowpass'

  if (type === 'S1') {
    // S1 "lub" — lower pitch, longer, louder
    osc.frequency.setValueAtTime(35, now)
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.12)
    filter.frequency.setValueAtTime(80, now)
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  } else {
    // S2 "dub" — higher pitch, shorter, quieter
    osc.frequency.setValueAtTime(55, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.08)
    filter.frequency.setValueAtTime(120, now)
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
  }

  osc.type = 'sine'
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.2)
}

export function useHeartSounds() {
  const lastPhaseRef = useRef('P7')
  const enabledRef = useRef(true)

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      getAudioContext()
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
        if (!enabledRef.current) return
        const prev = lastPhaseRef.current
        lastPhaseRef.current = phase

        // S1 at P2 onset (AV valves close)
        if (phase === 'P2' && prev !== 'P2') {
          playHeartSound('S1')
        }
        // S2 at P5 onset (semilunar valves close)
        if (phase === 'P5' && prev !== 'P5') {
          playHeartSound('S2')
        }
      }
    )
  }, [])

  return {
    setEnabled: (enabled: boolean) => { enabledRef.current = enabled },
  }
}
