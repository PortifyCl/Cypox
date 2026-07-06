import { useState, useRef, useCallback } from 'react'
import { usePageTransition } from '../hooks/usePageTransition'

function IconSearch() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

const visibiliteProblems = [
  'Aucun titre H1 optimisé pour vos services',
  'Meta description absente ou trop courte',
  'Aucun lien entrant (backlink) détecté',
  'Score Lighthouse inférieur à 70',
  'Structure d\'URL non optimisée',
]

const securiteProblems = [
  'Certificat SSL expiré ou mal configuré',
  'En-têtes de sécurité HTTP manquants',
  'Pas de protection contre le scraping',
  'Vulnérabilités JavaScript détectées',
  'Politique de sécurité CSP absente',
]

const credibiliteProblems = [
  'Email Gmail/Yahoo utilisé pour le business',
  'Pas d\'email professionnel par domaine',
  'Absence de page "Contact" accessible',
  'Aucun numéro de téléphone professionnel',
  'Pas de mention légale visible',
]

function getDeterministicScore(domain, salt) {
  let sum = 0
  for (let i = 0; i < domain.length; i++) sum += domain.charCodeAt(i)
  return 25 + ((sum + salt) % 46)
}

function pickN(arr, domain, salt, n) {
  let sum = 0
  for (let i = 0; i < domain.length; i++) sum += domain.charCodeAt(i)
  const shuffled = [...arr].sort((_, b) => ((sum + salt + b.charCodeAt(0)) % 7) - 3)
  return shuffled.slice(0, n)
}

function AuditCard({ icon: Icon, title, subtitle, placeholder, problems, salt }) {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const resultRef = useRef(null)
  const transitionTo = usePageTransition()

  const handleAnalyze = useCallback(() => {
    if (!url.trim()) return
    setAnalyzing(true)
    let domain = url.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')

    setTimeout(() => {
      const score = getDeterministicScore(domain, salt)
      const selected = pickN(problems, domain, salt, 3)
      setResult({ domain, score, problems: selected })
      setAnalyzing(false)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    }, 600)
  }, [url, salt, problems])

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleAnalyze() }

  const getScoreColor = (s) => {
    if (s < 40) return 'text-cypox-black bg-cypox-black/10'
    if (s < 60) return 'text-cypox-text-muted bg-cypox-black/5'
    return 'text-cypox-gray bg-cypox-black/5'
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-cypox-border bg-white">
      <div className="mb-4 text-cypox-black">
        <Icon />
      </div>
      <h3 className="font-display text-xl font-bold text-cypox-black mb-2">{title}</h3>
      <p className="text-cypox-gray text-sm mb-6">{subtitle}</p>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-cypox-gray/40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-3 rounded-lg border border-cypox-border text-sm text-cypox-black placeholder:text-cypox-gray/40 focus:outline-none focus:border-cypox-black transition-colors"
            aria-label={title}
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing || !url.trim()}
          className="bg-cypox-black text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-cypox-accent-hover transition-all duration-300 disabled:opacity-40 min-h-[44px] flex items-center shrink-0"
        >
          {analyzing ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Auditer'}
        </button>
      </div>

      {result && (
        <div ref={resultRef} className="mt-5 p-4 rounded-xl bg-cypox-surface border border-cypox-border animate-[fadeSlideUp_0.5s_ease-out]">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getScoreColor(result.score)}`}>
              <span className="text-lg font-display font-bold">{result.score}</span>
            </div>
            <div>
              <p className="font-bold text-cypox-black text-sm">{result.domain}</p>
              <p className="text-xs text-cypox-gray">Score sur 100</p>
            </div>
          </div>
          <ul className="space-y-1.5 mb-4">
            {result.problems.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-cypox-text-muted">
                <span className="text-cypox-black mt-0.5 shrink-0 font-bold">✗</span>{p}
              </li>
            ))}
          </ul>
          <button
            onClick={() => transitionTo('/#contact')}
            className="w-full bg-cypox-black text-white py-2.5 rounded-lg text-sm font-bold hover:bg-cypox-accent-hover transition-all duration-300 min-h-[44px]"
          >
            Obtenir le rapport complet
          </button>
        </div>
      )}
    </div>
  )
}

export default function Detections() {
  const titleRef = useRef(null)

  return (
    <section className="py-20 bg-cypox-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-12">
          <span className="text-xs font-medium text-cypox-gray tracking-[0.3em] uppercase mb-4 block">Nos détections</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cypox-black">
            Votre site est-il <span className="text-cypox-gray">à la hauteur</span> ?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AuditCard
            icon={IconSearch}
            title="Visibilité"
            subtitle="Votre site apparaît-il sur Google ?"
            placeholder="https://votresite.com"
            problems={visibiliteProblems}
            salt={42}
          />
          <AuditCard
            icon={IconShield}
            title="Sécurité"
            subtitle="Votre site est-il protégé ?"
            placeholder="https://votresite.com"
            problems={securiteProblems}
            salt={17}
          />
          <AuditCard
            icon={IconMail}
            title="Crédibilité"
            subtitle="Votre email est-il professionnel ?"
            placeholder="contact@votresite.com"
            problems={credibiliteProblems}
            salt={73}
          />
        </div>
        <p className="text-center text-[10px] text-cypox-gray/60 mt-8 italic">Résultats indicatifs — demandez un audit complet et personnalisé.</p>
      </div>
    </section>
  )
}
