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

export function getClassTypes() {
  return api.get("/class-types")
}

export function createClassType(data) {
  return api.post("/class-types", data)
}

export function updateClassType(id, data) {
  return api.put(`/class-types/${id}`, data)
}

export function deleteClassType(id) {
  return api.delete(`/class-types/${id}`)
}

export function getSessions() {
  return api.get("/sessions")
}

export function createSession(data) {
  return api.post("/sessions", data)
}

export function updateSession(id, data) {
  return api.put(`/sessions/${id}`, data)
}

export function deleteSession(id) {
  return api.delete(`/sessions/${id}`)
}

export default api