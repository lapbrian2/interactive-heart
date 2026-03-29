import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

/**
 * Coronary arteries — the heart's own blood supply.
 * Rendered as red tube geometry on the heart surface.
 *
 * LAD (Left Anterior Descending) — supplies anterior LV wall
 * LCx (Left Circumflex) — supplies lateral/posterior LV wall
 * RCA (Right Coronary Artery) — supplies RV and inferior LV wall
 */
export function CoronaryArteries() {
  const visible = useSimStore((s) => s.activeLayers.has('coronary'))

  const ladGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.05, 0.3, 0.3),    // left main origin
      new THREE.Vector3(-0.1, 0.15, 0.35),
      new THREE.Vector3(-0.12, 0, 0.38),
      new THREE.Vector3(-0.1, -0.2, 0.35),   // down the anterior wall
      new THREE.Vector3(-0.08, -0.4, 0.3),
      new THREE.Vector3(-0.05, -0.6, 0.2),   // toward apex
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 40, 0.012, 8, false)
  }, [])

  const lcxGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.05, 0.3, 0.3),    // branches from left main
      new THREE.Vector3(-0.2, 0.2, 0.25),
      new THREE.Vector3(-0.3, 0.1, 0.15),    // wraps around to posterior
      new THREE.Vector3(-0.32, -0.05, 0.0),
      new THREE.Vector3(-0.28, -0.15, -0.1),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 32, 0.01, 8, false)
  }, [])

  const rcaGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0.15, 0.35, 0.2),    // right coronary ostium
      new THREE.Vector3(0.25, 0.25, 0.25),
      new THREE.Vector3(0.3, 0.1, 0.2),      // AV groove
      new THREE.Vector3(0.28, -0.1, 0.1),
      new THREE.Vector3(0.2, -0.25, 0.0),    // posterior descending
      new THREE.Vector3(0.1, -0.4, -0.05),
    ]
    const curve = new THREE.CatmullRomCurve3(points)
    return new THREE.TubeGeometry(curve, 40, 0.011, 8, false)
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
