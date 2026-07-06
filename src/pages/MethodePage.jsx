import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { ArrowRight } from 'lucide-react'
import SEO, { createProcessSchema } from '../components/SEO'
import { createContactHandler } from '../utils/useScrollToHash'
import { usePageTransition } from '../hooks/usePageTransition'

const phases = [
  {
    num: '01',
    title: 'Détection',
    subtitle: 'Nous analysons votre réalité numérique',
    items: [
      'Audit complet de votre présence en ligne',
      'Analyse de la concurrence et du positionnement',
      'Identification des opportunités de croissance',
      'Rapport personnalisé avec recommandations',
    ],
    result: 'Rapport complet en 48 heures',
  },
  {
    num: '02',
    title: 'Conception',
    subtitle: 'Nous créons l\'expérience qui convertit',
    items: [
      'Design sur mesure (pas de templates)',
      'Expérience utilisateur optimisée pour la conversion',
      'Prototype interactif validé ensemble',
      'Stratégie de contenu et de positionnement',
    ],
    result: 'Prototype interactif validé',
  },
  {
    num: '03',
    title: 'Déploiement',
    subtitle: 'Nous lançons et optimisons vos résultats',
    items: [
      'Mise en ligne et configuration technique',
      'SEO local et optimisation de performance',
      'Automatisation des processus (formulaires, notifications)',
      'Suivi des résultats et optimisation continue',
    ],
    result: 'Vous voyez les chiffres monter',
  },
]

const principles = [
  { title: 'Observation', desc: 'Nous comprenons votre marché avant de concevoir.' },
  { title: 'Expérimentation', desc: 'Nous testons chaque hypothèse avant de la déployer.' },
  { title: 'Mesure', desc: 'Chaque décision est guidée par des données, pas par l\'intuition.' },
  { title: 'Optimisation', desc: 'Le site évolue après le lancement pour maximiser les résultats.' },
]

export default function MethodePage() {
  const processSchema = useMemo(() => createProcessSchema(phases), [])
  const location = useLocation()
  const transitionTo = usePageTransition()
  const handleContactClick = useMemo(() => createContactHandler(location.pathname, transitionTo), [location.pathname, transitionTo])

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Notre Méthode — CYPOX | Comment nous transformons votre présence en ligne"
        description="Détection, Conception, Déploiement. Notre méthode en 3 phases pour transformer votre présence en ligne en outil de croissance."
        url="/methode"
        jsonLd={processSchema}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-cypox-border/20 blur-[150px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 text-cypox-black">
            Notre <span className="text-cypox-gray">méthode</span>
          </h1>
          <p className="text-lg text-cypox-text-muted max-w-2xl mx-auto leading-relaxed">
            Trois phases. Zéro hasard. Chaque étape est conçue pour maximiser vos résultats.
          </p>
        </div>
      </section>

      {/* 3 Phases */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          {phases.map((phase, i) => (
            <div key={phase.num} className="mb-20 last:mb-0">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left — Phase info */}
                <div>
                  <span className="text-xs font-medium text-cypox-gray tracking-[0.3em] uppercase mb-4 block">
                    Phase {phase.num}
                  </span>
                  <h2 className="font-display text-4xl lg:text-5xl font-bold text-cypox-black mb-4">
                    {phase.title}
                  </h2>
                  <p className="text-cypox-text-muted text-lg leading-relaxed mb-8">
                    {phase.subtitle}
                  </p>
                  <div className="bg-cypox-surface rounded-2xl p-6 border border-cypox-border">
                    <span className="text-xs font-medium text-cypox-gray tracking-wider uppercase mb-3 block">Résultat</span>
                    <p className="text-cypox-black font-bold text-lg">{phase.result}</p>
                  </div>
                </div>

                {/* Right — Items */}
                <ul className="space-y-4 list-none p-0">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-4 p-4 rounded-xl hover:bg-cypox-surface transition-colors">
                      <span className="text-sm font-mono text-cypox-gray mt-0.5 w-6 shrink-0">
                        {String(j + 1).padStart(2, '0')}
                      </span>
                      <p className="text-cypox-black font-medium">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connector */}
              {i < phases.length - 1 && (
                <div className="flex justify-center my-12">
                  <div className="w-[1px] h-16 bg-cypox-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-cypox-surface">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-center mb-16 text-cypox-black">
            Nos <span className="text-cypox-gray">principes</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((p, i) => (
              <div key={i} className="text-center">
                <span className="text-xs font-bold text-cypox-gray/50 tracking-widest mb-4 block">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display font-bold text-lg mb-2 text-cypox-black">{p.title}</h3>
                <p className="text-cypox-gray text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 text-cypox-black">
            Prêt à commencer ?
          </h2>
          <p className="text-cypox-text-muted text-lg mb-10 max-w-xl mx-auto">
            Demandez votre analyse gratuite et découvrez les opportunités cachées de votre présence en ligne.
          </p>
          <button
            onClick={handleContactClick}
            className="group inline-flex items-center gap-2 bg-cypox-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-cypox-accent-hover transition-all duration-300 hover:-translate-y-1 min-h-[44px]"
          >
            Lancer notre analyse <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  )
}
