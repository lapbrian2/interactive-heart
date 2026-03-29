import { TelemetryPanel } from './TelemetryPanel'
import { SimulationControls } from './SimulationControls'
import { LayerControls } from './LayerControls'
import { ECGTrace } from './ECGTrace'
import { EducationPanel } from './EducationPanel'
import { AnnotationCard } from './AnnotationCard'

export function HUD() {
  return (
    <div className="hud">
      <div className="hud-left">
        <EducationPanel />
        <LayerControls />
      </div>
      <div className="hud-right">
        <TelemetryPanel />
      </div>
      <div className="hud-bottom">
        <ECGTrace />
        <SimulationControls />
      </div>
      <AnnotationCard />
    </div>
  )
}
