import { authenticate } from './_shared.js'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = authenticate(req, res)
  if (!supabase) return

  const { action, prospect, audit } = req.body

  if (!action || !prospect) {
    return res.status(400).json({ error: 'action and prospect are required' })
  }

  try {
    let prompt = ''

    if (action === 'email') {
      prompt = buildEmailPrompt(prospect)
    } else if (action === 'analyze') {
      prompt = buildAnalyzePrompt(prospect, audit)
    } else if (action === 'score') {
      prompt = buildScorePrompt(prospect, audit)
    } else {
      return res.status(400).json({ error: 'Invalid action: use email, analyze, or score' })
    }

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[AI] Gemini error:', err)
      return res.status(502).json({ error: 'Gemini API error', details: err })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return res.status(500).json({ error: 'No response from Gemini' })
    }

    return res.status(200).json({ result: text })
  } catch (err) {
    console.error('[AI] Handler error:', err)
    return res.status(500).json({ error: err.message })
  }
}

function buildEmailPrompt(prospect) {
  const d = prospect.details
  return `Tu es un expert en prospection commerciale pour CYPOX, un laboratoire de croissance web spécialisé dans les PME francophones (France, Belgique, Suisse).

Génère un email de prospection personnalisé pour ce prospect :

NOM: ${prospect.nom}
SECTEUR: ${prospect.secteur}
VILLE: ${prospect.ville}
SITE WEB: ${d.collecte.siteWeb || 'Aucun'}
ACTIVITÉ: ${d.collecte.activite}
SCORE: ${prospect.score}/100
POTENTIEL: ${d.score.potentiel}
STATUT ACTUEL: ${d.suivi.statut}

OPPORTUNITÉS DÉTECTÉES:
${d.opportunites?.map(o => `- ${o}`).join('\n') || 'Aucune'}

CONTEXTE CYPOX:
- On aide les PME à améliorer leur présence web
- Services: sites vitrines, SEO local, référencement Google
- Approche: audit gratuit + plan d'action concret
- Différenciation: résultats mesurables, pas de promesses vides

RÈGLES:
1. Email court et percutant (max 150 mots)
2. Personnalisé au secteur et à la situation du prospect
3. Mentionner un problème concret lié à leur site/situation
4. Proposer un audit gratuit ou un appel de 15min
5. Ton professionnel mais chaleureux
6. Pas de jargon technique excessif
7. Signature: CYPOX - Laboratoire de croissance web
8. Email de réponse: coffigildas268@gmail.com

Format: seulement le texte de l'email, pas de markdown, pas de sujet d'email.`
}

function buildAnalyzePrompt(prospect, audit) {
  const d = prospect.details
  const auditInfo = audit ? `
RÉSULTATS D'AUDIT RÉEL:
- Score global: ${audit.overall}/100
- SEO: ${audit.scores?.seo}/100
- Sécurité: ${audit.scores?.security}/100
- Performance: ${audit.scores?.performance}/100
- Accessibilité: ${audit.scores?.accessibility}/100
- Contenu: ${audit.scores?.content}/100
- Technique: ${audit.scores?.technical}/100

PROBLÈMES DÉTECTÉS:
SEO: ${audit.details?.seo?.issues?.join(', ') || 'Aucun'}
Sécurité: ${audit.details?.security?.issues?.join(', ') || 'Aucun'}
Performance: ${audit.details?.performance?.issues?.join(', ') || 'Aucun'}
` : 'Aucun audit réal disponible.'

  return `Tu es un analyste web expert pour CYPOX, un laboratoire de croissance web.

Analyse ce prospect et fournis un résumé intelligent :

PROSPECT: ${prospect.nom}
SECTEUR: ${prospect.secteur}
VILLE: ${prospect.ville}
SITE: ${d.collecte.siteWeb || 'Aucun'}
SCORE: ${prospect.score}/100
POTENTIEL: ${d.score.potentiel}
FICHE GOOGLE: ${d.collecte.ficheGoogle ? 'Oui' : 'Non'}
${auditInfo}

Donne :
1. UN RÉSUMÉ EN 2-3 PHRASES de la situation du prospect
2. LES 3 PRIORITÉS d'amélioration (les plus impactantes)
3. UN ARGUMENT DE VENTE CLÉ pour convaincre ce prospect
4. UN RISQUE À SURVEILLER

Réponds en français, sois concis et actionnable. Max 200 mots.`
}

function buildScorePrompt(prospect, audit) {
  const d = prospect.details
  return `Évalue le potentiel de conversion de ce prospect pour CYPOX.

PROSPECT: ${prospect.nom} (${prospect.secteur}, ${prospect.ville})
SITE: ${d.collecte.siteWeb || 'Aucun'}
FICHE GOOGLE: ${d.collecte.ficheGoogle ? 'Oui' : 'Non'}
SCORE ACTUEL: ${prospect.score}/100
OPPORTUNITÉS: ${d.opportunites?.join(', ') || 'Aucune'}
AUDIT: ${audit ? `${audit.overall}/100` : 'Non disponible'}

Donne UNIQUEMENT un JSON avec ces champs:
{
  "conversionProbability": <pourcentage 0-100>,
  "confidence": <faible|moyen|fort>,
  "recommendedAction": "<action prioritaire en 1 phrase>",
  "estimatedValue": "<valeur estimée en euros/mois>"
}

Pas de texte avant ou après le JSON.`
}
