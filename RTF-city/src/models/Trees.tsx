import { Clone, useGLTF } from '@react-three/drei'
import { type ThreeElements } from '@react-three/fiber'

type TreeProps = ThreeElements['group']

export function BirchTree({ position = [3.2, 0, 2.5], scale = 0.6, ...props }: TreeProps) {
    const { scene } = useGLTF('/models/Birch-Tree.glb')

    return (
        <group position={position} scale={scale} {...props}>
            <Clone object={scene} position={[0, 1, 0]} castShadow receiveShadow />
        </group>
    )
}

export function PineTree({ position = [4.4, 0, 1.8], scale = 0.65, ...props }: TreeProps) {
    const { scene } = useGLTF('/models/Pine-Tree.glb')

    return (
        <group position={position} scale={scale} {...props}>
            <Clone object={scene} position={[0, 1, 0]} castShadow receiveShadow />
        </group>
    )
}

export function SimpleTree({ position = [-3.3, 0, -0.2], scale = 0.6, ...props }: TreeProps) {
    const { scene } = useGLTF('/models/Simple-Tree.glb')

    return (
        <group position={position} scale={scale} {...props}>
            <Clone object={scene} position={[0, 1, 0]} castShadow receiveShadow />
        </group>
    )
}

export function StylizedTree({ position = [2.8, 0, 4.2], scale = 0.55, ...props }: TreeProps) {
    const { scene } = useGLTF('/models/Stylized-Tree.glb')

    return (
        <group position={position} scale={scale} {...props}>
            <Clone object={scene} position={[0, 1, 0]} castShadow receiveShadow />
        </group>
    )
}

useGLTF.preload('/models/Birch-Tree.glb')
useGLTF.preload('/models/Pine-Tree.glb')
useGLTF.preload('/models/Simple-Tree.glb')
useGLTF.preload('/models/Stylized-Tree.glb')

