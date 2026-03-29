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
  const annotation = ANNOTATIONS[selectedStructure]
  if (!annotation) return null

  return (
    <div className="annotation-backdrop" onClick={() => selectStructure(null)}>
      <div
        className="annotation-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Information about ${annotation.name}`}
      >
        <button
          className="annotation-close"
          onClick={() => selectStructure(null)}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="annotation-title">{annotation.name}</h2>
        <p className="annotation-desc">{annotation.description}</p>
        <div className="annotation-failure">
          <h3>When It Fails</h3>
          <p>{annotation.failureMode}</p>
        </div>
        <div className="annotation-phases">
          <h3>Active During</h3>
          <div className="phase-tags">
            {annotation.relatedPhases.map((p) => (
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
