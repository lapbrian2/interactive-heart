import { EffectComposer, Bloom } from '@react-three/postprocessing'

export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.025}
        mipmapBlur
      />
    </EffectComposer>
  )
}
