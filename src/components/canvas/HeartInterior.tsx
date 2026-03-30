import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'
import { Html } from '@react-three/drei'

/**
 * Anatomically accurate interior structures based on detailed
 * spatial research. All positions normalized to 2.8-unit heart centered at origin.
 *
 * Visible when Interior or Cross Section overlays are active.
 */

// ── Materials (Netter color palette) ──

const myocardiumMat = new THREE.MeshPhysicalMaterial({
  color: '#8B2020', roughness: 0.35, metalness: 0.02, clearcoat: 0.4,
  clearcoatRoughness: 0.15, side: THREE.DoubleSide,
})

const septumMat = new THREE.MeshPhysicalMaterial({
  color: '#7A2828', roughness: 0.35, metalness: 0.02, clearcoat: 0.35,
  clearcoatRoughness: 0.15, side: THREE.DoubleSide,
})

const membranousMat = new THREE.MeshPhysicalMaterial({
  color: '#F0D8D0', roughness: 0.3, metalness: 0.01, clearcoat: 0.5,
  clearcoatRoughness: 0.1, side: THREE.DoubleSide, transparent: true, opacity: 0.6,
})

const papillaryMat = new THREE.MeshPhysicalMaterial({
  color: '#A0352C', roughness: 0.4, metalness: 0.01, clearcoat: 0.3,
  clearcoatRoughness: 0.2, side: THREE.DoubleSide,
})

const chordaeMat = new THREE.MeshBasicMaterial({
  color: '#F5F0E8', transparent: true, opacity: 0.75,
})

const leafletMat = new THREE.MeshPhysicalMaterial({
  color: '#F0D8D0', roughness: 0.25, metalness: 0.03, clearcoat: 0.6,
  clearcoatRoughness: 0.08, side: THREE.DoubleSide, transparent: true, opacity: 0.8,
})

const smoothEndoMat = new THREE.MeshPhysicalMaterial({
  color: '#E8D0C8', roughness: 0.3, metalness: 0.01, clearcoat: 0.5,
  clearcoatRoughness: 0.1, side: THREE.DoubleSide, transparent: true, opacity: 0.4,
})

const fibrousMat = new THREE.MeshPhysicalMaterial({
  color: '#F5F0E8', roughness: 0.3, metalness: 0.02, clearcoat: 0.4,
  clearcoatRoughness: 0.15, side: THREE.DoubleSide,
})

const fossaMat = new THREE.MeshBasicMaterial({
  color: '#F0D8D0', transparent: true, opacity: 0.3, side: THREE.DoubleSide,
})

// ── Chordae generator ──

function makeChorda(from: [number, number, number], to: [number, number, number], radius = 0.003) {
  const curve = new THREE.LineCurve3(new THREE.Vector3(...from), new THREE.Vector3(...to))
  return new THREE.TubeGeometry(curve, 4, radius, 4, false)
}

// ── Labels ──

const INTERIOR_LABELS = [
  { name: 'Interventricular Septum', pos: [0.1, -0.3, 0.12] },
  { name: 'Membranous Septum', pos: [0.05, 0.5, 0.0] },
  { name: 'Anterolateral Papillary', pos: [0.5, -0.5, 0.25] },
  { name: 'Posteromedial Papillary', pos: [0.2, -0.5, -0.35] },
  { name: 'Moderator Band', pos: [-0.15, -0.55, 0.25] },
  { name: 'Fossa Ovalis', pos: [0.05, 1.0, -0.15] },
  { name: 'Crista Supraventricularis', pos: [-0.15, 0.3, 0.3] },
  { name: 'LV Outflow Tract', pos: [0.2, 0.35, 0.25] },
  { name: 'Infundibulum', pos: [-0.05, 0.55, 0.45] },
  { name: 'Mitral Anterior Leaflet', pos: [0.35, 0.45, 0.0] },
  { name: 'Tricuspid Valve', pos: [-0.2, 0.45, 0.15] },
  { name: 'RV Anterior Papillary', pos: [-0.3, -0.4, 0.4] },
]

