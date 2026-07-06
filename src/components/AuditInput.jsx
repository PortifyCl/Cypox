import { useState, useRef, useCallback } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { usePageTransition } from '../hooks/usePageTransition'

const problems = [
  'Site non optimisé pour mobile (63% du trafic vient du mobile)',
  'Temps de chargement supérieur à 3 secondes (40% des visiteurs partent)',
  'Pas de formulaire de contact visible en moins de 3 clics',
  'Aucun référencement local Google (les clients proches ne vous trouvent pas)',
  'Images non compressées (ralentissent le site)',
  'Pas de page dédiée par service proposé',
  'Aucun appel à l\'action clair sur la page d\'accueil',
]

function getScore(domain) {
  let sum = 0
  for (let i = 0; i < domain.length; i++) sum += domain.charCodeAt(i)
  return 35 + (sum % 41)
}

function pickProblems(domain) {
  let sum = 0
  for (let i = 0; i < domain.length; i++) sum += domain.charCodeAt(i)
  const shuffled = [...problems].sort((_, b) => ((sum + b) % 7) - 3)
  return shuffled.slice(0, 4)
}

function getScoreColor(score) {
  if (score < 45) return { ring: 'text-red-500', bg: 'bg-red-50', label: 'Urgent' }
  if (score < 60) return { ring: 'text-orange-500', bg: 'bg-orange-50', label: 'À améliorer' }
  return { ring: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Peut mieux faire' }
}

function getOpportunity(domain) {
  let sum = 0
  for (let i = 0; i < domain.length; i++) sum += domain.charCodeAt(i)
  const visitors = 80 + (sum % 121)
  const conv = 1.5 + ((sum * 7) % 31) / 10
  const value = 500 + ((sum * 13) % 801)
  const leads = Math.round(visitors * conv / 100)
  const lost = Math.round(leads * value)
  return { visitors, conv: conv.toFixed(1), leads, lost }
}

export default function AuditInput() {
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
      const score = getScore(domain)
      const color = getScoreColor(score)
      const selectedProblems = pickProblems(domain)
      const opp = getOpportunity(domain)

      setResult({ domain, score, color, problems: selectedProblems, opp })
      setAnalyzing(false)

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }, 800)
  }, [url])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze()
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cypox-gray/40" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://votresite.com"
            className="w-full pl-11 pr-4 py-4 rounded-full border border-cypox-border bg-white text-cypox-black placeholder:text-cypox-gray/40 focus:outline-none focus:border-cypox-black transition-colors text-sm"
            aria-label="Adresse du site à analyser"
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing || !url.trim()}
          className="bg-cypox-black text-white px-6 py-4 rounded-full font-bold text-sm hover:bg-cypox-accent-hover transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2 shrink-0"
        >
          {analyzing ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Analyser<ArrowRight size={16} /></>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div ref={resultRef} className="mt-6 p-6 rounded-2xl bg-cypox-surface border border-cypox-border animate-[fadeSlideUp_0.5s_ease-out]">
          <p className="text-[10px] text-cypox-gray/60 mb-4 italic">Résultat indicatif — audit complet disponible sur demande.</p>
          {/* Domain + Score */}
          <div className="flex items-center gap-4 mb-5">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${result.color.bg}`}>
              <span className={`text-2xl font-display font-bold ${result.color.ring}`}>{result.score}</span>
            </div>
            <div>
              <p className="font-bold text-cypox-black">{result.domain}</p>
              <p className="text-xs text-cypox-gray">{result.color.label} — Score sur 100</p>
            </div>
          </div>

          {/* Problems */}
          <ul className="space-y-2 mb-5">
            {result.problems.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-cypox-text-muted">
                <span className="text-red-500 mt-0.5 shrink-0">✗</span>
                {p}
              </li>
            ))}
          </ul>

          {/* Opportunity */}
          <div className="p-4 rounded-xl bg-white border border-cypox-border mb-5">
            <p className="text-sm text-cypox-gray mb-1">Opportunité estimée</p>
            <p className="font-display font-bold text-cypox-black text-lg">
              ~{result.opp.lost.toLocaleString('fr-FR')}€ de CA potentiel perdu chaque mois
            </p>
            <p className="text-xs text-cypox-gray mt-1">
              {result.opp.visitors} visiteurs/mois × {result.opp.conv}% de conversion = {result.opp.leads} leads manqués
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => transitionTo('/#contact')}
            className="w-full sm:w-auto bg-cypox-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-cypox-accent-hover transition-all duration-300 min-h-[44px] flex items-center justify-center gap-2"
          >
            Voir notre plan d'action
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
