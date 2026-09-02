import { EffectComposer, Bloom } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={1}
        luminanceSmoothing={0.2}
        mipmapBlur
        intensity={1.2}
      />
    </EffectComposer>
  )
}
