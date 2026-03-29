import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'

const POINTS = [
  {
    name: 'Aortic',
    pos: [0.3, 0.75, 0.55] as [number, number, number],
    sound: 'S2 loudest',
    location: '2nd R intercostal',
  },
  {
    name: 'Pulmonary',
    pos: [-0.2, 0.75, 0.55] as [number, number, number],
    sound: 'S2 splitting',
    location: '2nd L intercostal',
  },
  {
    name: "Erb's",
    pos: [0.0, 0.4, 0.6] as [number, number, number],
    sound: 'AR murmur',
    location: '3rd L intercostal',
  },
  {
    name: 'Tricuspid',
    pos: [0.15, 0.0, 0.6] as [number, number, number],
    sound: 'S1, TR murmur',
    location: 'L lower sternal',
  },
  {
    name: 'Mitral',
    pos: [-0.2, -0.5, 0.6] as [number, number, number],
    sound: 'S1 loudest, MR',
    location: '5th L, midclavicular',
  },
]

const ringMaterial = new THREE.MeshBasicMaterial({
  color: '#FFD700',
  transparent: true,
  opacity: 0.9,
  side: THREE.DoubleSide,
})

const innerMaterial = new THREE.MeshBasicMaterial({
  color: '#FFD700',
  transparent: true,
  opacity: 0.4,
  side: THREE.DoubleSide,
})

export function AuscultationPoints() {
  const visible = useSimStore((s) => s.activeLayers.has('auscultation'))
  const groupRef = useRef<THREE.Group>(null)

  // Subtle pulse animation
  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return
    const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.1
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.scale.setScalar(scale)
      }
    })
  })

  if (!visible) return null

  return (
    <group ref={groupRef}>
      {POINTS.map((point) => (
        <group key={point.name}>
          {/* Outer ring */}
          <mesh position={point.pos} material={ringMaterial}>
            <ringGeometry args={[0.04, 0.055, 24]} />
          </mesh>
          {/* Inner disc */}
          <mesh position={point.pos} material={innerMaterial}>
            <circleGeometry args={[0.04, 24]} />
          </mesh>
          {/* Cross-hair lines */}
          <mesh position={point.pos} material={ringMaterial}>
            <planeGeometry args={[0.12, 0.003]} />
          </mesh>
          <mesh position={point.pos} material={ringMaterial}>
            <planeGeometry args={[0.003, 0.12]} />
          </mesh>

          <Html position={point.pos} center distanceFactor={4} style={{ pointerEvents: 'none' }}>
            <div className="ausc-card">
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
