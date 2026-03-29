import { useSimStore } from '../../store/useSimStore'
import { PHASE_EDUCATION } from '../../data/phase-education'

export function EducationPanel() {
  const phase = useSimStore((s) => s.currentPhase)
  const bpm = useSimStore((s) => s.bpm)
  const edu = PHASE_EDUCATION[phase]

  return (
    <div className="education-panel">
      <div className="edu-phase-indicator">
        <span className="edu-phase-number">{phase}</span>
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
