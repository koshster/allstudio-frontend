import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export function login(email, password) {
  return api.post("/auth/login", { email, password })
}

export function register(email, password) {
  return api.post("/auth/register", { email, password })
}

export function getClients() {
  return api.get("/clients")
}

export function getClientById(id) {
  return api.get(`/clients/${id}`)
}

export function createClient(clientData) {
  return api.post("/clients", clientData)
}

export function updateClient(id, clientData) {
  return api.put(`/clients/${id}`, clientData)
}

export function deleteClient(id) {
  return api.delete(`/clients/${id}`)
}

export function getAnalyticsSummary() {
  return api.get("/analytics/summary")
}

export function getAtRiskClients() {
  return api.get("/analytics/at-risk")
}

export function recalculateChurn() {
  return api.post("/analytics/recalculate-churn")
}

export default api