import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

// Try the 3D volumetric model first
useGLTF.preload('/models/heart2.glb')

export function HeartModel() {
  const { scene, animations } = useGLTF('/models/heart2.glb')
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

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    console.log('[HeartModel] Size:', size.x.toFixed(3), size.y.toFixed(3), size.z.toFixed(3))
    console.log('[HeartModel] Center:', center.x.toFixed(3), center.y.toFixed(3), center.z.toFixed(3))

    // Auto-scale to fit ~2.5 units in the largest dimension
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

    console.log('[HeartModel] Scale:', scaleFactor.toFixed(3))

    // Apply Netter-style anatomical materials
    let meshCount = 0
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++
        const n = child.name.toLowerCase()

        // Classify and color each structure
        let color = '#8B2020' // default: muscle
        let roughness = 0.45
        let clearcoat = 0.3

        if (n.includes('aort') || n.includes('artery')) {
          color = '#CC3333'
          roughness = 0.35
          clearcoat = 0.4
        } else if (n.includes('vein') || n.includes('vena')) {
          color = '#4A5A8A'
          roughness = 0.4
          clearcoat = 0.35
        } else if (n.includes('valve') || n.includes('leaflet')) {
          color = '#E8D8B8'
          roughness = 0.3
          clearcoat = 0.5
        }

        child.material = new THREE.MeshPhysicalMaterial({
          color,
          roughness,
          metalness: 0.03,
          clearcoat,
          clearcoatRoughness: 0.15,
          sheen: 0.25,
          sheenColor: new THREE.Color('#FF8888'),
          sheenRoughness: 0.4,
          side: THREE.DoubleSide,
        })

        child.castShadow = true
        child.receiveShadow = true
      }
    })
    console.log('[HeartModel] Meshes:', meshCount)
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
