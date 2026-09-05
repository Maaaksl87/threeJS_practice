import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { AdditiveBlending, type PointsMaterial } from 'three'
import { world } from '../world'
import { mulberry32 } from '../random'

const STAR_COUNT = 400
const STAR_SPHERE_RADIUS = 25
// потрбіно стале число, а не Math.random(), щоб сузір'я не перемальовувались
const STAR_SEED = 20240614

export function Stars() {
  const material = useRef<PointsMaterial>(null!)
  const starTexture = useTexture('/textures/star.webp')

  const positions = useMemo(() => {
    const rnd = mulberry32(STAR_SEED)
    const arr = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      // рівномірний розподіл по верхній півсфері
      const theta = rnd() * Math.PI * 2
      const phi = Math.acos(rnd())
      arr[i * 3] = STAR_SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = STAR_SPHERE_RADIUS * Math.cos(phi)
      arr[i * 3 + 2] = STAR_SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [])

  // Зорі проявляються вночі — прозорість зростає, коли world.day падає до 0.
  useFrame(() => {
    material.current.opacity = 1 - world.day
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        map={starTexture}
        size={1.4}
        sizeAttenuation={false}
        transparent
        depthWrite={false}
        fog={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
