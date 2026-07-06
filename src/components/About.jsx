import { useGsapReveal } from '../hooks/useGsap'
import { usePageTransition } from '../hooks/usePageTransition'
import { ArrowRight } from 'lucide-react'

export default function About() {
  const ref = useGsapReveal()
  const transitionTo = usePageTransition()

  return (
    <section id="apropos" className="py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div ref={ref}>
          <span className="text-xs font-medium text-cypox-gray tracking-[0.3em] uppercase mb-8 block">Pourquoi CYPOX</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-cypox-black tracking-[-0.03em] leading-[1.1] mb-12">
            Un site web ne devrait jamais être une simple vitrine.
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <p className="text-cypox-text-muted text-lg leading-relaxed">
              Il doit devenir un outil de croissance. Chaque page, chaque formulaire, chaque pixel doit travailler pour transformer vos visiteurs en clients. C'est cette conviction qui nous anime.
            </p>
            <p className="text-cypox-text-muted text-lg leading-relaxed">
              Nous combinons analyse de données, design stratégique et développement sur mesure pour créer des expériences web qui ne sont pas seulement belles — elles génèrent des résultats concrets. Des demandes de devis. Des prises de contact. De la croissance.
            </p>
          </div>
          <div className="mt-12">
            <button
              onClick={() => transitionTo('/methode')}
              className="group inline-flex items-center gap-2 text-cypox-black font-bold text-sm hover:opacity-60 transition-opacity min-h-[44px]"
            >
              Découvrir notre méthode
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
