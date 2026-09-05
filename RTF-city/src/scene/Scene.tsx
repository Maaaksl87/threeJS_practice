import { Sun } from './Sun'
import { Moon } from './Moon'
import { Stars } from './Stars'
import { Atmosphere } from './Atmosphere'
import { Ground } from './Ground'
import Road from './Road'
import { Building } from './Building'
import { BrownBuilding } from './BrownBuilding'
import { StreetLights } from './StreetLights'
import TrafficLight from '../models/TrafficLight'
import { Trees } from './Trees'

export function Scene() {
  return (
    <>
      <Sun />
      <Moon />
      <Stars />
      <Atmosphere />
      <Trees />

      <Ground />
      <Road />
      <StreetLights />
      <TrafficLight position={[1.8, 0, -3]} />
      <Building position={[-3.2, 0, 2]} rotation={[0, -Math.PI / 2, 0]} scale={2.5} windowSeed={1} />
      <Building position={[3.15, 0, -0.5]} rotation={[0, Math.PI / 2, 0]} scale={2.5} windowSeed={2} />
      <BrownBuilding position={[-2.9, 0, -2.6]} rotation={[0, Math.PI / 2, 0]} windowSeed={3} />
    </>
  )
}
