import { HeartModel } from './HeartModel'
import { HeartInterior } from './HeartInterior'
import { Lighting } from './Lighting'
import { CameraRig } from './CameraRig'
import { ConductionSystem } from './ConductionSystem'
import { BloodFlow } from './BloodFlow'
import { CoronaryArteries } from './CoronaryArteries'
import { CrossSection } from './CrossSection'
import { AuscultationPoints } from './AuscultationPoints'
import { useCardiacCycle } from '../../hooks/useCardiacCycle'
import { useHeartSounds } from '../../hooks/useHeartSounds'

export function HeartScene() {
  useCardiacCycle()
  useHeartSounds()

  return (
    <>
      <Lighting />
      <CameraRig />
      <HeartModel />
      <HeartInterior />
      <ConductionSystem />
      <BloodFlow />
      <CoronaryArteries />
      <CrossSection />
      <AuscultationPoints />
    </>
  )
}
