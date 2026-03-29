import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

useGLTF.preload('/models/heart.glb')

export function HeartModel() {
  const { scene, animations } = useGLTF('/models/heart.glb')
  const groupRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const phaseProgressRef = useRef(0)
  const currentPhaseRef = useRef('P1')
  const selectStructure = useSimStore((s) => s.selectStructure)
  const muscleVisible = useSimStore((s) => s.activeLayers.has('muscle'))

  useMemo(() => {
    useSimStore.subscribe(
      (s) => s.phaseProgress,
      (p) => { phaseProgressRef.current = p }
    )
    useSimStore.subscribe(
      (s) => s.currentPhase,
      (p) => { currentPhaseRef.current = p }
    )
  }, [])

  // Set up animation mixer
  useEffect(() => {
    if (animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene)
      animations.forEach((clip) => {
        const action = mixer.clipAction(clip)
        action.play()
      })
      mixerRef.current = mixer
      return () => { mixer.stopAllAction() }
    }
  }, [scene, animations])

  // Compute bounding box and auto-scale/center the model
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    // Log for debugging
    console.log('[HeartModel] Bounding box size:', size.x.toFixed(3), size.y.toFixed(3), size.z.toFixed(3))
    console.log('[HeartModel] Bounding box center:', center.x.toFixed(3), center.y.toFixed(3), center.z.toFixed(3))
    console.log('[HeartModel] Children:', scene.children.length)

    // Auto-scale to fit ~2 units tall
    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 2.5
    const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1
    scene.scale.setScalar(scaleFactor)

    // Center the model
    scene.position.set(
      -center.x * scaleFactor,
      -center.y * scaleFactor,
      -center.z * scaleFactor
    )

    console.log('[HeartModel] Applied scale:', scaleFactor.toFixed(3))

    // Enhance materials for visibility
    let meshCount = 0
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++
        // Keep original material but ensure it's visible
        const mat = child.material as THREE.MeshStandardMaterial
        if (mat) {
          mat.side = THREE.DoubleSide
          mat.needsUpdate = true
        }
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    console.log('[HeartModel] Mesh count:', meshCount)
  }, [scene])

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }

    if (!groupRef.current) return
    const phase = currentPhaseRef.current
    const t = phaseProgressRef.current

    const isSystole = phase === 'P2' || phase === 'P3' || phase === 'P4'
    const squeeze = isSystole ? 1 - 0.035 * Math.sin(t * Math.PI) : 1
    const expand = isSystole ? 1 + 0.015 * Math.sin(t * Math.PI) : 1

    groupRef.current.scale.set(
      THREE.MathUtils.lerp(groupRef.current.scale.x, squeeze, 0.12),
      THREE.MathUtils.lerp(groupRef.current.scale.y, expand, 0.12),
      THREE.MathUtils.lerp(groupRef.current.scale.z, squeeze, 0.12)
    )
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    const name = e.object?.name
    if (name) selectStructure(name)
  }

  return (
    <group ref={groupRef} visible={muscleVisible}>
      <primitive object={scene} onClick={handleClick} />
    </group>
  )
}
