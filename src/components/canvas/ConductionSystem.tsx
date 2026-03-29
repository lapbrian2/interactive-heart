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

export function ConductionSystem() {
  const materialRef = useRef<any>(null)
  const wavePosition = useConductionWave()
  const visible = useSimStore((s) => s.activeLayers.has('conduction'))

  const tubeGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(0.2, 0.6, 0.2),
      new THREE.Vector3(0.1, 0.4, 0.2),
      new THREE.Vector3(0.05, 0.2, 0.15),
      new THREE.Vector3(0, 0, 0.1),
      new THREE.Vector3(-0.1, -0.3, 0.1),
      new THREE.Vector3(-0.2, -0.5, 0),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 64, 0.02, 8, false)
  }, [])

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uWavePosition = wavePosition.current
      materialRef.current.uTime = clock.elapsedTime
    }
  })

  if (!visible) return null

  return (
    <mesh geometry={tubeGeometry}>
      {/* @ts-expect-error custom shaderMaterial */}
      <conductionMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
