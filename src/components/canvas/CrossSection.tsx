import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

/**
 * Cross-section using a clipping plane that slices the heart
 * along the coronal plane to reveal internal chambers.
 * Also renders a visible cut-plane disc for visual reference.
 */
const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)

export function CrossSection() {
  const visible = useSimStore((s) => s.activeLayers.has('crossSection'))
  const { gl, scene } = useThree()
  const planeHelperRef = useRef<THREE.Mesh>(null)

  // Enable local clipping on mount
  useEffect(() => {
    gl.localClippingEnabled = true
  }, [gl])

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.Material
        if (visible) {
          mat.clippingPlanes = [clipPlane]
          mat.clipShadows = true
        } else {
          mat.clippingPlanes = []
        }
        mat.needsUpdate = true
      }
    })
  }, [visible, scene])

  if (!visible) return null

  return (
    <mesh
      ref={planeHelperRef}
      rotation={[0, 0, 0]}
      position={[0, 0, 0]}
      renderOrder={0}
    >
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial
        color="#1a1f35"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
