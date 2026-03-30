import { useMemo } from 'react'
import * as THREE from 'three'
import { useSimStore } from '../../store/useSimStore'
import { Html } from '@react-three/drei'

/**
 * Anatomically accurate interior structures.
 * Scaled to fit INSIDE the heart model (0.6x scale factor).
 * Labels are minimal — only key structures labeled.
 */

const S = 0.3 // Scale factor — smaller to stay centered inside the heart model

// ── Materials — Dissection-grade (bright, wet, fresh tissue) ──
const myoMat = new THREE.MeshPhysicalMaterial({
  color: '#A03030', roughness: 0.3, metalness: 0.02, clearcoat: 0.5,
  clearcoatRoughness: 0.1, sheen: 0.3, sheenColor: new THREE.Color('#FF6060'),
  sheenRoughness: 0.3, side: THREE.DoubleSide,
})
const septumMat = new THREE.MeshPhysicalMaterial({
  color: '#8B2525', roughness: 0.3, metalness: 0.02, clearcoat: 0.45,
  clearcoatRoughness: 0.12, sheen: 0.25, sheenColor: new THREE.Color('#DD5555'),
  sheenRoughness: 0.35, side: THREE.DoubleSide,
})
const papMat = new THREE.MeshPhysicalMaterial({
  color: '#B03838', roughness: 0.35, metalness: 0.01, clearcoat: 0.4,
  clearcoatRoughness: 0.15, sheen: 0.2, sheenColor: new THREE.Color('#FF5050'),
  side: THREE.DoubleSide,
})
const chordMat = new THREE.MeshPhysicalMaterial({
  color: '#F5EDE0', roughness: 0.2, metalness: 0.03, clearcoat: 0.6,
  clearcoatRoughness: 0.05, side: THREE.DoubleSide,
})
const leafMat = new THREE.MeshPhysicalMaterial({
  color: '#F0D0C0', roughness: 0.2, metalness: 0.04, clearcoat: 0.7,
  clearcoatRoughness: 0.05, side: THREE.DoubleSide, transparent: true, opacity: 0.85,
})
const membrMat = new THREE.MeshPhysicalMaterial({
  color: '#F0D8D0', roughness: 0.25, metalness: 0.02, clearcoat: 0.5,
  side: THREE.DoubleSide, transparent: true, opacity: 0.5,
})

function tube(pts: number[][], radius: number) {
  const v = pts.map(([x, y, z]) => new THREE.Vector3(x * S, y * S, z * S))
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v), 12, radius * S, 6, false)
}

function chorda(from: number[], to: number[]) {
  return tube([from, to], 0.003)
}

// Only the most important labels — 6 max visible at once
// Labels positioned in absolute coords near the structures
const LABELS = [
  { name: 'Septum', pos: [0.02, -0.06, 0.04] },
  { name: 'Moderator Band', pos: [-0.04, -0.16, 0.07] },
  { name: 'Papillary', pos: [0.1, -0.12, 0.06] },
  { name: 'Chordae', pos: [0.07, -0.02, 0.03] },
  { name: 'Fossa Ovalis', pos: [0.01, 0.25, -0.02] },
  { name: 'Mitral', pos: [0.06, 0.12, 0.0] },
]

