import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, MeshStandardMaterial, Quaternion, RectAreaLight, Vector3 } from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { world } from '../world'
import { splitIntoQuads } from '../splitQuads'
import { makeWindowSchedule, windowIntensity } from '../windows'

const WINDOW_EMISSIVE_INTENSITY = 2.2
// яскравість вікна яке випромінює світло на підлогу
const WINDOW_AREA_INTENSITY = 90

// Без цього виклику RectAreaLight рендериться чорним
RectAreaLightUniformsLib.init()

const LIGHT_FORWARD = new Vector3(0, 0, -1)

// беремо центр, нормаль та розміри квада вікна
function placeAtQuad(geometry: BufferGeometry) {
  const position = geometry.getAttribute('position')
  const center = new Vector3()
  const vertex = new Vector3()
  for (let i = 0; i < position.count; i++) center.add(vertex.fromBufferAttribute(position, i))
  center.divideScalar(position.count)

  // Квад плаский, тож нормаль будь-якої вершини — це нормаль усього вікна.
  const normal = new Vector3().fromBufferAttribute(geometry.getAttribute('normal'), 0).normalize()
  // Поворот, який спрямує -Z джерела назовні від стіни.
  const quaternion = new Quaternion().setFromUnitVectors(LIGHT_FORWARD, normal)


  const axisX = new Vector3(1, 0, 0).applyQuaternion(quaternion)
  const axisY = new Vector3(0, 1, 0).applyQuaternion(quaternion)
  let width = 0
  let height = 0
  for (let i = 0; i < position.count; i++) {
    const offset = vertex.fromBufferAttribute(position, i).sub(center)
    width = Math.max(width, Math.abs(offset.dot(axisX)) * 2)
    height = Math.max(height, Math.abs(offset.dot(axisY)) * 2)
  }

  return { center, quaternion, width, height }
}

export function BuildingWindows({
  geometry,
  material,
  seed,
  areaLights = 0,
}: {
  geometry: BufferGeometry
  material: MeshStandardMaterial
  seed: number
  // кількість вікон які отримують справжнє світло від джерела
  areaLights?: number
}) {
  const windows = useMemo(
    () =>
      splitIntoQuads(geometry).map((quadGeometry, i) => {
        const schedule = makeWindowSchedule(seed * 1000 + i)
        const litMaterial = material.clone()
        litMaterial.emissive.set(schedule.color)
        litMaterial.emissiveIntensity = 0
        litMaterial.toneMapped = false
        return { geometry: quadGeometry, material: litMaterial, schedule }
      }),
    [geometry, material, seed],
  )

  // "освітлюємо" ті вікна які будть вмикатися.
  const areaLit = useMemo(
    () =>
      windows
        .filter((w) => w.schedule.lit)
        .slice(0, areaLights)
        .map((w) => ({ schedule: w.schedule, placement: placeAtQuad(w.geometry) })),
    [windows, areaLights],
  )

  const lights = useRef<RectAreaLight[]>([])

  useEffect(() => {
    const worldScale = new Vector3()
    areaLit.forEach((w, i) => {
      const light = lights.current[i]
      if (!light) return
      light.quaternion.copy(w.placement.quaternion)
      light.getWorldScale(worldScale)
      light.width = w.placement.width * worldScale.x
      light.height = w.placement.height * worldScale.x
    })
  }, [areaLit])

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
    // Справжні джерела живуть за тим самим розкладом, що й свічення їхніх вікон.
    areaLit.forEach(({ schedule }, i) => {
      const light = lights.current[i]
      if (light) light.intensity = WINDOW_AREA_INTENSITY * windowIntensity(schedule, world.time)
    })
  })

  return (
    <>
      {windows.map((window, i) => (
        <mesh key={i} geometry={window.geometry} material={window.material} receiveShadow />
      ))}
      {areaLit.map(({ schedule, placement }, i) => (
        <rectAreaLight
          key={`area-${i}`}
          ref={(el) => {
            if (el) lights.current[i] = el
          }}
          position={placement.center}
          color={schedule.color}
          intensity={0}
        />
      ))}
    </>
  )
}
