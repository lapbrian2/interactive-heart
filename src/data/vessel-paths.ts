import * as THREE from 'three'

/**
 * Blood flow path through the heart interior.
 * Keep points INSIDE the model volume — not on or outside the surface.
 */
export const SYSTEMIC_PATH_POINTS = [
  new THREE.Vector3(-0.08, -0.35, 0.05),   // LV interior
  new THREE.Vector3(-0.03, 0.05, 0.04),    // up through aortic valve
  new THREE.Vector3(0, 0.4, 0.03),         // ascending aorta
  new THREE.Vector3(0.1, 0.6, 0),          // aortic arch
  new THREE.Vector3(0.3, 0.3, -0.05),      // descending — stays close
  new THREE.Vector3(0.3, -0.1, -0.08),     // body circuit (abstracted)
  new THREE.Vector3(0.25, -0.3, -0.05),    // returning
  new THREE.Vector3(0.2, 0.2, 0),          // vena cavae
  new THREE.Vector3(0.2, 0.45, 0.02),      // RA inflow
  new THREE.Vector3(0.12, 0.05, 0.05),     // through tricuspid
  new THREE.Vector3(0.08, -0.3, 0.08),     // RV interior
  new THREE.Vector3(0, -0.5, 0.05),        // toward apex
  new THREE.Vector3(-0.08, -0.35, 0.05),   // back to LV
]

export function createSystemicCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(SYSTEMIC_PATH_POINTS, true)
}
