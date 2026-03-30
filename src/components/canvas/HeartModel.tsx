import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'
import { CROSS_SECTION_PLANE } from '../../data/clipping'

useGLTF.preload('/models/heart-detailed.glb')

const leaderLineMaterial = new THREE.MeshBasicMaterial({
  color: '#999999',
  transparent: true,
  opacity: 0.35,
})

function LeaderLine({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const geo = useMemo(() => {
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3(...to)
    )
    return new THREE.TubeGeometry(curve, 1, 0.002, 4, false)
  }, [from, to])

  return <mesh geometry={geo} material={leaderLineMaterial} />
}

/**
 * Anatomy labels with pin point (on structure) and label point (outside).
 * Leader line connects pin to label — medical textbook style.
 */
const LABELS = [
  { name: 'Left Ventricle', pin: [-0.1, -0.35, 0.2], label: [-0.65, -0.6, 0.4], id: 'left-ventricle' },
  { name: 'Right Ventricle', pin: [0.15, -0.3, 0.2], label: [0.6, -0.55, 0.4], id: 'right-ventricle' },
  { name: 'Left Atrium', pin: [-0.15, 0.3, 0], label: [-0.65, 0.4, 0.3], id: 'left-atrium' },
  { name: 'Right Atrium', pin: [0.2, 0.25, 0], label: [0.6, 0.35, 0.3], id: 'right-atrium' },
  { name: 'Aorta', pin: [0.03, 0.65, 0.05], label: [0.5, 0.9, 0.2], id: 'aorta' },
  { name: 'Pulmonary Artery', pin: [-0.08, 0.55, 0.15], label: [-0.6, 0.75, 0.3], id: 'pulmonary-artery' },
  { name: 'Superior Vena Cava', pin: [0.25, 0.6, -0.05], label: [0.65, 0.7, 0.2], id: 'superior-vena-cava' },
  { name: 'Mitral Valve', pin: [-0.05, 0.02, 0.15], label: [-0.6, -0.1, 0.4], id: 'mitral-valve' },
  { name: 'Tricuspid Valve', pin: [0.12, -0.02, 0.15], label: [0.55, -0.15, 0.4], id: 'tricuspid-valve' },
]

/**
 * Normal map generators — unchanged from previous
 */
function createFiberNormalMap(): THREE.DataTexture {
  const size = 1024
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const u = x / size
      const v = y / size
      let nx = 128
      let ny = 128
      const fiberAngle = Math.sin(u * 50) * 0.4
      nx += Math.sin((v + fiberAngle) * 180) * 15 * 0.7
      ny += Math.sin((u + v) * 120) * Math.cos((u - v) * 80) * 8 * 0.6
      nx += Math.sin(u * 300 + v * 50) * 4 * 0.4
      ny += Math.sin(v * 280 + u * 40) * 4 * 0.4
      const vesselU = Math.sin(u * 8 + 0.5) * Math.sin(v * 12 + 0.3)
      if (Math.abs(vesselU) > 0.7) nx += (Math.abs(vesselU) - 0.7) * 30 * Math.sign(Math.cos(u * 16))
      nx += (Math.random() - 0.5) * 6
      ny += (Math.random() - 0.5) * 4.2
      data[i] = Math.max(0, Math.min(255, nx))
      data[i + 1] = Math.max(0, Math.min(255, ny))
      data[i + 2] = 255
      data[i + 3] = 255
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  texture.needsUpdate = true
  return texture
}

function createRoughnessMap(): THREE.DataTexture {
  const size = 512
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const u = x / size
      const v = y / size
      let roughness = 90
      const wet = Math.sin(u * 12 + v * 8) * Math.cos(u * 6 - v * 10)
      if (wet > 0.5) roughness -= 20
      const dry = Math.sin(u * 20 + 1.5) * Math.sin(v * 15 + 0.7)
      if (dry > 0.6) roughness += 25
      roughness += (Math.random() - 0.5) * 15
      const val = Math.max(40, Math.min(180, roughness))
      data[i] = val; data[i + 1] = val; data[i + 2] = val; data[i + 3] = 255
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 3)
  texture.needsUpdate = true
  return texture
}

