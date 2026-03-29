import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'
import { Html } from '@react-three/drei'

/**
 * Coronary arteries — thin bright red tubes on the heart surface.
 * With labels for LAD, LCx, RCA.
 */
export function CoronaryArteries() {
  const visible = useSimStore((s) => s.activeLayers.has('coronary'))

  const ladGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.04, 0.3, 0.25),
      new THREE.Vector3(-0.08, 0.12, 0.28),
      new THREE.Vector3(-0.1, 0, 0.3),
      new THREE.Vector3(-0.08, -0.2, 0.26),
      new THREE.Vector3(-0.06, -0.4, 0.2),
      new THREE.Vector3(-0.04, -0.55, 0.15),
    ]
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 40, 0.005, 6, false)
  }, [])

  const lcxGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.04, 0.3, 0.25),
      new THREE.Vector3(-0.15, 0.2, 0.2),
      new THREE.Vector3(-0.22, 0.1, 0.1),
      new THREE.Vector3(-0.24, -0.02, 0),
      new THREE.Vector3(-0.2, -0.1, -0.08),
    ]
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 32, 0.004, 6, false)
  }, [])

  const rcaGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0.1, 0.32, 0.15),
      new THREE.Vector3(0.18, 0.22, 0.18),
      new THREE.Vector3(0.22, 0.08, 0.15),
      new THREE.Vector3(0.2, -0.05, 0.08),
      new THREE.Vector3(0.15, -0.2, 0),
      new THREE.Vector3(0.08, -0.3, -0.04),
    ]
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 40, 0.0045, 6, false)
  }, [])

  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#FF3030',
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  }), [])

  if (!visible) return null

  return (
    <group renderOrder={3}>
      <mesh geometry={ladGeo} material={material} />
      <mesh geometry={lcxGeo} material={material} />
      <mesh geometry={rcaGeo} material={material} />

      <Html position={[-0.08, -0.1, 0.3]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <span className="coronary-label">LAD</span>
      </Html>
      <Html position={[-0.22, 0.05, 0.05]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <span className="coronary-label">LCx</span>
      </Html>
      <Html position={[0.2, 0.1, 0.15]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <span className="coronary-label">RCA</span>
      </Html>
    </group>
  )
}
