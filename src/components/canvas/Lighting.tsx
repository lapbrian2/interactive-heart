import { Environment } from '@react-three/drei'

export function Lighting() {
  return (
    <>
      {/* Strong key light to ensure model visibility */}
      <directionalLight
        position={[-4, 6, 3]}
        intensity={3}
        color="#FFF0E0"
      />
      <directionalLight position={[3, -2, 2]} intensity={1.2} color="#B8C8E0" />
      <directionalLight position={[1, 1, -4]} intensity={1.0} color="#FFD0B0" />
      <directionalLight position={[0, -4, 1]} intensity={0.5} color="#FFE8D0" />
      <ambientLight intensity={0.8} />
      <Environment preset="studio" environmentIntensity={0.5} />
    </>
  )
}
