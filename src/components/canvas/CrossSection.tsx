import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

/**
 * Applies a clipping plane to the renderer when cross-section layer is active.
 * Slices the heart along the coronal plane (front-to-back cut)
 * to reveal internal chambers.
 */
export function CrossSection() {
  const visible = useSimStore((s) => s.activeLayers.has('crossSection'))
  const { gl, scene } = useThree()

  useEffect(() => {
    if (visible) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.05)
      gl.clippingPlanes = [plane]
      gl.localClippingEnabled = true

      // Enable clipping on all materials in scene
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.Material
          mat.clippingPlanes = [plane]
          mat.clipShadows = true
          mat.needsUpdate = true
        }
      })
    } else {
      gl.clippingPlanes = []
      gl.localClippingEnabled = false

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.Material
          mat.clippingPlanes = []
          mat.needsUpdate = true
        }
      })
    }
  }, [visible, gl, scene])

  return null
}
