import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DirectionalLight, Group, MathUtils } from 'three'
import { world } from '../world'
import { celestialPosition, HORIZON_FADE, SUN_RADIUS, SUN_HEIGHT, SUN_Z_OFFSET } from '../celestial'

const MOON_INTENSITY = 0.35

export function Moon() {
  const group = useRef<Group>(null!)
  const light = useRef<DirectionalLight>(null!)

  useFrame(() => {
    const moonTime = (world.time + 0.5) % 1
    const { x, y, z, elevation } = celestialPosition(moonTime, SUN_RADIUS, SUN_HEIGHT, SUN_Z_OFFSET)
    group.current.position.set(x, y, z)

    light.current.intensity = MOON_INTENSITY * MathUtils.smoothstep(elevation, 0, HORIZON_FADE)
  }, -1)

  return (
    <group ref={group}>
      <directionalLight ref={light} color="#a9c2ff" intensity={0} />
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#dbe4ff" />
      </mesh>
    </group>
  )
}
