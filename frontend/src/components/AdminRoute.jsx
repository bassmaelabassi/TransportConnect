import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h2>
          <p className="text-gray-700 mb-2">Vous n'avez pas les droits nécessaires pour accéder à cette page administrateur.</p>
          <a href="/" className="text-blue-600 hover:underline">Retour à l'accueil</a>
        </div>
      </div>
    )
  }

  return children
}

export default AdminRoute
