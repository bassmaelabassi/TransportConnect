import api from "./api"

export const demandeService = {
  async createDemande(demandeData) {
    try {
      const response = await api.post("/demandes", demandeData)
      return response
    } catch (error) {
      throw error
    }
  },

  async getMesDemandes() {
    try {
      const response = await api.get("/demandes/mes-demandes")
      return response
    } catch (error) {
      throw error
    }
  },

  async getDemandesRecues() {
    try {
      const response = await api.get("/demandes/recues")
      return response
    } catch (error) {
      throw error
    }
  },

  async getDemandeById(demandeId) {
    try {
      const response = await api.get(`/demandes/${demandeId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  async accepterDemande(demandeId) {
    try {
      const response = await api.post(`/demandes/${demandeId}/accepter`)
      return response
    } catch (error) {
      throw error
    }
  },

  async refuserDemande(demandeId, raison = "") {
    try {
      const response = await api.post(`/demandes/${demandeId}/refuser`, {
        raison,
      })
      return response
    } catch (error) {
      throw error
    }
  },


  async annulerDemande(demandeId) {
    try {
      const response = await api.post(`/demandes/${demandeId}/annuler`)
      return response
    } catch (error) {
      throw error
    }
  },

  async updateDemande(demandeId, demandeData) {
    try {
      const response = await api.put(`/demandes/${demandeId}`, demandeData)
      return response
    } catch (error) {
      throw error
    }
  },
  async marquerTerminee(demandeId) {
    try {
      const response = await api.post(`/demandes/${demandeId}/terminer`)
      return response
    } catch (error) {
      throw error
    }
  },

  async getHistoriqueDemandes() {
    try {
      const response = await api.get("/demandes/historique")
      return response
    } catch (error) {
      throw error
    }
  },
  async getDemandesByTrajet(trajetId) {
    try {
      const response = await api.get(`/demandes/trajet/${trajetId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  async searchDemandes(searchParams) {
    try {
      const response = await api.post("/demandes/search", searchParams)
      return response
    } catch (error) {
      throw error
    }
  },

  async getDemandeStats() {
    try {
      const response = await api.get("/demandes/stats")
      return response
    } catch (error) {
      throw error
    }
  },

  async sendMessageDemande(demandeId, message) {
    try {
      const response = await api.post(`/demandes/${demandeId}/message`, {
        message,
      })
      return response
    } catch (error) {
      throw error
    }
  },

  async getMessagesDemande(demandeId) {
    try {
      const response = await api.get(`/demandes/${demandeId}/messages`)
      return response
    } catch (error) {
      throw error
    }
  },

  async marquerCommeLivree(demandeId) {
    try {
      const response = await api.post(`/demandes/${demandeId}/livrer`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
