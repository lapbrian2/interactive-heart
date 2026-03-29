import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

useGLTF.preload('/models/heart2.glb')

/**
 * Anatomical labels positioned in 3D space.
 * Each label has a position inside/on the heart and a name.
 */
const LABELS = [
  { name: 'Left Ventricle', position: [-0.15, -0.2, 0.3], id: 'left-ventricle' },
  { name: 'Right Ventricle', position: [0.2, -0.15, 0.35], id: 'right-ventricle' },
  { name: 'Left Atrium', position: [-0.2, 0.3, -0.1], id: 'left-atrium' },
  { name: 'Right Atrium', position: [0.25, 0.25, 0.1], id: 'right-atrium' },
  { name: 'Aorta', position: [0.05, 0.55, 0.05], id: 'aorta' },
  { name: 'Pulmonary Artery', position: [-0.1, 0.45, 0.2], id: 'pulmonary-artery' },
  { name: 'Superior Vena Cava', position: [0.3, 0.5, -0.05], id: 'superior-vena-cava' },
  { name: 'Mitral Valve', position: [-0.05, 0.05, 0.15], id: 'mitral-valve' },
  { name: 'Tricuspid Valve', position: [0.15, 0.05, 0.2], id: 'tricuspid-valve' },
]

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

    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 2.5
    const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1
    scene.scale.setScalar(scaleFactor)
    scene.position.set(
      -center.x * scaleFactor,
      -center.y * scaleFactor,
      -center.z * scaleFactor
    )

    // Semi-transparent tissue — see through to internal systems
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: '#8B2020',
          roughness: 0.4,
          metalness: 0.02,
          clearcoat: 0.3,
          clearcoatRoughness: 0.15,
          transmission: 0.35,
          thickness: 1.5,
          opacity: 0.7,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          sheen: 0.2,
          sheenColor: new THREE.Color('#FF6666'),
          sheenRoughness: 0.4,
        })
        child.castShadow = true
        child.renderOrder = 1
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
    selectStructure(e.object?.name || 'left-ventricle')
  }

  return (
    <group ref={groupRef}>
      {/* Heart surface — semi-transparent */}
      <group visible={muscleVisible}>
        <primitive object={scene} onClick={handleClick} />
      </group>

      {/* 3D anatomical labels */}
      {LABELS.map((label) => (
        <Html
          key={label.id}
          position={label.position as [number, number, number]}
          center
          distanceFactor={5}
          style={{ pointerEvents: 'all' }}
        >
          <div
            className="anatomy-label"
            onClick={() => selectStructure(label.id)}
          >
            <span className="label-dot" />
            <span className="label-text">{label.name}</span>
          </div>
        </Html>
      ))}
    </group>
  )
}
