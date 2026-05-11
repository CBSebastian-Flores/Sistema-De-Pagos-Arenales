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
      const mensaje = error.response?.data?.message ?? 'Backend aún no disponible. Intenta más tarde.'
      toast.error(mensaje)
    }
  }

  return (
    <>
      <Layout onSubmit={handleSubmit} />
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  )
}