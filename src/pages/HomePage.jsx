import Hero from '../components/Hero'
import Detections from '../components/Detections'
import About from '../components/About'
import Sectors from '../components/Sectors'
import Portfolio from '../components/Portfolio'
import Process from '../components/Process'
import ClientLogos from '../components/ClientLogos'
import Testimonials from '../components/Testimonials'
import CtaSection from '../components/CtaSection'
import Contact from '../components/Contact'
import SEO from '../components/SEO'

export default function HomePage() {
  return (
    <>
      <SEO
        title="CYPOX — Laboratoire de croissance web | Europe francophone"
        description="Chaque entreprise laisse des opportunités sur Internet. Nous les trouvons. Analyse, expériences web sur mesure, et stratégies qui transforment vos visiteurs en clients."
        url="/"
      />
      <Hero />
      <Detections />
      <About />
      <Sectors />
      <Portfolio />
      <Process />
      <ClientLogos />
      <Testimonials />
      <CtaSection />
      <Contact />
    </>
  )
}
