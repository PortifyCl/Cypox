import { useGsapReveal } from '../hooks/useGsap'

const testimonials = [
  {
    quote: 'Le site génère des réservations tous les jours. C\'est devenu notre meilleur commercial.',
    name: 'Restauration',
    role: 'Retour type',
    project: 'Site vitrine + réservations',
  },
  {
    quote: 'L\'application a dépassé nos attentes. Le processus était fluide du début à la fin.',
    name: 'Tech / SaaS',
    role: 'Retour type',
    project: 'Application mobile UI/UX',
  },
  {
    quote: 'Le site génère des demandes de devis tous les jours. C\'est notre meilleur investissement marketing.',
    name: 'BTP & Construction',
    role: 'Retour type',
    project: 'Site vitrine + formulaire devis',
  },
]

export default function Testimonials() {
  const titleRef = useGsapReveal()
  const gridRef = useGsapReveal({ stagger: 0.12 })

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="mb-16">
          <span className="text-xs font-medium text-cypox-gray tracking-[0.3em] uppercase mb-4 block">Témoignages</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cypox-black tracking-[-0.03em]">
            Ce qu'ils disent
          </h2>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-0 border-t border-cypox-border">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 lg:p-10 border-b md:border-b-0 md:odd:border-r border-cypox-border group hover:bg-cypox-surface transition-colors duration-300"
            >
              {/* Quote mark */}
              <span className="font-serif text-5xl text-cypox-black/10 leading-none block mb-4">"</span>

              <blockquote className="text-cypox-black text-base leading-relaxed mb-8">
                {t.quote}
                <cite className="sr-only"> — {t.name}, {t.role}</cite>
              </blockquote>

              <div className="border-t border-cypox-border pt-6">
                <p className="font-display font-bold text-cypox-black text-sm tracking-[-0.02em]">{t.name}</p>
                <p className="text-cypox-gray text-xs mt-1">{t.role}</p>
                <p className="text-cypox-gray text-xs mt-1 font-medium">{t.project}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
