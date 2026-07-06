import { useRef, useCallback, lazy, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

const ParticleField = lazy(() => import('./ParticleField'))
const ConnectionLines = lazy(() => import('./ConnectionLines'))

export default function Particles() {
  const positionsRef = useRef(null)

  const onPositionsUpdate = useCallback((arr) => {
    positionsRef.current = arr
  }, [])

  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ pointerEvents: 'auto' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ParticleField onPositionsUpdate={onPositionsUpdate} />
          <ConnectionLines positionsRef={positionsRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
