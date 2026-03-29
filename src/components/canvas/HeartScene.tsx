import { HeartModel } from './HeartModel'
import { HeartInterior } from './HeartInterior'
import { Lighting } from './Lighting'
import { CameraRig } from './CameraRig'
import { ConductionSystem } from './ConductionSystem'
import { BloodFlow } from './BloodFlow'
import { CoronaryArteries } from './CoronaryArteries'
import { CardiacVeins } from './CardiacVeins'
import { CrossSection } from './CrossSection'
import { AuscultationPoints } from './AuscultationPoints'
import { Pericardium } from './Pericardium'
import { SurgicalLandmarks } from './SurgicalLandmarks'
import { useCardiacCycle } from '../../hooks/useCardiacCycle'
import { useHeartSounds } from '../../hooks/useHeartSounds'

export function HeartScene() {
  useCardiacCycle()
  useHeartSounds()

  return (
    <>
      <Lighting />
      <CameraRig />
      <Pericardium />
      <HeartModel />
      <HeartInterior />
      <ConductionSystem />
      <BloodFlow />
      <CoronaryArteries />
      <CardiacVeins />
      <CrossSection />
      <AuscultationPoints />
      <SurgicalLandmarks />
    </>
  )
}
