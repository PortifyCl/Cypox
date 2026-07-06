import { useState, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router'
import { ArrowRight, Grid3X3, LayoutList, Search } from 'lucide-react'
import { createContactHandler } from '../utils/useScrollToHash'
import { useGsapReveal } from '../hooks/useGsap'
import { usePageTransition } from '../hooks/usePageTransition'
import FilterBar from '../components/FilterBar'
import GalleryCard from '../components/GalleryCard'
import ProjectModal from '../components/ProjectModal'
import { projects } from '../data/projects'
import SEO, { createCaseStudySchema } from '../components/SEO'

export default function TransformationsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSubFilter, setActiveSubFilter] = useState(null)
  const [layout, setLayout] = useState('grid')
  const [selectedProject, setSelectedProject] = useState(null)
  const location = useLocation()
  const transitionTo = usePageTransition()

  const titleRef = useGsapReveal()
  const gridRef = useGsapReveal({ stagger: 0.05 })

  const handleOpen = useCallback((project) => setSelectedProject(project), [])
  const handleClose = useCallback(() => setSelectedProject(null), [])

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchCategory = activeFilter === 'all' || project.category === activeFilter
      const matchSubCategory = !activeSubFilter || project.subcategory === activeSubFilter
      return matchCategory && matchSubCategory
    })
    // Web projects first (they show live HTML previews)
    return filtered.sort((a, b) => {
      if (a.category === 'web' && b.category !== 'web') return -1
      if (a.category !== 'web' && b.category === 'web') return 1
      return 0
    })
  }, [activeFilter, activeSubFilter])

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setActiveSubFilter(null)
  }

  const handleContactClick = useMemo(() => createContactHandler(location.pathname, transitionTo), [location.pathname, transitionTo])

  const collectionsSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Transformations CYPOX',
    description: 'Découvrez les transformations digitales de nos clients : sites web, applications, designs UI/UX. Avant, après, résultats mesurés.',
    hasPart: projects.slice(0, 6).map((p) => createCaseStudySchema(p)),
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Transformations — CYPOX | Résultats clients"
        description="Découvrez les transformations digitales de nos clients : sites web, applications, designs UI/UX. Avant, après, résultats mesurés."
        url="/transformations"
        jsonLd={collectionsSchema}
      />
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-cypox-border/20 blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10" ref={titleRef}>
          <div className="inline-flex items-center gap-2 bg-cypox-black/5 border border-cypox-border rounded-full px-4 py-2 mb-8">
            <Grid3X3 size={14} className="text-cypox-black" />
            <span className="text-sm font-medium text-cypox-gray">{projects.length} transformations</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 text-cypox-black">
            Nos <span className="text-cypox-gray">transformations</span>
          </h1>

          <p className="text-lg text-cypox-text-muted max-w-2xl mb-8 leading-relaxed">
            Chaque projet raconte une histoire. Découvrez comment nous transformons la présence en ligne de nos clients.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={handleContactClick}
              className="group inline-flex items-center gap-2 bg-cypox-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-cypox-accent-hover transition-all duration-300 min-h-[44px]"
            >
              Votre transformation
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Filters & Gallery */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <FilterBar
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              activeSubFilter={activeSubFilter}
              onSubFilterChange={setActiveSubFilter}
            />

            <div className="flex items-center gap-2 sm:ml-4">
              <button
                onClick={() => setLayout('grid')}
                aria-pressed={layout === 'grid'}
                aria-label="Vue grille"
                className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg transition-colors ${layout === 'grid' ? 'bg-cypox-black text-white' : 'text-cypox-gray hover:text-cypox-black'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setLayout('large')}
                aria-pressed={layout === 'large'}
                aria-label="Vue liste"
                className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg transition-colors ${layout === 'large' ? 'bg-cypox-black text-white' : 'text-cypox-gray hover:text-cypox-black'}`}
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>

          <div className="mb-6 text-sm text-cypox-gray">
            {filteredProjects.length} résultat{filteredProjects.length !== 1 ? 's' : ''}
          </div>

          <div
            key={`${activeFilter}-${activeSubFilter}`}
            ref={gridRef}
            className={`grid gap-6 ${
              layout === 'large'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredProjects.map((project, index) => (
              <GalleryCard
                key={project.id}
                project={project}
                layout={layout === 'large' && index === 0 ? 'large' : 'grid'}
                onOpen={handleOpen}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <Search size={48} className="text-cypox-gray/30 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold mb-2 text-cypox-black">Aucune transformation trouvée</h3>
              <p className="text-cypox-gray">Essayez de changer les filtres.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 bg-cypox-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 text-cypox-black">
            Votre transformation <span className="text-cypox-gray">commence ici</span>
          </h2>
          <p className="text-cypox-text-muted text-lg mb-8 max-w-xl mx-auto">
            Chaque projet est une nouvelle occasion de créer quelque chose d'exceptionnel. Et le vôtre pourrait être le prochain.
          </p>
          <button
            onClick={handleContactClick}
            className="group inline-flex items-center gap-2 bg-cypox-black text-white px-8 py-4 rounded-full font-bold text-base hover:bg-cypox-accent-hover transition-all duration-300 hover:-translate-y-1"
          >
            Démarrer ma transformation <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
      {/* Modal */}
      <ProjectModal project={selectedProject} onClose={handleClose} />
    </div>
  )
}
