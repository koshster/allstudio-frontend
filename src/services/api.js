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

export function getClients() {
  return api.get("/clients")
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

export default api
