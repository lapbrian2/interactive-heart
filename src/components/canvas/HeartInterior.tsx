import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'
import { Html } from '@react-three/drei'

/**
 * Procedural interior structures visible when cross-section is active.
 * Builds the septum, chamber walls, papillary muscles, and
 * chordae tendineae as simple geometry inside the heart shell.
 */

const endocardiumMaterial = new THREE.MeshPhysicalMaterial({
  color: '#6B1515',
  roughness: 0.3,
  metalness: 0.02,
  clearcoat: 0.5,
  clearcoatRoughness: 0.1,
  side: THREE.DoubleSide,
})

const septumMaterial = new THREE.MeshPhysicalMaterial({
  color: '#7A2828',
  roughness: 0.35,
  metalness: 0.02,
  clearcoat: 0.4,
  clearcoatRoughness: 0.15,
  side: THREE.DoubleSide,
})

const papillaryMaterial = new THREE.MeshPhysicalMaterial({
  color: '#8B3030',
  roughness: 0.4,
  metalness: 0.01,
  clearcoat: 0.3,
  clearcoatRoughness: 0.2,
  side: THREE.DoubleSide,
})

const chordaeMaterial = new THREE.MeshBasicMaterial({
  color: '#D4C090',
  transparent: true,
  opacity: 0.7,
})

const valveLeafletMaterial = new THREE.MeshPhysicalMaterial({
  color: '#E8D0A8',
  roughness: 0.25,
  metalness: 0.05,
  clearcoat: 0.6,
  clearcoatRoughness: 0.08,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.85,
})

export function HeartInterior() {
  const crossSectionActive = useSimStore((s) => s.activeLayers.has('crossSection'))

  // Interventricular septum — the wall between L and R ventricles
  const septumGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.1)
    shape.bezierCurveTo(0.02, -0.15, -0.02, -0.4, 0, -0.65)
    shape.lineTo(0.04, -0.65)
    shape.bezierCurveTo(0.06, -0.4, 0.02, -0.15, 0.04, 0.1)
    shape.closePath()
    const extrudeSettings = { depth: 0.04, bevelEnabled: false }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  // Papillary muscles — conical protrusions from ventricular walls
  const papillaryGeo = useMemo(() => {
    return new THREE.ConeGeometry(0.03, 0.15, 8)
  }, [])

  // Chordae tendineae — thin strings from papillary muscles to valve leaflets
  const chordaeGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.12, 0.02),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 8, 0.003, 4, false)
  }, [])

  // Valve leaflets — thin discs at the AV junction
  const leafletGeo = useMemo(() => {
    return new THREE.CircleGeometry(0.06, 16, 0, Math.PI)
  }, [])

  // Trabeculae carneae — ridges on inner ventricular walls
  const trabeculaeGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.01, -0.08, 0.005),
      new THREE.Vector3(-0.005, -0.16, 0),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 12, 0.008, 4, false)
  }, [])

  if (!crossSectionActive) return null

  return (
    <group>
      {/* Interventricular septum */}
      <mesh
        geometry={septumGeo}
        material={septumMaterial}
        position={[0.02, 0, -0.02]}
        rotation={[0, 0, 0]}
      />

      {/* LV posterior papillary muscle */}
      <mesh geometry={papillaryGeo} material={papillaryMaterial} position={[-0.08, -0.35, 0.05]} rotation={[0.1, 0, 0.2]} />
      {/* LV anterior papillary muscle */}
      <mesh geometry={papillaryGeo} material={papillaryMaterial} position={[-0.12, -0.25, 0.1]} rotation={[-0.1, 0, -0.15]} />
      {/* RV papillary muscle */}
      <mesh geometry={papillaryGeo} material={papillaryMaterial} position={[0.1, -0.3, 0.08]} rotation={[0.05, 0, -0.1]} />

      {/* Chordae tendineae — LV */}
      <mesh geometry={chordaeGeo} material={chordaeMaterial} position={[-0.08, -0.28, 0.05]} />
      <mesh geometry={chordaeGeo} material={chordaeMaterial} position={[-0.12, -0.18, 0.1]} />
      <mesh geometry={chordaeGeo} material={chordaeMaterial} position={[-0.06, -0.3, 0.07]} rotation={[0, 0.3, 0]} />

      {/* Chordae tendineae — RV */}
      <mesh geometry={chordaeGeo} material={chordaeMaterial} position={[0.1, -0.23, 0.08]} />
      <mesh geometry={chordaeGeo} material={chordaeMaterial} position={[0.08, -0.25, 0.1]} rotation={[0, -0.2, 0]} />

      {/* Mitral valve leaflets */}
      <mesh geometry={leafletGeo} material={valveLeafletMaterial} position={[-0.05, -0.02, 0.06]} rotation={[1.2, 0.1, 0]} />
      <mesh geometry={leafletGeo} material={valveLeafletMaterial} position={[-0.05, -0.02, 0.06]} rotation={[-1.2, 0.1, 0]} />

      {/* Tricuspid valve leaflets */}
      <mesh geometry={leafletGeo} material={valveLeafletMaterial} position={[0.1, -0.02, 0.08]} rotation={[1.3, -0.1, 0]} scale={[0.85, 0.85, 0.85]} />

      {/* Trabeculae carneae — ridges on LV wall */}
      {[0, 0.5, 1.0, 1.5, 2.0].map((angle, i) => (
        <mesh
          key={`trab-lv-${i}`}
          geometry={trabeculaeGeo}
          material={endocardiumMaterial}
          position={[-0.1 + Math.sin(angle) * 0.04, -0.15 - i * 0.08, 0.05 + Math.cos(angle) * 0.03]}
          rotation={[0.1 * i, angle * 0.3, 0]}
        />
      ))}

      {/* Trabeculae on RV wall */}
      {[0, 0.7, 1.4].map((angle, i) => (
        <mesh
          key={`trab-rv-${i}`}
          geometry={trabeculaeGeo}
          material={endocardiumMaterial}
          position={[0.12 + Math.sin(angle) * 0.03, -0.1 - i * 0.1, 0.08 + Math.cos(angle) * 0.02]}
          rotation={[0.15 * i, angle * 0.2, 0]}
        />
      ))}

      {/* Interior labels */}
      <Html position={[0.02, -0.15, 0.08]} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
        <span className="interior-label">Septum</span>
      </Html>
      <Html position={[-0.1, -0.35, 0.08]} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
        <span className="interior-label">Papillary M.</span>
      </Html>
      <Html position={[-0.08, -0.15, 0.1]} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
        <span className="interior-label">Chordae</span>
      </Html>
      <Html position={[-0.1, -0.25, 0.06]} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
        <span className="interior-label">Trabeculae</span>
      </Html>
    </group>
  )
}
