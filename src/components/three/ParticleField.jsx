import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT_DESKTOP = 600
const COUNT_MOBILE = 200
const SPEED = 0.0015
const MOUSE_RADIUS = 1.8
const MOUSE_FORCE = 0.4
const BOUNDS = 5

export default function ParticleField({ onPositionsUpdate }) {
  const { viewport } = useThree()
  const isMobile = viewport.width < 768
  const count = isMobile ? COUNT_MOBILE : COUNT_DESKTOP

  const meshRef = useRef()
  const mouseRef = useRef(new THREE.Vector3(100, 100, 100))
  const prevMouseRef = useRef(new THREE.Vector3(100, 100, 100))

  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * BOUNDS * 2
      positions[i3 + 1] = (Math.random() - 0.5) * BOUNDS * 2
      positions[i3 + 2] = (Math.random() - 0.5) * 2

      velocities[i3] = (Math.random() - 0.5) * SPEED
      velocities[i3 + 1] = (Math.random() - 0.5) * SPEED
      velocities[i3 + 2] = (Math.random() - 0.5) * SPEED * 0.3

      sizes[i] = 0.015 + Math.random() * 0.025
    }

    return { positions, velocities, sizes }
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const posAttr = meshRef.current.geometry.attributes.position
    const arr = posAttr.array

    const mp = state.pointer
    const camZ = state.camera.position.z
    mouseRef.current.set(mp.x * (viewport.width / 2), mp.y * (viewport.height / 2), 0)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const dx = arr[i3] - mouseRef.current.x
      const dy = arr[i3 + 1] - mouseRef.current.y
      const dz = arr[i3 + 2] - mouseRef.current.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (dist < MOUSE_RADIUS && dist > 0.01) {
        const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE
        arr[i3] += (dx / dist) * force
        arr[i3 + 1] += (dy / dist) * force
      }

      arr[i3] += velocities[i3]
      arr[i3 + 1] += velocities[i3 + 1]
      arr[i3 + 2] += velocities[i3 + 2]

      if (arr[i3] > BOUNDS) arr[i3] = -BOUNDS
      if (arr[i3] < -BOUNDS) arr[i3] = BOUNDS
      if (arr[i3 + 1] > BOUNDS) arr[i3 + 1] = -BOUNDS
      if (arr[i3 + 1] < -BOUNDS) arr[i3 + 1] = BOUNDS
      if (arr[i3 + 2] > 1) arr[i3 + 2] = -1
      if (arr[i3 + 2] < -1) arr[i3 + 2] = 1
    }

    posAttr.needsUpdate = true
    if (onPositionsUpdate) onPositionsUpdate(arr)
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#0a0a0a"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
