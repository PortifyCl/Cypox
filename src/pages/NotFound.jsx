import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import SEO from '../components/SEO'
import { usePageTransition } from '../hooks/usePageTransition'

export default function NotFound() {
  const [prefersReduced, setPrefersReduced] = useState(false)
  const transitionTo = usePageTransition()

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (prefersReduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.notfound-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
      gsap.fromTo('.notfound-sub', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' })
      gsap.fromTo('.notfound-btn', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <SEO
        title="Page introuvable — CYPOX"
        description="La page que vous cherchez n'existe pas ou a été déplacée."
        url="/404"
        noindex
      />

      <div className="text-center max-w-xl">
        <h1 className="sr-only">Page introuvable — Erreur 404</h1>
        <p aria-hidden="true" className="notfound-title text-[80px] sm:text-[120px] lg:text-[180px] font-bold tracking-[-0.03em] text-cypox-black leading-none">
          404
        </p>
        <p className="font-display text-xl sm:text-2xl font-bold text-cypox-black mb-4">
          Page introuvable
        </p>

        <p className="notfound-sub text-base sm:text-lg text-cypox-text-muted mb-12 leading-relaxed">
          Cette page n'existe pas ou a été déplacée.
        </p>

        <button
          onClick={() => transitionTo('/')}
          className="notfound-btn btn-fill inline-block px-10 py-4 text-sm uppercase tracking-widest rounded-full font-medium min-h-[44px]"
        >
          <span>Retour à l'accueil</span>
        </button>
      </div>
    </div>
  )
}
