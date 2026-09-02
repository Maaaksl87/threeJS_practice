import { useState } from 'react'
import { useProgress } from '@react-three/drei'

const BACKDROP = '#050714'
const ACCENT = '#fcc067'

export function LoadingScreen({ ready }: { ready: boolean }) {
  const { progress, loaded, total } = useProgress()
  const [gone, setGone] = useState(false)

  if (gone) return null

  const started = total > 0
  const assetsDone = started && loaded >= total

  return (
    <div
      onTransitionEnd={() => ready && setGone(true)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        background: BACKDROP,
        color: '#e8e6f0',
        fontFamily: 'system-ui, sans-serif',
        opacity: ready ? 0 : 1,
        pointerEvents: ready ? 'none' : 'auto',
        transition: 'opacity 700ms ease',
      }}
    >
      <div style={{ fontSize: 18, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.9 }}>
        RTF City
      </div>

      <div style={{ width: 260, height: 3, background: '#ffffff1f', borderRadius: 2, overflow: 'hidden' }}>
        <div
          style={{
            width: `${assetsDone ? 100 : progress}%`,
            height: '100%',
            background: ACCENT,
            borderRadius: 2,
            transition: 'width 250ms ease',
          }}
        />
      </div>

      <div style={{ fontSize: 12, opacity: 0.55, fontVariantNumeric: 'tabular-nums' }}>
        {!started && 'Ініціалізація…'}
        {started && !assetsDone && `Моделі й текстури — ${Math.round(progress)}% (${loaded}/${total})`}
        {assetsDone && 'Компіляція шейдерів…'}
      </div>
    </div>
  )
}
