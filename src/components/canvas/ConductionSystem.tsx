import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useConductionWave } from '../../hooks/useConductionWave'
import { useSimStore } from '../../store/useSimStore'
import conductionVert from '../../shaders/conduction.vert.glsl?raw'
import conductionFrag from '../../shaders/conduction.frag.glsl?raw'

const ConductionMaterial = shaderMaterial(
  { uWavePosition: 0, uTime: 0, uColor: new THREE.Color('#00e5ff') },
  conductionVert,
  conductionFrag
)

extend({ ConductionMaterial })

// Bright emissive material for the tube structure (always visible)
const tubeMaterial = new THREE.MeshBasicMaterial({
  color: '#00BBDD',
  transparent: true,
  opacity: 0.4,
  depthWrite: false,
})

// Node markers — bright spheres at key conduction points
const nodeMaterial = new THREE.MeshBasicMaterial({
  color: '#00FFFF',
  transparent: true,
  opacity: 0.9,
})

const NODE_POSITIONS = [
  { pos: [0.25, 0.7, 0.02] as [number, number, number], name: 'SA Node', size: 0.035 },
  { pos: [0.04, 0.1, 0.02] as [number, number, number], name: 'AV Node', size: 0.03 },
  { pos: [0, -0.05, 0.02] as [number, number, number], name: 'Bundle of His', size: 0.02 },
  { pos: [0, -0.75, 0.04] as [number, number, number], name: 'Apex', size: 0.02 },
]

export function ConductionSystem() {
  const materialRef1 = useRef<any>(null)
  const materialRef2 = useRef<any>(null)
  const wavePosition = useConductionWave()
  const visible = useSimStore((s) => s.activeLayers.has('conduction'))

  const mainTube = useMemo(() => {
    const points = [
      new THREE.Vector3(0.25, 0.7, 0.02),
      new THREE.Vector3(0.15, 0.45, 0.04),
      new THREE.Vector3(0.08, 0.25, 0.04),
      new THREE.Vector3(0.04, 0.1, 0.02),
      new THREE.Vector3(0, -0.05, 0.02),
      new THREE.Vector3(-0.02, -0.25, 0.04),
      new THREE.Vector3(-0.03, -0.5, 0.06),
      new THREE.Vector3(0, -0.75, 0.04),
      new THREE.Vector3(0.08, -0.5, 0.1),
      new THREE.Vector3(0.15, -0.2, 0.12),
    ]
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 80, 0.012, 8, false)
  }, [])

  const leftBranch = useMemo(() => {
    const points = [
      new THREE.Vector3(0, -0.05, 0.02),
      new THREE.Vector3(-0.06, -0.2, -0.02),
      new THREE.Vector3(-0.12, -0.45, -0.02),
      new THREE.Vector3(-0.08, -0.7, 0),
      new THREE.Vector3(-0.18, -0.5, 0.06),
      new THREE.Vector3(-0.22, -0.2, 0.08),
    ]
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 60, 0.01, 8, false)
  }, [])

  useFrame(({ clock }) => {
    if (materialRef1.current) {
      materialRef1.current.uWavePosition = wavePosition.current
      materialRef1.current.uTime = clock.elapsedTime
    }
    if (materialRef2.current) {
      materialRef2.current.uWavePosition = wavePosition.current
      materialRef2.current.uTime = clock.elapsedTime
    }
  })

  if (!visible) return null

  return (
    <group renderOrder={2}>
      {/* Background tube structure — always visible cyan */}
      <mesh geometry={mainTube} material={tubeMaterial} />
      <mesh geometry={leftBranch} material={tubeMaterial} />

      {/* Animated glow wave overlay */}
      <mesh geometry={mainTube}>
        {/* @ts-expect-error custom shaderMaterial */}
        <conductionMaterial ref={materialRef1} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh geometry={leftBranch}>
        {/* @ts-expect-error custom shaderMaterial */}
        <conductionMaterial ref={materialRef2} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Node markers — bright spheres */}
      {NODE_POSITIONS.map((node) => (
        <group key={node.name}>
          <mesh position={node.pos} material={nodeMaterial}>
            <sphereGeometry args={[node.size, 12, 12]} />
          </mesh>
          <Html position={node.pos} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
            <span className="conduction-label">{node.name}</span>
          </Html>
        </group>
      ))}
    </group>
  )
}
