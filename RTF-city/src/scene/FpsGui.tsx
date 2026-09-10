import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { GUI, GUIController } from 'dat.gui'

interface FpsGuiProps {
  hidden?: boolean
}

export function FpsGui({ hidden = false }: FpsGuiProps) {
  const guiRef = useRef<GUI | null>(null)
  const fpsCtrlRef = useRef<GUIController | null>(null)
  const msCtrlRef = useRef<GUIController | null>(null)

  const stats = useRef({ fps: 0, ms: 0 })
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    const gui = new GUI({ autoPlace: false, width: 180 })
    guiRef.current = gui

    const el = gui.domElement
    el.style.position = 'fixed'
    el.style.top = '12px'
    el.style.left = '12px'
    el.style.zIndex = '9999'
    document.body.appendChild(el)

    // Без .listen() — оновлюємо контролери вручну, щоб прибрати зайві rAF
    const fpsCtrl = gui.add(stats.current, 'fps').name('FPS')
    const msCtrl = gui.add(stats.current, 'ms').name('MS')

    fpsCtrl.domElement.style.pointerEvents = 'none'
    msCtrl.domElement.style.pointerEvents = 'none'

    fpsCtrlRef.current = fpsCtrl
    msCtrlRef.current = msCtrl

    return () => {
      gui.destroy()
      guiRef.current = null
      fpsCtrlRef.current = null
      msCtrlRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!guiRef.current) return
    if (hidden) {
      guiRef.current.hide()
    } else {
      guiRef.current.show()
    }
  }, [hidden])

  useFrame(() => {
    frameCount.current++
    const now = performance.now()
    const delta = now - lastTime.current

    if (delta >= 300) {
      stats.current.fps = Math.round((frameCount.current * 1000) / delta)
      stats.current.ms = Number((delta / frameCount.current).toFixed(1))

      // Пряме оновлення тільки коли значення змінилися
      fpsCtrlRef.current?.updateDisplay()
      msCtrlRef.current?.updateDisplay()

      frameCount.current = 0
      lastTime.current = now
    }
  })

  return null
}