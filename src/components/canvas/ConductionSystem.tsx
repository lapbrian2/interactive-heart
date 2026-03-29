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
 * Conduction pathway — positioned inside the heart model bounds.
 * Traces: SA node (upper-right atrium) → AV node (center) →
 * Bundle of His → Purkinje fibers (apex, then fans upward).
 *
 * Also renders a second branch for the left bundle.
 */
export function ConductionSystem() {
  const materialRef1 = useRef<any>(null)
  const materialRef2 = useRef<any>(null)
  const wavePosition = useConductionWave()
  const visible = useSimStore((s) => s.activeLayers.has('conduction'))

  // Main pathway: SA node → AV node → right bundle → apex
  const mainTube = useMemo(() => {
    const points = [
      new THREE.Vector3(0.3, 0.6, 0),       // SA node — upper right atrium
      new THREE.Vector3(0.2, 0.4, 0.05),    // atrial pathway
      new THREE.Vector3(0.1, 0.2, 0.05),    // approaching AV node
      new THREE.Vector3(0.05, 0.1, 0),      // AV node — center
      new THREE.Vector3(0, -0.05, 0),       // Bundle of His — septum
      new THREE.Vector3(-0.02, -0.25, 0.05),// right bundle branch
      new THREE.Vector3(-0.05, -0.5, 0.1),  // descending
      new THREE.Vector3(0, -0.8, 0.05),     // apex
      new THREE.Vector3(0.1, -0.5, 0.15),   // Purkinje — fans back up
      new THREE.Vector3(0.2, -0.2, 0.2),    // right ventricular wall
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 80, 0.015, 8, false)
  }, [])

  // Left bundle branch — forks at the septum
  const leftBranch = useMemo(() => {
    const points = [
      new THREE.Vector3(0, -0.05, 0),       // fork point at Bundle of His
      new THREE.Vector3(-0.08, -0.2, -0.05),// left bundle
      new THREE.Vector3(-0.15, -0.45, -0.05),
      new THREE.Vector3(-0.1, -0.75, 0),    // near apex — left side
      new THREE.Vector3(-0.2, -0.5, 0.1),   // Purkinje — left ventricular wall
      new THREE.Vector3(-0.25, -0.2, 0.15), // fans upward
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 60, 0.012, 8, false)
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
