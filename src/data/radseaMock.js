const STATUSES = ['Nouveau', 'En analyse', 'Analysé', 'Proposition préparée', 'En attente validation', 'Contacté', 'Relance', 'Converti', 'Rejeté']
const SECTEURS = ['Bâtiment', 'Médical', 'Restaurant', 'Hôtel', 'Immobilier', 'Profession libérale', 'Commerce', 'Services']
const VILLES = ['Paris', 'Lyon', 'Marseille', 'Bruxelles', 'Genève', 'Bordeaux', 'Nantes', 'Lille', 'Strasbourg', 'Toulouse']

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick(arr) { return arr[rand(0, arr.length - 1)] }

const nomsEntreprises = [
  'Cabinet Dr. Martin', 'Boulangerie Pain Doré', 'Garage Auto Plus', 'Cabinet Dentaire Sorbonne',
  'Restaurant Le Bistrot', 'Pharmacie Centrale', 'Agence Immobilière BelVilla', 'Salon Coiffure Élégance',
  'Menuiserie Bois & Co', 'Cabinet Vétérinaire', 'Pizzeria Napoli', 'Hotel Le Petit Paris',
  'Avocat & Associés', 'Architecte Studio', 'Fleuriste Jardin Magique', 'Librairie Les Pages',
  'Coach Bien-Être', 'Comptabilité Plus', 'Jardinage Vert Présent', 'Traiteur Saveurs',
  'Photographe Studio', 'Consultant Digital', 'Courtier AssurPro', 'École de Musique',
  'Gym Fitness Plus', 'Imprimerie Rapide', 'Jeu Vidéo Studio', 'Kinesithérapie Active',
  'Laboratoire Analyse', 'Médecine Douce', 'Nettoyage Pro', 'Opticien Vue Claire',
  'Peinture Déco', 'Quincaillerie Bricol', 'Restaurant Asiatique', 'Salle de Sport',
  'Taxi Express', 'Union Commerçants', 'Vétérinaire Animalie', 'Wedding Planner'
]

const prenoms = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Antoine', 'Julie', 'Nicolas', 'Camille']

function generateProspects(count) {
  return Array.from({ length: count }, (_, i) => {
    const nom = nomsEntreprises[i % nomsEntreprises.length]
    const secteur = pick(SECTEURS)
    const ville = pick(VILLES)
    const hasSite = Math.random() > 0.3
    const score = rand(15, 98)
    const status = pick(STATUSES)

    return {
      id: i + 1,
      nom,
      secteur,
      ville,
      telephone: `+33 ${rand(1, 6)} ${rand(10, 99)} ${rand(10, 99)} ${rand(10, 99)} ${rand(10, 99)}`,
      email: `contact@${nom.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)}.fr`,
      siteWeb: hasSite ? `https://${nom.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}.fr` : null,
      ficheGoogle: Math.random() > 0.4,
      score,
      statut: status,
      dateDecouverte: `${rand(1, 28)}/0${rand(1, 6)}/2026`,
      details: {
        detection: {
          secteur,
          ville,
          source: pick(['Google Maps', 'Pages Jaunes', 'LinkedIn', 'Annuaire', 'Réseaux sociaux']),
        },
        collecte: {
          nom,
          activite: secteur,
          localisation: ville,
          siteWeb: hasSite ? `https://${nom.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}.fr` : 'Aucun',
          ficheGoogle: Math.random() > 0.4,
          telephone: `+33 ${rand(1, 6)} ${rand(10, 99)} ${rand(10, 99)} ${rand(10, 99)} ${rand(10, 99)}`,
          email: Math.random() > 0.5 ? `contact@${nom.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)}.fr` : null,
          reseaux: pick([['Facebook'], ['Instagram'], ['LinkedIn'], ['Facebook', 'Instagram'], ['Aucun']]),
        },
        analyse: {
          siteWeb: hasSite ? {
            vitesse: rand(20, 90),
            design: pick(['Obsolète', 'Basique', 'Correct', 'Moderne']),
            responsive: Math.random() > 0.4,
            seo: rand(10, 80),
            accessibilite: rand(15, 70),
            cta: pick(['Aucun', 'Faible', 'Correct', 'Bon']),
            formulaires: Math.random() > 0.5,
          } : null,
          referencement: {
            visibiliteLocale: rand(5, 60),
            ficheGoogle: Math.random() > 0.4,
            coherence: pick(['Faible', 'Moyen', 'Bon']),
          },
          image: {
            qualiteVisuels: pick(['Faible', 'Moyen', 'Bon']),
            temoignages: Math.random() > 0.6,
            identiteGraphique: pick(['Absente', 'Incohérente', 'Correcte', 'Professionnelle']),
          },
        },
        opportunites: [
          hasSite && Math.random() > 0.7 ? 'Site obsolète nécessitant une refonte' : null,
          !hasSite ? 'Aucun site internet' : null,
          Math.random() > 0.6 ? 'Formulaire de contact absent ou inefficace' : null,
          Math.random() > 0.5 ? 'Faible référencement local' : null,
          Math.random() > 0.7 ? 'Absence de prise de rendez-vous en ligne' : null,
          Math.random() > 0.6 ? 'Site lent' : null,
          Math.random() > 0.8 ? 'Pas de témoignages clients' : null,
        ].filter(Boolean),
        score: {
          total: score,
          potentiel: score > 70 ? 'Élevé' : score > 40 ? 'Moyen' : 'Faible',
          priorite: score > 70 ? 'Haute' : score > 40 ? 'Moyenne' : 'Basse',
        },
        proposition: {
          pret: status === 'Proposition préparée' || status === 'En attente validation' || status === 'Contacté',
          message: `Bonjour ${pick(prenoms)},\n\nJ'ai remarqué que votre ${secteur.toLowerCase()} à ${ville} pourrait bénéficier d'une meilleure présence en ligne. CYPOX peut vous aider à attirer plus de clients grâce à un site web professionnel et optimisé.\n\nSouhaitez-vous en discuter ?`,
          auditPret: score > 50,
        },
        suivi: {
          statut: status,
          historique: [
            { date: '01/01/2026', action: 'Découverte du prospect' },
            { date: '02/01/2026', action: 'Analyse automatique lancée' },
            ...(status !== 'Nouveau' ? [{ date: '03/01/2026', action: 'Analyse terminée' }] : []),
            ...(status === 'Contacté' || status === 'Converti' ? [{ date: '05/01/2026', action: 'Prise de contact' }] : []),
          ],
        },
      },
    }
  })
}

