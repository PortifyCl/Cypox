import { ArrowRight } from 'lucide-react'
import { useGsapReveal } from '../hooks/useGsap'
import { usePageTransition } from '../hooks/usePageTransition'

const features = [
  'Site premium codé sur mesure (pas de template)',
  'Formulaire de contact intelligent avec qualification automatique',
  'Notifications instantanées (email + WhatsApp)',
  'SEO local optimisé pour votre ville/région',
  'Galerie de réalisations et témoignages clients',
  'Hébergement sécurisé inclus 6 mois',
  'Maintenance et support 6 mois',
]

export default function CtaSection() {
  const ref = useGsapReveal()
  const transitionTo = usePageTransition()

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="relative rounded-2xl overflow-hidden bg-cypox-black p-6 sm:p-10 lg:p-16">
          <div className="relative z-10">
            <span className="inline-block bg-white text-cypox-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              À partir de 2 500 CHF
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white tracking-[-0.03em]">
              Pack Croissance Digitale
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mb-10">
              Un système complet qui transforme votre site en commercial digital qui travaille 24h/24 pour vous trouver des clients.
            </p>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 list-none p-0">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                  <span className="text-white/80 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => transitionTo('/methode')}
              className="group inline-flex items-center gap-3 btn-border-light px-8 py-4 rounded-full font-bold text-base"
            >
              Découvrir l'offre complète
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
