import { useGsapReveal } from '../hooks/useGsap'
import { ArrowRight } from 'lucide-react'
import { usePageTransition } from '../hooks/usePageTransition'

const sectors = [
  {
    name: 'BTP & Construction',
    desc: 'Sites vitrines qui transforment les visiteurs en demandes de devis.',
    stat: '+187%',
    statLabel: 'de demandes de devis en moyenne sur 6 mois',
  },
  {
    name: 'Cabinets médicaux',
    desc: 'Prise de rendez-vous en ligne, présentation des services, confiance patient.',
    stat: '+124%',
    statLabel: 'de prises de RDV en ligne sur 4 mois',
  },
  {
    name: 'Restauration & Hôtellerie',
    desc: 'Réservations, menu en ligne, visibilité locale Google.',
    stat: '+93%',
    statLabel: 'de réservations en ligne sur 3 mois',
  },
  {
    name: 'Immobilier & Conseil',
    desc: 'Pages de conversion, formulaires qualifiés, SEO local.',
    stat: '+156%',
    statLabel: 'de leads qualifiés sur 5 mois',
  },
]

export default function Sectors() {
  const titleRef = useGsapReveal()
  const gridRef = useGsapReveal({ stagger: 0.1 })
  const transitionTo = usePageTransition()

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="mb-16">
          <span className="text-xs font-medium text-cypox-gray tracking-[0.3em] uppercase mb-6 block">Secteurs</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cypox-black">
            Nous comprenons <span className="text-cypox-gray">votre marché</span>
          </h2>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 gap-6">
          {sectors.map((sector) => (
            <article
              key={sector.name}
              className="p-8 rounded-2xl border border-cypox-border"
              aria-label={sector.name}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-cypox-black">{sector.name}</h3>
                <span className="font-display text-2xl font-bold text-cypox-black">{sector.stat}</span>
              </div>
              <p className="text-cypox-gray text-sm leading-relaxed mb-2">{sector.desc}</p>
              <p className="text-cypox-gray/60 text-xs">{sector.statLabel}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => transitionTo('/methode')}
            className="group inline-flex items-center gap-2 text-cypox-black font-bold text-sm hover:opacity-60 transition-opacity min-h-[44px]"
          >
            Découvrir notre méthode
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  )
}
