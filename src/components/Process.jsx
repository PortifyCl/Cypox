import { useGsapReveal } from '../hooks/useGsap'

const steps = [
  {
    number: '01',
    title: 'Découverte',
    description: 'Nous discutons de votre projet, vos objectifs, votre cible. Nous analysons votre marché et vos concurrents.',
    duration: '1-2 jours',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Maquettes haute fidélité validées avant le développement. Vous visualisez le résultat final.',
    duration: '3-5 jours',
  },
  {
    number: '03',
    title: 'Développement',
    description: 'Code propre, optimisé, responsive. Chaque composant est pensé pour la performance.',
    duration: '1-2 semaines',
  },
  {
    number: '04',
    title: 'Lancement',
    description: 'Mise en ligne, configuration SEO, formation. Nous restons disponibles pour le support.',
    duration: '1-2 jours',
  },
]

export default function Process() {
  const titleRef = useGsapReveal()
  const gridRef = useGsapReveal({ stagger: 0.15 })

  return (
    <section className="py-28 bg-cypox-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="mb-16">
          <span className="text-xs font-medium text-cypox-gray tracking-[0.3em] uppercase mb-4 block">Processus</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-cypox-black tracking-[-0.03em]">
            Comment nous travaillons
          </h2>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="group">
              <div className="text-4xl sm:text-5xl font-display font-bold text-cypox-border/60 mb-6 group-hover:text-cypox-black transition-colors duration-500 tracking-[-0.03em]">
                {step.number}
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-cypox-black tracking-[-0.02em]">{step.title}</h3>
              <p className="text-cypox-gray text-sm leading-relaxed mb-4">{step.description}</p>
              <span className="text-xs font-medium text-cypox-gray/70">{step.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
