import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

export async function registrarUsuario(datos) {
  const response = await api.post('/api/auth/register', datos)
  return response.data
}