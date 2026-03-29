import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'
import { Html } from '@react-three/drei'

/**
 * Pericardium — the tough fibrous sac surrounding the heart.
 * Rendered as a semi-transparent outer shell larger than the heart model.
 *
 * Layers (outer to inner):
 * 1. Fibrous pericardium — tough outer layer
 * 2. Parietal serous pericardium — inner lining of the sac
 * 3. Pericardial space (with ~20mL fluid)
 * 4. Visceral serous pericardium (epicardium) — on heart surface
 */

const pericardiumMaterial = new THREE.MeshPhysicalMaterial({
  color: '#C8B898',
  roughness: 0.5,
  metalness: 0.0,
  transparent: true,
  opacity: 0.15,
  side: THREE.DoubleSide,
  depthWrite: false,
})

export function Pericardium() {
  const visible = useSimStore((s) => s.activeLayers.has('pericardium'))

  // Outer sac — slightly larger than the heart
  const sacGeo = useMemo(() => {
    return new THREE.SphereGeometry(1.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.85)
  }, [])

  if (!visible) return null

  return (
    <group renderOrder={0}>
      <mesh
        geometry={sacGeo}
        material={pericardiumMaterial}
        position={[0, 0.1, 0]}
        scale={[1, 1.1, 0.85]}
      />

      {/* Labels */}
      <Html position={[0, 1.5, 0.8]} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
        <div className="pericardium-card">
          <span className="peri-name">Fibrous Pericardium</span>
          <span className="peri-detail">Tough outer sac anchored to diaphragm, sternum, and great vessels</span>
        </div>
      </Html>
      <Html position={[1.2, 0, 0.5]} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
        <div className="pericardium-card">
          <span className="peri-name">Pericardial Space</span>
          <span className="peri-detail">~20mL serous fluid. Tamponade if {'>'} 150mL accumulates rapidly</span>
        </div>
      </Html>
    </group>
  )
}
