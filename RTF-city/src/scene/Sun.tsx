import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DirectionalLight, Group, MathUtils } from 'three'
import { world } from '../world'
import { celestialPosition, HORIZON_FADE, SUN_RADIUS, SUN_HEIGHT, SUN_Z_OFFSET } from '../celestial'

export function Sun() {
  const group = useRef<Group>(null!)
  const light = useRef<DirectionalLight>(null!)

  useEffect(() => {
    light.current.shadow.camera.updateProjectionMatrix()
  }, [])

  useFrame(() => {
    const { x, y, z, elevation } = celestialPosition(world.time, SUN_RADIUS, SUN_HEIGHT, SUN_Z_OFFSET)
    group.current.position.set(x, y, z)
    world.day = Math.max(0, elevation)

    const above = MathUtils.smoothstep(elevation, 0, HORIZON_FADE)
    light.current.intensity = above

    // Вночі вимикаємо оновлення тіней: на відміну від light.visible, це не тригерить перекомпіляцію шейдерів.
    light.current.shadow.autoUpdate = above > 0
  }, -1)

  return (
    <group ref={group}>
      <directionalLight
        ref={light}
        castShadow
        intensity={0}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ffdd55" />
      </mesh>
    </group>
  )
}
