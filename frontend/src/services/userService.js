import api from "./api"

export const userService = {
  async getAllUsers(filters = {}) {
    try {
      const params = new URLSearchParams()
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params.append(key, filters[key])
        }
      })

      const response = await api.get(`/users?${params.toString()}`)
      return response
    } catch (error) {
      throw error
    }
  },

  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData)
      return response
    } catch (error) {
      throw error
    }
  },

 
  async toggleUserStatus(userId, action) {
    try {
      const response = await api.post(`/users/${userId}/toggle-status`, {
        action, 
      })
      return response
    } catch (error) {
      throw error
    }
  },
  async verifyUser(userId) {
    try {
      const response = await api.post(`/users/${userId}/verify`)
      return response
    } catch (error) {
      throw error
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  async getUserStats() {
    try {
      const response = await api.get("/users/stats")
      return response
    } catch (error) {
      throw error
    }
  },

  async searchUsers(searchParams) {
    try {
      const response = await api.post("/users/search", searchParams)
      return response
    } catch (error) {
      throw error
    }
  },

  async getUserHistory(userId) {
    try {
      const response = await api.get(`/users/${userId}/history`)
      return response
    } catch (error) {
      throw error
    }
  },

  async sendMessageToUser(userId, message) {
    try {
      const response = await api.post(`/users/${userId}/message`, {
        message,
      })
      return response
    } catch (error) {
      throw error
    }
  },
}
