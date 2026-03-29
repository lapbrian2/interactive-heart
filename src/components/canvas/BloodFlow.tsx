import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createSystemicCurve } from '../../data/vessel-paths'
import { useSimStore } from '../../store/useSimStore'

const PARTICLE_COUNT = 1000

export function BloodFlow() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const curve = useMemo(() => createSystemicCurve(), [])
  const point = useMemo(() => new THREE.Vector3(), [])

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      t: Math.random(),
      speed: 0.3 + Math.random() * 0.4,
      offset: new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03
      ),
    }))
  }, [])

  const phaseRef = useRef('P7')
  useMemo(() => {
    return useSimStore.subscribe(
      (s) => s.currentPhase,
      (p) => {
        phaseRef.current = p
      }
    )
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    const phase = phaseRef.current
    let speedMod = 1
    if (phase === 'P3') speedMod = 2.5
    else if (phase === 'P4') speedMod = 1.5
    else if (phase === 'P7') speedMod = 0.3

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]
      p.t = (p.t + delta * p.speed * speedMod * 0.15) % 1
      curve.getPointAt(p.t, point)
      point.add(p.offset)

      dummy.position.copy(point)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.008, 4, 4]} />
      <meshBasicMaterial color="#ff3333" transparent opacity={0.8} />
    </instancedMesh>
  )
}
