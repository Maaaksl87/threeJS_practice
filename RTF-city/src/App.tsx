import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene } from './scene/Scene'
import { TimeAutoplay } from './scene/TimeAutoplay'
import { Effects } from './scene/Effects'
import { WarmUp } from './scene/WarmUp'
import { LoadingScreen } from './LoadingScreen'
import { TimeControls } from './TimeControls'

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <>
      <LoadingScreen ready={ready} />
      <TimeControls hidden={!ready} />

      <Canvas dpr={1} shadows="percentage" camera={{ position: [6, 4, 7], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
          <TimeAutoplay />
          {!ready && <WarmUp onReady={() => setReady(true)} />}
        </Suspense>
        <OrbitControls minDistance={9} maxDistance={15} maxPolarAngle={Math.PI / 2} target={[0, 1.2, 0]} />
        <Effects />

      </Canvas>
    </>
  )
}
