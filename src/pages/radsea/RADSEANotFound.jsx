import { Link } from 'react-router'

export default function RADSEANotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <p className="text-[80px] font-bold text-gray-200 leading-none">404</p>
        <h1 className="text-xl font-bold text-gray-900 mt-2">Page introuvable</h1>
        <p className="text-gray-400 text-sm mt-2">Cette page RADSEA n'existe pas.</p>
        <Link to="/radsea/dashboard" className="inline-block mt-6 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-2xl hover:bg-gray-800 transition-colors">
          Retour au dashboard
        </Link>
      </div>
    </div>
  )
}
