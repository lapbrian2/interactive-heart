import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.2}
        luminanceThreshold={0.93}
        luminanceSmoothing={0.02}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={0.4}
        darkness={0.4}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
