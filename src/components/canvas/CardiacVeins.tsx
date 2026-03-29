import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'
import { Html } from '@react-three/drei'

/**
 * Cardiac veins — the heart's own venous drainage.
 * All drain into the coronary sinus → right atrium.
 *
 * Key veins:
 * - Great cardiac vein (runs with LAD, largest)
 * - Middle cardiac vein (runs with PDA)
 * - Small cardiac vein (runs with RCA marginal)
 * - Coronary sinus (receives all, empties into RA)
 */

const veinMaterial = new THREE.MeshBasicMaterial({
  color: '#4466CC',
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
})

const sinusMaterial = new THREE.MeshBasicMaterial({
  color: '#3355BB',
  transparent: true,
  opacity: 0.9,
  depthWrite: false,
})

const VEINS = [
  {
    name: 'Great Cardiac V.',
    fullName: 'Runs with LAD → coronary sinus',
    labelPos: [-0.12, -0.15, 0.32] as [number, number, number],
    points: [
      [-0.04, -0.55, 0.16], [-0.06, -0.35, 0.22], [-0.08, -0.15, 0.27],
      [-0.06, 0.05, 0.28], [-0.04, 0.2, 0.25], [0.0, 0.28, 0.2],
    ],
    radius: 0.006,
  },
  {
    name: 'Middle Cardiac V.',
    fullName: 'Runs with PDA → coronary sinus',
    labelPos: [0.04, -0.45, -0.06] as [number, number, number],
    points: [
      [-0.02, -0.55, -0.05], [0.02, -0.4, -0.06], [0.05, -0.25, -0.04],
      [0.08, -0.1, 0.0], [0.1, 0.05, 0.05],
    ],
    radius: 0.005,
  },
  {
    name: 'Small Cardiac V.',
    fullName: 'Runs with right marginal → coronary sinus',
    labelPos: [0.22, -0.1, 0.08] as [number, number, number],
    points: [
      [0.18, -0.25, 0.02], [0.2, -0.1, 0.06], [0.18, 0.05, 0.08],
      [0.14, 0.15, 0.1],
    ],
    radius: 0.004,
  },
  {
    name: 'Coronary Sinus',
    fullName: 'Collects all venous blood → RA',
    labelPos: [0.15, 0.2, -0.05] as [number, number, number],
    points: [
      [0.0, 0.28, 0.2], [0.06, 0.22, 0.12], [0.1, 0.18, 0.05],
      [0.14, 0.15, 0.1], [0.2, 0.2, 0.0],
    ],
    radius: 0.008,
    isSinus: true,
  },
]

export function CardiacVeins() {
  const visible = useSimStore((s) => s.activeLayers.has('veins'))

  const geometries = useMemo(() => {
    return VEINS.map((v) => {
      const pts = v.points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, v.radius, 6, false)
    })
  }, [])

  if (!visible) return null

  return (
    <group renderOrder={3}>
      {VEINS.map((vein, i) => (
        <group key={vein.name}>
          <mesh geometry={geometries[i]} material={vein.isSinus ? sinusMaterial : veinMaterial} />
          <Html position={vein.labelPos} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
            <div className="vein-card">
              <span className="vein-name">{vein.name}</span>
              <span className="vein-detail">{vein.fullName}</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}
