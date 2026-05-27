import { Navigate } from 'react-router-dom'
import { estaAutenticado } from '../services/loginService'

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />
  }

  const userRole = sessionStorage.getItem('rol')
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/acceso-denegado" replace />
  }

  return children
}