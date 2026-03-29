import { useSimStore } from '../../store/useSimStore'
import { PHASE_NAMES, getValveStates } from '../../data/cardiac-timing'

export function TelemetryPanel() {
  const bpm = useSimStore((s) => s.bpm)
  const phase = useSimStore((s) => s.currentPhase)
  const cycleElapsed = useSimStore((s) => s.cycleElapsed)
  const valves = getValveStates(phase)

  return (
    <div className="telemetry-panel" aria-label="Heart telemetry">
      <div className="telemetry-section">
        <span className="telemetry-label">BPM</span>
        <span className="telemetry-value">{bpm}</span>
      </div>
      <div className="telemetry-section">
        <span className="telemetry-label">Phase</span>
        <span className="telemetry-value telemetry-phase">{PHASE_NAMES[phase]}</span>
      </div>
      <div className="telemetry-section">
        <span className="telemetry-label">Cycle</span>
        <span className="telemetry-value">{Math.round(cycleElapsed)}ms</span>
      </div>
      <div className="telemetry-section">
        <span className="telemetry-label">Valves</span>
        <div className="valve-indicators">
          <span className={`valve ${valves.mitral ? 'open' : 'closed'}`} title="Mitral">M</span>
          <span className={`valve ${valves.tricuspid ? 'open' : 'closed'}`} title="Tricuspid">T</span>
          <span className={`valve ${valves.aortic ? 'open' : 'closed'}`} title="Aortic">A</span>
          <span className={`valve ${valves.pulmonary ? 'open' : 'closed'}`} title="Pulmonary">P</span>
        </div>
      </div>
    </div>
  )
}
