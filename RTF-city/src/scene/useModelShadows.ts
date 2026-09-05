import { useLayoutEffect, useRef } from 'react'
import { Group, Mesh } from 'three'

export function useModelShadows() {
  const ref = useRef<Group>(null!)

  useLayoutEffect(() => {
    ref.current.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [])

  return ref
}
