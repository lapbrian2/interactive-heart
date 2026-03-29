import { Html } from '@react-three/drei'
import { useSimStore } from '../../store/useSimStore'

/**
 * Auscultation points — where you place a stethoscope on the chest
 * to hear each valve. Positioned relative to the heart model.
 *
 * Classic locations (mapped to 3D positions on/near the heart):
 * - Aortic: 2nd right intercostal, parasternal
 * - Pulmonary: 2nd left intercostal, parasternal
 * - Tricuspid: Left lower sternal border
 * - Mitral: 5th left intercostal, midclavicular (apex)
 * - Erb's point: 3rd left intercostal
 */
const AUSCULTATION_POINTS = [
  {
    name: 'Aortic Area',
    position: [0.3, 0.75, 0.55] as [number, number, number],
    valve: 'Aortic Valve',
    sound: 'S2 loudest here',
    location: '2nd right intercostal space',
  },
  {
    name: 'Pulmonary Area',
    position: [-0.2, 0.75, 0.55] as [number, number, number],
    valve: 'Pulmonary Valve',
    sound: 'S2 splitting heard here',
    location: '2nd left intercostal space',
  },
  {
    name: "Erb's Point",
    position: [0.0, 0.4, 0.6] as [number, number, number],
    valve: 'Multiple',
    sound: 'Aortic regurgitation murmur',
    location: '3rd left intercostal space',
  },
  {
    name: 'Tricuspid Area',
    position: [0.15, 0.0, 0.6] as [number, number, number],
    valve: 'Tricuspid Valve',
    sound: 'S1 component, tricuspid murmurs',
    location: 'Left lower sternal border',
  },
  {
    name: 'Mitral Area (Apex)',
    position: [-0.2, -0.5, 0.6] as [number, number, number],
    valve: 'Mitral Valve',
    sound: 'S1 loudest here, mitral murmurs',
    location: '5th left intercostal, midclavicular',
  },
]

export function AuscultationPoints() {
  const visible = useSimStore((s) => s.activeLayers.has('auscultation'))

  if (!visible) return null

  return (
    <group>
      {AUSCULTATION_POINTS.map((point) => (
        <group key={point.name}>
          {/* Stethoscope marker */}
          <mesh position={point.position}>
            <ringGeometry args={[0.03, 0.045, 24]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.8}
              side={2}
            />
          </mesh>
          {/* Center dot */}
          <mesh position={point.position}>
            <circleGeometry args={[0.015, 16]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.6}
              side={2}
            />
          </mesh>

          <Html
            position={point.position}
            center
            distanceFactor={5}
            style={{ pointerEvents: 'none' }}
          >
            <div className="auscultation-label">
              <span className="ausc-name">{point.name}</span>
              <span className="ausc-location">{point.location}</span>
              <span className="ausc-sound">{point.sound}</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}
