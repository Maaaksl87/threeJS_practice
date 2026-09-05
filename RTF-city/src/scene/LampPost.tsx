
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { MathUtils, type SpotLight, type MeshStandardMaterial } from 'three'
import { useGLTF } from '@react-three/drei'

import { Model as LampPostModel } from '../models/LampPost'
import { world } from '../world'
import { useModelShadows } from './useModelShadows'

const LAMP_LIGHT_COLOR = '#fcc067'
const LAMP_INTENSITY = 10
const LAMP_ON_THRESHOLD = 0.3

export function LampPost(props: ThreeElements['group']) {
  const ref = useModelShadows()
  const light = useRef<SpotLight>(null!)
  const { materials } = useGLTF('/models/lamp-post.glb') as any

  const emissiveMaterial = useMemo(() => {
    const mat = materials.lambert2SG.clone() as MeshStandardMaterial
    mat.emissive.set(LAMP_LIGHT_COLOR)
    mat.emissiveIntensity = 0
    mat.toneMapped = false
    return mat
  }, [materials])

  useEffect(() => {
    const spot = light.current
    spot.target.position.set(0, -1, 0)
    spot.add(spot.target)

    return () => {
      emissiveMaterial.dispose()
    }
  }, [emissiveMaterial])

  useFrame(() => {
    const factor =
      1 - MathUtils.smoothstep(world.day, 0, LAMP_ON_THRESHOLD)

    light.current.intensity = LAMP_INTENSITY * factor
    emissiveMaterial.emissiveIntensity = factor * 2
  })

  return (
    <group {...props} scale={0.06}>
      <group ref={ref}>
        <LampPostModel emissiveMaterial={emissiveMaterial} />
      </group>

      <spotLight
        ref={light}
        position={[0, 16.8, 0]}
        color={LAMP_LIGHT_COLOR}
        distance={8}
        decay={1.2}
        angle={Math.PI / 3}
        penumbra={0.6}
      />
    </group>
  )
}
