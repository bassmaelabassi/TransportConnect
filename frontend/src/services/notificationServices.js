import api from "./api"

export const notificationService = {
  async getNotifications() {
    try {
      const response = await api.get("/notifications")
      return response
    } catch (error) {
      throw error
    }
  },
  
  async createNotification(data) {
    try {
      const response = await api.post("/notifications", data)
      return response
    } catch (error) {
      throw error
    }
  },

  async getNotificationSettings() {
    try {
      const response = await api.get("/notifications/settings")
      return response
    } catch (error) {
      throw error
    }
  },
  async sendPushNotification(data) {
    try {
      const response = await api.post("/notifications/push", data)
      return response
    } catch (error) {
      throw error
    }
  }
}