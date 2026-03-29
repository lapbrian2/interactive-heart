import { useState, useEffect, useRef } from 'react'
import { useSimStore } from '../../store/useSimStore'
import { PHASE_EDUCATION } from '../../data/phase-education'
import { type Phase } from '../../data/cardiac-timing'

/**
 * Education panel that updates once per heartbeat cycle, not per phase.
 * Shows the current phase info but only transitions when the phase
 * changes AND has been stable for at least 200ms — prevents flickering.
 */
export function EducationPanel() {
  const phase = useSimStore((s) => s.currentPhase)
  const bpm = useSimStore((s) => s.bpm)
  const [displayPhase, setDisplayPhase] = useState<Phase>('P1')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Debounce phase changes — only update display after phase is stable 200ms
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      if (phase !== displayPhase) {
        setIsTransitioning(true)
        setTimeout(() => {
          setDisplayPhase(phase)
          setIsTransitioning(false)
        }, 150) // fade out then swap
      }
    }, 200)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [phase, displayPhase])

  const edu = PHASE_EDUCATION[displayPhase]

  return (
    <div className={`education-panel ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="edu-phase-indicator">
        <span className="edu-phase-number">{displayPhase}</span>
        <span className="edu-phase-title">{edu.title}</span>
      </div>

      <div className="edu-event">{edu.event}</div>

      <div className="edu-section">
        <h4 className="edu-section-label">What's Happening</h4>
        <p className="edu-section-text">{edu.detail}</p>
      </div>

      <div className="edu-section">
        <h4 className="edu-section-label">ECG</h4>
        <p className="edu-ecg-event">{edu.ecgEvent}</p>
      </div>

      <div className="edu-section">
        <h4 className="edu-section-label">Active Structures</h4>
        <div className="edu-structures">
          {edu.structures.map((s) => (
            <span key={s} className="edu-structure-tag">{s}</span>
          ))}
        </div>
      </div>

      <div className="edu-section edu-clinical">
        <h4 className="edu-section-label">Clinical Note</h4>
        <p className="edu-section-text">{edu.clinicalNote}</p>
      </div>

      <div className="edu-footer">
        <span className="edu-bpm">{bpm} BPM</span>
        <span className="edu-cycle-label">Cardiac Cycle</span>
      </div>
    </div>
  )
}
