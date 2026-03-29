import * as THREE from 'three'

/**
 * Shared clipping plane for cross-section view.
 * Sagittal cut (left-right split) — clips the right half to reveal
 * internal chambers from the medial view, like an anatomy textbook.
 * Normal (1, 0, 0) with constant 0.02 clips x > 0.02 (right side).
 */
export const CROSS_SECTION_PLANE = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.02)
