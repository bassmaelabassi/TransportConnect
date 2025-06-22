import api from "./api"

export const authService = {

  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials)
      return response
    } catch (error) {
      throw error
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData)
      return response
    } catch (error) {
      throw error
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me")
      return response
    } catch (error) {
      throw error
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await api.put("/auth/profile", profileData)
      return response
    } catch (error) {
      throw error
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await api.put("/auth/change-password", passwordData)
      return response
    } catch (error) {
      throw error
    }
  },
  async logout() {
    try {
      await api.post("/auth/logout")
      localStorage.removeItem("token")
    } catch (error) {
      localStorage.removeItem("token")
      throw error
    }
  }
}
