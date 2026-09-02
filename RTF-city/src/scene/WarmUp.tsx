import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

const WARMUP_FRAMES = 4

export function WarmUp({ onReady }: { onReady: () => void }) {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const [compiled, setCompiled] = useState(false)
  const frames = useRef(0)

  useEffect(() => {
    let cancelled = false
    gl.compileAsync(scene, camera).then(() => {
      if (!cancelled) setCompiled(true)
    })
    return () => {
      cancelled = true
    }
  }, [gl, scene, camera])

  useFrame(() => {
    if (!compiled) return
    frames.current += 1
    if (frames.current === WARMUP_FRAMES) onReady()
  })

  return null
}
