import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/sistemapagoarenales',
  headers: { 'Content-Type': 'application/json' },
})

export async function loginUsuario(datos) {
  const response = await api.post('/api/auth/login', datos)
  return response.data
}

export function guardarSesion(data) {
  sessionStorage.setItem('token', data.token)
  sessionStorage.setItem('dni', data.dni)
  sessionStorage.setItem('nombres', data.nombres)
  sessionStorage.setItem('rol', data.rol)
}

export function cerrarSesion() {
  sessionStorage.clear()
}

export function obtenerToken() {
  return sessionStorage.getItem('token')
}

export function estaAutenticado() {
  return !!sessionStorage.getItem('token')
}