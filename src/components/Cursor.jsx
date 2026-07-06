import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const cursor = cursorRef.current
    const dot = cursorDotRef.current
    if (!cursor || !dot) return

    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -100, y: -100, scale: 1 })
    gsap.set(dot, { xPercent: -50, yPercent: -50, x: -100, y: -100 })

    const cursorX = gsap.quickTo(cursor, 'x', { duration: 0.8, ease: 'power3.out' })
    const cursorY = gsap.quickTo(cursor, 'y', { duration: 0.8, ease: 'power3.out' })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power2.out' })

    let rafPending = false
    let latestX = 0
    let latestY = 0

    const handleMouseMove = (e) => {
      latestX = e.clientX
      latestY = e.clientY
      if (!rafPending) {
        rafPending = true
        requestAnimationFrame(() => {
          cursorX(latestX)
          cursorY(latestY)
          dotX(latestX)
          dotY(latestY)
          rafPending = false
        })
      }
    }

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.5 })
      gsap.to(dot, { opacity: 1, duration: 0.5 })
    }

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.5 })
      gsap.to(dot, { opacity: 0, duration: 0.5 })
    }

    const handleElementEnter = (e) => {
      if (e.target.closest('a, button, [data-cursor="pointer"]')) {
        gsap.to(cursor, { scale: 2, duration: 0.5, ease: 'power2.out' })
        gsap.to(dot, { scale: 0, duration: 0.5 })
      }
    }

    const handleElementLeave = (e) => {
      if (e.target.closest('a, button, [data-cursor="pointer"]')) {
        gsap.to(cursor, { scale: 1, duration: 0.5, ease: 'power2.out' })
        gsap.to(dot, { scale: 1, duration: 0.5 })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleElementEnter)
    document.addEventListener('mouseout', handleElementLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleElementEnter)
      document.removeEventListener('mouseout', handleElementLeave)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-[1.5px] border-cypox-black pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-cypox-black pointer-events-none z-[9999] hidden md:block"
      />
    </>
  )
}
