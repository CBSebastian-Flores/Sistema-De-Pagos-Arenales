import axios from 'axios'
import { obtenerToken } from './loginService'

const api = axios.create({
  baseURL: 'http://localhost:8080/sistemapagoarenales',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor — agrega el token automáticamente a cada petición
api.interceptors.request.use(
  (config) => {
    const token = obtenerToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api