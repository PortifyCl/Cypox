import { useState, useEffect } from 'react'
import { fetchAgents } from '../../lib/radseaApi'

export default function RADSEAAgents() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
      .then(setAgents)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"/>
          <span className="text-xs text-gray-400">Chargement des agents...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">Agents spécialisés</h1>
        <p className="text-gray-400 text-sm mt-1">{agents.length} agents collaboratifs au service de RADSEA</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {agents.map((agent) => (
          <div key={agent.id} className="white-card rounded-[24px] p-6 shadow-soft hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${agent.statut === 'Actif' ? 'bg-gray-900' : 'bg-gray-300'}`}/>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{agent.nom}</h3>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${agent.statut === 'Actif' ? 'text-gray-900' : 'text-gray-400'}`}>{agent.statut}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4">{agent.role}</p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gray-900 rounded-full" style={{ width: `${Math.min(100, (agent.traite / 200) * 100)}%` }}/>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Traités: <span className="font-bold text-gray-900">{agent.traite}</span></span>
              <span className="text-gray-400">Erreurs: <span className={`font-bold ${agent.erreurs > 5 ? 'text-gray-900' : 'text-gray-500'}`}>{agent.erreurs}</span></span>
            </div>
          </div>
        ))}
      </div>

      <div className="white-card rounded-[32px] p-8 shadow-soft">
        <h2 className="text-xl font-semibold mb-5">Flux de travail</h2>
        <div className="flex flex-wrap items-center gap-3">
          {agents.map((a, i) => (
            <div key={a.id} className="flex items-center gap-2">
              <div className={`px-4 py-2 rounded-2xl text-xs font-semibold ${a.statut === 'Actif' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>{a.nom}</div>
              {i < agents.length - 1 && <span className="text-gray-300 text-xs">→</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
