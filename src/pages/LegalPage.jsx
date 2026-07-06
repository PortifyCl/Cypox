import SEO from '../components/SEO'
import { usePageTransition } from '../hooks/usePageTransition'

export default function LegalPage() {
  const transitionTo = usePageTransition()
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <SEO
        title="Mentions Légales — CYPOX"
        description="Mentions légales et politique de confidentialité du site CYPOX."
        url="/mentions-legales"
      />
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cypox-black mb-12">
          Mentions Légales
        </h1>

        <div className="space-y-10 text-cypox-text-muted leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Éditeur du site</h2>
            <p>CYPOX — Studio de développement web, design UI/UX et graphisme.</p>
            <p>Email : <a href="mailto:Coffigildas268@gmail.com" className="underline hover:text-cypox-black">Coffigildas268@gmail.com</a></p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Hébergeur</h2>
            <p>Ce site est hébergé sur les serveurs de Vercel Inc.</p>
            <p>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, images, graphismes, logos, icônes, sons, logiciels) est la propriété exclusive de CYPOX ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Données personnelles</h2>
            <p>Les informations recueillies via le formulaire de contact sont destinées à CYPOX pour le traitement de votre demande. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant CYPOX via le formulaire de contact.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Cookies</h2>
            <p>Ce site utilise Google Analytics (GA4) pour mesurer l'audience et améliorer l'expérience utilisateur. Conformément au RGPD, les cookies de tracking ne sont déposés qu'après votre consentement via le bandeau de cookies affiché lors de votre première visite. Seuls les cookies techniques nécessaires au fonctionnement du site sont exemptés de consentement.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-cypox-black mb-4">Droit applicable</h2>
            <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
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
