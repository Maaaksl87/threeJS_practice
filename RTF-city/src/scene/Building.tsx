import { type ThreeElements } from '@react-three/fiber'
import { Model as SmallBuilding, useSmallBuilding } from '../models/SmallBuilding'
import { BuildingWindows } from './BuildingWindows'
import { useModelShadows } from './useModelShadows'

type BuildingProps = ThreeElements['group'] & {
  windowSeed: number
}

export function Building({ windowSeed, ...props }: BuildingProps) {
  const { nodes, materials } = useSmallBuilding()
  const ref = useModelShadows()

  return (
    <group {...props}>
      <group ref={ref}>
        <SmallBuilding />
      </group>
      <BuildingWindows
        geometry={nodes.small_buildingE_1_3.geometry}
        material={materials.window}
        seed={windowSeed}
      />
    </group>
  )
}
