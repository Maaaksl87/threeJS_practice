import { Fragment } from 'react'
import { LampPost } from './LampPost'

const LAMP_COUNT = 4
const START_Z = -4.5
const END_Z = 4.5
const LAMP_OFFSET_X = 1.8

const LAMP_POSITIONS_Z = Array.from({ length: LAMP_COUNT }, (_, i) =>
  START_Z + (i / (LAMP_COUNT - 1)) * (END_Z - START_Z)
)

export function StreetLights() {
  return (
    <group>
      {LAMP_POSITIONS_Z.map((z, i) => (
        <Fragment key={i}>
          <LampPost position={[LAMP_OFFSET_X, 0, z]} />
          <LampPost position={[-LAMP_OFFSET_X, 0, z]} rotation={[0, Math.PI, 0]} />
        </Fragment>
      ))}
    </group>
  )
}
