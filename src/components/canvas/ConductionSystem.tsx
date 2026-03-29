import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useConductionWave } from '../../hooks/useConductionWave'
import { useSimStore } from '../../store/useSimStore'
import conductionVert from '../../shaders/conduction.vert.glsl?raw'
import conductionFrag from '../../shaders/conduction.frag.glsl?raw'

const ConductionMaterial = shaderMaterial(
  {
    uWavePosition: 0,
    uTime: 0,
    uColor: new THREE.Color('#00e5ff'),
  },
  conductionVert,
  conductionFrag
)

extend({ ConductionMaterial })

/**
 * Conduction pathway scaled to match heart-detailed.glb model bounds (~2.8 units tall).
 */
export function ConductionSystem() {
  const materialRef1 = useRef<any>(null)
  const materialRef2 = useRef<any>(null)
  const wavePosition = useConductionWave()
  const visible = useSimStore((s) => s.activeLayers.has('conduction'))

  // Main pathway: SA node → AV node → right bundle → apex
  const mainTube = useMemo(() => {
    const points = [
      new THREE.Vector3(0.4, 0.85, 0.05),    // SA node — upper right atrium
      new THREE.Vector3(0.3, 0.6, 0.08),
      new THREE.Vector3(0.15, 0.35, 0.08),
      new THREE.Vector3(0.08, 0.15, 0.05),   // AV node
      new THREE.Vector3(0, -0.05, 0.05),     // Bundle of His
      new THREE.Vector3(-0.03, -0.35, 0.08),
      new THREE.Vector3(-0.05, -0.7, 0.12),  // near apex
      new THREE.Vector3(0, -1.0, 0.08),      // apex
      new THREE.Vector3(0.15, -0.7, 0.2),    // Purkinje — right wall
      new THREE.Vector3(0.25, -0.3, 0.25),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 80, 0.025, 8, false)
  }, [])

  // Left bundle branch
  const leftBranch = useMemo(() => {
    const points = [
      new THREE.Vector3(0, -0.05, 0.05),     // fork at Bundle of His
      new THREE.Vector3(-0.1, -0.3, -0.05),
      new THREE.Vector3(-0.2, -0.6, -0.05),
      new THREE.Vector3(-0.15, -0.95, 0),     // near apex — left
      new THREE.Vector3(-0.3, -0.65, 0.12),   // Purkinje — left wall
      new THREE.Vector3(-0.35, -0.3, 0.18),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 60, 0.02, 8, false)
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
      <mesh geometry={mainTube}>
        {/* @ts-expect-error custom shaderMaterial */}
        <conductionMaterial
          ref={materialRef1}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={leftBranch}>
        {/* @ts-expect-error custom shaderMaterial */}
        <conductionMaterial
          ref={materialRef2}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
