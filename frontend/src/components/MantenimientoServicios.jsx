import { useState, useEffect } from "react"
import api from "../services/axiosConfig"
import Swal from "sweetalert2"
import { toast } from "react-toastify"

// ─── Íconos inline ────────────────────────────────────────────────────────────
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213l-4.5 1.5 1.5-4.5 12.362-12.226z" />
  </svg>
)
const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
)
const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

// ─── Modal base ───────────────────────────────────────────────────────────────
function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-[#111e30] border border-[#1e3a5f] rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a5f]">
          <h3 className="text-white font-bold text-base">{titulo}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <IconClose />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Campo de formulario ──────────────────────────────────────────────────────
function CampoForm({ label, nombre, valor, onChange, error, type = "text", disabled = false, placeholder = "" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={valor}
        onChange={(e) => onChange(nombre, e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`bg-[#0f1b2d] border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors
          ${error ? "border-red-500 focus:border-red-400" : "border-[#1e3a5f] focus:border-blue-500"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

// ─── Modal Crear / Editar Servicio ────────────────────────────────────────────
function ModalServicio({ servicio, onClose, onGuardado }) {
  const esEdicion = !!servicio

  const [form, setForm] = useState({
    nombreServicio: servicio?.nombreServicio || "",
    descripcion: servicio?.descripcion || "",
    precioBase: servicio?.precioBase !== undefined ? String(servicio.precioBase) : "",
  })
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)

  const handleChange = (nombre, valor) => {
    setForm(f => ({ ...f, [nombre]: valor }))
    setErrores(e => ({ ...e, [nombre]: null }))
  }

  const validar = () => {
    const nuevosErrores = {}
    if (!form.nombreServicio.trim()) nuevosErrores.nombreServicio = "El nombre es obligatorio"
    if (form.precioBase === "" || form.precioBase === null) {
      nuevosErrores.precioBase = "El precio base es obligatorio"
    } else if (isNaN(Number(form.precioBase)) || Number(form.precioBase) < 0) {
      nuevosErrores.precioBase = "El precio base no puede ser menor a 0"
    }
    return nuevosErrores
  }

  const handleGuardar = async () => {
    const nuevosErrores = validar()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    const payload = {
      nombreServicio: form.nombreServicio.trim(),
      descripcion: form.descripcion.trim() || null,
      precioBase: Number(form.precioBase),
    }

    setCargando(true)
    try {
      if (esEdicion) {
        await api.put(`/api/servicios/actualizar/${servicio.idServicio}`, payload)
        toast.success("Servicio actualizado correctamente")
      } else {
        await api.post("/api/servicios/crear", payload)
        toast.success("Servicio registrado correctamente")
      }
      onGuardado()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al guardar el servicio")
    } finally {
      setCargando(false)
    }
  }

  return (
    <Modal titulo={esEdicion ? "Editar Servicio" : "Registrar Nuevo Servicio"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* ID solo en edición */}
        {esEdicion && (
          <CampoForm
            label="ID Servicio"
            nombre="idServicio"
            valor={String(servicio.idServicio)}
            onChange={() => {}}
            disabled
          />
        )}
        <CampoForm
          label="Nombre del Servicio"
          nombre="nombreServicio"
          valor={form.nombreServicio}
          onChange={handleChange}
          error={errores.nombreServicio}
          placeholder="Ej: Limpieza, Seguridad..."
        />
        <CampoForm
          label="Descripción (opcional)"
          nombre="descripcion"
          valor={form.descripcion}
          onChange={handleChange}
          error={errores.descripcion}
          placeholder="Descripción breve del servicio"
        />
        <CampoForm
          label="Precio Base (S/.)"
          nombre="precioBase"
          valor={form.precioBase}
          onChange={handleChange}
          error={errores.precioBase}
          type="number"
          placeholder="0.00"
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-[#1e3a5f] hover:border-gray-500 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={cargando}
          className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
        >
          {cargando ? "Guardando..." : esEdicion ? "Guardar Cambios" : "Registrar Servicio"}
        </button>
      </div>
    </Modal>
  )
}

// ─── Badge de Estado ──────────────────────────────────────────────────────────
function BadgeEstado({ activo }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
      ${activo ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${activo ? "bg-emerald-400" : "bg-red-400"}`} />
      {activo ? "Activo" : "Inactivo"}
    </span>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function MantenimientoServicios() {
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [modalServicio, setModalServicio] = useState(undefined) // undefined = cerrado, null = nuevo, objeto = editar

  // ── Carga de servicios ──
  const cargarServicios = async () => {
    try {
      const res = await api.get("/api/servicios/listar")
      setServicios(res.data)
    } catch (error) {
      console.log("ERROR SERVICIOS:", error.response?.status, error.response?.data)
      toast.error("No se pudo cargar la lista de servicios")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    const inicializar = async () => {
      await cargarServicios()
    }
    inicializar()
  }, [])

  // ── Eliminar servicio ──
  const handleEliminar = (servicio) => {
    Swal.fire({
      title: "¿Eliminar servicio?",
      html: `El servicio <strong>${servicio.nombreServicio}</strong> será eliminado del catálogo.<br/>Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#1e3a5f",
      background: "#111e30",
      color: "#f1f5f9",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/servicios/inhabilitar/${servicio.idServicio}`)
          toast.success(`Servicio "${servicio.nombreServicio}" inhabilitado correctamente`)
          cargarServicios()
        } catch (error) {
          toast.error(error.response?.data?.error || "Error al eliminar el servicio")
        }
      }
    })
  }

  // ── Filtro de búsqueda ──
  const serviciosFiltrados = servicios.filter(s => {
    const texto = busqueda.toLowerCase()
    return (
      s.nombreServicio?.toLowerCase().includes(texto) ||
      s.descripcion?.toLowerCase().includes(texto)
    )
  })

  return (
    <div className="p-6 min-h-full">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Mantenimiento de Servicios</h1>
        <p className="text-gray-400 text-sm mt-1">Catálogo centralizado de conceptos de cobro del CC Arenales</p>
      </div>

      {/* ── Barra de búsqueda + botón nuevo ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-80">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#111e30] border border-[#1e3a5f] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {serviciosFiltrados.length} servicio{serviciosFiltrados.length !== 1 ? "s" : ""} encontrado{serviciosFiltrados.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setModalServicio(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            <IconPlus />
            Nuevo Servicio
          </button>
        </div>
      </div>

      {/* ── Tabla ── */}
      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                {["ID", "Nombre", "Descripción", "Precio Base", "Estado", "Acciones"].map(col => (
                  <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Cargando servicios...</span>
                    </div>
                  </td>
                </tr>
              ) : serviciosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500 text-xs">
                    No se encontraron servicios
                  </td>
                </tr>
              ) : (
                serviciosFiltrados.map((s, i) => (
                  <tr
                    key={s.idServicio}
                    className={`border-b border-[#1e3a5f]/50 transition-colors hover:bg-[#1a2d4a]/40
                      ${i % 2 === 0 ? "" : "bg-[#0f1b2d]/30"}`}
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.idServicio}</td>
                    <td className="px-4 py-3 text-white font-medium">{s.nombreServicio}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{s.descripcion || "—"}</td>
                    <td className="px-4 py-3 text-gray-300 text-xs font-mono">
                      S/. {Number(s.precioBase).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <BadgeEstado activo={s.estado === true || s.estado === 1} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setModalServicio(s)}
                          title="Editar servicio"
                          className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/15 hover:text-blue-300 transition-colors"
                        >
                          <IconEdit />
                        </button>
                        <button
                          onClick={() => handleEliminar(s)}
                          title="Eliminar servicio"
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ── */}
      {modalServicio !== undefined && (
        <ModalServicio
          servicio={modalServicio}
          onClose={() => setModalServicio(undefined)}
          onGuardado={cargarServicios}
        />
      )}
    </div>
  )
}