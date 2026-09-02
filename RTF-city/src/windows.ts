import { MathUtils } from 'three'
import { mulberry32 } from './random'

export type WindowSchedule = {
  lit: boolean
  onAt: number
  offAt: number
  color: string
}

const mod1 = (x: number) => ((x % 1) + 1) % 1

// Частка вікон, які взагалі колись вмикаються цієї ночі — решта лишається темною
const WINDOW_LIT_CHANCE = 0.55

const ON_RANGE: [number, number] = [0.8, 0.95]
const OFF_RANGE: [number, number] = [0.05, 0.2]

const FADE_WIDTH = 0.015

const WINDOW_COLORS = ['#ffdd88', '#8fd0ff', '#b6e6a0']

const PULSE_CHANCE = 0.04
const PULSE_DURATION = 0.045

export function makeWindowSchedule(seed: number): WindowSchedule {
  const rnd = mulberry32(seed)
  const lit = rnd() < WINDOW_LIT_CHANCE
  const color = WINDOW_COLORS[Math.floor(rnd() * WINDOW_COLORS.length)]

  if (lit && rnd() < PULSE_CHANCE) {
    const center = mod1(0.75 + rnd() * 0.5)
    const half = PULSE_DURATION / 2
    return { lit, onAt: mod1(center - half), offAt: mod1(center + half), color }
  }

  const onAt = ON_RANGE[0] + rnd() * (ON_RANGE[1] - ON_RANGE[0])
  const offAt = OFF_RANGE[0] + rnd() * (OFF_RANGE[1] - OFF_RANGE[0])
  return { lit, onAt, offAt, color }
}

export function windowIntensity(schedule: WindowSchedule, time: number): number {
  if (!schedule.lit) return 0

  const { onAt, offAt } = schedule
  // Скільки часток доби пройшло від onAt до зараз, з обгортанням через 1 -> 0.
  const sinceOn = ((time - onAt) % 1 + 1) % 1
  // Загальна тривалість "увімкненого" інтервалу, так само обгорнута.
  const duration = ((offAt - onAt) % 1 + 1) % 1

  if (sinceOn > duration) return 0

  const fadeIn = MathUtils.smoothstep(sinceOn, 0, FADE_WIDTH)
  const fadeOut = 1 - MathUtils.smoothstep(sinceOn, duration - FADE_WIDTH, duration)
  return Math.min(fadeIn, fadeOut)
}
