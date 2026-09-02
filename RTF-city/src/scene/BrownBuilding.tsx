import { type ThreeElements } from '@react-three/fiber'
import {
  Model as BrownBuildingModel,
  useBrownBuilding,
  BROWN_BUILDING_INNER_TRANSFORM,
} from '../models/BrownBuilding'
import { BuildingWindows } from './BuildingWindows'
import { useModelShadows } from './useModelShadows'

type BrownBuildingProps = ThreeElements['group'] & {
  windowSeed: number
}

export function BrownBuilding({ windowSeed, ...props }: BrownBuildingProps) {
  const { nodes, materials } = useBrownBuilding()
  const ref = useModelShadows()

  return (
    <group {...props}>
      <group ref={ref}>
        <BrownBuildingModel />
      </group>

      <group {...BROWN_BUILDING_INNER_TRANSFORM}>
        <BuildingWindows
          geometry={nodes.BrownBuilding_3.geometry}
          material={materials.window_glass}
          seed={windowSeed}
          //кількість вікон які отримують справжнє світло
          areaLights={6}
        />
      </group>
    </group>
  )
}
