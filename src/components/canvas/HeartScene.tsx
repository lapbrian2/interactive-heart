import { HeartModel } from './HeartModel'
import { Lighting } from './Lighting'
import { CameraRig } from './CameraRig'
import { ConductionSystem } from './ConductionSystem'
import { BloodFlow } from './BloodFlow'
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
      <ConductionSystem />
      <BloodFlow />
    </>
  )
}