export function HeartInterior() {
  const crossSectionActive = useSimStore((s) => s.activeLayers.has('crossSection'))
  const interiorActive = useSimStore((s) => s.activeLayers.has('interior'))

  // ── Interventricular Septum (muscular portion) ──
  const septumGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.2)
    shape.bezierCurveTo(0.03, -0.1, -0.02, -0.5, 0, -1.0)
    shape.lineTo(0.12, -1.0)
    shape.bezierCurveTo(0.14, -0.5, 0.09, -0.1, 0.12, 0.2)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 })
  }, [])

  // ── Membranous septum (thin, pale) ──
  const membranousGeo = useMemo(() => new THREE.CircleGeometry(0.06, 16), [])

  // ── LV Anterolateral papillary muscle ──
  const alvPapGeo = useMemo(() => new THREE.ConeGeometry(0.085, 0.45, 10), [])

  // ── LV Posteromedial papillary muscle (2 heads) ──
  const pmPapGeo = useMemo(() => new THREE.ConeGeometry(0.07, 0.45, 10), [])
  const pmPapGeo2 = useMemo(() => new THREE.ConeGeometry(0.06, 0.4, 8), [])

  // ── RV Anterior papillary (largest) ──
  const rvAntPapGeo = useMemo(() => new THREE.ConeGeometry(0.075, 0.35, 8), [])

  // ── RV Posterior papillary ──
  const rvPostPapGeo = useMemo(() => new THREE.ConeGeometry(0.05, 0.25, 8), [])

  // ── RV Septal papillary (tiny) ──
  const rvSeptPapGeo = useMemo(() => new THREE.ConeGeometry(0.03, 0.15, 6), [])

  // ── Moderator band ──
  const moderatorGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.6, 0.1),
      new THREE.Vector3(-0.12, -0.55, 0.2),
      new THREE.Vector3(-0.25, -0.5, 0.3),
    ])
    return new THREE.TubeGeometry(curve, 16, 0.035, 8, false)
  }, [])

  // ── Crista supraventricularis ──
  const cristaGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 0.3, 0.15),
      new THREE.Vector3(-0.1, 0.3, 0.25),
      new THREE.Vector3(-0.25, 0.3, 0.3),
    ])
    return new THREE.TubeGeometry(curve, 12, 0.04, 8, false)
  }, [])

  // ── LVOT smooth wall ──
  const lvotGeo = useMemo(() => new THREE.CylinderGeometry(0.14, 0.16, 0.5, 12, 1, true), [])

  // ── Infundibulum smooth wall ──
  const infundGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.14, 0.45, 12, 1, true), [])

  // ── Mitral valve leaflets ──
  const mitralAnteriorGeo = useMemo(() => new THREE.CircleGeometry(0.12, 16, 0, Math.PI), [])
  const mitralPosteriorGeo = useMemo(() => new THREE.CircleGeometry(0.1, 16, 0, Math.PI), [])

  // ── Tricuspid valve (3 leaflets) ──
  const tricuspidGeo = useMemo(() => new THREE.CircleGeometry(0.1, 12, 0, Math.PI * 0.67), [])

  // ── Fossa ovalis ──
  const fossaGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.absellipse(0, 0, 0.075, 0.05, 0, Math.PI * 2, false, 0)
    return new THREE.ShapeGeometry(shape)
  }, [])

  // ── Fossa limbus (rim) ──
  const limbusGeo = useMemo(() => new THREE.RingGeometry(0.07, 0.1, 20), [])

  // ── Chordae tendineae (LV) ──
  const chordaeGeos = useMemo(() => [
    // Anterolateral papillary → mitral anterior leaflet (lateral half)
    makeChorda([0.45, -0.3, 0.2], [0.3, 0.45, 0.02]),
    makeChorda([0.45, -0.3, 0.2], [0.35, 0.42, 0.05]),
    makeChorda([0.45, -0.3, 0.2], [0.4, 0.4, -0.02]),
    // Anterolateral → mitral posterior leaflet (lateral half)
    makeChorda([0.45, -0.3, 0.2], [0.4, 0.45, -0.08]),
    makeChorda([0.45, -0.3, 0.2], [0.42, 0.43, -0.05]),
    // Posteromedial papillary → mitral anterior (medial half)
    makeChorda([0.15, -0.3, -0.3], [0.25, 0.45, -0.02]),
    makeChorda([0.15, -0.3, -0.3], [0.2, 0.42, 0.0]),
    // Posteromedial → mitral posterior (medial half)
    makeChorda([0.15, -0.3, -0.3], [0.28, 0.45, -0.1]),
    makeChorda([0.15, -0.3, -0.3], [0.3, 0.43, -0.12]),
    // Second head of posteromedial
    makeChorda([0.2, -0.35, -0.25], [0.22, 0.44, -0.04]),
    makeChorda([0.2, -0.35, -0.25], [0.32, 0.44, -0.08]),
  ], [])

  // ── Trabeculae bridges (LV — 3 crossing the apical cavity) ──
  const trabGeos = useMemo(() => [
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.3, -0.9, 0.15),
      new THREE.Vector3(0.15, -1.0, 0.1),
      new THREE.Vector3(0.0, -0.9, 0.05),
    ]), 8, 0.01, 4, false),
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, -0.7, 0.1),
      new THREE.Vector3(0.2, -0.8, 0.0),
      new THREE.Vector3(0.05, -0.7, -0.05),
    ]), 8, 0.008, 4, false),
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.25, -0.6, 0.2),
      new THREE.Vector3(0.15, -0.65, 0.15),
      new THREE.Vector3(0.05, -0.55, 0.1),
    ]), 8, 0.009, 4, false),
  ], [])

  // ── RV Trabeculae (coarser, more prominent) ──
  const rvTrabGeos = useMemo(() => [
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, -0.3, 0.3),
      new THREE.Vector3(-0.2, -0.4, 0.35),
      new THREE.Vector3(-0.1, -0.3, 0.25),
    ]), 8, 0.012, 4, false),
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.3, -0.15, 0.35),
      new THREE.Vector3(-0.2, -0.25, 0.3),
      new THREE.Vector3(-0.05, -0.2, 0.2),
    ]), 8, 0.014, 4, false),
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, -0.5, 0.25),
      new THREE.Vector3(-0.25, -0.6, 0.3),
      new THREE.Vector3(-0.1, -0.55, 0.2),
    ]), 8, 0.011, 4, false),
  ], [])

  if (!crossSectionActive && !interiorActive) return null

  return (
    <group>
      {/* ── Interventricular Septum ── */}
      <mesh geometry={septumGeo} material={septumMat} position={[0.04, 0, -0.07]} />

      {/* ── Membranous Septum (thin, pale) ── */}
      <mesh geometry={membranousGeo} material={membranousMat} position={[0.05, 0.5, -0.05]} rotation={[0, Math.PI * 0.1, 0]} />

      {/* ── LV Papillary Muscles ── */}
      <mesh geometry={alvPapGeo} material={papillaryMat} position={[0.45, -0.5, 0.2]} rotation={[0.15, 0, -0.25]} />
      <mesh geometry={pmPapGeo} material={papillaryMat} position={[0.15, -0.5, -0.3]} rotation={[-0.1, 0, 0.15]} />
      <mesh geometry={pmPapGeo2} material={papillaryMat} position={[0.2, -0.55, -0.25]} rotation={[-0.05, 0.2, 0.1]} />

      {/* ── RV Papillary Muscles ── */}
      <mesh geometry={rvAntPapGeo} material={papillaryMat} position={[-0.3, -0.4, 0.35]} rotation={[0.1, 0, 0.15]} />
      <mesh geometry={rvPostPapGeo} material={papillaryMat} position={[-0.2, -0.4, -0.1]} rotation={[-0.1, 0, -0.1]} />
      <mesh geometry={rvSeptPapGeo} material={papillaryMat} position={[0.05, -0.2, 0.1]} rotation={[0, 0, -0.05]} />

      {/* ── Moderator Band ── */}
      <mesh geometry={moderatorGeo} material={myocardiumMat} />

      {/* ── Crista Supraventricularis ── */}
      <mesh geometry={cristaGeo} material={myocardiumMat} />

      {/* ── LVOT (smooth outflow tract) ── */}
      <mesh geometry={lvotGeo} material={smoothEndoMat} position={[0.2, 0.35, 0.2]} rotation={[0, 0, -0.15]} />

      {/* ── Infundibulum (RV smooth outflow) ── */}
      <mesh geometry={infundGeo} material={smoothEndoMat} position={[-0.05, 0.55, 0.4]} rotation={[-0.2, 0, 0.1]} />

      {/* ── Mitral Valve Leaflets ── */}
      <mesh geometry={mitralAnteriorGeo} material={leafletMat} position={[0.3, 0.5, 0.0]} rotation={[Math.PI * 0.45, 0.1, 0]} />
      <mesh geometry={mitralPosteriorGeo} material={leafletMat} position={[0.35, 0.48, -0.08]} rotation={[-Math.PI * 0.45, 0.1, 0]} />

      {/* ── Tricuspid Valve Leaflets (3) ── */}
      <mesh geometry={tricuspidGeo} material={leafletMat} position={[-0.2, 0.5, 0.1]} rotation={[Math.PI * 0.45, -0.15, 0]} />
      <mesh geometry={tricuspidGeo} material={leafletMat} position={[-0.15, 0.48, 0.0]} rotation={[-Math.PI * 0.3, 0, 0.3]} />
      <mesh geometry={tricuspidGeo} material={leafletMat} position={[-0.22, 0.48, 0.15]} rotation={[Math.PI * 0.2, 0.2, -0.2]} />

      {/* ── Fossa Ovalis ── */}
      <mesh geometry={fossaGeo} material={fossaMat} position={[0.05, 1.0, -0.1]} rotation={[0, 0.1, 0]} />
      <mesh geometry={limbusGeo} material={fibrousMat} position={[0.05, 1.0, -0.1]} rotation={[0, 0.1, 0]} />

      {/* ── Chordae Tendineae ── */}
      {chordaeGeos.map((geo, i) => (
        <mesh key={`ch-${i}`} geometry={geo} material={chordaeMat} />
      ))}

      {/* ── LV Trabeculae Bridges ── */}
      {trabGeos.map((geo, i) => (
        <mesh key={`trab-lv-${i}`} geometry={geo} material={myocardiumMat} />
      ))}

      {/* ── RV Trabeculae (coarser) ── */}
      {rvTrabGeos.map((geo, i) => (
        <mesh key={`trab-rv-${i}`} geometry={geo} material={myocardiumMat} />
      ))}

      {/* ── Labels ── */}
      {INTERIOR_LABELS.map((label) => (
        <Html
          key={label.name}
          position={label.pos as [number, number, number]}
          distanceFactor={5}
          style={{ pointerEvents: 'none' }}
        >
          <span className="interior-label">{label.name}</span>
        </Html>
      ))}
    </group>
  )
}
