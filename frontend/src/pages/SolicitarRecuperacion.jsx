import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosConfig";

export default function SolicitarRecuperacion() {
  const [dni, setDni] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dni || dni.length !== 8) {
      toast.error("Ingresa un DNI válido de 8 dígitos");
      return;
    }

    setEnviando(true);

    let mensajeExito =
      "Si el DNI coincide con una cuenta activa y registrada, recibirá un enlace de restablecimiento.";

    try {
      const response = await api.post("/api/auth/solicitar-recuperacion", {
        dni,
      });

      if (response.data?.mensaje) {
        mensajeExito = response.data.mensaje;
      }
    } catch (error) {
      console.error("Error en solicitud: ", error);
    } finally {
      toast.success(mensajeExito);
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1e35]">
      <div className="bg-[#1a2d4a] rounded-3xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Recuperar Contraseña
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Ingresa tu DNI. Te enviaremos un enlace de recuperación a tu teléfono
          o correo registrado.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <label className="block text-white font-semibold mb-2">DNI</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="12345678"
            maxLength={8}
            className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white mb-6"
          />
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            {enviando ? "Enviando..." : "Enviar enlace"}
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
