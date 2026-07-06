import { useState, useEffect } from 'react'
import { fetchProspects, fetchAgents } from '../../lib/radseaApi'

function BarChart({ data }) {
  const maxVal = Math.max(...Object.values(data).map(v => v.count || 0))
  return (
    <div className="space-y-3">
      {Object.entries(data).sort(([,a],[,b]) => (b.count || 0) - (a.count || 0)).map(([name, d]) => {
        const count = d.count || d
        const avg = d.totalScore ? Math.round(d.totalScore / d.count) : null
        return (
          <div key={name}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-700 font-medium">{name}</span>
              <span className="text-xs text-gray-400">{count}{avg !== null ? ` · moy. ${avg}` : ''}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900 rounded-full" style={{ width: `${(count / maxVal) * 100}%` }}/>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function RADSEAAnalytics() {
  const [prospects, setProspects] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchProspects(), fetchAgents()])
      .then(([p, a]) => { setProspects(p); setAgents(a) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"/>
          <span className="text-xs text-gray-400">Chargement des analytics...</span>
        </div>
      </div>
    )
  }

  const total = prospects.length
  const avgScore = Math.round(prospects.reduce((s, p) => s + p.score, 0) / total)
  const highScore = prospects.filter(p => p.score > 70).length
  const converted = prospects.filter(p => p.statut === 'Converti').length
  const contacted = prospects.filter(p => p.statut === 'Contacté' || p.statut === 'Converti').length
  const totalTreated = agents.reduce((s, a) => s + a.traite, 0)
  const totalErrors = agents.reduce((s, a) => s + a.erreurs, 0)

  const kpis = [
    { label: 'Total', value: total, dark: true },
    { label: 'Score moyen', value: `${avgScore}`, dark: false },
    { label: 'Score > 70', value: highScore, dark: true },
    { label: 'Contactés', value: contacted, dark: false },
    { label: 'Convertis', value: converted, dark: true },
    { label: 'Conversion', value: `${Math.round((converted / total) * 100)}%`, dark: false },
    { label: 'Traitements', value: totalTreated, dark: true },
    { label: 'Erreurs', value: totalErrors, dark: false },
  ]

  const bySecteur = prospects.reduce((acc, p) => {
    if (!acc[p.secteur]) acc[p.secteur] = { count: 0, totalScore: 0 }
    acc[p.secteur].count++
    acc[p.secteur].totalScore += p.score
    return acc
  }, {})

  const byVille = prospects.reduce((acc, p) => {
    if (!acc[p.ville]) acc[p.ville] = { count: 0, totalScore: 0 }
    acc[p.ville].count++
    acc[p.ville].totalScore += p.score
    return acc
  }, {})

  const byStatut = prospects.reduce((acc, p) => { acc[p.statut] = (acc[p.statut] || 0) + 1; return acc }, {})

  return (
    <>
      <header className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Performances de la prospection RADSEA</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k, i) => (
          <div key={k.label} className={`${k.dark ? 'dark-card' : 'white-card'} rounded-2xl p-5 text-center shadow-soft`}>
            <div className={`text-2xl font-bold mb-0.5 ${k.dark ? 'text-white' : 'text-gray-900'}`}>{k.value}</div>
            <div className={`text-[10px] uppercase tracking-wider ${k.dark ? 'text-gray-400' : 'text-gray-500'}`}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="white-card rounded-[32px] p-8 shadow-soft">
          <h2 className="text-xl font-semibold mb-5">Par secteur</h2>
          <BarChart data={bySecteur}/>
        </div>
        <div className="white-card rounded-[32px] p-8 shadow-soft">
          <h2 className="text-xl font-semibold mb-5">Par ville</h2>
          <BarChart data={byVille}/>
        </div>
      </div>

      <div className="white-card rounded-[32px] p-8 shadow-soft">
        <h2 className="text-xl font-semibold mb-5">Répartition par statut</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {Object.entries(byStatut).sort(([,a],[,b]) => b - a).map(([statut, count]) => (
            <div key={statut} className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1 font-medium">{statut}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
