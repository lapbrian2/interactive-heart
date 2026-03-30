import { useEffect } from 'react'
import { useSimStore } from '../../store/useSimStore'
import { PHASE_NAMES } from '../../data/cardiac-timing'

/**
 * Updates the browser tab title with the current cardiac phase.
 */
export function DynamicTitle() {
  const phase = useSimStore((s) => s.currentPhase)
  const bpm = useSimStore((s) => s.bpm)

  useEffect(() => {
    document.title = `${PHASE_NAMES[phase]} — Human Heart | ${bpm} BPM`
  }, [phase, bpm])

  return null
}
