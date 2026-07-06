import { useEffect, useRef, useMemo, useState, lazy, Suspense } from 'react'
import { useLocation } from 'react-router'
import { gsap } from 'gsap'
import TorusWireframe from './TorusWireframe'
import AuditInput from './AuditInput'
import { createContactHandler } from '../utils/useScrollToHash'
import { usePageTransition } from '../hooks/usePageTransition'

const Particles = lazy(() => import('./three/Particles'))
const FloatingShapes = lazy(() => import('./three/FloatingShapes'))

const stats = [
  { value: '50+', label: 'Projets livrés' },
  { value: '4', label: 'Pays' },
  { value: '+180%', label: 'Demandes en plus' },
  { value: '24h', label: 'Réponse' },
]

export default function Hero() {
  const heroRef = useRef(null)
  const tagRef = useRef(null)
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const statsRef = useRef(null)
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)
  const transitionTo = usePageTransition()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([tagRef.current, titleRef.current, subRef.current, ctaRef.current, statsRef.current], { opacity: 1, y: 0 })
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      gsap.set(tagRef.current, { opacity: 0, y: 20 })
      gsap.set(titleRef.current, { opacity: 0, y: 60 })
      gsap.set(subRef.current, { opacity: 0, y: 30 })
      gsap.set(ctaRef.current, { opacity: 0, y: 30 })
      gsap.set(statsRef.current, { opacity: 0, y: 20 })

      tl.to(tagRef.current, { opacity: 1, y: 0, duration: 1 }, 0.2)
        .to(titleRef.current, { opacity: 1, y: 0, duration: 1.2 }, 0.4)
        .to(subRef.current, { opacity: 1, y: 0, duration: 1 }, 0.8)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.2)
        .to(statsRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.6)
    }, heroRef)
    return () => ctx.revert()
  }, [])

  const handleContactClick = useMemo(() => createContactHandler(location.pathname, transitionTo), [location.pathname, transitionTo])

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-cypox-surface" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, var(--color-cypox-surface) 0%, var(--color-cypox-card) 70%)' }}>
      {/* Particles Background */}
      <Suspense fallback={null}>
        <Particles />
      </Suspense>

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')]" aria-hidden="true" />

      {/* Permanent circles */}
      <div className="absolute top-[8%] right-[5%] w-[380px] h-[380px] rounded-full border-[1.5px] border-cypox-black/[0.07] pointer-events-none z-[2] max-md:w-[200px] max-md:h-[200px] max-md:right-[-50px] max-md:top-[15%]" aria-hidden="true" />
      <div className="absolute top-[32%] right-[18%] w-[260px] h-[260px] rounded-full bg-cypox-black/[0.04] pointer-events-none z-[2] max-md:w-[140px] max-md:h-[140px] max-md:right-[-20px] max-md:top-[38%]" aria-hidden="true" />

      {/* Desktop — Floating 3D Shapes */}
      <div className="hidden lg:block absolute top-0 right-0 w-[45%] h-full z-[2]" aria-hidden="true">
        <Suspense fallback={null}>
          <FloatingShapes />
        </Suspense>
      </div>

      {/* Mobile torus — only mounts on small screens */}
      {isMobile && (
        <div className="lg:hidden">
          <TorusWireframe />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pt-24 sm:pt-32 pb-6 sm:pb-8 flex-1 flex flex-col justify-center relative z-10 w-full">
        <div ref={tagRef} className="mb-4 sm:mb-8">
          <span className="text-xs font-medium text-cypox-gray tracking-[0.2em] uppercase">Laboratoire de croissance web</span>
        </div>
        <div ref={titleRef} className="mb-6 sm:mb-10">
          <h1 className="font-display font-bold leading-[0.95] tracking-[-0.04em]">
            <span className="block text-[clamp(2.5rem,6vw,7rem)] text-cypox-black">Chaque entreprise</span>
            <span className="block text-[clamp(2.5rem,6vw,7rem)] text-cypox-black">laisse des</span>
            <span className="block text-[clamp(3rem,7vw,8rem)] text-cypox-black relative">
              opportunités
              <svg className="absolute -bottom-2 left-0 w-[45%] h-4" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 8 C50 2, 100 12, 150 6 S250 2, 298 8" stroke="var(--color-cypox-black)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="block text-[clamp(2.5rem,6vw,7rem)] text-cypox-text-muted">sur Internet.</span>
          </h1>
        </div>
        <div ref={subRef} className="flex flex-col gap-6">
          <div className="max-w-lg">
            <p className="text-base sm:text-lg text-cypox-text-muted leading-relaxed">
              Audit complet de votre présence en ligne. Rapport personnalisé en quelques secondes.
            </p>
          </div>
          <AuditInput />
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <button onClick={() => transitionTo('/transformations')} className="btn-fill inline-block px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider min-h-[44px]">
              <span>Voir les résultats</span>
            </button>
            <a
              href="/#contact"
              onClick={handleContactClick}
              className="text-cypox-black font-bold text-sm border-b-2 border-cypox-black pb-0.5 hover:opacity-60 transition-opacity py-2 min-h-[44px] inline-flex items-center"
              aria-label="Parlons de votre projet — nous contacter"
            >
              Parlons de votre projet
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="border-t border-cypox-border py-6 relative z-10">
        <dl className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-2xl sm:text-3xl font-display font-bold text-cypox-black tracking-[-0.03em]">{stat.value}</dd>
              <dd className="text-xs text-cypox-gray mt-1 tracking-wider uppercase">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
