import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

useGLTF.preload('/models/heart.glb')

/**
 * Netter/Gray's Anatomy color palette.
 * Per-structure materials that mimic wet anatomical specimens
 * under clinical studio lighting.
 */
const ANATOMY_PALETTE = {
  // Myocardium — deep brownish-red, like fresh cardiac muscle
  muscle: { color: '#8B2020', roughness: 0.45, metalness: 0.02, clearcoat: 0.3, clearcoatRoughness: 0.2 },
  // Arteries — bright oxygenated red
  artery: { color: '#CC3333', roughness: 0.35, metalness: 0.03, clearcoat: 0.4, clearcoatRoughness: 0.15 },
  // Veins — dusky blue-purple
  vein: { color: '#4A5A8A', roughness: 0.4, metalness: 0.02, clearcoat: 0.35, clearcoatRoughness: 0.2 },
  // Valve leaflets — pale fibrous ivory
  valve: { color: '#E8D8B8', roughness: 0.3, metalness: 0.05, clearcoat: 0.5, clearcoatRoughness: 0.1 },
  // Endocardium / inner lining — glossy deep red
  endocardium: { color: '#6B1515', roughness: 0.3, metalness: 0.02, clearcoat: 0.5, clearcoatRoughness: 0.1 },
  // Fat / connective tissue — pale yellow
  fat: { color: '#E8D060', roughness: 0.5, metalness: 0.0, clearcoat: 0.2, clearcoatRoughness: 0.3 },
  // Aorta — thick arterial wall, slightly paler
  aorta: { color: '#D04848', roughness: 0.35, metalness: 0.03, clearcoat: 0.45, clearcoatRoughness: 0.12 },
}

function createAnatomyMaterial(preset: keyof typeof ANATOMY_PALETTE): THREE.MeshPhysicalMaterial {
  const p = ANATOMY_PALETTE[preset]
  return new THREE.MeshPhysicalMaterial({
    color: p.color,
    roughness: p.roughness,
    metalness: p.metalness,
    clearcoat: p.clearcoat,
    clearcoatRoughness: p.clearcoatRoughness,
    side: THREE.DoubleSide,
    // Subsurface scattering approximation via sheen
    sheen: 0.3,
    sheenColor: new THREE.Color('#FF6666'),
    sheenRoughness: 0.4,
  })
}

/**
 * Classify a mesh name to an anatomy palette preset.
 * Falls back to 'muscle' for unrecognized names.
 */
function classifyMesh(name: string): keyof typeof ANATOMY_PALETTE {
  const n = name.toLowerCase()
  if (n.includes('aort')) return 'aorta'
  if (n.includes('artery') || n.includes('pulmonary_a') || n.includes('coronar')) return 'artery'
  if (n.includes('vein') || n.includes('vena') || n.includes('pulmonary_v')) return 'vein'
  if (n.includes('valve') || n.includes('leaflet') || n.includes('cusp')) return 'valve'
  if (n.includes('endo') || n.includes('inner') || n.includes('chamber')) return 'endocardium'
  if (n.includes('fat') || n.includes('adipose') || n.includes('connective')) return 'fat'
  return 'muscle'
}

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

  // Apply Netter-style anatomical materials per mesh
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const preset = classifyMesh(child.name)
        child.material = createAnatomyMaterial(preset)
        child.castShadow = true
        child.receiveShadow = true
      }
    })
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
    <group ref={groupRef}>
      <Center>
        <primitive
          object={scene}
          scale={8}
          visible={muscleVisible}
          onClick={handleClick}
        />
      </Center>
    </group>
  )
}
