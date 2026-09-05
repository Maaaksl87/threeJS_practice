import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DirectionalLight, Group, MathUtils } from 'three'
import { world } from '../world'
import { celestialPosition, HORIZON_FADE, SUN_RADIUS, SUN_HEIGHT, SUN_Z_OFFSET } from '../celestial'

const MOON_COLOR = '#70a8d9'
const MOON_INTENSITY = 0.8

export function Moon() {
  const group = useRef<Group>(null!)
  const light = useRef<DirectionalLight>(null!)

  useEffect(() => {
    light.current.shadow.camera.updateProjectionMatrix();
    light.current.shadow.needsUpdate = true
  }, [])

  useFrame(() => {
    const moonTime = (world.time + 0.5) % 1
    const { x, y, z, elevation } = celestialPosition(moonTime, SUN_RADIUS, SUN_HEIGHT, SUN_Z_OFFSET)
    group.current.position.set(x, y, z)
    const above = MathUtils.smoothstep(elevation, 0, HORIZON_FADE)
    light.current.intensity = above * MOON_INTENSITY
    light.current.shadow.autoUpdate = above > 0
  }, -1)

  return (
    <group ref={group}>
      <directionalLight
        ref={light}
        color={MOON_COLOR}
        intensity={0}
      />
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#dbe4ff" />
      </mesh>
    </group>
  )
}
