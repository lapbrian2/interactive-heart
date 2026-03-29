import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

export function PlaceholderHeart() {
  const groupRef = useRef<THREE.Group>(null)
  const phaseProgressRef = useRef(0)
  const currentPhaseRef = useRef('P1')
  const selectStructure = useSimStore((s) => s.selectStructure)
  const muscleVisible = useSimStore((s) => s.activeLayers.has('muscle'))
  const valvesVisible = useSimStore((s) => s.activeLayers.has('valves'))

  useMemo(() => {
    useSimStore.subscribe(
      (s) => s.phaseProgress,
      (p) => {
        phaseProgressRef.current = p
      }
    )
    useSimStore.subscribe(
      (s) => s.currentPhase,
      (p) => {
        currentPhaseRef.current = p
      }
    )
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    const phase = currentPhaseRef.current
    const t = phaseProgressRef.current

    const isSystole = phase === 'P2' || phase === 'P3' || phase === 'P4'
    const targetScale = isSystole ? 1 - 0.08 * Math.sin(t * Math.PI) : 1
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
    )
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    const name = e.object?.name
    if (name) selectStructure(name)
  }

  return (
    <group ref={groupRef}>
      <mesh
        visible={muscleVisible}
        name="left-ventricle"
        onClick={handleClick}
      >
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshPhysicalMaterial
          color="#c84b4b"
          roughness={0.6}
          metalness={0.1}
          transmission={0.05}
          thickness={1}
        />
      </mesh>

      <mesh
        position={[0.3, 0.2, 0]}
        visible={muscleVisible}
        name="right-ventricle"
        onClick={handleClick}
      >
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshPhysicalMaterial
          color="#a04040"
          roughness={0.6}
          metalness={0.1}
          transmission={0.05}
          thickness={1}
        />
      </mesh>

      <mesh
        position={[0.1, 0.9, 0]}
        rotation={[0, 0, 0.3]}
        visible={muscleVisible}
        name="aorta"
        onClick={handleClick}
      >
        <cylinderGeometry args={[0.12, 0.15, 0.6, 16]} />
        <meshPhysicalMaterial color="#b83e3e" roughness={0.5} />
      </mesh>

      <mesh
        position={[0, 0.3, 0.4]}
        visible={valvesVisible}
        name="mitral-valve"
        onClick={handleClick}
      >
        <torusGeometry args={[0.12, 0.03, 8, 16]} />
        <meshStandardMaterial color="#e8d4a0" />
      </mesh>

      <mesh
        position={[0.3, 0.3, 0.3]}
        visible={valvesVisible}
        name="tricuspid-valve"
        onClick={handleClick}
      >
        <torusGeometry args={[0.1, 0.03, 8, 16]} />
        <meshStandardMaterial color="#e8d4a0" />
      </mesh>
    </group>
  )
}
