import { useEffect, useRef } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { MathUtils, MeshBasicMaterial, SpotLight } from 'three'
import { Model as LampPostModel } from '../models/LampPost'
import { world } from '../world'
import { useModelShadows } from './useModelShadows'

const LAMP_LIGHT_COLOR = '#fcc067'
const LAMP_INTENSITY = 10
const LAMP_ON_THRESHOLD = 0.3
const LAMP_CONE_ANGLE = Math.PI / 3
const LAMP_SHADOW_MAP = 512

export function LampPost(props: ThreeElements['group']) {
  const ref = useModelShadows()
  const light = useRef<SpotLight>(null!)
  const bulb = useRef<MeshBasicMaterial>(null!)

  useEffect(() => {
    const spot = light.current

    spot.target.position.set(0, -1, 0)
    spot.add(spot.target)

    spot.shadow.autoUpdate = false
    spot.shadow.needsUpdate = true
  }, [])

  // smoothstep(world.day, 0, 0.3) дає 0 вночі й 1 задовго до полудня — нам
  // потрібно навпаки, тому 1 - smoothstep: повна яскравість під горизонтом,
  // нуль ще на підході до дня, з плавним переходом між ними.
  useFrame(() => {
    const factor = 1 - MathUtils.smoothstep(world.day, 0, LAMP_ON_THRESHOLD)
    light.current.intensity = LAMP_INTENSITY * factor
    bulb.current.opacity = MathUtils.lerp(0.15, 1, factor)
  })

  return (
    <group {...props} scale={0.06}>
      <group ref={ref}>
        <LampPostModel />
      </group>
      <spotLight
        ref={light}
        position={[0, 16.8, 0]}
        color={LAMP_LIGHT_COLOR}
        distance={8}
        decay={1.2}
        angle={LAMP_CONE_ANGLE}
        penumbra={0.6}
        castShadow
        shadow-mapSize={[LAMP_SHADOW_MAP, LAMP_SHADOW_MAP]}
        shadow-camera-near={0.3}
        shadow-normalBias={0.02}
      >
        <mesh>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial ref={bulb} color={LAMP_LIGHT_COLOR} transparent />
        </mesh>
      </spotLight>
    </group>
  )
}
