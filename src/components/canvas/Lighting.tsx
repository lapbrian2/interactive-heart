import { Environment } from '@react-three/drei'

export function Lighting() {
  return (
    <>
      {/* Key light — warm, upper-left, surgical lamp */}
      <directionalLight position={[-4, 6, 3]} intensity={2.0} color="#FFF0E0" />
      {/* Fill — cool, lower-right */}
      <directionalLight position={[3, -2, 2]} intensity={0.6} color="#B8C8E0" />
      {/* Rim — warm edge separation */}
      <directionalLight position={[1, 1, -4]} intensity={0.5} color="#FFD0B0" />
      {/* Ambient — low baseline */}
      <ambientLight intensity={0.3} />
      {/* Environment for specular reflections only — low intensity */}
      <Environment preset="studio" environmentIntensity={0.25} />
    </>
  )
}
