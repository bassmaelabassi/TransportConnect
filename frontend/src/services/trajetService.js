import api from "./api"
export const trajetService = {
  async getTrajetsDisponibles(filters = {}) {
    try {
      const params = new URLSearchParams()
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params.append(key, filters[key])
        }
      })

      const response = await api.get(`/trajets?${params.toString()}`)
      return response
    } catch (error) {
      throw error
    }
  },

  async getMesTrajets() {
    try {
      const response = await api.get("/trajets/mes-trajets")
      return response
    } catch (error) {
      throw error
    }
  },

  async createTrajet(trajetData) {
    try {
      const response = await api.post("/trajets", trajetData)
      return response
    } catch (error) {
      throw error
    }
  },


  async getTrajetById(trajetId) {
    try {
      const response = await api.get(`/trajets/${trajetId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  async updateTrajet(trajetId, trajetData) {
    try {
      const response = await api.put(`/trajets/${trajetId}`, trajetData)
      return response
    } catch (error) {
      throw error
    }
  },

  async deleteTrajet(trajetId) {
    try {
      const response = await api.delete(`/trajets/${trajetId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  async searchTrajets(searchParams) {
    try {
      const response = await api.post("/trajets/search", searchParams)
      return response
    } catch (error) {
      throw error
    }
  },

  async getTrajetStats() {
    try {
      const response = await api.get("/trajets/stats")
      return response
    } catch (error) {
      throw error
    }
  },

  async moderateTrajet(trajetId, action, reason = "") {
    try {
      const response = await api.post(`/trajets/${trajetId}/moderate`, {
        action,
        reason,
      })
      return response
    } catch (error) {
      throw error
    }
  },
}
