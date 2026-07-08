import { useState, useEffect } from 'react'

const letters = ['C', 'Y', 'P', 'O', 'X']

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let raf
    const start = performance.now()
    const duration = 2000

    const tick = (now) => {
      const elapsed = now - start
      const p = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setProgress(p)

      if (p < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setVisible(false)
          onComplete?.()
        }, 400)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white transition-opacity duration-500"
      style={{ opacity: progress >= 100 ? 0 : 1 }}
    >
      {/* 3D Cube */}
      <div className="loader-cube-wrapper mb-10">
        <div className="loader-cube">
          {letters.map((letter, i) => (
            <div key={letter} className={`loader-cube-face ${['front', 'back', 'right', 'left', 'top'][i]}`}>
              {letter}
            </div>
          ))}
          <div className="loader-cube-face bottom">●</div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono text-cypox-gray tracking-wider">{String(progress).padStart(3, ' ')}</span>
        <div className="w-32 h-[2px] bg-cypox-border overflow-hidden rounded-full">
          <div
            className="h-full bg-cypox-black transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
