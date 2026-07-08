import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { getConsent } from '../utils/consent'

const GA_ID = import.meta.env.VITE_GA_ID

function gtag() {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(arguments)
}

export default function Analytics() {
  const location = useLocation()
  const [consented, setConsented] = useState(() => getConsent() === 'accepted')

  useEffect(() => {
    const onConsent = () => setConsented(getConsent() === 'accepted')
    window.addEventListener('cookie-consent', onConsent)
    return () => window.removeEventListener('cookie-consent', onConsent)
  }, [])

  useEffect(() => {
    if (!GA_ID || !consented) return
    if (document.querySelector(`script[src*="${GA_ID}"]`)) return

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)

    gtag('js', new Date())
    gtag('config', GA_ID, { send_page_view: false })

    return () => {
      try {
        document.head.removeChild(script)
      } catch {
        /* script may already be removed */
      }
    }
  }, [consented])

  useEffect(() => {
    if (!GA_ID || !consented) return
    gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title,
    })
  }, [location.pathname, location.search, consented])

  return null
}
