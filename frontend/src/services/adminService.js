import api from "./api";

export const adminService = {
  async getRecentAnnonces() {
    return await api.get("/admin/recent-annonces");
  },
  async getRecentUsers() {
    return await api.get("/admin/recent-users");
  },
  async getStats() {
    return await api.get("/admin/stats");
  },
  async updateUserStatus(id, data) {
    return await api.patch(`/admin/user/${id}`, data);
  },
  async deleteAnnonce(id) {
    return await api.delete(`/admin/annonce/${id}`);
  },
  async updateAnnonce(id, data) {
    return await api.patch(`/admin/annonce/${id}`, data);
  },
}; 