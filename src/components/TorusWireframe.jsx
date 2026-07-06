import { useMemo, useState, useEffect } from 'react'

export default function TorusWireframe({ className = '' }) {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const paths = useMemo(() => {
    const R = 120
    const r = 45
    const segments = isMobile ? 8 : 12
    const tubes = isMobile ? 4 : 6
    const result = []

    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      const nextTheta = ((i + 1) / segments) * Math.PI * 2

      for (let j = 0; j < tubes; j++) {
        const phi = (j / tubes) * Math.PI * 2
        const nextPhi = ((j + 1) / tubes) * Math.PI * 2

        const x1 = (R + r * Math.cos(phi)) * Math.cos(theta)
        const y1 = (R + r * Math.cos(phi)) * Math.sin(theta)
        const z1 = r * Math.sin(phi)

        const x2 = (R + r * Math.cos(nextPhi)) * Math.cos(theta)
        const y2 = (R + r * Math.cos(nextPhi)) * Math.sin(theta)
        const z2 = r * Math.sin(nextPhi)

        const x3 = (R + r * Math.cos(phi)) * Math.cos(nextTheta)
        const y3 = (R + r * Math.cos(phi)) * Math.sin(nextTheta)
        const z3 = r * Math.sin(phi)

        result.push(
          `M ${x1} ${y1} L ${x2} ${y2}`,
          `M ${x1} ${y1} L ${x3} ${y3}`
        )
      }
    }
    return result
  }, [isMobile])

  if (prefersReduced) return null

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg
        viewBox="-200 -200 400 400"
        className="absolute top-1/2 left-1/2 w-[min(280px,75vw)] h-[min(280px,75vw)] md:w-[500px] md:h-[500px]"
        style={{
          transform: 'translate(-50%, -50%) rotateX(20deg)',
          animation: 'torusRotate 25s linear infinite',
          opacity: 0.06,
        }}
      >
        {paths.map((d, i) => (
          <path key={i} d={d} stroke="var(--color-cypox-black)" strokeWidth="0.5" fill="none" />
        ))}
      </svg>
      <svg
        viewBox="-200 -200 400 400"
        className="absolute top-1/2 left-1/2 w-[min(220px,60vw)] h-[min(220px,60vw)] md:w-[400px] md:h-[400px]"
        style={{
          transform: 'translate(-50%, -50%) rotateX(35deg) rotateY(15deg)',
          animation: 'torusRotateReverse 30s linear infinite',
          opacity: 0.04,
        }}
      >
        {paths.map((d, i) => (
          <path key={i} d={d} stroke="var(--color-cypox-black)" strokeWidth="0.5" fill="none" />
        ))}
      </svg>
    </div>
  )
}
