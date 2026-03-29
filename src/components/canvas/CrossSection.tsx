import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.02)

/**
 * Cross-section — applies clipping every frame to catch
 * materials that were set after initial mount.
 */
export function CrossSection() {
  const visible = useSimStore((s) => s.activeLayers.has('crossSection'))
  const { scene } = useThree()
  const wasVisible = useRef(false)

  useFrame(() => {
    if (visible === wasVisible.current) return
    wasVisible.current = visible

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach((mat) => {
          mat.clippingPlanes = visible ? [clipPlane] : []
          mat.clipShadows = visible
          mat.needsUpdate = true
        })
      }
    })
  })

  if (!visible) return null

  // Visual indicator of the cut plane
  return (
    <mesh position={[0, 0, 0.02]} renderOrder={0}>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial
        color="#1a1f35"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
