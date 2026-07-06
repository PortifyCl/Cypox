import { ArrowUpRight } from 'lucide-react'
import { useGsapReveal } from '../hooks/useGsap'
import { projects as allProjects } from '../data/projects'
import { usePageTransition } from '../hooks/usePageTransition'

const featured = allProjects.filter(p => p.category === 'web').slice(0, 3)

const sectorStats = [
  { sector: 'BTP & Construction', metric: '+180%', label: 'de demandes de devis' },
  { sector: 'Cabinets médicaux', metric: '+120%', label: 'de prises de rendez-vous' },
  { sector: 'Restauration', metric: '+95%', label: 'de réservations en ligne' },
]

export default function Portfolio() {
  const titleRef = useGsapReveal()
  const listRef = useGsapReveal({ stagger: 0.1 })
  const statsRef = useGsapReveal({ stagger: 0.1 })
  const transitionTo = usePageTransition()

  return (
    <section id="realisations" className="py-28 bg-cypox-surface">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={titleRef} className="mb-16">
          <span className="text-xs font-medium text-cypox-gray tracking-[0.3em] uppercase mb-6 block">Résultats</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-cypox-black">
            Ce que nos clients gagnent
          </h2>
        </div>

        {/* Sector stats */}
        <div ref={statsRef} className="grid sm:grid-cols-3 gap-8 mb-20">
          {sectorStats.map((stat) => (
            <div key={stat.sector} className="p-6 rounded-2xl bg-white border border-cypox-border">
              <span className="text-xs font-medium text-cypox-gray tracking-wider uppercase mb-3 block">{stat.sector}</span>
              <p className="font-display text-4xl font-bold text-cypox-black mb-1">{stat.metric}</p>
              <p className="text-cypox-gray text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Featured projects */}
        <div ref={listRef} className="space-y-0">
          {featured.map((project, i) => (
            <div
              key={project.id}
              className="group border-t border-cypox-border py-8 -mx-6 px-6"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <span className="text-sm font-mono text-cypox-gray w-8 hidden sm:block">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm text-cypox-gray w-48 hidden md:block">{project.subcategory || project.category}</span>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-cypox-black flex-1">
                  {project.title}
                </h3>
                <span className="text-sm font-medium text-cypox-gray px-4 py-1.5 rounded-full border border-cypox-border w-fit">
                  {project.category}
                </span>
              </div>
              <div className="mt-3 ml-0 sm:ml-11 md:ml-[14rem]">
                <p className="text-cypox-gray text-sm">{project.description}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-cypox-border" />
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => transitionTo('/transformations')}
            className="group inline-flex items-center gap-2 bg-cypox-black text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-cypox-accent-hover transition-all duration-300"
          >
            Voir toutes les transformations
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
