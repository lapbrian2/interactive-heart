export function Lighting() {
  return (
    <>
      <directionalLight position={[-3, 4, 2]} intensity={2.5} color="#fff5e6" />
      <directionalLight position={[3, -1, 2]} intensity={1.0} color="#b0c4de" />
      <directionalLight position={[0, 0, -3]} intensity={0.8} color="#ffe0c0" />
      <directionalLight position={[0, -3, 1]} intensity={0.5} color="#ffd0d0" />
      <ambientLight intensity={0.6} />
    </>
  )
}
