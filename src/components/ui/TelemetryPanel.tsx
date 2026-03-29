import { useSimStore } from '../../store/useSimStore'
import { PHASE_NAMES, getValveStates, type Phase } from '../../data/cardiac-timing'

/**
 * Approximate hemodynamic values per cardiac phase.
 * Based on standard Wiggers diagram values.
 */
const HEMODYNAMICS: Record<Phase, { lvP: string; aoP: string; laP: string; lvVol: string }> = {
  P1: { lvP: '8-12', aoP: '80', laP: '10-12', lvVol: '120 (EDV)' },
  P2: { lvP: '12→80', aoP: '80', laP: '8', lvVol: '120' },
  P3: { lvP: '120', aoP: '120', laP: '5→10', lvVol: '120→70' },
  P4: { lvP: '100', aoP: '100', laP: '10→15', lvVol: '70→50' },
  P5: { lvP: '100→8', aoP: '80', laP: '15', lvVol: '50 (ESV)' },
  P6: { lvP: '0→5', aoP: '80', laP: '15→5', lvVol: '50→100' },
  P7: { lvP: '5→8', aoP: '80', laP: '5→8', lvVol: '100→120' },
}

export function TelemetryPanel() {
  const bpm = useSimStore((s) => s.bpm)
  const phase = useSimStore((s) => s.currentPhase)
  const cycleElapsed = useSimStore((s) => s.cycleElapsed)
  const valves = getValveStates(phase)
  const hemo = HEMODYNAMICS[phase]

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

      <div className="telemetry-divider" />

      <div className="telemetry-section">
        <span className="telemetry-label">LV Press.</span>
        <span className="telemetry-value hemo-value">{hemo.lvP} <span className="hemo-unit">mmHg</span></span>
      </div>
      <div className="telemetry-section">
        <span className="telemetry-label">Aortic</span>
        <span className="telemetry-value hemo-value">{hemo.aoP} <span className="hemo-unit">mmHg</span></span>
      </div>
      <div className="telemetry-section">
        <span className="telemetry-label">LA Press.</span>
        <span className="telemetry-value hemo-value">{hemo.laP} <span className="hemo-unit">mmHg</span></span>
      </div>
      <div className="telemetry-section">
        <span className="telemetry-label">LV Vol.</span>
        <span className="telemetry-value hemo-value">{hemo.lvVol} <span className="hemo-unit">mL</span></span>
      </div>
    </div>
  )
}
