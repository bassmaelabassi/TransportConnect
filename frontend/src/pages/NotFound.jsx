import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">Page non trouvée</h2>
          <p className="text-gray-600 mt-2">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </Link>

          <div className="text-sm text-gray-500">
            <p>Ou essayez ces liens :</p>
            <div className="mt-2 space-x-4">
              <Link to="/expediteur/trajets" className="text-blue-600 hover:text-blue-800">
                Trajets disponibles
              </Link>
              <Link to="/conducteur/annonces" className="text-blue-600 hover:text-blue-800">
                Mes annonces
              </Link>
              <Link to="/profile" className="text-blue-600 hover:text-blue-800">
                Mon profil
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <svg className="mx-auto h-32 w-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2.306"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default NotFound
