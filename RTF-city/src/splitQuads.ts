import { BufferGeometry, Float32BufferAttribute, InterleavedBufferAttribute, type BufferAttribute } from 'three'

export function splitIntoQuads(geometry: BufferGeometry): BufferGeometry[] {
  const position = geometry.getAttribute('position')
  const normal = geometry.getAttribute('normal')
  const uv = geometry.getAttribute('uv')
  const quadCount = Math.floor(position.count / 4)

  const quads: BufferGeometry[] = []
  for (let i = 0; i < quadCount; i++) {
    const start = i * 4
    const quad = new BufferGeometry()
    quad.setAttribute('position', sliceAttribute(position, start))
    if (normal) quad.setAttribute('normal', sliceAttribute(normal, start))
    if (uv) quad.setAttribute('uv', sliceAttribute(uv, start))
    quad.setIndex([0, 1, 2, 1, 0, 3])
    quads.push(quad)
  }
  return quads
}

function sliceAttribute(attr: BufferAttribute | InterleavedBufferAttribute, start: number): BufferAttribute {
  const itemSize = attr.itemSize
  const out = new Float32Array(4 * itemSize)
  for (let v = 0; v < 4; v++) {
    for (let c = 0; c < itemSize; c++) {
      out[v * itemSize + c] = attr.getComponent(start + v, c)
    }
  }
  return new Float32BufferAttribute(out, itemSize)
}
