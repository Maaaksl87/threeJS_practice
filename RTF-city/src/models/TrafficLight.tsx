import { useMemo } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type LightId = 'red' | 'yellow' | 'green'

const LIGHT_SECTIONS: { id: LightId; uv: number; color: string }[] = [
    { id: 'red', uv: 0.1709, color: '#ff2200' },
    { id: 'yellow', uv: 0.2045, color: '#ffaa00' },
    { id: 'green', uv: 0.2351, color: '#00ff44' },
]

export function TrafficLight(props: ThreeElements['group']) {
    const { nodes, materials } = useGLTF('/models/traffic-light.glb') as any

    // Розбиваємо геометрію на корпус і окремі секції світлофора за їхніми UV координатами
    const { bodyGeometry, sectionGeometries } = useMemo(() => {
        const baseGeom = nodes.TrafficLight_2.geometry as THREE.BufferGeometry
        const posAttr = baseGeom.getAttribute('position')
        const normAttr = baseGeom.getAttribute('normal')
        const uvAttr = baseGeom.getAttribute('uv')
        const indexAttr = baseGeom.getIndex()

        if (!indexAttr) {
            const sections = Object.fromEntries(LIGHT_SECTIONS.map((s) => [s.id, baseGeom])) as Record<
                LightId,
                THREE.BufferGeometry
            >
            return { bodyGeometry: baseGeom, sectionGeometries: sections }
        }

        const indices = indexAttr.array
        const uvs = uvAttr.array

        const bodyIndices: number[] = []
        const sectionIndices: Record<LightId, number[]> = { red: [], yellow: [], green: [] }

        for (let i = 0; i < indices.length; i += 3) {
            const i0 = indices[i]
            const i1 = indices[i + 1]
            const i2 = indices[i + 2]
            const u = uvs[i0 * 2]

            const section = LIGHT_SECTIONS.find((s) => Math.abs(u - s.uv) < 0.01)
            if (section) {
                sectionIndices[section.id].push(i0, i1, i2)
            } else {
                bodyIndices.push(i0, i1, i2)
            }
        }

        function createSubGeometry(subIndices: number[]) {
            const geom = new THREE.BufferGeometry()
            geom.setAttribute('position', posAttr)
            geom.setAttribute('normal', normAttr)
            geom.setAttribute('uv', uvAttr)
            geom.setIndex(subIndices)
            geom.computeBoundingSphere()
            return geom
        }

        const sections = Object.fromEntries(
            LIGHT_SECTIONS.map((s) => [s.id, createSubGeometry(sectionIndices[s.id])]),
        ) as Record<LightId, THREE.BufferGeometry>

        return { bodyGeometry: createSubGeometry(bodyIndices), sectionGeometries: sections }
    }, [nodes.TrafficLight_2.geometry])

    // emmisive-матеріал для кожної секції 
    const sectionMaterials = useMemo(() => {
        return Object.fromEntries(
            LIGHT_SECTIONS.map((s) => {
                const mat = materials['Atlas.052'].clone() as THREE.MeshStandardMaterial
                mat.emissive = new THREE.Color(s.color)
                mat.emissiveIntensity = 0
                mat.toneMapped = false
                return [s.id, mat]
            }),
        ) as Record<LightId, THREE.MeshStandardMaterial>
    }, [materials])

    useFrame((state) => {
        const cycle = state.clock.elapsedTime % 10

        let red = false
        let yellow = false
        let green = false

        switch (true) {
            case cycle < 3.5:
                red = true
                break
            case cycle < 4.5:
                red = true
                yellow = true
                break
            case cycle < 7.5:
                green = true
                break
            case cycle < 8.5:
                green = Math.floor((cycle - 7.5) * 5) % 2 === 0
                break
            default:
                yellow = true
                break
        }

        const active: Record<LightId, boolean> = { red, yellow, green }
        for (const s of LIGHT_SECTIONS) {
            sectionMaterials[s.id].emissiveIntensity = active[s.id] ? 3 : 0
        }
    })

    return (
        <group position={[1.8, 0, 0]} scale={35} {...props} dispose={null}>
            <mesh castShadow receiveShadow geometry={bodyGeometry} material={materials['Atlas.052']} />
            {LIGHT_SECTIONS.map((s) => (
                <mesh key={s.id} geometry={sectionGeometries[s.id]} material={sectionMaterials[s.id]} />
            ))}
        </group>
    )
}

export { TrafficLight as Model }
export default TrafficLight

useGLTF.preload('/models/traffic-light.glb')
