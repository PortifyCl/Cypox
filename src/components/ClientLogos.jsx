import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { useGsapReveal } from '../hooks/useGsap'

const clients = [
  'Maison Saveurs',
  'FitTrack',
  'Construction Plus',
  'CloudSync',
  'Dr. Martin',
  'Artisanat & Co',
  'Le Bistrot Parisien',
  'Immo Invest',
  'Marketing Digital',
  'ProductivOS',
]

export default function ClientLogos() {
  const sectionRef = useRef(null)
  const marqueeRef = useRef(null)
  const tweenRef = useRef(null)
  const titleRef = useGsapReveal()

  useEffect(() => {
    if (!marqueeRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const track = marqueeRef.current
    gsap.set(track, { x: 0 })
    tweenRef.current = gsap.to(track, {
      x: '-50%',
      duration: 35,
      ease: 'none',
      repeat: -1,
    })

    return () => { if (tweenRef.current) tweenRef.current.kill() }
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !tweenRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tweenRef.current?.play()
        } else {
          tweenRef.current?.pause()
        }
      },
      { threshold: 0 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleMouseEnter = useCallback(() => { tweenRef.current?.pause() }, [])
  const handleMouseLeave = useCallback(() => { tweenRef.current?.play() }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-cypox-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div ref={titleRef}>
          <span className="text-sm font-medium text-cypox-gray tracking-widest uppercase mb-4 block">Clients</span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-cypox-black tracking-[-0.03em]">
            Ils nous font confiance
          </h2>
        </div>
      </div>

      {/* Marquee */}
      <div
        className="border-t border-b border-cypox-border py-6 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        role="region"
        aria-label="Liste des clients"
      >
        <p className="sr-only">Maison Saveurs, FitTrack, Construction Plus, CloudSync, Dr. Martin, Artisanat & Co, Le Bistrot Parisien, Immo Invest, Marketing Digital, ProductivOS</p>
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-0 w-max">
          {[...clients, ...clients].map((client, i) => (
            <span
              key={i}
              className="flex items-center gap-8 px-8 text-lg font-display font-bold text-cypox-black/30 hover:text-cypox-black transition-colors duration-500 tracking-[-0.02em]"
            >
              {client}
              <span className="w-1.5 h-1.5 rounded-full bg-cypox-black/10" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
