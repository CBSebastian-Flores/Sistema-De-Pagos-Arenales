import { useNavigate } from 'react-router-dom'
import { cerrarSesion } from '../services/loginService'

export default function AccesoDenegado() {
  const navigate = useNavigate()

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1e35] text-white">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Acceso Denegado</h2>
      <p className="text-gray-400 mb-8">No tienes permisos para ver esta pantalla.</p>
      <button
        onClick={handleCerrarSesion}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
        Cerrar sesión
      </button>
    </div>
  )
}