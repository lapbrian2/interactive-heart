import * as THREE from 'three'

/**
 * Blood flow paths positioned inside the heart model bounds.
 * Model is ~2.5 units tall, centered at origin.
 *
 * Systemic circuit (v1): LV → aorta → (abstracted body) → vena cavae → RA → RV → repeat
 */
export const SYSTEMIC_PATH_POINTS = [
  // Left ventricle outflow
  new THREE.Vector3(-0.1, -0.3, 0.1),
  // Up through aortic valve
  new THREE.Vector3(-0.05, 0.05, 0.08),
  // Into ascending aorta
  new THREE.Vector3(0, 0.4, 0.05),
  // Aortic arch
  new THREE.Vector3(0.15, 0.6, 0),
  // Descending — abstracted body circuit
  new THREE.Vector3(0.4, 0.3, -0.1),
  new THREE.Vector3(0.5, -0.1, -0.15),
  new THREE.Vector3(0.4, -0.5, -0.1),
  // Returning via vena cavae
  new THREE.Vector3(0.3, -0.2, -0.05),
  new THREE.Vector3(0.3, 0.3, 0),
  // Into right atrium
  new THREE.Vector3(0.25, 0.4, 0.05),
  // Through tricuspid valve into right ventricle
  new THREE.Vector3(0.15, 0.05, 0.1),
  // Right ventricle
  new THREE.Vector3(0.1, -0.3, 0.15),
  // Back toward left side (simplified)
  new THREE.Vector3(0, -0.5, 0.1),
  new THREE.Vector3(-0.1, -0.3, 0.1),
]

export function createSystemicCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(SYSTEMIC_PATH_POINTS, true)
}
