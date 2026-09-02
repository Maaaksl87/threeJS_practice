import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { RepeatWrapping, SRGBColorSpace } from 'three'

const ROAD_WIDTH = 3
const ROAD_LENGTH = 12

export function Road() {
  const road = useTexture('/textures/road.png')

  useMemo(() => {
    road.colorSpace = SRGBColorSpace
    road.wrapT = RepeatWrapping

    road.repeat.set(1, ROAD_LENGTH / 4)
  }, [road])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <planeGeometry args={[ROAD_WIDTH, ROAD_LENGTH]} />
      <meshStandardMaterial map={road} />
    </mesh>
  )
}
