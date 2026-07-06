import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { categoryColors, categoryLabels } from '../utils/constants'

export default function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null)
  const closeButtonRef = useRef(null)
  const modalRef = useRef(null)

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    // Focus trap
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }, [onClose])

  useEffect(() => {
    if (!project) return
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, handleKeyDown])

  if (!project) return null

  const isHtml = project.screenshot?.endsWith('.html')
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Projet : ${project.title}`}
    >
      {isHtml ? (
        /* Web project — full screen iframe */
        <div ref={modalRef} className="bg-cypox-black rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[project.category]}`}>
                {categoryLabels[project.category]}
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-[-0.03em]">
                {project.title}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Fermer"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          {/* Iframe — scrollable */}
          <iframe
            src={project.screenshot}
            title={project.title}
            className="flex-1 w-full border-0"
          />
        </div>
      ) : (
        /* Image project — two column layout */
        <div ref={modalRef} className="bg-cypox-black rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Close button */}
          <div className="sticky top-0 z-10 flex justify-end p-4">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Fermer"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row -mt-12">
            {/* Left — Preview */}
            {project.screenshot && (
              <div className="lg:w-1/2 bg-cypox-black flex items-center justify-center p-6 lg:p-8">
                <img
                  src={project.screenshot}
                  alt={project.title}
                  className="w-full h-auto object-contain rounded-lg max-h-[70vh]"
                />
              </div>
            )}

            {/* Right — Content */}
            <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[project.category]}`}>
                  {categoryLabels[project.category]}
                </span>
                {project.subcategory && (
                  <span className="text-xs text-white/50">{project.subcategory}</span>
                )}
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6 tracking-[-0.03em]">
                {project.title}
              </h2>

              <p className="text-white/70 text-base leading-relaxed mb-6">
                {project.description}
              </p>

              {project.details && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Détails du projet</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {project.details}
                  </p>
                </div>
              )}

              {project.results && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Résultats</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {project.results}
                  </p>
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 bg-white/10 rounded-full text-white/60">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
