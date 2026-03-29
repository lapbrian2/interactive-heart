import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

/**
 * Enables localClippingEnabled on the renderer.
 * The actual clipping planes are applied in HeartModel's material.
 */
export function CrossSection() {
  const { gl } = useThree()

  useEffect(() => {
    gl.localClippingEnabled = true
  }, [gl])

  return null
}
