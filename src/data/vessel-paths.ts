import * as THREE from 'three'

// Simplified systemic circuit: LV -> aorta -> body -> vena cavae -> RA
export const SYSTEMIC_PATH_POINTS = [
  new THREE.Vector3(-0.1, -0.2, 0),
  new THREE.Vector3(0, 0.5, 0),
  new THREE.Vector3(0.3, 0.8, 0),
  new THREE.Vector3(0.6, 0.5, 0.2),
  new THREE.Vector3(0.5, 0, 0.3),
  new THREE.Vector3(0.4, -0.3, 0.2),
  new THREE.Vector3(0.3, 0.3, 0.1),
  new THREE.Vector3(0.25, 0.5, 0.15),
]

export function createSystemicCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(SYSTEMIC_PATH_POINTS, true)
}
