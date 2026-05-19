import { Navigate } from 'react-router-dom'
import { estaAutenticado } from '../services/loginService'

export default function ProtectedRoute({ children }) {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />
  }
  return children
}