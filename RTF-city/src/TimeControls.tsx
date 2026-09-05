import { useEffect, useRef } from 'react'
import { world } from './world'

const ACCENT = '#fcc067'
const TIME_STEP = 0.001

export function TimeControls({ hidden }: { hidden: boolean }) {
  const slider = useRef<HTMLInputElement>(null!)
  const readout = useRef<HTMLSpanElement>(null!)

  const dragging = useRef(false)

  useEffect(() => {
    let raf = 0
    let shown = ''

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (dragging.current) return

      const next = world.time.toFixed(3)
      if (next !== shown) {
        shown = next
        slider.current.value = next
        readout.current.textContent = next
      }
    }

    raf = requestAnimationFrame(tick)

    const release = () => {
      dragging.current = false
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 100,
        display: hidden ? 'none' : 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 8,
        background: '#0b0f1ee6',
        border: '1px solid #ffffff1a',
        color: '#e8e6f0',
        font: '12px system-ui, sans-serif',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, opacity: 0.75 }}>
        <span>Час доби</span>
        <span ref={readout} style={{ fontVariantNumeric: 'tabular-nums', color: ACCENT }}>
          {world.time.toFixed(3)}
        </span>
      </div>

      <input
        ref={slider}
        type="range"
        min={0}
        max={1}
        step={TIME_STEP}
        defaultValue={world.time}
        onPointerDown={() => (dragging.current = true)}
        onChange={(e) => {
          world.time = Number(e.target.value)
          readout.current.textContent = world.time.toFixed(3)
        }}
        style={{ width: 190, accentColor: ACCENT }}
      />

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input
          type="checkbox"
          defaultChecked={world.autoplay}
          onChange={(e) => (world.autoplay = e.target.checked)}
          style={{ accentColor: ACCENT }}
        />
        Автохід
      </label>
    </div>
  )
}
