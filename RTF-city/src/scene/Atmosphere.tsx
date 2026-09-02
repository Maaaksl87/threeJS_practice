import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AmbientLight, Color, Fog } from 'three'
import { world } from '../world'
import { sampleSky } from '../sky'

export function Atmosphere() {
  const ambient = useRef<AmbientLight>(null!)

  useFrame(({ scene }) => {
    const { sky, fog, ambient: ambientColor, ambientIntensity } = sampleSky(world.time)

    if (!(scene.background instanceof Color)) scene.background = new Color();
    (scene.background as Color).copy(sky)

    if (scene.fog instanceof Fog) scene.fog.color.copy(fog)

    ambient.current.color.copy(ambientColor)
    ambient.current.intensity = ambientIntensity
  })

  return (
    <>
      <fog attach="fog" args={['#000000', 8, 30]} />
      <ambientLight ref={ambient} />
    </>
  )
}
