import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { createContactHandler } from '../utils/useScrollToHash'
import { usePageTransition } from '../hooks/usePageTransition'

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Transformations', href: '/transformations' },
  { label: 'Méthode', href: '/methode' },
  { label: 'Contact', href: '/#contact', isHash: true },
]

export default function Footer() {
  const location = useLocation()
  const transitionTo = usePageTransition()
  const handleContactClick = useMemo(() => createContactHandler(location.pathname, transitionTo), [location.pathname, transitionTo])

  return (
    <footer className="border-t border-cypox-border bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top — CTA */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-cypox-black tracking-[-0.03em] mb-4">
            Un projet ?
          </h2>
          <p className="text-cypox-gray text-lg mb-8">
            Construisons quelque chose d'exceptionnel.
          </p>
          <button
            onClick={handleContactClick}
            className="inline-flex items-center gap-2 bg-cypox-black text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-cypox-accent-hover transition-all duration-300"
            aria-label="Nous contacter"
          >
            Parlons-en
          </button>
        </div>

        {/* Middle — Nav + Contact */}
        <div className="grid sm:grid-cols-2 gap-12 mb-16 pt-12 border-t border-cypox-border">
          {/* Navigation */}
          <div>
            <h3 className="text-xs font-medium text-cypox-gray tracking-[0.2em] uppercase mb-6">Navigation</h3>
            <ul className="space-y-3 list-none p-0">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.isHash ? (
                    <button
                      onClick={handleContactClick}
                      className="text-sm text-cypox-black hover:text-cypox-gray transition-colors font-medium py-1 min-h-[44px] flex items-center text-left w-full"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <button onClick={() => transitionTo(link.href)} className="text-sm text-cypox-black hover:text-cypox-gray transition-colors font-medium py-1 min-h-[44px] flex items-center text-left w-full">
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-medium text-cypox-gray tracking-[0.2em] uppercase mb-6">Contact</h3>
            <p className="text-sm text-cypox-black font-medium block mb-3">
              Via le formulaire de contact
            </p>
            <p className="text-sm text-cypox-gray">
              Réponse sous 24h
            </p>
          </div>
        </div>

        {/* Bottom — Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-cypox-border">
          <div className="text-xs text-cypox-gray tracking-[-0.02em]">
            © {new Date().getFullYear()} CYPOX
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => transitionTo('/mentions-legales')} className="text-xs text-cypox-gray hover:text-cypox-black transition-colors py-1 min-h-[44px] flex items-center">
              Mentions légales
            </button>
            <button onClick={() => transitionTo('/politique-de-confidentialite')} className="text-xs text-cypox-gray hover:text-cypox-black transition-colors py-1 min-h-[44px] flex items-center">
              Confidentialité
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
