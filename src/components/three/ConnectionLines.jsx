import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MAX_DISTANCE = 1.2
const MAX_LINES = 150
const LINE_OPACITY = 0.12

export default function ConnectionLines({ positionsRef }) {
  const lineRef = useRef()

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(MAX_LINES * 6)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setDrawRange(0, 0)
    return geo
  }, [])

  useFrame(() => {
    if (!lineRef.current || !positionsRef?.current) return
    const positions = positionsRef.current
    const linePos = lineRef.current.geometry.attributes.position.array
    let lineIndex = 0
    const count = positions.length / 3

    for (let i = 0; i < count && lineIndex < MAX_LINES; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2
      for (let j = i + 1; j < count && lineIndex < MAX_LINES; j++) {
        const jx = j * 3, jy = j * 3 + 1, jz = j * 3 + 2
        const dx = positions[ix] - positions[jx]
        const dy = positions[iy] - positions[jy]
        const dz = positions[iz] - positions[jz]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < MAX_DISTANCE) {
          const idx = lineIndex * 6
          linePos[idx] = positions[ix]
          linePos[idx + 1] = positions[iy]
          linePos[idx + 2] = positions[iz]
          linePos[idx + 3] = positions[jx]
          linePos[idx + 4] = positions[jy]
          linePos[idx + 5] = positions[jz]
          lineIndex++
        }
      }
    }

    lineRef.current.geometry.setDrawRange(0, lineIndex * 2)
    lineRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#0a0a0a" transparent opacity={LINE_OPACITY} depthWrite={false} />
    </lineSegments>
  )
}
