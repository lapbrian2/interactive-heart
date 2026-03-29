import { PlaceholderHeart } from './PlaceholderHeart'
import { Lighting } from './Lighting'
import { CameraRig } from './CameraRig'
import { ConductionSystem } from './ConductionSystem'
import { BloodFlow } from './BloodFlow'
import { useCardiacCycle } from '../../hooks/useCardiacCycle'

export function HeartScene() {
  useCardiacCycle()

  return (
    <>
      <Lighting />
      <CameraRig />
      <PlaceholderHeart />
      <ConductionSystem />
      <BloodFlow />
    </>
  )
}
