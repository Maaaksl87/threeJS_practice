import { EffectComposer, Bloom } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.5}
      />
    </EffectComposer>
  )
}
