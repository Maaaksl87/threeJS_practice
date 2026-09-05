import { useFrame } from '@react-three/fiber'
import { world } from '../world'

const TIME_SPEED = 1 / 60

export function TimeAutoplay() {
  useFrame((_, delta) => {
    if (!world.autoplay) return
    world.time = (world.time + delta * TIME_SPEED) % 1
  }, -2)

  return null
}
