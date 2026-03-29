import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  type Phase,
  PHASES,
  computePhaseDurations,
} from '../data/cardiac-timing'
import { useSimStore } from '../store/useSimStore'

export interface CardiacCycleState {
  phase: Phase
  t: number
  cycleElapsed: number
  cycleCount: number
  phaseDurations: number[]
}

export function computeCycleState(
  totalElapsedMs: number,
  bpm: number
): CardiacCycleState {
  const phaseDurations = computePhaseDurations(bpm)
  const cycleDuration = phaseDurations.reduce((a, b) => a + b, 0)
  const cycleCount = Math.floor(totalElapsedMs / cycleDuration)
  const cycleElapsed = totalElapsedMs % cycleDuration

  let accumulated = 0
  for (let i = 0; i < phaseDurations.length; i++) {
    const phaseEnd = accumulated + phaseDurations[i]
    if (cycleElapsed < phaseEnd) {
      const t = (cycleElapsed - accumulated) / phaseDurations[i]
      return {
        phase: PHASES[i],
        t: Math.max(0, Math.min(1, t)),
        cycleElapsed,
        cycleCount,
        phaseDurations,
      }
    }
    accumulated = phaseEnd
  }

  return {
    phase: 'P7',
    t: 1,
    cycleElapsed,
    cycleCount,
    phaseDurations,
  }
}

export function useCardiacCycle() {
  const totalElapsedRef = useRef(0)
  const bpmRef = useRef(72)
  const stateRef = useRef<CardiacCycleState>({
    phase: 'P1',
    t: 0,
    cycleElapsed: 0,
    cycleCount: 0,
    phaseDurations: computePhaseDurations(72),
  })

  useMemo(() => {
    return useSimStore.subscribe(
      (s) => s.bpm,
      (bpm) => {
        bpmRef.current = bpm
      }
    )
  }, [])

  useFrame((_, delta) => {
    totalElapsedRef.current += delta * 1000
    const state = computeCycleState(totalElapsedRef.current, bpmRef.current)
    stateRef.current = state

    useSimStore.setState({
      currentPhase: state.phase,
      phaseProgress: state.t,
      cycleElapsed: state.cycleElapsed,
    })
  })

  return stateRef
}
