import * as THREE from 'three'

/**
 * Shared clipping plane for cross-section view.
 * Coronal four-chamber cut — removes the anterior wall to expose
 * all four chambers from the front, like a standard dissection.
 * Normal (0, 0, -1) clips z > 0.08 (front face toward camera).
 */
export const CROSS_SECTION_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.08)
