import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

/**
 * Creates a heart-shaped geometry using an extruded Three.js Shape.
 * Based on the parametric heart curve, scaled and positioned for anatomical feel.
 */
function createHeartShape(): THREE.Shape {
  const shape = new THREE.Shape()
  // Heart curve via bezier — creates the classic heart silhouette
  shape.moveTo(0, -0.6)
  // Right lobe
  shape.bezierCurveTo(0.4, -0.6, 0.7, -0.2, 0.7, 0.1)
  shape.bezierCurveTo(0.7, 0.4, 0.4, 0.65, 0, 0.9)
  // Left lobe (mirror)
  shape.bezierCurveTo(-0.4, 0.65, -0.7, 0.4, -0.7, 0.1)
  shape.bezierCurveTo(-0.7, -0.2, -0.4, -0.6, 0, -0.6)
  return shape
}

const tissueMaterial = new THREE.MeshPhysicalMaterial({
  color: '#c84b4b',
  roughness: 0.55,
  metalness: 0.05,
  clearcoat: 0.1,
  clearcoatRoughness: 0.4,
  transmission: 0.02,
  thickness: 2,
  side: THREE.DoubleSide,
})

const darkTissueMaterial = new THREE.MeshPhysicalMaterial({
  color: '#8b3535',
  roughness: 0.6,
  metalness: 0.05,
  clearcoat: 0.1,
  clearcoatRoughness: 0.5,
  side: THREE.DoubleSide,
})

const vesselMaterial = new THREE.MeshPhysicalMaterial({
  color: '#a03030',
  roughness: 0.5,
  metalness: 0.08,
  side: THREE.DoubleSide,
})

const veinMaterial = new THREE.MeshPhysicalMaterial({
  color: '#4a5a8a',
  roughness: 0.5,
  metalness: 0.08,
  side: THREE.DoubleSide,
})

const valveMaterial = new THREE.MeshStandardMaterial({
  color: '#d4c090',
  roughness: 0.4,
  metalness: 0.15,
})

