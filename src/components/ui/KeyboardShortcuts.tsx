import { useEffect } from 'react'
import { useSimStore } from '../../store/useSimStore'

/**
 * Global keyboard shortcuts:
 * Space — toggle pause
 * 1-7 — jump to phase P1-P7 (in study mode)
 * R — reset to observatory mode
 * ? — toggle shortcut help
 */
export function KeyboardShortcuts() {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const store = useSimStore.getState()

      switch (e.key) {
        case ' ':
          e.preventDefault()
          store.setPaused(!store.isPaused)
          if (!store.isPaused) {
            store.setScrubPosition(null)
          }
          break

        case '1': case '2': case '3': case '4': case '5': case '6': case '7': {
          const phaseIdx = parseInt(e.key) - 1
          const durations = [100, 50, 110, 130, 70, 110, 263]
          const total = durations.reduce((a, b) => a + b, 0)
          let elapsed = 0
          for (let i = 0; i < phaseIdx; i++) elapsed += durations[i]
          const pos = (elapsed + durations[phaseIdx] * 0.5) / total
          store.setViewMode('study')
          store.setPaused(true)
          store.setScrubPosition(pos)
          break
        }

        case 'r':
        case 'R':
          store.setViewMode('observatory')
          store.setPaused(false)
          store.setScrubPosition(null)
          break

        case 'Escape':
          store.selectStructure(null)
          break
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return null
}
