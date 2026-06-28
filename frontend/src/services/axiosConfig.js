import axios from 'axios'
import { obtenerToken, cerrarSesion } from './loginService'

const api = axios.create({
  baseURL: 'http://localhost:8080/sistemapagoarenales',
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

//Interceptor de Respuesta (Atrapa el token vencido al regresar)
api.interceptors.response.use(
  (response) => {
    // Si la petición es exitosa (200 OK), dejamos que pase normal hacia el componente
    return response;
  },
  (error) => {
    // Si el backend nos lanza un 401 o 403 (Token caducado o inválido)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Sesión expirada por seguridad. Redirigiendo al Login...");
      cerrarSesion(); // Limpia el localStorage 
      window.location.href = '/login'; // Envia a la pantalla de acceso
    }
    return Promise.reject(error);
  }
)

export default api