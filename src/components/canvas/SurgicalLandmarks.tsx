import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'
import { Html } from '@react-three/drei'

/**
 * Surgical approach landmarks — where the surgeon cuts, clamps, and cannulates.
 *
 * Includes:
 * - Sternotomy line
 * - Aortic cross-clamp site
 * - Arterial cannulation (ascending aorta)
 * - Venous cannulation (SVC + IVC)
 * - Cardioplegia delivery (aortic root + coronary sinus)
 * - Triangle of Koch (AV node danger zone)
 */

const sternotomyMaterial = new THREE.MeshBasicMaterial({
  color: '#FFAA00',
  transparent: true,
  opacity: 0.8,
  depthWrite: false,
})

const dangerMaterial = new THREE.MeshBasicMaterial({
  color: '#FF0000',
  transparent: true,
  opacity: 0.25,
  side: THREE.DoubleSide,
  depthWrite: false,
})

const LANDMARKS = [
  {
    name: 'Aortic Cross-Clamp',
    detail: 'Clamped during bypass to create bloodless field. Ischemia time starts here.',
    pos: [0.12, 0.7, 0.12] as [number, number, number],
    color: '#FF6600',
  },
  {
    name: 'Arterial Cannulation',
    detail: 'Ascending aorta — returns oxygenated blood from bypass machine.',
    pos: [0.2, 0.8, 0.05] as [number, number, number],
    color: '#FF4444',
  },
  {
    name: 'SVC Cannulation',
    detail: 'Superior vena cava — drains venous blood to bypass machine.',
    pos: [0.35, 0.8, -0.1] as [number, number, number],
    color: '#4466CC',
  },
  {
    name: 'IVC Cannulation',
    detail: 'Inferior vena cava — second venous drainage for bypass.',
    pos: [0.2, -0.7, -0.05] as [number, number, number],
    color: '#4466CC',
  },
  {
    name: 'Cardioplegia (Root)',
    detail: 'Antegrade delivery — cold K+ solution stops the heart in diastole.',
    pos: [0.05, 0.6, 0.15] as [number, number, number],
    color: '#44AAFF',
  },
  {
    name: 'Cardioplegia (CS)',
    detail: 'Retrograde via coronary sinus — reaches areas past stenoses.',
    pos: [0.18, 0.18, 0.02] as [number, number, number],
    color: '#44AAFF',
  },
]

export function SurgicalLandmarks() {
  const visible = useSimStore((s) => s.activeLayers.has('surgical'))

  // Sternotomy line — vertical line down the center
  const sternotomyGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 1.2, 0.7),
      new THREE.Vector3(0, 0.8, 0.65),
      new THREE.Vector3(0, 0.3, 0.55),
      new THREE.Vector3(0, -0.2, 0.5),
      new THREE.Vector3(0, -0.7, 0.4),
    ]
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 40, 0.008, 4, false)
  }, [])

  // Triangle of Koch — danger zone near tricuspid annulus
  const triangleGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0.08, 0)
    shape.lineTo(0.04, 0.07)
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [])

  if (!visible) return null

  return (
    <group renderOrder={4}>
      {/* Sternotomy line */}
      <mesh geometry={sternotomyGeo} material={sternotomyMaterial} />
      <Html position={[0.15, 1.0, 0.7]} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
        <div className="surgical-card">
          <span className="surgical-name">Median Sternotomy</span>
          <span className="surgical-detail">Standard approach for all open-heart surgery</span>
        </div>
      </Html>

      {/* Triangle of Koch — AV node danger zone */}
      <mesh
        geometry={triangleGeo}
        material={dangerMaterial}
        position={[0.12, 0.05, 0.25]}
        rotation={[0.3, -0.2, 0]}
      />
      <Html position={[0.18, 0.05, 0.3]} center distanceFactor={4} style={{ pointerEvents: 'none' }}>
        <div className="surgical-card danger">
          <span className="surgical-name">Triangle of Koch</span>
          <span className="surgical-detail">DANGER ZONE — AV node and Bundle of His. Sutures here cause complete heart block.</span>
        </div>
      </Html>

      {/* Landmark markers */}
      {LANDMARKS.map((lm) => (
        <group key={lm.name}>
          {/* Cross marker */}
          <mesh position={lm.pos}>
            <planeGeometry args={[0.08, 0.004]} />
            <meshBasicMaterial color={lm.color} depthWrite={false} transparent opacity={0.9} />
          </mesh>
          <mesh position={lm.pos}>
            <planeGeometry args={[0.004, 0.08]} />
            <meshBasicMaterial color={lm.color} depthWrite={false} transparent opacity={0.9} />
          </mesh>
          {/* Circle */}
          <mesh position={lm.pos}>
            <ringGeometry args={[0.025, 0.035, 16]} />
            <meshBasicMaterial color={lm.color} depthWrite={false} transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>

          <Html position={lm.pos} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
            <div className="surgical-card">
              <span className="surgical-name">{lm.name}</span>
              <span className="surgical-detail">{lm.detail}</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}
