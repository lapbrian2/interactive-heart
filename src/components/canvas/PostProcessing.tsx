import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.92}
        luminanceSmoothing={0.02}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={0.35}
        darkness={0.6}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
