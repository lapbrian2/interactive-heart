import { Environment } from '@react-three/drei'

/**
 * Netter/Gray's Anatomy lighting setup.
 * Simulates a clinical studio with a strong key light,
 * warm fill, and environment reflections for wet-tissue specular.
 */
export function Lighting() {
  return (
    <>
      {/* Key light — strong warm white from upper-left, like a surgical lamp */}
      <directionalLight
        position={[-4, 6, 3]}
        intensity={3.0}
        color="#FFF0E0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />

      {/* Fill light — cool blue from lower-right, opens shadows */}
      <directionalLight
        position={[3, -2, 2]}
        intensity={0.8}
        color="#B8C8E0"
      />

      {/* Rim / backlight — warm edge separation from background */}
      <directionalLight
        position={[1, 1, -4]}
        intensity={1.0}
        color="#FFD0B0"
      />

      {/* Underlight — subtle warm fill from below, like reflected table light */}
      <directionalLight
        position={[0, -4, 1]}
        intensity={0.4}
        color="#FFE8D0"
      />

      {/* Ambient — very low, keeps shadows from going pure black */}
      <ambientLight intensity={0.15} color="#E8E0F0" />

      {/* Environment map — provides specular reflections for wet-tissue look */}
      <Environment preset="studio" environmentIntensity={0.4} />
    </>
  )
}
