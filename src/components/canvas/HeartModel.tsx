import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

useGLTF.preload('/models/heart-detailed.glb')

const LABELS = [
  { name: 'Left Ventricle', position: [-0.2, -0.25, 0.35], id: 'left-ventricle' },
  { name: 'Right Ventricle', position: [0.25, -0.2, 0.35], id: 'right-ventricle' },
  { name: 'Left Atrium', position: [-0.25, 0.35, -0.1], id: 'left-atrium' },
  { name: 'Right Atrium', position: [0.3, 0.3, 0.1], id: 'right-atrium' },
  { name: 'Aorta', position: [0.05, 0.6, 0.05], id: 'aorta' },
  { name: 'Pulmonary Artery', position: [-0.12, 0.5, 0.2], id: 'pulmonary-artery' },
  { name: 'Superior Vena Cava', position: [0.35, 0.55, -0.05], id: 'superior-vena-cava' },
  { name: 'Mitral Valve', position: [-0.08, 0.05, 0.18], id: 'mitral-valve' },
  { name: 'Tricuspid Valve', position: [0.18, 0.05, 0.22], id: 'tricuspid-valve' },
]

export function HeartModel() {
  const { scene, animations } = useGLTF('/models/heart-detailed.glb')
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
        // Keep the original painted texture but enhance the material
        const originalMap = (child.material as THREE.MeshStandardMaterial)?.map

        child.material = new THREE.MeshPhysicalMaterial({
          // Use the original baked texture — this has the anatomical detail
          map: originalMap,
          roughness: 0.45,
          metalness: 0.02,
          clearcoat: 0.25,
          clearcoatRoughness: 0.2,
          // Semi-transparent so conduction + blood flow show through
          transmission: 0.15,
          thickness: 2.0,
          opacity: 0.85,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          // Wet tissue sheen
          sheen: 0.15,
          sheenColor: new THREE.Color('#FF8888'),
          sheenRoughness: 0.35,
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

  return (
    <group ref={groupRef}>
      <group visible={muscleVisible}>
        <primitive object={scene} onClick={handleClick} />
      </group>

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
