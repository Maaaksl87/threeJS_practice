import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import { world } from './world'
import { Scene } from './scene/Scene'
import { TimeAutoplay } from './scene/TimeAutoplay'
import { Effects } from './scene/Effects'
import { WarmUp } from './scene/WarmUp'
import { LoadingScreen } from './LoadingScreen'

const TIME_STEP = 0.001

export default function App() {
  const [{ time, autoplay }, set] = useControls('Час доби', () => ({
    time: { value: world.time, min: 0, max: 1, step: TIME_STEP },
    autoplay: true,
  }))
  const echoed = useRef(Number.NaN)
  const [ready, setReady] = useState(false)

  const isEcho = Math.abs(time - echoed.current) < TIME_STEP / 2
  if (!isEcho) world.time = time

  return (
    <>
      <LoadingScreen ready={ready} />
      <Leva hidden={!ready} />

      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [6, 4, 7], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
          <TimeAutoplay
            autoplay={autoplay}
            onTick={(t) => {
              echoed.current = t
              set({ time: t })
            }}
          />
          {!ready && <WarmUp onReady={() => setReady(true)} />}
        </Suspense>
        <OrbitControls />
        <Effects />
      </Canvas>
    </>
  )
}
