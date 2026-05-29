import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/axiosConfig";

export default function RestablecerPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [verContrasena, setVerContrasena] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nuevaContrasena || nuevaContrasena.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (nuevaContrasena !== confirmar) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (!token) {
      toast.error("Token inválido o expirado");
      return;
    }

    setGuardando(true);
    try {
      await api.post("/api/auth/restablecer-password", {
        token,
        nuevaContrasena,
      });
      toast.success("Contraseña actualizada correctamente");
      navigate("/login");
    } catch {
      toast.error("El enlace expiró o es inválido. Solicita uno nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1e35]">
        <div className="bg-[#1a2d4a] rounded-3xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Nueva Contraseña
          </h1>
          <p className="text-gray-400 text-sm text-center mb-6">
            Ingresa tu nueva contraseña para continuar.
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <label className="block text-white font-semibold mb-2">
              Nueva contraseña
            </label>
            <div className="relative mb-4">
              <input
                type={verContrasena ? "text" : "password"}
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-lg px-4 py-3 pr-16 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              <button
                type="button"
                onClick={() => setVerContrasena(!verContrasena)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium hover:text-gray-700"
              >
                {verContrasena ? "Ocultar" : "Ver"}
              </button>
            </div>

            <label className="block text-white font-semibold mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Repite tu contraseña"
              className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white mb-6"
            />

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {guardando ? "Guardando..." : "Guardar contraseña"}
            </button>
          </form>
          <button
            onClick={() => navigate("/login")}
            className="w-full mt-4 text-gray-400 hover:text-white text-sm text-center transition-colors"
          >
            Volver al login
          </button>
        </div>
      </div>
    );
  }
}
