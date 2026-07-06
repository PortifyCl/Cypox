import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { fetchProspects, fetchAgents, fetchStats } from '../../lib/radseaApi'

export default function RADSEADashboard() {
  const [stats, setStats] = useState(null)
  const [agents, setAgents] = useState([])
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([fetchStats(), fetchAgents(), fetchProspects()])
      .then(([s, a, p]) => { setStats(s); setAgents(a); setProspects(p) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"/>
          <span className="text-xs text-gray-400">Chargement du dashboard...</span>
        </div>
      </div>
    )
  }

  const statusCounts = prospects.reduce((acc, p) => {
    acc[p.statut] = (acc[p.statut] || 0) + 1
    return acc
  }, {})

  const statCards = [
    { label: 'Prospects', value: stats.totalProspects, sub: 'détectés', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg> },
    { label: 'En analyse', value: stats.analysesEnCours, sub: 'en cours', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeDasharray="2 4"/></svg> },
    { label: 'Propositions', value: stats.propositionsEnvoyees, sub: 'envoyées', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> },
    { label: 'Conversion', value: stats.tauxConversion, sub: 'moyen', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18"/></svg> },
  ]

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Vue d'ensemble du système RADSEA</p>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => (
          <div key={s.label} className={`${i === 1 ? 'bg-white shadow-soft' : 'dark-card'} rounded-2xl p-5 text-center`}>
            <div className={`${i === 1 ? 'text-gray-400' : 'text-gray-300'} mb-2 flex justify-center`}>{s.icon}</div>
            <div className={`text-2xl font-bold mb-0.5 ${i === 1 ? 'text-gray-900' : 'text-white'}`}>{s.value}</div>
            <div className={`text-[10px] uppercase tracking-wider ${i === 1 ? 'text-gray-500' : 'text-gray-400'}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="dark-card rounded-[32px] p-8 shadow-soft">
            <h2 className="text-xl font-semibold mb-6">Overall Information</h2>
            <div className="flex items-center gap-8 mb-8">
              <div>
                <div className="text-[40px] font-bold leading-none mb-1">{stats.totalProspects}</div>
                <div className="text-xs text-gray-400">Prospects<br/>détectés</div>
              </div>
              <div className="w-px h-12 bg-gray-600"/>
              <div>
                <div className="text-[32px] font-bold leading-none mb-1">{stats.analysesEnCours}</div>
                <div className="text-xs text-gray-400">En cours<br/>d'analyse</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#3a3a3a] rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold mb-0.5">{stats.secteursCouverts}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Secteurs</div>
              </div>
              <div className="bg-white text-gray-900 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold mb-0.5">{stats.villesCouvertes}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Villes</div>
              </div>
              <div className="bg-[#3a3a3a] rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold mb-0.5">{stats.scoreMoyen}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Score moy.</div>
              </div>
            </div>
          </div>

          <div className="white-card rounded-[32px] p-8 shadow-soft flex-1">
            <h2 className="text-xl font-semibold mb-5">Agents spécialisés</h2>
            <div className="space-y-3">
              {agents.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${a.statut === 'Actif' ? 'bg-gray-900' : 'bg-gray-300'}`}/>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{a.nom}</span>
                      <span className="text-xs text-gray-400 ml-2">{a.role}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{a.traite}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="white-card rounded-[32px] p-8 shadow-soft">
            <h2 className="text-xl font-semibold mb-5">Pipeline</h2>
            <div className="space-y-3">
              {Object.entries(statusCounts).sort(([,a],[,b]) => b - a).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 font-medium">{status}</span>
                    <span className="text-xs text-gray-400">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-900 rounded-full" style={{ width: `${(count / stats.totalProspects) * 100}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="white-card rounded-[32px] p-8 shadow-soft flex-1">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold">Derniers prospects</h2>
              <span className="text-xs text-gray-400">Mis à jour il y a 2 minutes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-[10px] font-semibold text-gray-400 pb-3 uppercase tracking-wider">Nom</th>
                    <th className="text-[10px] font-semibold text-gray-400 pb-3 uppercase tracking-wider">Secteur</th>
                    <th className="text-[10px] font-semibold text-gray-400 pb-3 uppercase tracking-wider">Score</th>
                    <th className="text-[10px] font-semibold text-gray-400 pb-3 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {prospects.slice(0, 5).map((p) => (
                    <tr key={p.id} onClick={() => navigate(`/radsea/prospect/${p.id}`)} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors">
                      <td className="py-3 text-sm font-medium text-gray-900">{p.nom}</td>
                      <td className="py-3 text-sm text-gray-500">{p.secteur}</td>
                      <td className="py-3">
                        <span className={`text-sm font-bold ${p.score > 70 ? 'text-gray-900' : p.score > 40 ? 'text-gray-500' : 'text-gray-300'}`}>{p.score}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{p.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
