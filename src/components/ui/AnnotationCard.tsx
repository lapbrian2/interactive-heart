import { useEffect } from 'react'
import { useSimStore } from '../../store/useSimStore'
import { ANNOTATIONS } from '../../data/annotations'
import { PHASE_NAMES } from '../../data/cardiac-timing'

export function AnnotationCard() {
  const selectedStructure = useSimStore((s) => s.selectedStructure)
  const selectStructure = useSimStore((s) => s.selectStructure)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectStructure(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectStructure])

  if (!selectedStructure) return null
  const a = ANNOTATIONS[selectedStructure]
  if (!a) return null

  return (
    <div className="annotation-backdrop" onClick={() => selectStructure(null)}>
      <div
        className="annotation-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Anatomy: ${a.name}`}
      >
        <button
          className="annotation-close"
          onClick={() => selectStructure(null)}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="annotation-header">
          <h2 className="annotation-title">{a.name}</h2>
          <span className="annotation-latin">{a.latinName}</span>
        </div>

        <p className="annotation-desc">{a.description}</p>

        <div className="annotation-grid">
          <div className="annotation-detail">
            <h4>Dimensions</h4>
            <p>{a.dimensions}</p>
          </div>
          <div className="annotation-detail">
            <h4>Blood Supply</h4>
            <p>{a.bloodSupply}</p>
          </div>
          <div className="annotation-detail">
            <h4>Innervation</h4>
            <p>{a.innervation}</p>
          </div>
        </div>

        {a.ecgTerritory && (
          <div className="annotation-section annotation-ecg-territory">
            <h4>ECG Territory</h4>
            <p>{a.ecgTerritory}</p>
          </div>
        )}

        <div className="annotation-section annotation-failure">
          <h4>Pathology</h4>
          <p>{a.failureMode}</p>
        </div>

        <div className="annotation-section annotation-surgical">
          <h4>Surgical Relevance</h4>
          <p>{a.surgicalRelevance}</p>
        </div>

        <div className="annotation-phases">
          <h4>Active During</h4>
          <div className="phase-tags">
            {a.relatedPhases.map((p) => (
              <span key={p} className="phase-tag">
                {PHASE_NAMES[p]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
