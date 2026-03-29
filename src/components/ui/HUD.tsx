import { TelemetryPanel } from './TelemetryPanel'
import { ECGTrace } from './ECGTrace'
import { EducationPanel } from './EducationPanel'
import { ViewControls } from './ViewControls'
import { WiggersDiagram } from './WiggersDiagram'
import { AnnotationCard } from './AnnotationCard'
import { useSimStore } from '../../store/useSimStore'

export function HUD() {
  const viewMode = useSimStore((s) => s.viewMode)

  return (
    <div className="hud">
      <div className="hud-left">
        {viewMode !== 'quiz' && <EducationPanel />}
        {viewMode === 'quiz' && (
          <div className="quiz-prompt">
            <h3>Identify the Structures</h3>
            <p>Click on the heart to identify each anatomical structure. Labels are hidden.</p>
          </div>
        )}
      </div>
      <div className="hud-right">
        <TelemetryPanel />
        <ViewControls />
      </div>
      <div className="hud-bottom">
        <div className="bottom-panels">
          <ECGTrace />
          <WiggersDiagram />
        </div>
      </div>
      <AnnotationCard />
    </div>
  )
}
