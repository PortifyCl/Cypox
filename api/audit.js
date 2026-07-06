import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url, prospect_id } = req.body
  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  let targetUrl = url.trim()
  if (!targetUrl.startsWith('http')) {
    targetUrl = 'https://' + targetUrl
  }

  try {
    new URL(targetUrl)
  } catch {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  try {
    const startTime = Date.now()
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'CYPOX-Audit/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    })
    const ttfb = Date.now() - startTime

    if (!response.ok) {
      return res.status(422).json({ error: `HTTP ${response.status}: ${response.statusText}` })
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return res.status(422).json({ error: `Not an HTML page (Content-Type: ${contentType})` })
    }

    const html = await response.text()
    const htmlSize = new TextEncoder().encode(html).length

    const result = analyzeHtml(html, targetUrl, ttfb, htmlSize, response.status)
    result.url = targetUrl
    result.analyzedAt = new Date().toISOString()

    const { data: saved, error: saveError } = await supabase
      .from('audits')
      .insert({
        url: result.url,
        overall: result.overall,
        scores: result.scores,
        details: result.details,
        prospect_id: prospect_id || null,
      })
      .select('id')
      .single()

    if (saveError) {
      console.error('[AUDIT] Save error:', saveError.message)
    } else {
      result.id = saved.id
    }

    return res.status(200).json(result)
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout — le site met plus de 15s à répondre' })
    }
    return res.status(500).json({ error: `Erreur: ${err.message}` })
  }
}

function analyzeHtml(html, url, ttfb, htmlSize, httpStatus) {
  const parser = { html, url }

  const seo = analyzeSEO(parser)
  const security = analyzeSecurity(parser)
  const performance = analyzePerformance(parser, ttfb, htmlSize)
  const accessibility = analyzeAccessibility(parser)
  const content = analyzeContent(parser)
  const technical = analyzeTechnical(parser, httpStatus)

  const scores = {
    seo: Math.round((seo.score / seo.total) * 100),
    security: Math.round((security.score / security.total) * 100),
    performance: Math.round((performance.score / performance.total) * 100),
    accessibility: Math.round((accessibility.score / accessibility.total) * 100),
    content: Math.round((content.score / content.total) * 100),
    technical: Math.round((technical.score / technical.total) * 100),
  }

  const overall = Math.round(
    (scores.seo * 0.3 + scores.security * 0.15 + scores.performance * 0.2 +
     scores.accessibility * 0.15 + scores.content * 0.1 + scores.technical * 0.1)
  )

  return {
    overall,
    scores,
    details: { seo, security, performance, accessibility, content, technical },
  }
}

