import * as THREE from 'three'

/**
 * Blood flow paths scaled to match the heart-detailed.glb model.
 * Model is ~2.8 units tall after auto-scaling, centered at origin.
 *
 * Systemic circuit: LV → aorta → body → vena cavae → RA → RV
 */
export const SYSTEMIC_PATH_POINTS = [
  // Left ventricle outflow
  new THREE.Vector3(-0.15, -0.5, 0.15),
  // Up through aortic valve
  new THREE.Vector3(-0.05, 0.1, 0.12),
  // Into ascending aorta
  new THREE.Vector3(0, 0.6, 0.08),
  // Aortic arch
  new THREE.Vector3(0.2, 0.9, 0),
  // Descending — abstracted body circuit
  new THREE.Vector3(0.6, 0.4, -0.15),
  new THREE.Vector3(0.7, -0.1, -0.2),
  new THREE.Vector3(0.6, -0.6, -0.15),
  // Returning via vena cavae
  new THREE.Vector3(0.4, -0.3, -0.08),
  new THREE.Vector3(0.4, 0.4, 0),
  // Into right atrium
  new THREE.Vector3(0.35, 0.6, 0.08),
  // Through tricuspid valve into right ventricle
  new THREE.Vector3(0.2, 0.1, 0.15),
  // Right ventricle
  new THREE.Vector3(0.15, -0.4, 0.2),
  // Back toward left side
  new THREE.Vector3(0, -0.7, 0.15),
  new THREE.Vector3(-0.15, -0.5, 0.15),
]

export function createSystemicCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(SYSTEMIC_PATH_POINTS, true)
}
