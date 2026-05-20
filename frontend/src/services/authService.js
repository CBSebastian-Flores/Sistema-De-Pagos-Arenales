// 🚀 importamos la instancia 'api' que SÍ tiene los interceptores configurados
import api from './axiosConfig' 

export async function registrarUsuario(datos) {
  console.log('📦 Payload enviado:', JSON.stringify(datos, null, 2))
  const response = await api.post('/api/usuarios/registrar', datos)
  return response.data
}