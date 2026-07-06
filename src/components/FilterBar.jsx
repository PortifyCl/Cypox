import { cn } from '../utils/cn'

const filters = [
  { id: 'all', label: 'Tous' },
  { id: 'graphisme', label: 'Graphisme' },
  { id: 'ui-ux', label: 'Design UI/UX' },
  { id: 'web', label: 'Web' },
]

const subFilters = {
  graphisme: ['Logos', 'Branding', 'Print', 'Illustrations'],
  'ui-ux': ['Applications', 'Dashboards', 'Design System'],
  web: ['Sites Vitrines', 'Landing Pages', 'E-commerce'],
}

export default function FilterBar({ activeFilter, onFilterChange, activeSubFilter, onSubFilterChange }) {
  const currentCategory = activeFilter !== 'all' ? activeFilter : null
  const subs = currentCategory ? subFilters[currentCategory] : null

  return (
    <div className="mb-4 sm:mb-12">
      {/* Main filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6" role="group" aria-label="Filtrer par catégorie">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            aria-pressed={activeFilter === filter.id}
            className={cn(
              'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 min-h-[44px] flex items-center',
              activeFilter === filter.id
                ? 'bg-cypox-black text-white'
                : 'bg-cypox-surface border border-cypox-border text-cypox-gray hover:border-cypox-black hover:text-cypox-black'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Sub-filters */}
      {subs && (
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrer par sous-catégorie">
          <button
            onClick={() => onSubFilterChange(null)}
            aria-pressed={!activeSubFilter}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 min-h-[44px] flex items-center',
              !activeSubFilter
                ? 'bg-cypox-black/10 text-cypox-black'
                : 'text-cypox-gray hover:text-cypox-black'
            )}
          >
            Tout
          </button>
          {subs.map((sub) => (
            <button
              key={sub}
              onClick={() => onSubFilterChange(sub)}
              aria-pressed={activeSubFilter === sub}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px] flex items-center',
                activeSubFilter === sub
                  ? 'bg-cypox-black/10 text-cypox-black'
                  : 'text-cypox-gray hover:text-cypox-black'
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
