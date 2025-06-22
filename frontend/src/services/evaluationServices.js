import api from "./api"

export const evaluationService = {
  // Obtenir les évaluations reçues
  async getEvaluationsRecues() {
    try {
      const response = await api.get("/evaluations/recues")
      return response
    } catch (error) {
      throw error
    }
  },

  // Obtenir les évaluations données
  async getMesEvaluations() {
    try {
      const response = await api.get("/evaluations/donnees")
      return response
    } catch (error) {
      throw error
    }
  },

  // Créer une nouvelle évaluation
  async createEvaluation(evaluationData) {
    try {
      const response = await api.post("/evaluations", evaluationData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Obtenir une évaluation par ID
  async getEvaluationById(evaluationId) {
    try {
      const response = await api.get(`/evaluations/${evaluationId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Mettre à jour une évaluation
  async updateEvaluation(evaluationId, evaluationData) {
    try {
      const response = await api.put(`/evaluations/${evaluationId}`, evaluationData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Supprimer une évaluation
  async deleteEvaluation(evaluationId) {
    try {
      const response = await api.delete(`/evaluations/${evaluationId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Obtenir les évaluations d'un utilisateur
  async getUserEvaluations(userId) {
    try {
      const response = await api.get(`/evaluations/user/${userId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Obtenir les statistiques d'évaluation d'un utilisateur
  async getUserEvaluationStats(userId) {
    try {
      const response = await api.get(`/evaluations/user/${userId}/stats`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Vérifier si une évaluation peut être donnée
  async canEvaluate(trajetId, userId) {
    try {
      const response = await api.get(`/evaluations/can-evaluate/${trajetId}/${userId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Obtenir les évaluations en attente
  async getPendingEvaluations() {
    try {
      const response = await api.get("/evaluations/pending")
      return response
    } catch (error) {
      throw error
    }
  },

  // Signaler une évaluation inappropriée
  async reportEvaluation(evaluationId, reason) {
    try {
      const response = await api.post(`/evaluations/${evaluationId}/report`, {
        reason,
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Obtenir les statistiques globales des évaluations (admin)
  async getGlobalEvaluationStats() {
    try {
      const response = await api.get("/evaluations/stats")
      return response
    } catch (error) {
      throw error
    }
  },

  // Récupère les demandes à évaluer par l'utilisateur connecté
  async getDemandesAevaluer() {
    try {
      const response = await api.get('/evaluations/a-evaluer')
      return response
    } catch (error) {
      throw error
    }
  },

  // Récupère la note moyenne pour un utilisateur
  async getAverageRating(userId) {
    try {
      const response = await api.get(`/evaluations/moyenne/${userId}`)
      return response
    } catch (error) {
      throw error
    }
  },
}
