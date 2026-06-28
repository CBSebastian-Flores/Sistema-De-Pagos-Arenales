import { useState } from "react"
import api from "../services/axiosConfig"
import { toast } from "react-toastify"

const CATEGORIAS = [
  "Servicios Públicos",
  "Mantenimiento",
  "Suministros",
  "Honorarios",
  "Impuestos",
  "Otros",
]

const INITIAL_FORM = {
  categoria: "",
  beneficiario: "",
  monto: "",
  descripcion: "",
}

export default function RegistrarEgresos() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validar = () => {
    const nuevos = {}

    if (!form.categoria.trim()) {
      nuevos.categoria = "Selecciona una categoría"
    }

    if (!form.beneficiario.trim()) {
      nuevos.beneficiario = "El beneficiario es obligatorio"
    } else if (form.beneficiario.trim().length < 3) {
      nuevos.beneficiario = "Debe tener al menos 3 caracteres"
    }

    if (!form.monto) {
      nuevos.monto = "El monto es obligatorio"
    } else {
      const montoNum = parseFloat(form.monto)
      if (isNaN(montoNum) || montoNum <= 0) {
        nuevos.monto = "El monto debe ser mayor a 0"
      }
    }

    if (!form.descripcion.trim()) {
      nuevos.descripcion = "La descripción es obligatoria"
    } else if (form.descripcion.trim().length < 10) {
      nuevos.descripcion = "Describe con al menos 10 caracteres"
    }

    return nuevos
  }

  const esValido =
    form.categoria.trim() &&
    form.beneficiario.trim().length >= 3 &&
    form.monto &&
    parseFloat(form.monto) > 0 &&
    form.descripcion.trim().length >= 10

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nuevosErrores = validar()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setEnviando(true)

    try {
      const payload = {
        categoria: form.categoria.trim(),
        beneficiario: form.beneficiario.trim(),
        monto: parseFloat(form.monto),
        descripcion: form.descripcion.trim(),
      }

      await api.post("/api/egresos/registrar", payload)

      toast.success("Egreso registrado correctamente")
      setForm(INITIAL_FORM)
      setErrores({})
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(
          "El endpoint de egresos no está disponible en el backend. " +
          "Notificar al equipo de backend para que implemente POST /api/egresos/registrar"
        )
      } else {
        toast.error(error.response?.data?.mensaje || "Error al registrar el egreso")
      }
    } finally {
      setEnviando(false)
    }
  }

  const inputClasses = (nombre) =>
    `w-full bg-[#0f1b2d] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors ${
      errores[nombre]
        ? "border-red-500 focus:border-red-500"
        : "border-[#1e3a5f] focus:border-blue-500"
    }`

  return (
    <div className="p-6 min-h-full flex items-start justify-center">
      <div className="w-full max-w-xl mt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Registrar Egreso</h1>
          <p className="text-gray-400 text-sm mt-1">
            Registra un nuevo egreso o gasto del sistema
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-[#111e30] border border-[#1e3a5f] rounded-2xl p-6 space-y-5"
        >
          <div>
            <label
              htmlFor="categoria"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
            >
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className={inputClasses("categoria")}
            >
              <option value="" disabled hidden>
                Seleccionar categoría...
              </option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0f1b2d]">
                  {cat}
                </option>
              ))}
            </select>
            {errores.categoria && (
              <p className="text-red-400 text-xs mt-1">{errores.categoria}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="beneficiario"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
            >
              Beneficiario
            </label>
            <input
              id="beneficiario"
              name="beneficiario"
              type="text"
              value={form.beneficiario}
              onChange={handleChange}
              placeholder="Nombre de la persona o empresa"
              className={inputClasses("beneficiario")}
            />
            {errores.beneficiario && (
              <p className="text-red-400 text-xs mt-1">{errores.beneficiario}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="monto"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
            >
              Monto (S/.)
            </label>
            <input
              id="monto"
              name="monto"
              type="number"
              step="0.01"
              min="0"
              value={form.monto}
              onChange={handleChange}
              placeholder="0.00"
              className={inputClasses("monto")}
            />
            {errores.monto && (
              <p className="text-red-400 text-xs mt-1">{errores.monto}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Detalla el motivo del egreso..."
              className={`${inputClasses("descripcion")} resize-none`}
            />
            {errores.descripcion && (
              <p className="text-red-400 text-xs mt-1">{errores.descripcion}</p>
            )}
            <div className="mt-1 text-xs text-gray-500 text-right">
              {form.descripcion.trim().length}/10 caracteres mínimos
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!esValido || enviando}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors
                bg-blue-600 hover:bg-blue-500 text-white
                disabled:bg-blue-600/30 disabled:text-gray-400 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar Egreso"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
