import api from "./api"

export const notificationService = {
  // Obtenir toutes les notifications de l'utilisateur
  async getNotifications() {
    try {
      const response = await api.get("/notifications")
      return response
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error)
      throw error
    }
  },

  // Obtenir les notifications non lues
  async getUnreadNotifications() {
    try {
      const response = await api.get("/notifications/unread")
      return response
    } catch (error) {
      throw error
    }
  },

  // Marquer une notification comme lue
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Marquer toutes les notifications comme lues
  async markAllAsRead() {
    try {
      const response = await api.put("/notifications/read")
      return response
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications:", error)
      throw error
    }
  },

  // Supprimer une notification
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`)
      return response
    } catch (error) {
      throw error
    }
  },

  // Supprimer toutes les notifications
  async deleteAllNotifications() {
    try {
      const response = await api.delete("/notifications")
      return response
    } catch (error) {
      throw error
    }
  },

  // Créer une nouvelle notification (système)
  async createNotification(notificationData) {
    try {
      const response = await api.post("/notifications", notificationData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Obtenir les paramètres de notification
  async getNotificationSettings() {
    try {
      const response = await api.get("/notifications/settings")
      return response
    } catch (error) {
      throw error
    }
  },

  // Mettre à jour les paramètres de notification
  async updateNotificationSettings(settings) {
    try {
      const response = await api.put("/notifications/settings", settings)
      return response
    } catch (error) {
      throw error
    }
  },

  // Envoyer une notification push
  async sendPushNotification(userId, notificationData) {
    try {
      const response = await api.post(`/notifications/push/${userId}`, notificationData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Envoyer une notification email
  async sendEmailNotification(userId, emailData) {
    try {
      const response = await api.post(`/notifications/email/${userId}`, emailData)
      return response
    } catch (error) {
      throw error
    }
  },
}
