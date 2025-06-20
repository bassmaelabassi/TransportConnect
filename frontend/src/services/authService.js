import api from "./api"

export const authService = {
  // Connexion
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials)
      return response
    } catch (error) {
      throw error
    }
  },

  // Inscription
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Obtenir l'utilisateur actuel
  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me")
      return response
    } catch (error) {
      throw error
    }
  },

  // Mettre à jour le profil
  async updateProfile(profileData) {
    try {
      const response = await api.put("/auth/profile", profileData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Changer le mot de passe
  async changePassword(passwordData) {
    try {
      const response = await api.put("/auth/change-password", passwordData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Mot de passe oublié
  async forgotPassword(email) {
    try {
      const response = await api.post("/auth/forgot-password", { email })
      return response
    } catch (error) {
      throw error
    }
  },

  // Réinitialiser le mot de passe
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Vérifier l'email
  async verifyEmail(token) {
    try {
      const response = await api.post("/auth/verify-email", { token })
      return response
    } catch (error) {
      throw error
    }
  },

  // Déconnexion
  async logout() {
    try {
      await api.post("/auth/logout")
      localStorage.removeItem("token")
    } catch (error) {
      // Même en cas d'erreur, on supprime le token local
      localStorage.removeItem("token")
      throw error
    }
  }
}
