import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useGsapReveal(options = {}) {
  const ref = useRef(null)
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      y = 80,
      x = 0,
      opacity = 0,
      duration = 1.6,
      delay = 0,
      ease = 'power3.out',
      start = 'top 90%',
      stagger = 0,
    } = optionsRef.current

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const children = stagger ? el.children : [el]

    if (prefersReduced) {
      gsap.set(children, { y: 0, x: 0, opacity: 1 })
      return
    }

    let currentTween = null

    function animate() {
      if (currentTween) {
        currentTween.kill()
        ScrollTrigger.getAll().forEach(t => {
          if (t.trigger === el) t.kill()
        })
      }
      const currentStagger = optionsRef.current.stagger || 0
      const targets = currentStagger ? el.children : [el]
      if (targets.length === 0) return

      gsap.set(targets, { y, x, opacity })

      currentTween = gsap.to(targets, {
        y: 0,
        x: 0,
        opacity: 1,
        duration,
        delay,
        ease,
        stagger: currentStagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      })
    }

    animate()

    // Re-animate when children change (e.g. filter updates)
    if (stagger) {
      const observer = new MutationObserver(() => {
        requestAnimationFrame(animate)
      })
      observer.observe(el, { childList: true })
      return () => {
        observer.disconnect()
        if (currentTween) currentTween.kill()
        ScrollTrigger.getAll().forEach(t => {
          if (t.trigger === el) t.kill()
        })
      }
    }

    return () => {
      if (currentTween) currentTween.kill()
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [])

  return ref
}