export function PlaceholderHeart() {
  const groupRef = useRef<THREE.Group>(null)
  const leftVentricleRef = useRef<THREE.Group>(null)
  const rightVentricleRef = useRef<THREE.Group>(null)
  const atriaRef = useRef<THREE.Group>(null)
  const phaseProgressRef = useRef(0)
  const currentPhaseRef = useRef('P1')
  const selectStructure = useSimStore((s) => s.selectStructure)
  const muscleVisible = useSimStore((s) => s.activeLayers.has('muscle'))
  const valvesVisible = useSimStore((s) => s.activeLayers.has('valves'))

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

  // Heart body geometry — extruded heart shape
  const heartGeo = useMemo(() => {
    const shape = createHeartShape()
    const extrudeSettings = {
      depth: 0.6,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.1,
      bevelSegments: 8,
      curveSegments: 32,
    }
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.center()
    return geo
  }, [])

  // Septum — thin plane dividing the heart
  const septumGeo = useMemo(() => {
    return new THREE.PlaneGeometry(0.02, 1.0, 1, 8)
  }, [])

  // Aorta — curved tube
  const aortaGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0.1, 0.45, 0),
      new THREE.Vector3(0.15, 0.7, 0.05),
      new THREE.Vector3(0.25, 0.85, 0.1),
      new THREE.Vector3(0.4, 0.9, 0.05),
      new THREE.Vector3(0.5, 0.8, -0.05),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 32, 0.08, 12, false)
  }, [])

  // Pulmonary artery
  const pulmonaryGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.05, 0.35, 0.15),
      new THREE.Vector3(-0.15, 0.6, 0.2),
      new THREE.Vector3(-0.3, 0.75, 0.15),
      new THREE.Vector3(-0.45, 0.7, 0.05),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 24, 0.06, 10, false)
  }, [])

  // Superior vena cava
  const svcGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0.25, 0.3, -0.1),
      new THREE.Vector3(0.3, 0.6, -0.12),
      new THREE.Vector3(0.3, 0.85, -0.1),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 16, 0.055, 10, false)
  }, [])

  // Inferior vena cava
  const ivcGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0.2, -0.2, -0.05),
      new THREE.Vector3(0.25, -0.45, -0.08),
      new THREE.Vector3(0.22, -0.65, -0.05),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 16, 0.05, 10, false)
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    const phase = currentPhaseRef.current
    const t = phaseProgressRef.current

    // Atrial contraction during P1
    if (atriaRef.current) {
      const atrialSqueeze = phase === 'P1' ? 1 - 0.06 * Math.sin(t * Math.PI) : 1
      atriaRef.current.scale.set(
        THREE.MathUtils.lerp(atriaRef.current.scale.x, atrialSqueeze, 0.12),
        THREE.MathUtils.lerp(atriaRef.current.scale.y, 1, 0.12),
        THREE.MathUtils.lerp(atriaRef.current.scale.z, atrialSqueeze, 0.12)
      )
    }

    // Ventricular contraction during P2-P4
    const isSystole = phase === 'P2' || phase === 'P3' || phase === 'P4'
    const ventSqueeze = isSystole ? 1 - 0.07 * Math.sin(t * Math.PI) : 1

    if (leftVentricleRef.current) {
      leftVentricleRef.current.scale.set(
        THREE.MathUtils.lerp(leftVentricleRef.current.scale.x, ventSqueeze, 0.1),
        THREE.MathUtils.lerp(leftVentricleRef.current.scale.y, 1 + (isSystole ? 0.02 * Math.sin(t * Math.PI) : 0), 0.1),
        THREE.MathUtils.lerp(leftVentricleRef.current.scale.z, ventSqueeze, 0.1)
      )
    }

    if (rightVentricleRef.current) {
      rightVentricleRef.current.scale.set(
        THREE.MathUtils.lerp(rightVentricleRef.current.scale.x, ventSqueeze, 0.1),
        THREE.MathUtils.lerp(rightVentricleRef.current.scale.y, 1 + (isSystole ? 0.015 * Math.sin(t * Math.PI) : 0), 0.1),
        THREE.MathUtils.lerp(rightVentricleRef.current.scale.z, ventSqueeze, 0.1)
      )
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    const name = e.object?.name
    if (name) selectStructure(name)
  }

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI * 0.05]}>
      {/* Main heart body — left ventricle dominant */}
      <group ref={leftVentricleRef}>
        <mesh
          geometry={heartGeo}
          material={tissueMaterial}
          visible={muscleVisible}
          name="left-ventricle"
          onClick={handleClick}
          scale={[1, 1, 1]}
        />
      </group>

      {/* Right ventricle — slightly offset, thinner */}
      <group ref={rightVentricleRef}>
        <mesh
          position={[0.35, -0.05, 0.2]}
          visible={muscleVisible}
          name="right-ventricle"
          onClick={handleClick}
        >
          <sphereGeometry args={[0.38, 24, 24, 0, Math.PI * 1.5, 0, Math.PI]} />
          <meshPhysicalMaterial {...darkTissueMaterial} />
        </mesh>
      </group>

      {/* Atria — upper chambers */}
      <group ref={atriaRef}>
        {/* Left atrium */}
        <mesh
          position={[-0.15, 0.35, -0.15]}
          visible={muscleVisible}
          name="left-atrium"
          onClick={handleClick}
        >
          <sphereGeometry args={[0.28, 20, 20]} />
          <primitive object={darkTissueMaterial} attach="material" />
        </mesh>
        {/* Right atrium */}
        <mesh
          position={[0.25, 0.3, -0.1]}
          visible={muscleVisible}
          name="right-atrium"
          onClick={handleClick}
        >
          <sphereGeometry args={[0.25, 20, 20]} />
          <primitive object={darkTissueMaterial} attach="material" />
        </mesh>
      </group>

      {/* Septum */}
      <mesh
        geometry={septumGeo}
        position={[0.05, -0.05, 0.15]}
        rotation={[0, Math.PI * 0.1, 0]}
        visible={muscleVisible}
        name="septum"
      >
        <meshStandardMaterial color="#7a3030" side={THREE.DoubleSide} />
      </mesh>

      {/* Great vessels */}
      <mesh geometry={aortaGeo} material={vesselMaterial} visible={muscleVisible} name="aorta" onClick={handleClick} />
      <mesh geometry={pulmonaryGeo} material={vesselMaterial} visible={muscleVisible} name="pulmonary-artery" onClick={handleClick} />
      <mesh geometry={svcGeo} material={veinMaterial} visible={muscleVisible} name="superior-vena-cava" onClick={handleClick} />
      <mesh geometry={ivcGeo} material={veinMaterial} visible={muscleVisible} name="inferior-vena-cava" onClick={handleClick} />

      {/* Valves */}
      <mesh position={[-0.05, 0.12, 0.2]} rotation={[Math.PI * 0.5, 0, 0]} visible={valvesVisible} name="mitral-valve" onClick={handleClick}>
        <torusGeometry args={[0.1, 0.025, 8, 20]} />
        <primitive object={valveMaterial} attach="material" />
      </mesh>
      <mesh position={[0.2, 0.12, 0.2]} rotation={[Math.PI * 0.5, 0, 0.2]} visible={valvesVisible} name="tricuspid-valve" onClick={handleClick}>
        <torusGeometry args={[0.09, 0.022, 8, 20]} />
        <primitive object={valveMaterial} attach="material" />
      </mesh>
      <mesh position={[0.1, 0.42, 0.02]} rotation={[Math.PI * 0.4, 0.2, 0]} visible={valvesVisible} name="aortic-valve" onClick={handleClick}>
        <torusGeometry args={[0.07, 0.02, 8, 20]} />
        <primitive object={valveMaterial} attach="material" />
      </mesh>
      <mesh position={[-0.05, 0.35, 0.18]} rotation={[Math.PI * 0.3, -0.1, 0]} visible={valvesVisible} name="pulmonary-valve" onClick={handleClick}>
        <torusGeometry args={[0.06, 0.018, 8, 20]} />
        <primitive object={valveMaterial} attach="material" />
      </mesh>
    </group>
  )
}
