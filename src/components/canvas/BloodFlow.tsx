import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createSystemicCurve } from '../../data/vessel-paths'
import { useSimStore } from '../../store/useSimStore'

const PARTICLE_COUNT = 1500

export function BloodFlow() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const curve = useMemo(() => createSystemicCurve(), [])
  const point = useMemo(() => new THREE.Vector3(), [])

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      t: Math.random(),
      speed: 0.2 + Math.random() * 0.5,
      offset: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      // Vary size slightly for depth
      scale: 0.8 + Math.random() * 0.5,
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
    if (phase === 'P3') speedMod = 3.0      // rapid ejection — fastest
    else if (phase === 'P4') speedMod = 1.8  // reduced ejection
    else if (phase === 'P1') speedMod = 1.3  // atrial kick
    else if (phase === 'P6') speedMod = 1.5  // rapid filling
    else if (phase === 'P7') speedMod = 0.25 // diastasis — near still

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]
      p.t = (p.t + delta * p.speed * speedMod * 0.18) % 1
      curve.getPointAt(p.t, point)
      point.add(p.offset)

      dummy.position.copy(point)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      renderOrder={3}
    >
      <sphereGeometry args={[0.006, 4, 4]} />
      <meshBasicMaterial
        color="#E03030"
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </instancedMesh>
  )
}
