import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { world } from '../world'

// Один повний оберт world.time (0 -> 1) відбувається за 60 секунд.
const TIME_SPEED = 1 / 60
const TIME_SYNC_INTERVAL = 0.2

export function TimeAutoplay({
  autoplay,
  onTick,
}: {
  autoplay: boolean
  onTick: (time: number) => void
}) {
  const sinceLastSync = useRef(0)

  useFrame((_, delta) => {
    if (!autoplay) return

    world.time = (world.time + delta * TIME_SPEED) % 1

    sinceLastSync.current += delta
    if (sinceLastSync.current >= TIME_SYNC_INTERVAL) {
      sinceLastSync.current = 0
      onTick(world.time)
    }
  }, -2)

  return null
}
