import { useSimStore, type Layer } from '../../store/useSimStore'

const LAYERS: { id: Layer; label: string }[] = [
  { id: 'muscle', label: 'Muscle' },
  { id: 'valves', label: 'Valves' },
  { id: 'conduction', label: 'Conduction' },
]

export function LayerControls() {
  const activeLayers = useSimStore((s) => s.activeLayers)
  const toggleLayer = useSimStore((s) => s.toggleLayer)

  return (
    <div className="layer-controls" aria-label="Anatomical layers">
      {LAYERS.map(({ id, label }) => (
        <button
          key={id}
          className={`layer-btn ${activeLayers.has(id) ? 'active' : ''}`}
          onClick={() => toggleLayer(id)}
          aria-pressed={activeLayers.has(id)}
          aria-label={`Toggle ${label} layer`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
