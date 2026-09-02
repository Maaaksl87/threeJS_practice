import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, MeshStandardMaterial } from 'three'
import { world } from '../world'
import { splitIntoQuads } from '../splitQuads'
import { makeWindowSchedule, windowIntensity } from '../windows'

const WINDOW_EMISSIVE_INTENSITY = 2.2

export function BuildingWindows({
  geometry,
  material,
  seed,
}: {
  geometry: BufferGeometry
  material: MeshStandardMaterial
  seed: number
}) {
  const windows = useMemo(
    () =>
      splitIntoQuads(geometry).map((quadGeometry, i) => {
        const schedule = makeWindowSchedule(seed * 1000 + i)
        const litMaterial = material.clone()
        // Колір лампочки за цим вікном — свій для кожного (тепле жовте /
        // холодне синє), обраний разом із рештою розкладу.
        litMaterial.emissive.set(schedule.color)
        litMaterial.emissiveIntensity = 0
        litMaterial.toneMapped = false
        return { geometry: quadGeometry, material: litMaterial, schedule }
      }),
    [geometry, material, seed],
  )

  // прибираємо меморі лік
  useEffect(() => () => {
    for (const { geometry, material } of windows) {
      geometry.dispose()
      material.dispose()
    }
  }, [windows])

  // один useFrame на весь будинок замість одного на кожне вікно
  useFrame(() => {
    for (const { material, schedule } of windows) {
      material.emissiveIntensity = WINDOW_EMISSIVE_INTENSITY * windowIntensity(schedule, world.time)
    }
  })

  return (
    <>
      {windows.map((window, i) => (
        <mesh key={i} geometry={window.geometry} material={window.material} receiveShadow />
      ))}
    </>
  )
}
