import { Clone, useGLTF } from '@react-three/drei'

useGLTF.preload('/models/street-road.glb')

export default function Road() {
  const model = useGLTF('/models/street-road.glb')

  return (
    <>
      <Clone object={model.scene} position={[0, 0.01, 0]} scale={0.5} receiveShadow />
      <Clone object={model.scene} position={[0, 0.01, -4]} scale={0.5} receiveShadow />
      <Clone object={model.scene} position={[0, 0.01, 4]} scale={0.5} receiveShadow />
    </>
  )
}