export const mockProspects = generateProspects(42)

export const mockAgents = [
  { id: 'radar', nom: 'Radar', role: 'Détecte les entreprises', statut: 'Actif', traite: rand(120, 200), erreurs: rand(0, 5) },
  { id: 'collect', nom: 'Collect', role: 'Rassemble les informations', statut: 'Actif', traite: rand(100, 180), erreurs: rand(0, 8) },
  { id: 'analyzer', nom: 'Analyzer', role: 'Évalue la présence numérique', statut: 'Actif', traite: rand(90, 170), erreurs: rand(0, 6) },
  { id: 'opportunity', nom: 'Opportunity', role: 'Calcule le potentiel commercial', statut: 'Actif', traite: rand(85, 160), erreurs: rand(0, 3) },
  { id: 'writer', nom: 'Writer', role: 'Prépare l\'audit et le message', statut: 'En veille', traite: rand(40, 80), erreurs: rand(0, 4) },
  { id: 'designer', nom: 'Designer', role: 'Génère une proposition visuelle', statut: 'En veille', traite: rand(20, 50), erreurs: rand(0, 2) },
  { id: 'crm', nom: 'CRM', role: 'Assure le suivi des prospects', statut: 'Actif', traite: rand(60, 120), erreurs: rand(0, 3) },
  { id: 'analytics', nom: 'Analytics', role: 'Mesure les performances', statut: 'Actif', traite: rand(70, 140), erreurs: rand(0, 2) },
]

export const mockStats = {
  totalProspects: mockProspects.length,
  analysesEnCours: mockProspects.filter(p => p.statut === 'En analyse').length,
  propositionsEnvoyees: mockProspects.filter(p => ['Proposition préparée', 'En attente validation', 'Contacté'].includes(p.statut)).length,
  tauxConversion: `${Math.round((mockProspects.filter(p => p.statut === 'Converti').length / mockProspects.length) * 100)}%`,
  scoreMoyen: Math.round(mockProspects.reduce((sum, p) => sum + p.score, 0) / mockProspects.length),
  secteursCouverts: new Set(mockProspects.map(p => p.secteur)).size,
  villesCouvertes: new Set(mockProspects.map(p => p.ville)).size,
  derniereMAJ: 'Il y a 2 minutes',
}
