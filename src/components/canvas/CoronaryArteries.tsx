import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'
import { Html } from '@react-three/drei'

const arteryMaterial = new THREE.MeshBasicMaterial({
  color: '#FF2020',
  transparent: true,
  opacity: 0.95,
  depthWrite: false,
})

const ARTERIES = [
  {
    name: 'LAD',
    fullName: 'Left Anterior Descending',
    territory: 'Anterior wall, ant. 2/3 septum',
    labelPos: [-0.1, -0.1, 0.32] as [number, number, number],
    points: [
      [-0.04, 0.3, 0.25], [-0.08, 0.12, 0.28], [-0.1, 0, 0.3],
      [-0.08, -0.2, 0.26], [-0.06, -0.4, 0.2], [-0.04, -0.55, 0.15],
    ],
    radius: 0.008,
  },
  {
    name: 'LCx',
    fullName: 'Left Circumflex',
    territory: 'Lateral, posterior wall',
    labelPos: [-0.22, 0.05, 0.08] as [number, number, number],
    points: [
      [-0.04, 0.3, 0.25], [-0.15, 0.2, 0.2], [-0.22, 0.1, 0.1],
      [-0.24, -0.02, 0], [-0.2, -0.1, -0.08],
    ],
    radius: 0.006,
  },
  {
    name: 'RCA',
    fullName: 'Right Coronary',
    territory: 'RV, inferior wall',
    labelPos: [0.22, 0.08, 0.18] as [number, number, number],
    points: [
      [0.1, 0.32, 0.15], [0.18, 0.22, 0.18], [0.22, 0.08, 0.15],
      [0.2, -0.05, 0.08], [0.15, -0.2, 0], [0.08, -0.3, -0.04],
    ],
    radius: 0.007,
  },
  {
    name: 'PDA',
    fullName: 'Posterior Descending',
    territory: 'Posterior septum, inferior wall',
    labelPos: [0.05, -0.35, -0.06] as [number, number, number],
    points: [
      [0.08, -0.3, -0.04], [0.02, -0.4, -0.06], [-0.03, -0.5, -0.04],
    ],
    radius: 0.005,
  },
]

export function CoronaryArteries() {
  const visible = useSimStore((s) => s.activeLayers.has('coronary'))

  const geometries = useMemo(() => {
    return ARTERIES.map((a) => {
      const pts = a.points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, a.radius, 8, false)
    })
  }, [])

  if (!visible) return null

  return (
    <group renderOrder={3}>
      {ARTERIES.map((artery, i) => (
        <group key={artery.name}>
          <mesh geometry={geometries[i]} material={arteryMaterial} />
          <Html position={artery.labelPos} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
            <div className="coronary-card">
              <span className="coronary-name">{artery.name}</span>
              <span className="coronary-full">{artery.fullName}</span>
              <span className="coronary-territory">{artery.territory}</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}
