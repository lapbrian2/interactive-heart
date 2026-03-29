import { useSimStore, type ViewMode, type Layer } from '../../store/useSimStore'
import { PHASES, PHASE_NAMES, computePhaseDurations } from '../../data/cardiac-timing'

const VIEW_MODES: { id: ViewMode; label: string; description: string }[] = [
  { id: 'observatory', label: 'Observe', description: 'Watch the heart beat' },
  { id: 'study', label: 'Study', description: 'Pause and explore' },
  { id: 'quiz', label: 'Quiz', description: 'Test your knowledge' },
]

const OVERLAY_OPTIONS: { id: Layer; label: string }[] = [
  { id: 'muscle', label: 'Muscle' },
  { id: 'valves', label: 'Valves' },
  { id: 'conduction', label: 'Conduction' },
  { id: 'coronary', label: 'Coronary' },
  { id: 'crossSection', label: 'Cross Section' },
  { id: 'auscultation', label: 'Auscultation' },
]

export function ViewControls() {
  const viewMode = useSimStore((s) => s.viewMode)
  const setViewMode = useSimStore((s) => s.setViewMode)
  const activeLayers = useSimStore((s) => s.activeLayers)
  const toggleLayer = useSimStore((s) => s.toggleLayer)
  const isPaused = useSimStore((s) => s.isPaused)
  const setPaused = useSimStore((s) => s.setPaused)
  const scrubPosition = useSimStore((s) => s.scrubPosition)
  const setScrubPosition = useSimStore((s) => s.setScrubPosition)
  const bpm = useSimStore((s) => s.bpm)
  const setBPM = useSimStore((s) => s.setBPM)
  const currentPhase = useSimStore((s) => s.currentPhase)

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode === 'study') {
      setPaused(true)
      setScrubPosition(0)
    } else if (mode === 'observatory') {
      setPaused(false)
      setScrubPosition(null)
    } else if (mode === 'quiz') {
      setPaused(false)
      setScrubPosition(null)
    }
  }

  const phaseDurations = computePhaseDurations(bpm)
  const cycleDuration = phaseDurations.reduce((a, b) => a + b, 0)

  return (
    <div className="view-controls">
      {/* View mode selector */}
      <div className="view-modes">
        {VIEW_MODES.map((mode) => (
          <button
            key={mode.id}
            className={`view-mode-btn ${viewMode === mode.id ? 'active' : ''}`}
            onClick={() => handleModeChange(mode.id)}
            title={mode.description}
            aria-label={mode.description}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Layer toggles */}
      <div className="overlay-toggles">
        <span className="overlay-label">Overlays</span>
        <div className="overlay-grid">
          {OVERLAY_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              className={`overlay-btn ${activeLayers.has(id) ? 'active' : ''}`}
              onClick={() => toggleLayer(id)}
              aria-pressed={activeLayers.has(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* BPM control */}
      <div className="bpm-control">
        <span className="bpm-label">Heart Rate</span>
        <input
          type="range"
          min={40}
          max={180}
          value={bpm}
          onChange={(e) => setBPM(Number(e.target.value))}
          aria-label={`Heart rate: ${bpm} BPM`}
        />
        <span className="bpm-value">{bpm}</span>
      </div>

      {/* Phase scrubber — visible in study mode */}
      {viewMode === 'study' && (
        <div className="phase-scrubber">
          <div className="scrubber-header">
            <span className="scrubber-label">Phase Scrubber</span>
            <button
              className={`pause-btn ${isPaused ? 'paused' : ''}`}
              onClick={() => {
                if (isPaused) {
                  setPaused(false)
                  setScrubPosition(null)
                } else {
                  setPaused(true)
                  setScrubPosition(0)
                }
              }}
            >
              {isPaused ? 'Play' : 'Pause'}
            </button>
          </div>
          {isPaused && scrubPosition !== null && (
            <>
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={scrubPosition}
                onChange={(e) => setScrubPosition(Number(e.target.value))}
                className="scrubber-range"
                aria-label="Scrub through cardiac cycle"
              />
              <div className="scrubber-phases">
                {PHASES.map((p, i) => {
                  const start = phaseDurations.slice(0, i).reduce((a, b) => a + b, 0) / cycleDuration
                  const width = phaseDurations[i] / cycleDuration
                  const isActive = p === currentPhase
                  return (
                    <div
                      key={p}
                      className={`scrubber-phase ${isActive ? 'active' : ''}`}
                      style={{ left: `${start * 100}%`, width: `${width * 100}%` }}
                      onClick={() => setScrubPosition(start + width * 0.5)}
                      title={PHASE_NAMES[p]}
                    >
                      <span>{p}</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
