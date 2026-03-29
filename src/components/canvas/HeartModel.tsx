import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

useGLTF.preload('/models/heart-detailed.glb')

const LABELS = [
  { name: 'Left Ventricle', position: [-0.3, -0.4, 0.5], id: 'left-ventricle' },
  { name: 'Right Ventricle', position: [0.35, -0.3, 0.5], id: 'right-ventricle' },
  { name: 'Left Atrium', position: [-0.35, 0.5, -0.15], id: 'left-atrium' },
  { name: 'Right Atrium', position: [0.4, 0.45, 0.15], id: 'right-atrium' },
  { name: 'Aorta', position: [0.08, 0.9, 0.08], id: 'aorta' },
  { name: 'Pulmonary Artery', position: [-0.15, 0.75, 0.3], id: 'pulmonary-artery' },
  { name: 'Superior Vena Cava', position: [0.45, 0.8, -0.1], id: 'superior-vena-cava' },
  { name: 'Mitral Valve', position: [-0.1, 0.08, 0.25], id: 'mitral-valve' },
  { name: 'Tricuspid Valve', position: [0.25, 0.08, 0.3], id: 'tricuspid-valve' },
]

export function HeartModel() {
  const { scene, animations } = useGLTF('/models/heart-detailed.glb')
  const groupRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const phaseProgressRef = useRef(0)
  const currentPhaseRef = useRef('P1')
  const selectStructure = useSimStore((s) => s.selectStructure)
  const muscleVisible = useSimStore((s) => s.activeLayers.has('muscle'))
  const viewMode = useSimStore((s) => s.viewMode)

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
    const targetSize = 2.8
    const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1
    scene.scale.setScalar(scaleFactor)
    scene.position.set(
      -center.x * scaleFactor,
      -center.y * scaleFactor,
      -center.z * scaleFactor
    )

    console.log('[HeartModel] Size:', size.x.toFixed(3), size.y.toFixed(3), size.z.toFixed(3))
    console.log('[HeartModel] Scale:', scaleFactor.toFixed(3))

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const originalMap = (child.material as THREE.MeshStandardMaterial)?.map

        // Solid opaque material with wet-tissue look
        // Conduction + blood flow render on TOP of the model, not through it
        child.material = new THREE.MeshPhysicalMaterial({
          map: originalMap,
          color: originalMap ? '#FFFFFF' : '#8B2020',
          roughness: 0.4,
          metalness: 0.03,
          clearcoat: 0.35,
          clearcoatRoughness: 0.15,
          side: THREE.DoubleSide,
          // Wet tissue sheen
          sheen: 0.2,
          sheenColor: new THREE.Color('#FF6666'),
          sheenRoughness: 0.35,
        })

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
    const squeeze = isSystole ? 1 - 0.03 * Math.sin(t * Math.PI) : 1
    const expand = isSystole ? 1 + 0.012 * Math.sin(t * Math.PI) : 1

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

  // In quiz mode, hide labels
  const showLabels = viewMode !== 'quiz'

  return (
    <group ref={groupRef}>
      <group visible={muscleVisible}>
        <primitive object={scene} onClick={handleClick} />
      </group>

      {showLabels && LABELS.map((label) => (
        <Html
          key={label.id}
          position={label.position as [number, number, number]}
          center
          distanceFactor={6}
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
