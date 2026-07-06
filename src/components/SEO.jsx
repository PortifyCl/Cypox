import { Helmet } from 'react-helmet-async'
import { SITE_URL, EMAIL, PHONE_RAW, WHATSAPP_URL, TIKTOK_URL } from '../config'

const DEFAULT = {
  title: 'CYPOX — Laboratoire de croissance web | Europe francophone',
  description: 'Chaque entreprise laisse des opportunités sur Internet. Nous les trouvons. Analyse, expériences web sur mesure et stratégies qui transforment vos visiteurs en clients.',
  url: SITE_URL,
  image: `${SITE_URL}/og-image.webp`,
}

const servicesCatalog = [
  {
    '@type': 'Service',
    name: 'Audit de présence en ligne',
    description: 'Analyse complète de votre présence numérique, concurrence et opportunités de croissance. Rapport détaillé en 48h.',
    provider: { '@type': 'Organization', name: 'CYPOX' },
    areaServed: ['FR', 'BE', 'CH'],
  },
  {
    '@type': 'Service',
    name: 'Conception d\'expériences web',
    description: 'Design sur mesure d\'interfaces qui convertissent vos visiteurs en clients. Prototypes interactifs validés ensemble.',
    provider: { '@type': 'Organization', name: 'CYPOX' },
    areaServed: ['FR', 'BE', 'CH'],
  },
  {
    '@type': 'Service',
    name: 'Développement web sur mesure',
    description: 'Développement de sites performants, applications web et landing pages optimisées pour la conversion.',
    provider: { '@type': 'Organization', name: 'CYPOX' },
    areaServed: ['FR', 'BE', 'CH'],
  },
  {
    '@type': 'Service',
    name: 'SEO Local et référencement',
    description: 'Optimisation pour apparaître dans les résultats Google de votre ville. Référencement local pour PME et artisans.',
    provider: { '@type': 'Organization', name: 'CYPOX' },
    areaServed: ['FR', 'BE', 'CH'],
  },
  {
    '@type': 'Service',
    name: 'Automatisation et maintenance',
    description: 'Formulaires intelligents, notifications WhatsApp, hébergement, mises à jour et support continu 6 mois.',
    provider: { '@type': 'Organization', name: 'CYPOX' },
    areaServed: ['FR', 'BE', 'CH'],
  },
]

const defaultJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'CYPOX',
  description: DEFAULT.description,
  url: DEFAULT.url,
  logo: `${DEFAULT.url}/Logo.webp`,
  image: DEFAULT.image,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
  },
  areaServed: ['FR', 'BE', 'CH'],
  priceRange: '€€',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: EMAIL,
    telephone: `+${PHONE_RAW}`,
    availableLanguage: ['French', 'English'],
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services de croissance web CYPOX',
    itemListElement: servicesCatalog.map((service, index) => ({
      '@type': 'Offer',
      position: index + 1,
      itemOffered: service,
    })),
  },
  knowsAbout: [
    'Audit de site web',
    'Design UI/UX',
    'Développement web',
    'SEO local',
    'Conversion rate optimization',
    'Automatisation marketing',
    'Branding',
    'Graphisme',
  ],
  sameAs: [
    TIKTOK_URL,
    WHATSAPP_URL,
  ],
}

export function createProcessSchema(phases) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Notre méthode en 3 phases',
    description: 'Détection, Conception, Déploiement — Notre processus pour transformer votre présence en ligne en outil de croissance.',
    step: phases.map((phase, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: phase.title,
      text: `${phase.subtitle}. ${phase.items.join(' ')} Résultat : ${phase.result}`,
      url: `${SITE_URL}/methode#phase-${phase.num}`,
    })),
  }
}

export function createCaseStudySchema(project) {
  const isImage = project.screenshot && !project.screenshot.endsWith('.html')
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    creator: {
      '@type': 'Organization',
      name: 'CYPOX',
      url: SITE_URL,
    },
    about: project.category,
    genre: project.subcategory,
    url: `${SITE_URL}/transformations`,
    image: isImage ? `${SITE_URL}${project.screenshot}` : undefined,
  }
}

export default function SEO({ title, description, url, image, jsonLd, noindex }) {
  const t = title || DEFAULT.title
  const d = description || DEFAULT.description
  const u = url ? (url.startsWith('http') ? url : `${SITE_URL}${url}`) : DEFAULT.url
  const img = image || DEFAULT.image

  const ld = jsonLd || defaultJsonLd

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:url" content={u} />
      <meta property="og:image" content={img} />
      <meta property="og:site_name" content="CYPOX" />
      <meta property="og:locale" content="fr_FR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@paul_coffi" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
      <link rel="canonical" href={u} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c').replace(/>/g, '\\u003e') }} />
    </Helmet>
  )
}