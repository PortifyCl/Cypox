import { useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router'
import Lenis from 'lenis'
import { setLenisInstance } from '../utils/useScrollToHash'

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const rafCleanupRef = useRef(null)
  const location = useLocation()

  const destroyLenis = useCallback(() => {
    if (rafCleanupRef.current) {
      rafCleanupRef.current()
      rafCleanupRef.current = null
    }
    if (lenisRef.current) {
      lenisRef.current.destroy()
      lenisRef.current = null
      setLenisInstance(null)
    }
  }, [])

  const createLenis = useCallback(() => {
    destroyLenis()
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })
    lenisRef.current = lenis
    setLenisInstance(lenis)

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    rafCleanupRef.current = () => cancelAnimationFrame(rafId)
  }, [destroyLenis])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!mq.matches) {
      createLenis()
    }

    const handler = (e) => {
      if (e.matches) {
        destroyLenis()
      } else {
        createLenis()
      }
    }
    mq.addEventListener('change', handler)

    return () => {
      mq.removeEventListener('change', handler)
      destroyLenis()
    }
  }, [createLenis, destroyLenis])

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return children
}
