import { useState, useEffect } from 'react'
import { fetchAudits, deleteAudit } from '../../lib/radseaApi'

const SCORE_COLORS = {
  excellent: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' },
  good: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' },
  medium: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' },
  bad: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50', border: 'border-red-200' },
}

function getScoreColor(score) {
  if (score >= 80) return SCORE_COLORS.excellent
  if (score >= 60) return SCORE_COLORS.good
  if (score >= 40) return SCORE_COLORS.medium
  return SCORE_COLORS.bad
}

function ScoreRing({ score, size = 80 }) {
  const color = getScoreColor(score)
  const circumference = 2 * Math.PI * 34
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="40" cy="40" r="34" fill="none"
          stroke="currentColor" strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color.text} transition-all duration-1000`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold ${color.text}`}>{score}</span>
      </div>
    </div>
  )
}

function CategoryCard({ title, score, issues, good }) {
  const color = getScoreColor(score)

  return (
    <div className={`p-5 rounded-2xl border ${color.border} ${color.light}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className={`text-2xl font-bold ${color.text}`}>{score}%</span>
      </div>

      {good.length > 0 && (
        <div className="mb-3">
          {good.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-emerald-700 mb-1">
              <span className="mt-0.5">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {issues.length > 0 && (
        <div>
          {issues.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-red-600 mb-1">
              <span className="mt-0.5">✗</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RADSEAAudit() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    fetchAudits(20)
      .then(setHistory)
      .catch(console.error)
      .finally(() => setHistoryLoading(false))
  }, [])

  const handleAudit = async () => {
    if (!url.trim() || loading) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'audit')
      }

      setResult(data)

      const newAudit = {
        id: data.id,
        url: data.url,
        overall: data.overall,
        scores: data.scores,
        created_at: data.analyzedAt,
      }
      setHistory(prev => [newAudit, ...prev].slice(0, 20))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteAudit(id)
      setHistory(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const loadAudit = (audit) => {
    setResult({
      url: audit.url,
      overall: audit.overall,
      scores: audit.scores,
      details: audit.details,
      analyzedAt: audit.created_at,
      id: audit.id,
    })
    setUrl(audit.url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit de site web</h1>
        <p className="text-sm text-gray-500 mt-1">Analyse SEO, sécurité, performance et accessibilité</p>
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
          placeholder="https://exemple.com"
          className="flex-1 px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm"
          disabled={loading}
        />
        <button
          onClick={handleAudit}
          disabled={loading || !url.trim()}
          className="px-6 py-3.5 rounded-2xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyse...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Analyser
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-[fadeSlideUp_0.4s_ease-out]">
          {/* Overall Score */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center gap-6">
              <ScoreRing score={result.overall} size={90} />
              <div>
                <h2 className="text-lg font-bold text-gray-900">{result.url}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Score global: <span className={`font-bold ${getScoreColor(result.overall).text}`}>{result.overall}/100</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Analysé le {new Date(result.analyzedAt).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CategoryCard
              title="SEO"
              score={result.scores.seo}
              issues={result.details.seo.issues}
              good={result.details.seo.good}
            />
            <CategoryCard
              title="Sécurité"
              score={result.scores.security}
              issues={result.details.security.issues}
              good={result.details.security.good}
            />
            <CategoryCard
              title="Performance"
              score={result.scores.performance}
              issues={result.details.performance.issues}
              good={result.details.performance.good}
            />
            <CategoryCard
              title="Accessibilité"
              score={result.scores.accessibility}
              issues={result.details.accessibility.issues}
              good={result.details.accessibility.good}
            />
            <CategoryCard
              title="Contenu"
              score={result.scores.content}
              issues={result.details.content.issues}
              good={result.details.content.good}
            />
            <CategoryCard
              title="Technique"
              score={result.scores.technical}
              issues={result.details.technical.issues}
              good={result.details.technical.good}
            />
          </div>
        </div>
      )}

      {/* History from Supabase */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Audits récents</h3>
        {historyLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            Chargement...
          </div>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun audit pour le moment</p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-colors group"
              >
                <button
                  onClick={() => loadAudit(item)}
                  className="flex-1 text-left flex items-center justify-between"
                >
                  <span className="text-sm text-gray-700 truncate">{item.url}</span>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`text-sm font-bold ${getScoreColor(item.overall).text}`}>{item.overall}</span>
                    <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="ml-3 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Supprimer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
