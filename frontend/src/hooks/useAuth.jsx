import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const userData = await authService.getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
          setRetryCount(0) 
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        if (error.message.includes('401') || error.message.includes('403') || error.message.includes('Non autorisé')) {
          localStorage.removeItem("token")
        } else if (error.message.includes('Erreur de connexion') && retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
            initAuth()
          }, 2000)
          return 
        }
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [retryCount])

  const login = async (credentials) => {
    try {
      const transformedCredentials = {
        email: credentials.email,
        password: credentials.motDePasse
      }
      
      const response = await authService.login(transformedCredentials)
      const { token, ...userData } = response

      localStorage.setItem("token", token)
      setUser(userData)
      setIsAuthenticated(true)

      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      let role = userData.typeUtilisateur
      if (userData.typeUtilisateur === 'les-deux') {
        role = 'les-deux' 
      }
      
      const transformedData = {
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        telephone: userData.telephone,
        password: userData.motDePasse, 
        role: role || 'expediteur' 
      }
      
      const response = await authService.register(transformedData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData)
      setUser(updatedUser)
      return { success: true, user: updatedUser }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const hasRole = (requiredRole) => {
    if (!user) return false
    
    if (user.role === "les-deux") {
      return requiredRole === "conducteur" || requiredRole === "expediteur"
    }
    
    return user.role === requiredRole
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    isAdmin: user?.role === "admin",
    isConducteur: user?.role === "conducteur" || user?.role === "les-deux",
    isExpediteur: user?.role === "expediteur" || user?.role === "les-deux",
    canAccessConducteurFeatures: user?.role === "conducteur" || user?.role === "les-deux",
    canAccessExpediteurFeatures: user?.role === "expediteur" || user?.role === "les-deux",
    canAccessAdminFeatures: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

