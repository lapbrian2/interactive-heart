import { useSimStore } from '../../store/useSimStore'
import { Html } from '@react-three/drei'

/**
 * Pericardium overlay — educational labels only, no geometry.
 * The heart model's surface IS the epicardium (visceral pericardium).
 * A proper pericardium would require a separate, slightly larger
 * mesh sculpted to the heart's shape — not a sphere.
 */
export function Pericardium() {
  const visible = useSimStore((s) => s.activeLayers.has('pericardium'))

  if (!visible) return null

  return (
    <group>
      <Html position={[0, 1.2, 0.3]} distanceFactor={5} style={{ pointerEvents: 'none' }}>
        <div className="pericardium-card">
          <span className="peri-name">Pericardium</span>
          <span className="peri-detail">The heart surface you see is the epicardium (visceral pericardium). The fibrous pericardium surrounds it as a tough sac anchored to the diaphragm, sternum, and great vessels. ~20mL of serous fluid fills the pericardial space between them.</span>
        </div>
      </Html>
      <Html position={[0.6, 0.0, 0.3]} distanceFactor={5} style={{ pointerEvents: 'none' }}>
        <div className="pericardium-card">
          <span className="peri-name">Clinical</span>
          <span className="peri-detail">Cardiac tamponade: rapid fluid accumulation compresses the heart, preventing filling. Beck's triad: hypotension, JVD, muffled heart sounds. Treatment: pericardiocentesis (emergent) or pericardial window (surgical).</span>
        </div>
      </Html>
    </group>
  )
}
