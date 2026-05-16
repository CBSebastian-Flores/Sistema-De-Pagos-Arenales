import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/Layout'
import { registrarUsuario } from './services/authService'

export default function App() {
  const handleSubmit = async (datos) => {
    try {
      await registrarUsuario(datos)
      toast.success('¡Cuenta creada exitosamente!')
    } catch (error) {
      if (error.response) {
        // Error del backend (400, 500, etc.)
        const mensaje = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data?.message ?? 'Error al registrar.'
        toast.error(mensaje)
      } else {
        // Backend no disponible
        toast.error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.')
      }
    }
  }

  return (
    <>
      <Layout onSubmit={handleSubmit} />
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  )
}