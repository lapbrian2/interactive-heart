import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

/**
 * Coronary arteries scaled to heart-detailed.glb bounds (~2.8 units tall).
 * LAD, LCx, RCA traced on the heart surface.
 */
export function CoronaryArteries() {
  const visible = useSimStore((s) => s.activeLayers.has('coronary'))

  const ladGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.08, 0.45, 0.45),
      new THREE.Vector3(-0.15, 0.2, 0.5),
      new THREE.Vector3(-0.18, 0, 0.52),
      new THREE.Vector3(-0.15, -0.3, 0.48),
      new THREE.Vector3(-0.12, -0.6, 0.4),
      new THREE.Vector3(-0.08, -0.85, 0.3),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 40, 0.018, 8, false)
  }, [])

  const lcxGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.08, 0.45, 0.45),
      new THREE.Vector3(-0.3, 0.3, 0.35),
      new THREE.Vector3(-0.42, 0.15, 0.2),
      new THREE.Vector3(-0.45, -0.05, 0.0),
      new THREE.Vector3(-0.4, -0.2, -0.15),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 32, 0.015, 8, false)
  }, [])

  const rcaGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0.2, 0.5, 0.3),
      new THREE.Vector3(0.35, 0.35, 0.35),
      new THREE.Vector3(0.42, 0.15, 0.28),
      new THREE.Vector3(0.4, -0.1, 0.15),
      new THREE.Vector3(0.3, -0.35, 0.0),
      new THREE.Vector3(0.15, -0.55, -0.08),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 40, 0.016, 8, false)
  }, [])

  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#DD4444',
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    emissive: '#441111',
    emissiveIntensity: 0.3,
  }), [])

  if (!visible) return null

  return (
    <group renderOrder={2}>
      <mesh geometry={ladGeo} material={material} />
      <mesh geometry={lcxGeo} material={material} />
      <mesh geometry={rcaGeo} material={material} />
    </group>
  )
}
