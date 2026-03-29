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
 * Conduction pathway — THIN tubes inside the heart.
 * Radius 0.006 = hair-thin at model scale.
 */
export function ConductionSystem() {
  const materialRef1 = useRef<any>(null)
  const materialRef2 = useRef<any>(null)
  const wavePosition = useConductionWave()
  const visible = useSimStore((s) => s.activeLayers.has('conduction'))

  // SA node → AV node → right bundle → apex → Purkinje
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
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 80, 0.006, 6, false)
  }, [])

  // Left bundle branch
  const leftBranch = useMemo(() => {
    const points = [
      new THREE.Vector3(0, -0.05, 0.02),
      new THREE.Vector3(-0.06, -0.2, -0.02),
      new THREE.Vector3(-0.12, -0.45, -0.02),
      new THREE.Vector3(-0.08, -0.7, 0),
      new THREE.Vector3(-0.18, -0.5, 0.06),
      new THREE.Vector3(-0.22, -0.2, 0.08),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 60, 0.005, 6, false)
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
        <conductionMaterial ref={materialRef1} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh geometry={leftBranch}>
        {/* @ts-expect-error custom shaderMaterial */}
        <conductionMaterial ref={materialRef2} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}
