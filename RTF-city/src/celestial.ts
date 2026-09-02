export const SUN_RADIUS = 9
export const SUN_HEIGHT = 6
export const HORIZON_FADE = 0.15
export const SUN_Z_OFFSET = SUN_RADIUS * 0.35
export function celestialPosition(t: number, radius: number, height: number, zOffset: number) {
  const angle = t * Math.PI * 2
  // -cos: опівночі (t=0) під горизонтом (-1), опівдні (t=0.5) в зеніті (+1),
  // на світанку й заході (t=0.25 / 0.75) рівно на горизонті (0).
  const elevation = -Math.cos(angle)
  return {
    x: Math.sin(angle) * radius,
    y: elevation * height,
    z: zOffset,
    elevation,
  }
}
