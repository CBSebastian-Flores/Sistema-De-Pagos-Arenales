// importamos la instancia 'api' que tiene los interceptores configurados
import api from './axiosConfig'

// Función para registrar al usuario final 
export async function registrarUsuario(datos) {
  console.log('📦 Payload enviado:', JSON.stringify(datos, null, 2))
  const response = await api.post('/api/usuarios/registrar', datos)
  return response.data
}

// Función para validar el DNI con el controlador de Spring Boot
export async function verificarDni(dni) {
  try {
    // Hace un GET a http://localhost:8080/sistemapagoarenales/api/validaciones/dni?numero=XXXXXXXX
    const response = await api.get('/api/validaciones/dni', {
      params: { numero: dni }
    })
    return response.data // Retorna directamente el booleano (true o false) del backend
  } catch (error) {
    console.error("Error en verificarDni service:", error)
    throw error // Lanza el error para que lo atrape el catch del formulario
  }
}

// Función para consumir el endpoint de roles
export async function listarRoles() {
  try {
    const response = await api.get('/api/roles')
    return response.data // Devuelve el array de objetos JSON [{idRol: 1, nombre: '...'}, ...]
  } catch (error) {
    console.error("Error al traer los roles del backend:", error)
    throw error
  }
}