function analyzeSEO(p) {
  let score = 0, total = 0
  const issues = []
  const good = []

  const title = extractMeta(p.html, 'title')
  total++; if (title && title.length >= 30 && title.length <= 60) { score++; good.push('Title optimal (30-60 chars)') }
  else issues.push(title ? `Title ${title.length} chars (idéal: 30-60)` : 'Pas de title')

  const desc = extractMetaByName(p.html, 'description')
  total++; if (desc && desc.length >= 120 && desc.length <= 160) { score++; good.push('Meta description optimale') }
  else issues.push(desc ? `Description ${desc.length} chars (idéal: 120-160)` : 'Pas de meta description')

  total++
  const canonical = p.html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
  if (canonical) { score++; good.push('URL canonique définie') } else issues.push('Pas de canonical URL')

  total++
  const ogTitle = p.html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
  const ogDesc = p.html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
  const ogImage = p.html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
  if (ogTitle && ogDesc && ogImage) { score++; good.push('Open Graph complet') }
  else issues.push('Open Graph incomplet')

  total++
  const twitterCard = p.html.match(/<meta[^>]*name=["']twitter:card["']/i)
  if (twitterCard) { score++; good.push('Twitter Card présente') } else issues.push('Pas de Twitter Card')

  total++
  const h1 = p.html.match(/<h1[\s>]/i)
  if (h1) { score++; good.push('Balise H1 présente') } else issues.push('Pas de H1')

  total++
  const schemaOrg = p.html.match(/application\/ld\+json/i)
  if (schemaOrg) { score++; good.push('Schema.org présent') } else issues.push('Pas de Schema.org')

  total++
  const robots = p.html.match(/<meta[^>]*name=["']robots["']/i)
  if (robots) { score++; good.push('Balise robots présente') } else issues.push('Pas de balise robots')

  return { score, total, issues, good }
}

function analyzeSecurity(p) {
  let score = 0, total = 0
  const issues = []
  const good = []

  total++
  if (p.url.startsWith('https://')) { score++; good.push('HTTPS actif') } else issues.push('Pas de HTTPS')

  total++
  const csp = p.html.match(/<meta[^>]*http-equiv=["']Content-Security-Policy["']/i)
  if (csp) { score++; good.push('CSP configuré') } else issues.push('Pas de Content-Security-Policy')

  total++
  const xFrame = p.html.match(/<meta[^>]*http-equiv=["']X-Frame-Options["']/i)
  if (xFrame) { score++; good.push('X-Frame-Options présent') } else issues.push('Pas de X-Frame-Options')

  total++
  const referrer = p.html.match(/<meta[^>]*name=["']referrer["']/i)
  if (referrer) { score++; good.push('Politique referrer définie') } else issues.push('Pas de politique referrer')

  total++
  const mixedContent = p.html.match(/http:\/\/[^"'\s]+/gi)
  if (!mixedContent || mixedContent.length === 0) { score++; good.push('Pas de mixed content') }
  else issues.push(`${mixedContent.length} ressource(s) en HTTP`)

  return { score, total, issues, good }
}

function analyzePerformance(p, ttfb, htmlSize) {
  let score = 0, total = 0
  const issues = []
  const good = []

  total++
  if (ttfb < 800) { score++; good.push(`TTFB: ${ttfb}ms (excellent)`) }
  else if (ttfb < 2000) { score += 0.5; good.push(`TTFB: ${ttfb}ms (acceptable)`) }
  else issues.push(`TTFB: ${ttfb}ms (lent)`)

  total++
  if (htmlSize < 100000) { score++; good.push(`HTML: ${(htmlSize/1024).toFixed(1)}KB`) }
  else issues.push(`HTML trop volumineux: ${(htmlSize/1024).toFixed(1)}KB`)

  total++
  const images = (p.html.match(/<img[\s>]/gi) || []).length
  const lazyImages = (p.html.match(/loading=["']lazy["']/gi) || []).length
  if (images === 0 || lazyImages >= images * 0.5) { score++; good.push('Lazy loading configuré') }
  else issues.push(`${images - lazyImages} image(s) sans lazy loading`)

  total++
  const inlineStyles = (p.html.match(/style=["']/gi) || []).length
  if (inlineStyles < 10) { score++; good.push('Peu de styles inline') }
  else issues.push(`${inlineStyles} style(s) inline détecté(s)`)

  total++
  const scripts = (p.html.match(/<script[\s>]/gi) || []).length
  const asyncScripts = (p.html.match(/<(script[^>]*\b(async|defer)[^>]*>|script[^>]*>.*?<\/script>)/gi) || []).length
  if (scripts === 0 || asyncScripts >= scripts * 0.5) { score++; good.push('Scripts asynchrones') }
  else issues.push(`${scripts} script(s) bloquant(s)`)

  return { score, total, issues, good }
}

function analyzeAccessibility(p) {
  let score = 0, total = 0
  const issues = []
  const good = []

  total++
  const lang = p.html.match(/<html[^>]*lang=["']([^"']+)["']/i)
  if (lang) { score++; good.push(`Langue définie: ${lang[1]}`) } else issues.push('Pas de attribut lang sur <html>')

  total++
  const images = (p.html.match(/<img[\s>]/gi) || []).length
  const altImages = (p.html.match(/<img[^>]*alt=["'][^"']+["']/gi) || []).length
  if (images === 0 || altImages >= images * 0.8) { score++; good.push('Images avec alt text') }
  else issues.push(`${images - altImages} image(s) sans alt`)

  total++
  const forms = (p.html.match(/<form[\s>]/gi) || []).length
  const labels = (p.html.match(/<label[\s>]/gi) || []).length
  if (forms === 0 || labels >= forms) { score++; good.push('Forms avec labels') }
  else issues.push(`${forms - labels} formulaire(s) sans label`)

  total++
  const viewport = p.html.match(/<meta[^>]*name=["']viewport["']/i)
  if (viewport) { score++; good.push('Viewport configuré') } else issues.push('Pas de meta viewport')

  total++
  const skipLink = p.html.match(/aller au contenu|skip to content|skip-link/i)
  if (skipLink) { score++; good.push('Lien skip-to-content présent') }
  else issues.push('Pas de lien skip-to-content')

  return { score, total, issues, good }
}

function analyzeContent(p) {
  let score = 0, total = 0
  const issues = []
  const good = []

  total++
  const bodyText = p.html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = bodyText.split(' ').filter(w => w.length > 0).length
  if (wordCount >= 300) { score++; good.push(`${wordCount} mots (excellent)`) }
  else if (wordCount >= 100) { score += 0.5; good.push(`${wordCount} mots (minimum)`) }
  else issues.push(`${wordCount} mots (insuffisant, minimum 300)`)

  total++
  const images = (p.html.match(/<img[\s>]/gi) || []).length
  if (images >= 1) { score++; good.push(`${images} image(s)`) } else issues.push('Aucune image')

  total++
  const links = (p.html.match(/<a[\s>]/gi) || []).length
  if (links >= 3) { score++; good.push(`${links} lien(s)`) } else issues.push('Trop peu de liens')

  total++
  const hasContact = p.html.match(/contact|email|téléphone|phone|mailto/i)
  if (hasContact) { score++; good.push('Informations de contact trouvées') }
  else issues.push('Pas d\'infos de contact visibles')

  return { score, total, issues, good }
}

function analyzeTechnical(p, httpStatus) {
  let score = 0, total = 0
  const issues = []
  const good = []

  total++
  if (httpStatus === 200) { score++; good.push(`HTTP ${httpStatus} OK`) } else issues.push(`HTTP ${httpStatus}`)

  total++
  const charset = p.html.match(/<meta[^>]*charset=["']([^"']+)["']/i)
  if (charset) { score++; good.push(`Charset: ${charset[1]}`) } else issues.push('Pas de charset')

  total++
  const doctype = p.html.match(/<!DOCTYPE/i)
  if (doctype) { score++; good.push('DOCTYPE présent') } else issues.push('Pas de DOCTYPE')

  total++
  const favicon = p.html.match(/<link[^>]*rel=["'][^"']*icon[^"']*["']/i)
  if (favicon) { score++; good.push('Favicon présent') } else issues.push('Pas de favicon')

  total++
  const sitemap = p.html.match(/sitemap/i)
  if (sitemap) { score++; good.push('Référence sitemap') } else issues.push('Pas de référence sitemap')

  return { score, total, issues, good }
}

function extractMeta(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i'))
  return match ? match[1].trim() : null
}

function extractMetaByName(html, name) {
  const match = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i'))
  return match ? match[1].trim() : null
}
