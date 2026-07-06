import { useState, useRef, useEffect } from 'react'

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT

const steps = [
  { number: '01', label: 'Coordonnées' },
  { number: '02', label: 'Projet' },
]

const services = [
  'Site web sur mesure',
  'Audit de visibilité',
  'Design UI/UX',
  'Branding / Identité visuelle',
  'Application mobile',
  'Pack Croissance Digitale',
  'Autre',
]

const budgets = [
  'Moins de 2 000 CHF',
  '2 000 – 3 000 CHF',
  '3 000 – 5 000 CHF',
  'Plus de 5 000 CHF',
  'Pas encore défini',
]

export default function ContactForm({ contactType }) {
  const [step, setStep] = useState(0)
  const [formState, setFormState] = useState({
    service: '',
    budget: '',
    name: '',
    email: '',
    message: '',
  })
  const [emailTouched, setEmailTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [cooldown, setCooldown] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  useEffect(() => {
    setStep(0)
    setFormState({ service: '', budget: '', name: '', email: '', message: '' })
    setEmailTouched(false)
    setError(null)
    setSubmitted(false)
  }, [contactType])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cooldown > 0) {
      setError(`Veuillez patienter ${cooldown} secondes avant de réessayer.`)
      return
    }

    if (!FORMSPREE_ENDPOINT) {
      setError('Formulaire non configuré. Contactez-nous directement via le formulaire.')
      return
    }

    if (!formState.message.trim()) {
      setError('Veuillez décrire votre projet.')
      return
    }

    setSending(true)
    setError(null)

    const formData = {
      name: formState.name,
      email: formState.email,
      service: formState.service,
      budget: formState.budget,
      message: formState.message,
      contactType: contactType,
      _subject: `Nouveau message — ${formState.service || 'Contact général'}`,
      _gotcha: '',
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        setCooldown(30)
        try {
          const data = await response.json()
          if (mountedRef.current) setError(data.error || 'Une erreur est survenue. Réessayez.')
        } catch {
          if (mountedRef.current) setError('Une erreur est survenue. Réessayez.')
        }
      }
    } catch {
      if (mountedRef.current) {
        setError('Erreur réseau. Vérifiez votre connexion et réessayez.')
        setCooldown(30)
      }
    } finally {
      if (mountedRef.current) setSending(false)
    }
  }

  const canProceed = () => {
    if (step === 0) return formState.name !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)
    if (step === 1) return formState.service !== '' && formState.message.trim().length > 0
    return true
  }

  if (submitted) {
    return (
      <div className="py-20 text-center" aria-live="polite">
        <div className="font-display text-3xl font-bold text-cypox-black mb-4">Message envoyé</div>
        <p className="text-cypox-gray">Nous vous répondons sous 24h.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }} aria-hidden="true" />

      <div className="flex gap-2 sm:gap-4 mb-12" aria-label="Étapes du formulaire">
        {steps.map((s, i) => (
          <div key={s.number} className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-mono ${i <= step ? 'text-cypox-black' : 'text-cypox-border'}`}>{s.number}</span>
              <span className={`text-xs ${i <= step ? 'text-cypox-black' : 'text-cypox-border'}`}>{s.label}</span>
            </div>
            <div className="h-[2px] bg-cypox-border" role="progressbar" aria-valuenow={i <= step ? 100 : 0} aria-valuemin={0} aria-valuemax={100} aria-label={`Étape ${s.number}: ${s.label}`}>
              <div className="h-full bg-cypox-black transition-all duration-500" style={{ width: i <= step ? '100%' : '0%' }} />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-cypox-black mb-1">Votre nom</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formState.name}
              onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-5 py-4 rounded-xl border border-cypox-border text-cypox-black placeholder:text-cypox-gray/40 focus:outline-none focus:border-cypox-black transition-colors"
              placeholder="Votre nom"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-cypox-black mb-1">Email</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formState.email}
              onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
              onBlur={() => setEmailTouched(true)}
              className={`w-full px-5 py-4 rounded-xl border text-cypox-black placeholder:text-cypox-gray/40 focus:outline-none focus:border-cypox-black transition-colors ${
                emailTouched && formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)
                  ? 'border-red-400'
                  : 'border-cypox-border'
              }`}
              placeholder="votre@email.com"
              required
              aria-required="true"
              aria-invalid={emailTouched && formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)}
              aria-describedby={emailTouched && formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email) ? 'email-error' : undefined}
            />
            {emailTouched && formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email) && (
              <p id="email-error" className="text-red-500 text-xs mt-1">Veuillez entrer une adresse email valide.</p>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cypox-black mb-2">Service souhaité</label>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => setFormState(prev => ({ ...prev, service }))}
                  aria-pressed={formState.service === service}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    formState.service === service
                      ? 'bg-cypox-black text-white'
                      : 'border border-cypox-border text-cypox-gray hover:border-cypox-black hover:text-cypox-black'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-cypox-black mb-2">Budget approximatif</label>
            <div className="flex flex-wrap gap-2">
              {budgets.map((budget) => (
                <button
                  key={budget}
                  type="button"
                  onClick={() => setFormState(prev => ({ ...prev, budget }))}
                  aria-pressed={formState.budget === budget}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    formState.budget === budget
                      ? 'bg-cypox-black text-white'
                      : 'border border-cypox-border text-cypox-gray hover:border-cypox-black hover:text-cypox-black'
                  }`}
                >
                  {budget}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-cypox-black mb-1">Décrivez votre projet</label>
            <textarea
              id="contact-message"
              name="message"
              value={formState.message}
              onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full px-5 py-4 rounded-xl border border-cypox-border text-cypox-black placeholder:text-cypox-gray/40 focus:outline-none focus:border-cypox-black transition-colors resize-none"
              placeholder="Objectifs, cible, fonctionnalités souhaitées..."
              required
              aria-required="true"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-10">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="text-sm font-medium text-cypox-gray hover:text-cypox-black transition-colors py-2 min-h-[44px] flex items-center"
          >
            ← Retour
          </button>
        ) : (
          <div />
        )}

        {step < 1 ? (
          <div className="text-right">
            <button
              type="button"
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-cypox-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-cypox-accent-hover transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] flex items-center"
            >
              Continuer
            </button>
            {!canProceed() && (
              <p className="text-xs text-cypox-gray mt-2">
                {step === 0 && 'Nom et email requis'}
              </p>
            )}
          </div>
        ) : (
          <button
            type="submit"
            disabled={sending || cooldown > 0 || !canProceed()}
            className="bg-cypox-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-cypox-accent-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center"
          >
            {sending ? 'Envoi...' : cooldown > 0 ? `Réessayez dans ${cooldown}s` : 'Envoyer ma demande'}
          </button>
        )}
      </div>
    </form>
  )
}
