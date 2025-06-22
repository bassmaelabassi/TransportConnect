import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:33100/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    if (!error.response) {
      throw new Error("Erreur de connexion au serveur - Vérifiez votre connexion internet")
    }
    const errorMessage = error.response.data?.message || `Erreur ${error.response.status}: ${error.response.statusText}`
    throw new Error(errorMessage)
  },
)

export default api
