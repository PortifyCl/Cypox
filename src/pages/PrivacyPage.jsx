import SEO from '../components/SEO'
import { usePageTransition } from '../hooks/usePageTransition'

export default function PrivacyPage() {
  const transitionTo = usePageTransition()
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <SEO
        title="Politique de Confidentialité — CYPOX"
        description="Politique de confidentialité et protection des données personnelles du site CYPOX."
        url="/politique-de-confidentialite"
      />
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cypox-black mb-12">
          Politique de Confidentialité
        </h1>

        <div className="space-y-10 text-cypox-text-muted leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Responsable du traitement</h2>
            <p>Le responsable du traitement des données personnelles est CYPOX.</p>
            <p>Email : <a href="mailto:Coffigildas268@gmail.com" className="underline hover:text-cypox-black">Coffigildas268@gmail.com</a></p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Données collectées</h2>
            <p>Nous collectons uniquement les données que vous nous fournissez volontairement via notre formulaire de contact :</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Nom</li>
              <li>Adresse email</li>
              <li>Message et informations relatives à votre projet</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Utilisation des données</h2>
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Répondre à votre demande de contact</li>
              <li>Assurer le suivi de nos échanges commerciaux</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Durée de conservation</h2>
            <p>Vos données sont conservées pour une durée maximale de 3 ans à compter de notre dernier échange. Passé ce délai, les données sont supprimées.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Destinataires des données</h2>
            <p>Vos données ne sont communiquées à aucun tiers. Elles sont accessibles uniquement par les personnes habilitées au sein de CYPOX.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Transferts hors Union européenne</h2>
            <p>Notre formulaire de contact utilise Formspree, dont les serveurs peuvent être situés hors de l'Union européenne (États-Unis). Ce transfert est encadré par les clauses contractuelles types de la Commission européenne. Notre hébergeur Vercel Inc. est également situé aux États-Unis, avec des garanties similaires.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Vos droits</h2>
            <p>Conformément au RGPD (Règlement Général sur la Protection des Données), vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li><strong>Droit d'accès</strong> — obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> — corriger des données inexactes</li>
              <li><strong>Droit de suppression</strong> — demander la suppression de vos données</li>
              <li><strong>Droit d'opposition</strong> — vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré</li>
            </ul>
            <p className="mt-3">Pour exercer ces droits, contactez-nous à <a href="mailto:Coffigildas268@gmail.com" className="underline hover:text-cypox-black">Coffigildas268@gmail.com</a>.</p>
            <p className="mt-2">Vous pouvez également déposer une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-cypox-black">www.cnil.fr</a></p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Cookies</h2>
            <p>Ce site utilise Google Analytics (GA4) pour mesurer l'audience. Les cookies de tracking ne sont déposés qu'après votre consentement via le bandeau de cookies affiché lors de votre première visite.</p>
            <p className="mt-3">Les cookies utilisés sont :</p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li><strong>Cookie de consentement</strong> — stocke votre choix de consentement (durée : 6 mois)</li>
              <li><strong>Google Analytics (_ga, _ga_*)</strong> — mesures d'audience anonymisées (durée : 13 mois)</li>
            </ul>
            <p className="mt-3">Vous pouvez gérer ou retirer votre consentement à tout moment via le bandeau de cookies.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Sécurité</h2>
            <p>Nous mettons en œuvre les mesures techniques et organisationnelles nécessaires pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Modification de la politique</h2>
            <p>Cette politique de confidentialité peut être mise à jour à tout moment. La date de dernière mise à jour est indiquée ci-dessous.</p>
            <p className="mt-2 text-sm">Dernière mise à jour : juillet 2026</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-cypox-border">
          <button onClick={() => transitionTo('/')} className="text-cypox-black font-bold text-sm hover:opacity-60 transition-opacity min-h-[44px] inline-flex items-center">
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}
