import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { fetchProspects } from '../../lib/radseaApi'

const STATUTS = ['Tous', 'Nouveau', 'En analyse', 'Analysé', 'Proposition préparée', 'En attente validation', 'Contacté', 'Converti', 'Rejeté', 'Relance']

export default function RADSEAProspects() {
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statutFilter, setStatutFilter] = useState('Tous')
  const [secteurFilter, setSecteurFilter] = useState('Tous')
  const navigate = useNavigate()

  useEffect(() => {
    fetchProspects()
      .then(setProspects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const secteurs = useMemo(() => ['Tous', ...new Set(prospects.map(p => p.secteur))], [prospects])

  const filtered = useMemo(() => {
    let list = [...prospects]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.nom.toLowerCase().includes(q) || p.ville.toLowerCase().includes(q) || p.secteur.toLowerCase().includes(q))
    }
    if (statutFilter !== 'Tous') list = list.filter(p => p.statut === statutFilter)
    if (secteurFilter !== 'Tous') list = list.filter(p => p.secteur === secteurFilter)
    list.sort((a, b) => b.score - a.score)
    return list
  }, [prospects, search, statutFilter, secteurFilter])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"/>
          <span className="text-xs text-gray-400">Chargement des prospects...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">Prospects</h1>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} prospect(s) trouvé(s)</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 focus:shadow-soft transition-all w-64"
        />
        <select
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 appearance-none cursor-pointer"
        >
          {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={secteurFilter}
          onChange={(e) => setSecteurFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 appearance-none cursor-pointer"
        >
          {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="white-card rounded-[32px] overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-[10px] font-semibold text-gray-400 px-6 py-4 uppercase tracking-wider">Nom</th>
                <th className="text-[10px] font-semibold text-gray-400 px-6 py-4 uppercase tracking-wider">Secteur</th>
                <th className="text-[10px] font-semibold text-gray-400 px-6 py-4 uppercase tracking-wider">Ville</th>
                <th className="text-[10px] font-semibold text-gray-400 px-6 py-4 uppercase tracking-wider">Score</th>
                <th className="text-[10px] font-semibold text-gray-400 px-6 py-4 uppercase tracking-wider">Statut</th>
                <th className="text-[10px] font-semibold text-gray-400 px-6 py-4 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/radsea/prospect/${p.id}`)}
                  className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.secteur}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.ville}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${p.score > 70 ? 'text-gray-900' : p.score > 40 ? 'text-gray-500' : 'text-gray-300'}`}>{p.score}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{p.statut}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{p.date_decouverte}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">Aucun prospect trouvé</div>}
      </div>
    </>
  )
}
