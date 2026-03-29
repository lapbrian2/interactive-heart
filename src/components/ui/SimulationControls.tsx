import { useSimStore } from '../../store/useSimStore'

export function SimulationControls() {
  const bpm = useSimStore((s) => s.bpm)
  const setBPM = useSimStore((s) => s.setBPM)

  return (
    <div className="simulation-controls" aria-label="Simulation controls">
      <label className="control-label">
        <span>Heart Rate</span>
        <input
          type="range"
          min={40}
          max={180}
          value={bpm}
          onChange={(e) => setBPM(Number(e.target.value))}
          aria-label={`Heart rate: ${bpm} BPM`}
        />
        <span className="control-value">{bpm} BPM</span>
      </label>
    </div>
  )
}
