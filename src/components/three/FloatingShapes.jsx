import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function TorusShape() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.15
      ref.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref}>
        <torusGeometry args={[1, 0.03, 16, 100]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={0.25} wireframe />
      </mesh>
    </Float>
  )
}

function SphereShape() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.08
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      ref.current.scale.set(s, s, s)
    }
  })
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={0.15} wireframe />
      </mesh>
    </Float>
  )
}

export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <TorusShape />
        <SphereShape />
      </Canvas>
    </div>
  )
}
