import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { fetchProspect, updateProspectStatut, fetchAuditsByProspect, generateEmail, analyzeProspect, scoreProspect } from '../../lib/radseaApi'

function PhaseCard({ num, title, children }) {
  return (
    <div className="white-card rounded-[24px] p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{num}</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function DataRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs text-gray-900 font-medium text-right">{value ?? '—'}</span>
    </div>
  )
}

function ScoreBar({ value, max = 100 }) {
  const pct = (value / max) * 100
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${value > 70 ? 'bg-gray-900' : value > 40 ? 'bg-gray-400' : 'bg-gray-200'}`} style={{ width: `${pct}%` }}/>
      </div>
      <span className="text-gray-900 font-bold text-sm w-8 text-right">{value}</span>
    </div>
  )
}

export default function RADSEAProspectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [prospect, setProspect] = useState(null)
  const [loading, setLoading] = useState(true)
  const [validation, setValidation] = useState(null)
  const [audits, setAudits] = useState([])
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditRunning, setAuditRunning] = useState(false)
  const [aiEmail, setAiEmail] = useState(null)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiScore, setAiScore] = useState(null)
  const [aiLoading, setAiLoading] = useState(null)

  useEffect(() => {
    fetchProspect(id)
      .then((p) => {
        setProspect(p)
        if (p?.details?.collecte?.siteWeb) {
          setAuditLoading(true)
          fetchAuditsByProspect(p.id).then(setAudits).catch(console.error).finally(() => setAuditLoading(false))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleValidation = async (action) => {
    setValidation(action)
    const statutMap = { approved: 'Converti', modified: 'Relance', rejected: 'Rejeté' }
    try {
      await updateProspectStatut(prospect.id, statutMap[action])
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"/>
          <span className="text-xs text-gray-400">Chargement du prospect...</span>
        </div>
      </div>
    )
  }

  if (!prospect) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-sm">Prospect non trouvé</p>
        <button onClick={() => navigate('/radsea/prospects')} className="text-gray-500 text-sm mt-4 hover:text-gray-900 transition-colors">← Retour</button>
      </div>
    )
  }

  const d = prospect.details

  return (
    <>
      <header className="mb-8">
        <button onClick={() => navigate('/radsea/prospects')} className="text-gray-400 text-xs hover:text-gray-600 transition-colors mb-4 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          Retour aux prospects
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">{prospect.nom}</h1>
            <p className="text-gray-400 text-sm mt-1">{prospect.secteur} · {prospect.ville}</p>
          </div>
          <div className="text-right">
            <div className={`text-[40px] font-bold leading-none ${prospect.score > 70 ? 'text-gray-900' : prospect.score > 40 ? 'text-gray-500' : 'text-gray-300'}`}>{prospect.score}</div>
            <div className="text-xs text-gray-400 mt-1">Score / 100</div>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <PhaseCard num={1} title="Détection">
          <div className="grid grid-cols-3 gap-4"><DataRow label="Secteur" value={d.detection.secteur}/><DataRow label="Ville" value={d.detection.ville}/><DataRow label="Source" value={d.detection.source}/></div>
        </PhaseCard>

        <PhaseCard num={2} title="Collecte des informations">
          <div className="grid grid-cols-2 gap-x-6">
            <DataRow label="Nom" value={d.collecte.nom}/><DataRow label="Activité" value={d.collecte.activite}/>
            <DataRow label="Site web" value={d.collecte.siteWeb}/><DataRow label="Fiche Google" value={d.collecte.ficheGoogle ? 'Oui' : 'Non'}/>
            <DataRow label="Téléphone" value={d.collecte.telephone}/><DataRow label="Email" value={d.collecte.email}/>
          </div>
        </PhaseCard>

        <PhaseCard num={3} title="Analyse">
          {d.analyse.siteWeb && (
            <div className="mb-4">
              <h4 className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">Site web</h4>
              <div className="grid grid-cols-2 gap-x-6">
                <DataRow label="Vitesse" value={`${d.analyse.siteWeb.vitesse}/100`}/>
                <DataRow label="Design" value={d.analyse.siteWeb.design}/>
                <DataRow label="Responsive" value={d.analyse.siteWeb.responsive ? 'Oui' : 'Non'}/>
                <DataRow label="SEO" value={`${d.analyse.siteWeb.seo}/100`}/>
              </div>
            </div>
          )}
          <h4 className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">Référencement</h4>
          <div className="grid grid-cols-3 gap-4">
            <DataRow label="Visibilité" value={`${d.analyse.referencement.visibiliteLocale}/100`}/>
            <DataRow label="Fiche Google" value={d.analyse.referencement.ficheGoogle ? 'Oui' : 'Non'}/>
            <DataRow label="Cohérence" value={d.analyse.referencement.coherence}/>
          </div>
        </PhaseCard>

        {d.collecte.siteWeb && (
          <PhaseCard num={4} title="Audit du site web">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">{d.collecte.siteWeb}</p>
                <p className="text-[10px] text-gray-400 mt-1">{audits.length} audit(s) précédent(s)</p>
              </div>
              <button
                onClick={async () => {
                  setAuditRunning(true)
                  try {
                    const res = await fetch('/api/audit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url: d.collecte.siteWeb, prospect_id: prospect.id }),
                    })
                    const data = await res.json()
                    if (res.ok) {
                      setAudits(prev => [{ id: data.id, url: data.url, overall: data.overall, scores: data.scores, created_at: data.analyzedAt }, ...prev])
                    }
                  } catch (e) { console.error(e) }
                  finally { setAuditRunning(false) }
                }}
                disabled={auditRunning}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center gap-2"
              >
                {auditRunning ? (
                  <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyse...</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> Lancer un audit</>
                )}
              </button>
            </div>

            {auditLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> Chargement...
              </div>
            ) : audits.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Aucun audit pour le moment</p>
            ) : (
              <div className="space-y-2">
                {audits.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${a.overall >= 80 ? 'text-emerald-600' : a.overall >= 60 ? 'text-blue-600' : a.overall >= 40 ? 'text-amber-600' : 'text-red-600'}`}>{a.overall}</span>
                      <div>
                        <p className="text-[10px] text-gray-400">{new Date(a.created_at).toLocaleString('fr-FR')}</p>
                        <p className="text-[10px] text-gray-400">SEO {a.scores?.seo} · Perf {a.scores?.performance} · Secu {a.scores?.security}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/radsea/audit')}
                      className="text-[10px] text-gray-400 hover:text-gray-900 transition-colors"
                    >Voir →</button>
                  </div>
                ))}
              </div>
            )}
          </PhaseCard>
        )}

        <PhaseCard num={5} title="Intelligence artificielle">
          <div className="space-y-4">
            {/* Email generation */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-gray-700">Email de prospection</h4>
                <button
                  onClick={async () => {
                    setAiLoading('email')
                    try {
                      const email = await generateEmail(prospect)
                      setAiEmail(email)
                    } catch (e) { console.error(e) }
                    finally { setAiLoading(null) }
                  }}
                  disabled={aiLoading === 'email'}
                  className="px-3 py-1.5 bg-gray-900 text-white text-[10px] font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                >
                  {aiLoading === 'email' ? (
                    <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Génération...</>
                  ) : (
                    <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Générer</>
                  )}
                </button>
              </div>
              {aiEmail ? (
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{aiEmail}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(aiEmail)}
                    className="mt-3 text-[10px] text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                    Copier
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 italic">Cliquez sur "Générer" pour créer un email personnalisé</p>
              )}
            </div>

            {/* Analysis */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-gray-700">Analyse IA du prospect</h4>
                <button
                  onClick={async () => {
                    setAiLoading('analyze')
                    try {
                      const analysis = await analyzeProspect(prospect, audits[0] || null)
                      setAiAnalysis(analysis)
                    } catch (e) { console.error(e) }
                    finally { setAiLoading(null) }
                  }}
                  disabled={aiLoading === 'analyze'}
                  className="px-3 py-1.5 bg-gray-900 text-white text-[10px] font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                >
                  {aiLoading === 'analyze' ? (
                    <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyse...</>
                  ) : (
                    <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg> Analyser</>
                  )}
                </button>
              </div>
              {aiAnalysis ? (
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{aiAnalysis}</p>
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 italic">Cliquez sur "Analyser" pour obtenir un résumé intelligent</p>
              )}
            </div>

            {/* AI Score */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-gray-700">Score de conversion IA</h4>
                <button
                  onClick={async () => {
                    setAiLoading('score')
                    try {
                      const score = await scoreProspect(prospect, audits[0] || null)
                      setAiScore(score)
                    } catch (e) { console.error(e) }
                    finally { setAiLoading(null) }
                  }}
                  disabled={aiLoading === 'score'}
                  className="px-3 py-1.5 bg-gray-900 text-white text-[10px] font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                >
                  {aiLoading === 'score' ? (
                    <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Calcul...</>
                  ) : (
                    <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg> Évaluer</>
                  )}
                </button>
              </div>
              {aiScore ? (
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  {aiScore.raw ? (
                    <p className="text-xs text-gray-600 whitespace-pre-line">{aiScore.raw}</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Conversion</p>
                        <p className="text-lg font-bold text-gray-900">{aiScore.conversionProbability}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Confiance</p>
                        <p className="text-sm font-semibold text-gray-700">{aiScore.confidence}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-gray-400 uppercase">Action recommandée</p>
                        <p className="text-xs text-gray-600">{aiScore.recommendedAction}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-gray-400 uppercase">Valeur estimée</p>
                        <p className="text-sm font-bold text-gray-900">{aiScore.estimatedValue}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 italic">Cliquez sur "Évaluer" pour estimer le potentiel de conversion</p>
              )}
            </div>
          </div>
        </PhaseCard>

        <PhaseCard num={6} title="Opportunités">
          {d.opportunites && d.opportunites.length > 0 ? (
            <ul className="space-y-1.5">{d.opportunites.map((o, i) => <li key={i} className="flex items-start gap-2 text-xs text-gray-600"><span className="text-gray-900 mt-0.5">•</span>{o}</li>)}</ul>
          ) : <p className="text-gray-400 text-xs italic">Aucune opportunité majeure</p>}
        </PhaseCard>

        <PhaseCard num={7} title="Score intelligent">
          <ScoreBar value={d.score.total}/>
          <div className="grid grid-cols-2 gap-4 mt-3"><DataRow label="Potentiel" value={d.score.potentiel}/><DataRow label="Priorité" value={d.score.priorite}/></div>
        </PhaseCard>

        <PhaseCard num={8} title="Préparation de la proposition">
          {d.proposition.pret ? (
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">Message préparé</p>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{d.proposition.message}</p>
            </div>
          ) : <p className="text-gray-400 text-xs italic">Pas encore préparée</p>}
        </PhaseCard>

        <PhaseCard num={9} title="Validation humaine">
          {validation ? (
            <div className={`text-xs font-medium px-4 py-2.5 rounded-2xl ${validation === 'approved' ? 'bg-green-50 text-green-700' : validation === 'modified' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
              {validation === 'approved' ? 'Prospect approuvé' : validation === 'modified' ? 'Prospect en modification' : 'Prospect rejeté'}
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => handleValidation('approved')} className="px-5 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-2xl hover:bg-gray-800 transition-colors">Approuver</button>
              <button onClick={() => handleValidation('modified')} className="px-5 py-2.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-2xl hover:bg-gray-200 transition-colors">Modifier</button>
              <button onClick={() => handleValidation('rejected')} className="px-5 py-2.5 bg-gray-100 text-gray-400 text-xs font-semibold rounded-2xl hover:bg-gray-200 transition-colors">Rejeter</button>
            </div>
          )}
        </PhaseCard>

        <PhaseCard num={10} title="Suivi">
          <div className="space-y-2">
            {d.suivi.historique.filter(Boolean).map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-20 shrink-0">{h.date}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0"/>
                <span className="text-xs text-gray-600">{h.action}</span>
              </div>
            ))}
          </div>
          <div className="mt-3"><DataRow label="Statut actuel" value={d.suivi.statut}/></div>
        </PhaseCard>
      </div>
    </>
  )
}
