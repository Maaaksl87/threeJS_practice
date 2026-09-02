import { Color, MathUtils } from 'three'

type SkyKeyframe = {
  t: number
  sky: Color
  fog: Color
  ambient: Color
  ambientIntensity: number
}

const KEYFRAMES: SkyKeyframe[] = [
  {
    t: 0,
    sky: new Color('#050714'),
    fog: new Color('#050714'),
    ambient: new Color('#20264a'),
    ambientIntensity: 0.12,
  },
  {
    t: 0.25,
    // Світанок: холодніший, рожево-бузковий.
    sky: new Color('#e3bfe6'),
    fog: new Color('#e9cbea'),
    ambient: new Color('#cbb3e0'),
    ambientIntensity: 0.45,
  },
  {
    t: 0.5,
    sky: new Color('#8fd0f5'),
    fog: new Color('#bfe6fb'),
    ambient: new Color('#ffffff'),
    ambientIntensity: 0.9,
  },
  {
    t: 0.75,
    // Захід: тепліший, помаранчево-червоний.
    sky: new Color('#e8622f'),
    fog: new Color('#f0855a'),
    ambient: new Color('#ffb066'),
    ambientIntensity: 0.45,
  },
  {
    t: 1,
    sky: new Color('#050714'),
    fog: new Color('#050714'),
    ambient: new Color('#20264a'),
    ambientIntensity: 0.12,
  },
]

const _sample = {
  sky: new Color(),
  fog: new Color(),
  ambient: new Color(),
  ambientIntensity: 0,
}

export function sampleSky(time: number) {
  const t = ((time % 1) + 1) % 1

  // Знаходимо пару сусідніх ключових кадрів, між якими лежить t.
  let i = 0
  while (i < KEYFRAMES.length - 2 && KEYFRAMES[i + 1].t <= t) i++
  const a = KEYFRAMES[i]
  const b = KEYFRAMES[i + 1]
  const localT = (t - a.t) / (b.t - a.t)

  _sample.sky.copy(a.sky).lerp(b.sky, localT)
  _sample.fog.copy(a.fog).lerp(b.fog, localT)
  _sample.ambient.copy(a.ambient).lerp(b.ambient, localT)
  _sample.ambientIntensity = MathUtils.lerp(a.ambientIntensity, b.ambientIntensity, localT)
  return _sample
}