export function HeartInterior() {
  const crossSection = useSimStore((s) => s.activeLayers.has('crossSection'))
  const interior = useSimStore((s) => s.activeLayers.has('interior'))

  // Septum (muscular)
  const septumGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.15 * S)
    shape.bezierCurveTo(0.02 * S, -0.1 * S, -0.01 * S, -0.5 * S, 0, -0.85 * S)
    shape.lineTo(0.08 * S, -0.85 * S)
    shape.bezierCurveTo(0.1 * S, -0.5 * S, 0.06 * S, -0.1 * S, 0.08 * S, 0.15 * S)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1 * S, bevelEnabled: false })
  }, [])

  // Papillary muscles
  const alvPap = useMemo(() => new THREE.ConeGeometry(0.06 * S, 0.3 * S, 8), [])
  const pmPap = useMemo(() => new THREE.ConeGeometry(0.05 * S, 0.3 * S, 8), [])
  const rvPap = useMemo(() => new THREE.ConeGeometry(0.05 * S, 0.22 * S, 8), [])

  // Moderator band
  const modGeo = useMemo(() => tube(
    [[0, -0.6, 0.08], [-0.1, -0.55, 0.18], [-0.2, -0.48, 0.25]],
    0.025
  ), [])

  // Crista
  const cristaGeo = useMemo(() => tube(
    [[0.0, 0.25, 0.12], [-0.08, 0.25, 0.2], [-0.18, 0.25, 0.25]],
    0.03
  ), [])

  // Mitral leaflets
  const mitAntGeo = useMemo(() => new THREE.CircleGeometry(0.08 * S, 12, 0, Math.PI), [])
  const mitPostGeo = useMemo(() => new THREE.CircleGeometry(0.06 * S, 12, 0, Math.PI), [])

  // Tricuspid leaflets
  const triGeo = useMemo(() => new THREE.CircleGeometry(0.06 * S, 10, 0, Math.PI * 0.67), [])

  // Fossa ovalis
  const fossaGeo = useMemo(() => new THREE.CircleGeometry(0.04 * S, 16), [])
  const limbusGeo = useMemo(() => new THREE.RingGeometry(0.04 * S, 0.06 * S, 16), [])

  // Chordae (fewer, cleaner)
  const chordaeGeos = useMemo(() => [
    chorda([0.35, -0.25, 0.15], [0.2, 0.4, 0.0]),
    chorda([0.35, -0.25, 0.15], [0.25, 0.38, 0.03]),
    chorda([0.35, -0.25, 0.15], [0.28, 0.4, -0.05]),
    chorda([0.12, -0.25, -0.22], [0.18, 0.4, -0.02]),
    chorda([0.12, -0.25, -0.22], [0.22, 0.38, -0.06]),
    chorda([0.12, -0.25, -0.22], [0.15, 0.4, 0.01]),
  ], [])

  // Trabeculae bridges (LV)
  const trabGeos = useMemo(() => [
    tube([[ 0.2, -0.7, 0.1], [0.1, -0.8, 0.05], [0.0, -0.7, 0.0]], 0.007),
    tube([[ 0.25, -0.55, 0.08], [0.15, -0.6, 0.0], [0.03, -0.5, -0.03]], 0.006),
  ], [])

  // RV trabeculae
  const rvTrabGeos = useMemo(() => [
    tube([[-0.25, -0.25, 0.22], [-0.15, -0.3, 0.25], [-0.05, -0.22, 0.18]], 0.009),
    tube([[-0.22, -0.4, 0.2], [-0.15, -0.45, 0.22], [-0.06, -0.38, 0.16]], 0.008),
  ], [])

  // LV chamber cavity — elongated ellipsoid showing the interior surface
  const lvCavityGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.22 * S, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.8)
    return geo
  }, [])

  // RV chamber cavity — crescent/flatter
  const rvCavityGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.18 * S, 14, 14, 0, Math.PI * 1.5, 0, Math.PI * 0.7)
    return geo
  }, [])

  // Endocardial lining material — glossy, deep red, wet
  const endoMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#6B1818',
    roughness: 0.25,
    metalness: 0.02,
    clearcoat: 0.6,
    clearcoatRoughness: 0.08,
    sheen: 0.3,
    sheenColor: new THREE.Color('#CC4040'),
    side: THREE.BackSide, // Render inside faces only
  }), [])

  if (!crossSection && !interior) return null

  return (
    <group>
      {/* LV cavity — endocardial lining */}
      <mesh geometry={lvCavityGeo} material={endoMat}
        position={[0.05, -0.1, 0]}
        scale={[0.6, 1.3, 0.5]}
      />

      {/* RV cavity — endocardial lining */}
      <mesh geometry={rvCavityGeo} material={endoMat}
        position={[-0.05, -0.05, 0.03]}
        scale={[0.5, 1.0, 0.4]}
        rotation={[0, 0.3, 0]}
      />

      {/* Septum */}
      <mesh geometry={septumGeo} material={septumMat} position={[0.03 * S, 0, -0.05 * S]} />

      {/* Membranous septum */}
      <mesh geometry={fossaGeo} material={membrMat} position={[0.04 * S, 0.42 * S, -0.03 * S]} />

      {/* LV Papillary */}
      <mesh geometry={alvPap} material={papMat} position={[0.35 * S, -0.4 * S, 0.15 * S]} rotation={[0.1, 0, -0.2]} />
      <mesh geometry={pmPap} material={papMat} position={[0.12 * S, -0.4 * S, -0.22 * S]} rotation={[-0.08, 0, 0.12]} />

      {/* RV Papillary */}
      <mesh geometry={rvPap} material={papMat} position={[-0.22 * S, -0.32 * S, 0.25 * S]} rotation={[0.08, 0, 0.1]} />
      <mesh geometry={new THREE.ConeGeometry(0.035 * S, 0.15 * S, 6)} material={papMat} position={[-0.15 * S, -0.32 * S, -0.06 * S]} />

      {/* Moderator band */}
      <mesh geometry={modGeo} material={myoMat} />

      {/* Crista */}
      <mesh geometry={cristaGeo} material={myoMat} />

      {/* Mitral leaflets */}
      <mesh geometry={mitAntGeo} material={leafMat} position={[0.22 * S, 0.42 * S, 0.0]} rotation={[Math.PI * 0.45, 0.1, 0]} />
      <mesh geometry={mitPostGeo} material={leafMat} position={[0.25 * S, 0.4 * S, -0.05 * S]} rotation={[-Math.PI * 0.45, 0.1, 0]} />

      {/* Tricuspid leaflets */}
      <mesh geometry={triGeo} material={leafMat} position={[-0.14 * S, 0.42 * S, 0.07 * S]} rotation={[Math.PI * 0.45, -0.1, 0]} />
      <mesh geometry={triGeo} material={leafMat} position={[-0.1 * S, 0.4 * S, 0.0]} rotation={[-Math.PI * 0.3, 0, 0.2]} />

      {/* Fossa ovalis */}
      <mesh geometry={fossaGeo} material={membrMat} position={[0.03 * S, 0.85 * S, -0.07 * S]} />
      <mesh geometry={limbusGeo} material={septumMat} position={[0.03 * S, 0.85 * S, -0.07 * S]} />

      {/* Chordae */}
      {chordaeGeos.map((g, i) => <mesh key={`c${i}`} geometry={g} material={chordMat} />)}

      {/* LV trabeculae */}
      {trabGeos.map((g, i) => <mesh key={`t${i}`} geometry={g} material={myoMat} />)}

      {/* RV trabeculae */}
      {rvTrabGeos.map((g, i) => <mesh key={`rt${i}`} geometry={g} material={myoMat} />)}

      {/* Labels — minimal, only key structures */}
      {LABELS.map((l) => (
        <Html key={l.name} position={l.pos as [number, number, number]} distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <span className="interior-label">{l.name}</span>
        </Html>
      ))}
    </group>
  )
}
