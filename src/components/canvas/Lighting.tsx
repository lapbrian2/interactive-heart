export function Lighting() {
  return (
    <>
      <directionalLight position={[-3, 4, 2]} intensity={1.2} color="#fff5e6" />
      <directionalLight position={[3, -1, 2]} intensity={0.4} color="#b0c4de" />
      <directionalLight position={[0, 0, -3]} intensity={0.3} color="#ffe0c0" />
      <ambientLight intensity={0.2} />
    </>
  )
}
