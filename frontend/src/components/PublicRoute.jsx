import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    } else if (user?.role === "conducteur") {
      return <Navigate to="/conducteur/annonces" replace />
    } else if (user?.role === "expediteur") {
      return <Navigate to="/expediteur/trajets" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default PublicRoute 