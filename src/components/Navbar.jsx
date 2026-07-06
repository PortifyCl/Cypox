import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { cn } from '../utils/cn'
import { gsap } from 'gsap'
import { scrollToHash } from '../utils/useScrollToHash'
import { usePageTransition } from '../hooks/usePageTransition'

const navItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Transformations', href: '/transformations' },
  { label: 'Méthode', href: '/methode' },
  { label: 'Contact', href: '/#contact', isHash: true },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)
  const menuItemsRef = useRef([])
  const previousFocusRef = useRef(null)
  const transitionTo = usePageTransition()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    if (mobileOpen && menuRef.current) {
      previousFocusRef.current = document.activeElement
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const ctx = gsap.context(() => {
        if (prefersReduced) {
          gsap.set(menuItemsRef.current, { opacity: 1, y: 0 })
          return
        }
        gsap.fromTo(menuItemsRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.15, ease: 'power3.out' }
        )
      }, menuRef)

      // Focus trap
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMobileOpen(false)
          return
        }
        if (e.key === 'Tab' && menuRef.current) {
          const focusable = menuRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (focusable.length === 0) return
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus() }
          } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus() }
          }
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      return () => {
        ctx.revert()
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [mobileOpen])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      if (menuRef.current) {
        menuRef.current.style.removeProperty('clipPath')
        menuRef.current.style.removeProperty('opacity')
        menuRef.current.style.removeProperty('transform')
      }
      if (previousFocusRef.current && previousFocusRef.current.isConnected) {
        previousFocusRef.current.focus()
      }
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = useCallback((href) => {
    const id = href.replace('/#', '').replace('#', '')
    if (location.pathname === '/') {
      scrollToHash(id)
    } else {
      transitionTo('/' + (id === 'contact' ? '#contact' : ''), { replace: false })
    }
  }, [location.pathname, transitionTo])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-cypox-border py-3'
          : 'bg-transparent py-5'
      )}
      style={{ paddingTop: 'max(0px, env(safe-area-inset-top))' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => transitionTo('/')} className="flex items-center gap-3 group">
          <img
            src="/Logo.webp"
            alt="CYPOX"
            className="h-7 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            item.isHash ? (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="relative px-4 py-2 overflow-hidden group min-h-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cypox-black focus-visible:ring-offset-2 rounded"
              >
                <span className="absolute inset-0 flex items-center justify-start text-sm font-medium text-cypox-gray transition-all duration-700 translate-y-0 group-hover:-translate-y-full group-hover:opacity-0">
                  {item.label}
                </span>
                <span className="absolute inset-0 flex items-center justify-start text-sm font-medium text-cypox-black font-serif italic translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                  {item.label}
                </span>
                <span className="invisible">{item.label}</span>
              </button>
            ) : (
              <button
                key={item.label}
                onClick={() => transitionTo(item.href)}
                className="relative px-4 py-2 overflow-hidden group min-h-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cypox-black focus-visible:ring-offset-2 rounded"
              >
                <span className="absolute inset-0 flex items-center justify-start text-sm font-medium text-cypox-gray transition-all duration-700 translate-y-0 group-hover:-translate-y-full group-hover:opacity-0">
                  {item.label}
                </span>
                <span className="absolute inset-0 flex items-center justify-start text-sm font-medium text-cypox-black font-serif italic translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                  {item.label}
                </span>
                <span className="invisible">{item.label}</span>
              </button>
            )
          ))}
          <button
            onClick={() => handleNavClick('/#contact')}
            className="ml-4 bg-cypox-black text-white px-6 py-3 min-h-[44px] flex items-center rounded-full text-sm font-bold hover:bg-cypox-accent-hover transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cypox-black focus-visible:ring-offset-2"
          >
            Parlons-en
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => {
            if (!mobileOpen) setMobileOpen(true)
          }}
          className="md:hidden text-cypox-black p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center z-20"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className={cn(
          'md:hidden fixed inset-0 top-0 flex flex-col justify-center overflow-hidden transition-none',
          mobileOpen ? 'pointer-events-auto z-[60] visible' : 'pointer-events-none z-[45] invisible'
        )}
        style={!mobileOpen ? { clipPath: 'circle(0% at calc(100% - 40px) 40px)' } : undefined}
        onClick={(e) => { if (e.target === menuRef.current || e.target === menuRef.current?.firstElementChild) setMobileOpen(false) }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-cypox-surface" />

        {/* Content */}
        <div className="relative z-10 px-8">
          {navItems.map((item, i) => (
            item.isHash ? (
              <button
                key={item.label}
                ref={el => menuItemsRef.current[i] = el}
                className="block mb-3 group focus-visible:ring-2 focus-visible:ring-cypox-black rounded py-2 text-left w-full min-h-[44px]"
                onClick={() => {
                  setMobileOpen(false)
                  handleNavClick(item.href)
                }}
              >
                <span className="font-serif text-4xl sm:text-5xl font-normal text-cypox-black leading-none group-hover:text-cypox-gray transition-colors duration-300">
                  {item.label}
                </span>
              </button>
            ) : (
              <button
                key={item.label}
                ref={el => menuItemsRef.current[i] = el}
                className="block mb-3 group focus-visible:ring-2 focus-visible:ring-cypox-black rounded py-2 min-h-[44px]"
                onClick={() => {
                  setMobileOpen(false)
                  transitionTo(item.href)
                }}
              >
                <span className="font-serif text-4xl sm:text-5xl font-normal text-cypox-black leading-none group-hover:text-cypox-gray transition-colors duration-300">
                  {item.label}
                </span>
              </button>
            )
          ))}

          {/* CTA in menu */}
          <div className="mt-12 pt-8 border-t border-cypox-border/30">
            <button
              onClick={() => {
                setMobileOpen(false)
                handleNavClick('/#contact')
              }}
              className="inline-block bg-cypox-black text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider min-h-[44px]"
            >
              Parlons de votre projet
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-cypox-black p-2 min-w-[44px] min-h-[44px] flex items-center justify-center z-20"
          aria-label="Fermer"
        >
          <X size={28} />
        </button>
      </div>
    </nav>
  )
}

export default memo(Navbar)
