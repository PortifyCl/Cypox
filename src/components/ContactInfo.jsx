import { memo } from 'react'

const ContactInfo = memo(function ContactInfo({ contactType, setContactType }) {
  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h2 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-cypox-black leading-[0.9] mb-6">
          Disons bonjour
        </h2>
        <p className="text-sm text-cypox-gray uppercase tracking-wider">
          Remplissez le formulaire<br />et nous répondons sous 24h
        </p>
      </div>

      <div className="flex gap-3 mb-8" role="group" aria-label="Type de contact">
        <button
          onClick={() => setContactType('projet')}
          aria-pressed={contactType === 'projet'}
          className={`px-5 py-3 min-h-[44px] rounded-full text-sm font-medium transition-all duration-300 ${
            contactType === 'projet'
              ? 'bg-cypox-black text-white'
              : 'border border-cypox-border text-cypox-gray hover:border-cypox-black hover:text-cypox-black'
          }`}
        >
          Nouveau projet
        </button>
        <button
          onClick={() => setContactType('general')}
          aria-pressed={contactType === 'general'}
          className={`px-5 py-3 min-h-[44px] rounded-full text-sm font-medium transition-all duration-300 ${
            contactType === 'general'
              ? 'bg-cypox-black text-white'
              : 'border border-cypox-border text-cypox-gray hover:border-cypox-black hover:text-cypox-black'
          }`}
        >
          Général
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
          <div>
            <span className="text-xs uppercase tracking-wider text-cypox-gray block mb-2">Réponse</span>
            <p className="text-sm text-cypox-black leading-relaxed">
              Sous 24 heures
            </p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-cypox-gray block mb-2">Disponibilité</span>
            <p className="text-sm text-cypox-black leading-relaxed">
              France · Belgique · Suisse
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ContactInfo
