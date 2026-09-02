import { useEffect, useRef } from 'react'
import { Group, Mesh } from 'three'

/**
 * Вмикає castShadow та receiveShadow для мешів .glb моделі.
 * Вішається тільки на саму модель для економії draw calls у shadow-проході.
 */

export function useModelShadows() {
  const ref = useRef<Group>(null!)

  useEffect(() => {
    ref.current.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [])

  return ref
}
