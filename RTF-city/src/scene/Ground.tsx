import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { RepeatWrapping, SRGBColorSpace } from 'three'

const GROUND_SIZE = 12

export function Ground() {
  const grass = useTexture('/textures/grass.webp')

  useMemo(() => {
    grass.colorSpace = SRGBColorSpace
    grass.wrapS = grass.wrapT = RepeatWrapping
    grass.repeat.set(GROUND_SIZE / 2, GROUND_SIZE / 2)
  }, [grass])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
      <meshStandardMaterial map={grass} />
    </mesh>
  )
}
