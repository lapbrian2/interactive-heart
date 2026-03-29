import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSimStore } from '../store/useSimStore'
import { CONDUCTION_TIMING } from '../data/cardiac-timing'

export function useConductionWave() {
  const wavePositionRef = useRef(0)
  const cycleElapsedRef = useRef(0)

  useMemo(() => {
    return useSimStore.subscribe(
      (s) => s.cycleElapsed,
      (e) => {
        cycleElapsedRef.current = e
      }
    )
  }, [])

  useFrame(() => {
    const elapsed = cycleElapsedRef.current
    const total = CONDUCTION_TIMING.totalDepolarization

    if (elapsed <= total) {
      wavePositionRef.current = elapsed / total
    } else {
      wavePositionRef.current = 1.0
    }
  })

  return wavePositionRef
}
