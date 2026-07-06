import { Routes, Route, useLocation } from 'react-router'
import { Suspense, lazy, useState, useCallback, useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
const Cursor = lazy(() => import('./components/Cursor'))
const Loader = lazy(() => import('./components/Loader'))
import SmoothScroll from './components/SmoothScroll'
import ErrorBoundary from './components/ErrorBoundary'
import StickyCTA from './components/StickyCTA'
import Analytics from './components/Analytics'
import CookieConsent from './components/CookieConsent'
import { scrollToHash } from './utils/useScrollToHash'
import { RADSEAAuthProvider } from './contexts/RADSEAAuth'

const HomePage = lazy(() => import('./pages/HomePage'))
const MethodePage = lazy(() => import('./pages/MethodePage'))
const TransformationsPage = lazy(() => import('./pages/TransformationsPage'))
const LegalPage = lazy(() => import('./pages/LegalPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

const RADSEALogin = lazy(() => import('./pages/radsea/RADSEALogin'))
const RADSEALayout = lazy(() => import('./pages/radsea/RADSEALayout'))
const RADSEADashboard = lazy(() => import('./pages/radsea/RADSEADashboard'))
const RADSEAProspects = lazy(() => import('./pages/radsea/RADSEAProspects'))
const RADSEAProspectDetail = lazy(() => import('./pages/radsea/RADSEAProspectDetail'))
const RADSEAAgents = lazy(() => import('./pages/radsea/RADSEAAgents'))
const RADSEAAnalytics = lazy(() => import('./pages/radsea/RADSEAAnalytics'))
const RADSEAAudit = lazy(() => import('./pages/radsea/RADSEAAudit'))
const RADSEANotFound = lazy(() => import('./pages/radsea/RADSEANotFound'))

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleLoadComplete = useCallback(() => setLoaded(true), [])
  const location = useLocation()
  const isRADSEA = location.pathname.startsWith('/radsea')

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const tryScroll = (attempts = 0) => {
      const el = document.getElementById(id)
      if (el) scrollToHash(id)
      else if (attempts < 10) requestAnimationFrame(() => tryScroll(attempts + 1))
    }
    const timer = setTimeout(() => tryScroll(), 100)
    return () => clearTimeout(timer)
  }, [location.pathname, location.hash])

  if (isRADSEA) {
    return (
      <HelmetProvider>
        <ErrorBoundary>
          <RADSEAAuthProvider>
            <Suspense fallback={
              <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"/>
                  <span className="text-xs text-gray-400 font-medium">Chargement...</span>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/radsea" element={<RADSEALogin />} />
                <Route path="/radsea" element={<RADSEALayout />}>
                  <Route path="dashboard" element={<RADSEADashboard />} />
                  <Route path="prospects" element={<RADSEAProspects />} />
                  <Route path="prospect/:id" element={<RADSEAProspectDetail />} />
                  <Route path="agents" element={<RADSEAAgents />} />
                  <Route path="analytics" element={<RADSEAAnalytics />} />
                  <Route path="audit" element={<RADSEAAudit />} />
                  <Route path="*" element={<RADSEANotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </RADSEAAuthProvider>
        </ErrorBoundary>
      </HelmetProvider>
    )
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-white">
          {!loaded && (
            <Suspense fallback={null}>
              <Loader onComplete={handleLoadComplete} />
            </Suspense>
          )}
          <Suspense fallback={null}>
            <Cursor />
          </Suspense>
          <Analytics />
          <CookieConsent />
          <SmoothScroll>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10001] focus:bg-cypox-black focus:text-white focus:px-6 focus:py-3 focus:rounded-full focus:font-bold focus:text-sm"
            >
              Aller au contenu principal
            </a>
            <Navbar />
            <main id="main-content">
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/methode" element={<MethodePage />} />
                  <Route path="/transformations" element={<TransformationsPage />} />
                  <Route path="/mentions-legales" element={<LegalPage />} />
                  <Route path="/politique-de-confidentialite" element={<PrivacyPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <StickyCTA />
          </SmoothScroll>
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  )
}