export function HeartModel() {
  const { scene, animations } = useGLTF('/models/heart-detailed.glb')
  const groupRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const phaseProgressRef = useRef(0)
  const currentPhaseRef = useRef('P1')
  const selectStructure = useSimStore((s) => s.selectStructure)
  const muscleVisible = useSimStore((s) => s.activeLayers.has('muscle'))
  const crossSectionActive = useSimStore((s) => s.activeLayers.has('crossSection'))
  const interiorActive = useSimStore((s) => s.activeLayers.has('interior'))
  const viewMode = useSimStore((s) => s.viewMode)

  const fiberNormalMap = useMemo(() => createFiberNormalMap(), [])
  const roughnessMap = useMemo(() => createRoughnessMap(), [])

  useMemo(() => {
    useSimStore.subscribe((s) => s.phaseProgress, (p) => { phaseProgressRef.current = p })
    useSimStore.subscribe((s) => s.currentPhase, (p) => { currentPhaseRef.current = p })
  }, [])

  useEffect(() => {
    if (animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene)
      animations.forEach((clip) => { mixer.clipAction(clip).play() })
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
    const scaleFactor = maxDim > 0 ? 2.8 / maxDim : 1
    scene.scale.setScalar(scaleFactor)
    scene.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor)

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const originalMap = (child.material as THREE.MeshStandardMaterial)?.map
        child.material = new THREE.MeshPhysicalMaterial({
          map: originalMap,
          color: originalMap ? '#FFFFFF' : '#8B2020',
          normalMap: fiberNormalMap,
          normalScale: new THREE.Vector2(0.4, 0.4),
          roughnessMap: roughnessMap,
          roughness: 0.35,
          metalness: 0.03,
          clearcoat: interiorActive ? 0.1 : 0.4,
          clearcoatRoughness: 0.12,
          clearcoatNormalMap: fiberNormalMap,
          clearcoatNormalScale: new THREE.Vector2(0.15, 0.15),
          side: THREE.DoubleSide,
          sheen: 0.25,
          sheenColor: new THREE.Color('#FF6666'),
          sheenRoughness: 0.3,
          iridescence: interiorActive ? 0 : 0.1,
          iridescenceIOR: 1.3,
          // Interior mode: semi-transparent to see through
          transparent: interiorActive,
          opacity: interiorActive ? 0.25 : 1.0,
          depthWrite: !interiorActive,
          clippingPlanes: crossSectionActive ? [CROSS_SECTION_PLANE] : [],
          clipShadows: crossSectionActive,
        })
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene, fiberNormalMap, roughnessMap, crossSectionActive, interiorActive])

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta)
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

  const handleLabelClick = (id: string) => {
    selectStructure(id)
  }

  const interiorOn = useSimStore((s) => s.activeLayers.has('interior'))
  const crossSectOn = useSimStore((s) => s.activeLayers.has('crossSection'))
  // Hide anatomy pin labels when interior view shows its own labels
  const showLabels = viewMode !== 'quiz' && !interiorOn && !crossSectOn

  return (
    <group ref={groupRef}>
      <group visible={muscleVisible}>
        <primitive object={scene} onClick={(e: any) => {
          e.stopPropagation()
          selectStructure(e.object?.name || 'left-ventricle')
        }} />
      </group>

      {showLabels && LABELS.map((label) => (
        <group key={label.id}>
          <mesh position={label.pin as [number, number, number]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
          </mesh>

          <LeaderLine from={label.pin as [number, number, number]} to={label.label as [number, number, number]} />

          <Html
            position={label.label as [number, number, number]}
            distanceFactor={6}
            zIndexRange={[50, 0]}
          >
            <button
              className="anatomy-pin-label"
              onClick={(e) => {
                e.stopPropagation()
                handleLabelClick(label.id)
              }}
            >
              <span className="pin-label-text">{label.name}</span>
            </button>
          </Html>
        </group>
      ))}
    </group>
  )
}
