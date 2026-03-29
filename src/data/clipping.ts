import * as THREE from 'three'

/**
 * Shared clipping plane for cross-section view.
 * Normal (0, 0, -1) with constant 0 clips z > 0 (front half toward camera).
 */
export const CROSS_SECTION_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
