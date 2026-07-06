import { ArrowUpRight } from 'lucide-react'
import { cn } from '../utils/cn'
import { categoryColors, categoryLabels } from '../utils/constants'

function ScreenshotContent({ project }) {
  if (project.screenshot) {
    const isHtml = project.screenshot.endsWith('.html')

    if (isHtml) {
      return (
        <iframe
          src={project.screenshot}
          title={project.title}
          loading="lazy"
          className="w-full h-full border-0"
          style={{ pointerEvents: 'none' }}
        />
      )
    }

    return (
      <img
        src={project.screenshot}
        alt={project.title}
        width="400"
        height="300"
        decoding="async"
        className="w-full h-full object-cover object-top"
        loading="lazy"
      />
    )
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br ${project.gradient || 'from-cypox-surface to-cypox-border'} flex items-center justify-center p-6`} aria-hidden="true">
      <div className="text-center" />
    </div>
  )
}

export default function GalleryCard({ project, layout = 'grid', onOpen }) {
  const isLarge = layout === 'large'

  const handleClick = () => {
    onOpen?.(project)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative rounded-2xl overflow-hidden bg-white border border-cypox-border hover:border-cypox-black transition-all duration-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-cypox-black focus-visible:ring-offset-2 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1',
        isLarge ? 'md:col-span-2 md:row-span-2' : ''
      )}
      aria-label={`Projet : ${project.title}. Appuyez pour voir les détails.`}
    >
      {/* Screenshot area */}
      <div className={cn(
        'relative overflow-hidden',
        isLarge ? 'aspect-[4/3] md:aspect-[16/10]' : 'aspect-[4/3]'
      )}>
        <div className="transition-transform duration-300 ease-out group-hover:scale-105 absolute inset-0">
          <ScreenshotContent project={project} />
        </div>

        {/* Mobile: always-visible open icon */}
        <div className="md:hidden absolute top-3 right-3 z-10">
          <div className="bg-white rounded-full p-2.5 shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ArrowUpRight size={18} className="text-cypox-black" />
          </div>
        </div>

        {/* Hover overlay (desktop) */}
        <div className="hidden md:flex absolute inset-0 bg-cypox-black/80 flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            Voir le projet <ArrowUpRight size={20} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', categoryColors[project.category])}>
            {categoryLabels[project.category]}
          </span>
          {project.subcategory && (
            <span className="text-xs text-cypox-gray">{project.subcategory}</span>
          )}
        </div>
        <h3 className="font-display text-lg font-bold mb-2 text-cypox-black">{project.title}</h3>
        <p className="text-cypox-gray text-sm leading-relaxed line-clamp-2">{project.description}</p>

        {/* Tags */}
        {project.tags && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-cypox-surface rounded text-cypox-gray">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
