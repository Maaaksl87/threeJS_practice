import { Clone, useGLTF } from '@react-three/drei'

const MODELS = {
  birch: '/models/Birch-Tree.glb',
  pine: '/models/Pine-Tree.glb',
  simple: '/models/Simple-Tree.glb',
  stylized: '/models/Stylized-Tree.glb',
} as const

type TreeType = keyof typeof MODELS

interface TreeConfig {
  type: TreeType
  position: [number, number, number]
  scale: number
  rotation?: [number, number, number]
}

const CITY_TREES: TreeConfig[] = [
  { type: 'birch', position: [3.8, 0, 2.8], scale: 1.7, rotation: [0, 0.4, 0] },
  { type: 'pine', position: [3.9, 0, 1.6], scale: 1.6, rotation: [0, 1.2, 0] },
  { type: 'simple', position: [3, 0, 2], scale: 1.5, rotation: [0, 2.1, 0] },
  { type: 'stylized', position: [0, 0, 3.8], scale: 1.8, rotation: [0, -0.7, 0] },
  { type: 'simple', position: [-1.4, 0, 3], scale: 1.7, rotation: [0, -1.2, 0] },
  { type: 'stylized', position: [-1, 0, 0], scale: 1.6, rotation: [0, 0.8, 0] },
  { type: 'pine', position: [-6, 0, 3], scale: 1.9, rotation: [0, -0.5, 0] },
  { type: 'birch', position: [4, 0, -5], scale: 1.8, rotation: [0, 2.5, 0] },
  { type: 'stylized', position: [9, 0, -2], scale: 1.7, rotation: [0, 0.8, 0] },
  { type: 'simple', position: [-2, 0, -1.6], scale: 1.6, rotation: [0, -1.2, 0] },
]

export function Trees() {
  const birch = useGLTF(MODELS.birch)
  const pine = useGLTF(MODELS.pine)
  const simple = useGLTF(MODELS.simple)
  const stylized = useGLTF(MODELS.stylized)

  const scenes: Record<TreeType, any> = {
    birch: birch.scene,
    pine: pine.scene,
    simple: simple.scene,
    stylized: stylized.scene,
  }

  return (
    <group>
      {CITY_TREES.map((tree, i) => (
        <group
          key={i}
          position={tree.position}
          scale={tree.scale}
          rotation={tree.rotation ?? [0, 0, 0]}
        >
          <Clone
            object={scenes[tree.type]}
            castShadow
            receiveShadow
          />
        </group>
      ))}
    </group>
  )
}

export default Trees

Object.values(MODELS).forEach((path) => useGLTF.preload(path))
