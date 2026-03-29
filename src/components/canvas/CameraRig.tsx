import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'

export function CameraRig() {
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.05}
      minDistance={1.5}
      maxDistance={8}
      target={[0, -0.1, 0]}
      autoRotate={!prefersReducedMotion}
      autoRotateSpeed={0.3}
    />
  )
}
