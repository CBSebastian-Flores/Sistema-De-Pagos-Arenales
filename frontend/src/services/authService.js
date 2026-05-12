import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/sistemapagoarenales',
  headers: { 'Content-Type': 'application/json' },
})

export async function registrarUsuario(datos) {
  console.log('📦 Payload enviado:', JSON.stringify(datos, null, 2))
  const response = await api.post('/api/usuarios/registrar', datos)
  return response.data
}