import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AccesoDenegado from "./components/AccesoDenegado";
import SolicitarRecuperacion from "./pages/SolicitarRecuperacion";
import RestablecerPassword from "./pages/RestablecerPassword";
import { registrarUsuario } from "./services/authService";
import {loginUsuario, guardarSesion, cerrarSesion, estaAutenticado} from "./services/loginService";

export default function App() {
  const handleLogin = async (datos) => {
    try {
      const respuesta = await loginUsuario(datos);
      guardarSesion(respuesta);
      toast.success(`¡Bienvenido, ${respuesta.nombres}!`);
      window.location.href = "/dashboard";
    } catch (error) {
      if (error.response?.status === 423) {
        toast.error(
          "Cuenta bloqueada por múltiples intentos fallidos. Intente de nuevo en 15 minutos.",
        );
      } else {
        const mensaje =
          typeof error.response?.data === "string"
            ? error.response.data
            : "DNI o contraseña incorrectos";
        toast.error(mensaje);
      }
    }
  };

  const handleSubmit = async (datos) => {
    try {
      await registrarUsuario(datos);
      toast.success("¡Cuenta creada exitosamente!");
    } catch (error) {
      const mensaje =
        typeof error.response?.data === "string"
          ? error.response.data
          : (error.response?.data?.message ?? "Error al registrar.");
      toast.error(mensaje);
    }
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={4000} />
      <Routes>
        {/* Rutas Públicas de Acceso */}
        <Route path="/login" element={
          estaAutenticado() ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />
        
        {/* 🔑 Flujo de recuperación de credenciales (Públicas) */}
        <Route path="/solicitar-recuperacion" element={<SolicitarRecuperacion />} />
        <Route path="/restablecer-password" element={<RestablecerPassword />} />

        {/* Ruta Privada */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout onSubmit={handleSubmit} onCerrarSesion={handleCerrarSesion} />
          </ProtectedRoute>
        } />

        <Route path="/acceso-denegado" element={<AccesoDenegado />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
