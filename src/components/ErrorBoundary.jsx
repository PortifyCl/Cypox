import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[CYPOX ErrorBoundary]', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="text-center max-w-md" role="alert">
            <h1 className="font-display text-4xl sm:text-6xl font-bold text-cypox-black mb-4">Erreur</h1>
            <p className="text-cypox-gray mb-8">
              Quelque chose s'est mal passé. Veuillez réessayer ou recharger la page.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={this.handleRetry}
                className="bg-cypox-black text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-cypox-accent-hover transition-all duration-300 min-h-[44px]"
              >
                Réessayer
              </button>
              <a
                href="/"
                className="text-cypox-gray hover:text-cypox-black transition-colors font-medium text-sm min-h-[44px] inline-flex items-center"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
