import api from './axiosConfig'

export async function registrarUsuario(datos) {
  const response = await api.post('/api/usuarios/registrar', datos)
  return response.data
}

export async function verificarDni(dni) {
  const response = await api.get('/api/validaciones/dni', {
    params: { numero: dni }
  })
  return response.data
}

export async function listarRoles() {
  try {
    const response = await api.get('/api/roles')
    return response.data
  } catch (error) {
    console.error("Error al traer los roles del backend:", error)
    throw error
  }
}