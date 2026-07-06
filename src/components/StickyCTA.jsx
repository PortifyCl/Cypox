import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLocation } from 'react-router'
import { scrollToHash } from '../utils/useScrollToHash'
import { usePageTransition } from '../hooks/usePageTransition'

export default function StickyCTA() {
  const [visible, setVisible] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const transitionTo = usePageTransition()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (e) => {
    e.preventDefault()
    if (isHome) {
      scrollToHash('contact')
    } else {
      transitionTo('/#contact')
    }
  }

  if (!visible) return null

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-cypox-border p-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      <button
        onClick={handleClick}
        className="flex items-center justify-center gap-2 w-full bg-cypox-black text-white py-4 rounded-full font-bold text-sm hover:bg-cypox-accent-hover transition-all duration-300"
      >
        Parlons de votre projet <ArrowRight size={16} />
      </button>
    </div>
  )
}
