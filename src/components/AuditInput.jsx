import { useState, useRef, useCallback } from 'react'
import { ArrowRight, Search, Shield, Zap, SearchCode, Eye, FileText, Settings } from 'lucide-react'
import { usePageTransition } from '../hooks/usePageTransition'

const categoryIcons = {
  seo: SearchCode,
  security: Shield,
  performance: Zap,
  accessibility: Eye,
  content: FileText,
  technical: Settings,
}

const categoryLabels = {
  seo: 'SEO',
  security: 'Sécurité',
  performance: 'Performance',
  accessibility: 'Accessibilité',
  content: 'Contenu',
  technical: 'Technique',
}

function getScoreColor(score) {
  if (score < 40) return { ring: 'text-red-500', bg: 'bg-red-50', label: 'Urgent' }
  if (score < 70) return { ring: 'text-orange-500', bg: 'bg-orange-50', label: 'À améliorer' }
  return { ring: 'text-green-500', bg: 'bg-green-50', label: 'Bon état' }
}

function getGrade(score) {
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

export default function AuditInput() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const resultRef = useRef(null)
  const transitionTo = usePageTransition()

  const handleAnalyze = useCallback(async () => {
    const input = url.trim()
    if (!input) return

    setAnalyzing(true)
    setError(null)
    setResult(null)

    let targetUrl = input
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl
    }

    try {
      new URL(targetUrl)
    } catch {
      setError('URL invalide. Veuillez entrer une adresse valide.')
      setAnalyzing(false)
      return
    }

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'analyse.')
        setAnalyzing(false)
        return
      }

      const domain = targetUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')
      setResult({ ...data, domain })
      setAnalyzing(false)

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    } catch {
      setError('Impossible de contacter le serveur. Réessayez plus tard.')
      setAnalyzing(false)
    }
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

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div ref={resultRef} className="mt-6 p-6 rounded-2xl bg-cypox-surface border border-cypox-border animate-[fadeSlideUp_0.5s_ease-out]">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreColor(result.overall).bg}`}>
                <span className={`text-2xl font-display font-bold ${getScoreColor(result.overall).ring}`}>{result.overall}</span>
              </div>
              <div>
                <p className="font-bold text-cypox-black">{result.domain}</p>
                <p className="text-xs text-cypox-gray">
                  Grade {getGrade(result.overall)} — {getScoreColor(result.overall).label}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-cypox-gray/60 italic hidden sm:block">
              {new Date(result.analyzedAt).toLocaleDateString('fr-FR')}
            </span>
          </div>

          {/* Category scores */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {Object.entries(result.scores).map(([key, value]) => {
              const Icon = categoryIcons[key]
              return (
                <div key={key} className="bg-white rounded-xl p-3 border border-cypox-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className="text-cypox-gray" />
                    <span className="text-[10px] font-medium text-cypox-gray uppercase tracking-wider">{categoryLabels[key]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-display font-bold ${value >= 70 ? 'text-green-600' : value >= 40 ? 'text-orange-500' : 'text-red-500'}`}>{value}</span>
                    <div className="flex-1 h-1.5 bg-cypox-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-orange-400' : 'bg-red-500'}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Issues summary */}
          {result.details && (
            <div className="mb-5">
              <p className="text-xs font-medium text-cypox-gray uppercase tracking-wider mb-3">Problèmes détectés</p>
              <div className="space-y-2">
                {Object.entries(result.details)
                  .filter(([, v]) => v.issues && v.issues.length > 0)
                  .slice(0, 3)
                  .map(([key, v]) => (
                    <div key={key} className="bg-white rounded-lg p-3 border border-cypox-border">
                      <span className="text-xs font-medium text-cypox-gray">{categoryLabels[key]}</span>
                      <ul className="mt-1 space-y-0.5">
                        {v.issues.slice(0, 2).map((issue, i) => (
                          <li key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                            <span className="mt-0.5 shrink-0">✗</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          )}

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
