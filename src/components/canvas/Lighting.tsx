import { Environment } from '@react-three/drei'

export function Lighting() {
  return (
    <>
      {/* Key light — strong warm from upper-left */}
      <directionalLight position={[-4, 6, 3]} intensity={3.0} color="#FFF0E0" />
      {/* Fill — cool from right, opens shadows */}
      <directionalLight position={[3, -1, 3]} intensity={1.2} color="#C0D0E8" />
      {/* Rim — warm edge from behind */}
      <directionalLight position={[1, 1, -4]} intensity={0.8} color="#FFD0B0" />
      {/* Front fill — ensures face of heart is lit */}
      <directionalLight position={[0, 0, 5]} intensity={0.8} color="#F0E8E0" />
      {/* Ambient — raised so nothing is too dark */}
      <ambientLight intensity={0.5} />
      {/* Environment for specular reflections */}
      <Environment preset="studio" environmentIntensity={0.35} />
    </>
  )
}
