import { useState, useEffect } from "react"
import api from "../services/axiosConfig"
import { validarCampo } from "../utils/validaciones"
import Swal from "sweetalert2"
import { toast } from "react-toastify"

// ─── Íconos inline ────────────────────────────────────────────────────────────
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213l-4.5 1.5 1.5-4.5 12.362-12.226z" />
  </svg>
)
const IconKey = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
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
const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

// ─── Campo de formulario reutilizable ─────────────────────────────────────────
function CampoForm({ label, nombre, valor, onChange, error, type = "text", disabled = false, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      {children ? children : (
        <input
          type={type}
          value={valor}
          onChange={(e) => onChange(nombre, e.target.value)}
          disabled={disabled}
          className={`bg-[#0f1b2d] border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors
            ${error ? "border-red-500 focus:border-red-400" : "border-[#1e3a5f] focus:border-blue-500"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

// ─── Campo con toggle de visibilidad ──────────────────────────────────────────
function CampoPassword({ label, nombre, valor, onChange, error }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={valor}
          onChange={(e) => onChange(nombre, e.target.value)}
          autoComplete="new-password"
          className={`w-full bg-[#0f1b2d] border rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder-gray-600 outline-none transition-colors
            ${error ? "border-red-500 focus:border-red-400" : "border-[#1e3a5f] focus:border-blue-500"}`}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {visible ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

// ─── Modal base ───────────────────────────────────────────────────────────────
function Modal({ titulo, onClose, children, ancho = "max-w-lg" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full ${ancho} mx-4 bg-[#111e30] border border-[#1e3a5f] rounded-2xl shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a5f]">
          <h3 className="text-white font-bold text-base">{titulo}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <IconClose />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Modal Editar Usuario ──────────────────────────────────────────────────────
function ModalEditar({ usuario, roles, onClose, onGuardado }) {
  const [form, setForm] = useState({
    nombres: usuario.nombres || "",
    apellidos: usuario.apellidos || "",
    correo: usuario.correo || "",
    telefono: usuario.telefono || "",
    nroPuesto: String(usuario.nroPuesto ?? ""),
    genero: usuario.genero || "",
    fechaNacimiento: usuario.fechaNacimiento || "",
    idRol: String(usuario.idRol ?? ""),
  })
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)

  const handleChange = (nombre, valor) => {
    setForm(f => ({ ...f, [nombre]: valor }))
    const err = validarCampo(nombre, valor)
    setErrores(e => ({ ...e, [nombre]: err }))
  }

  const camposValidar = ["nombres", "apellidos", "correo", "telefono", "nroPuesto", "genero", "fechaNacimiento", "idRol"]

  const handleGuardar = async () => {
    const nuevosErrores = {}
    camposValidar.forEach(c => {
      const err = validarCampo(c, form[c])
      if (err) nuevosErrores[c] = err
    })
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setCargando(true)
    try {
      await api.put(`/api/usuarios/${usuario.idUsuario}`, {
        correo: form.correo,
        telefono: form.telefono,
        nroPuesto: Number(form.nroPuesto),
        idRol: Number(form.idRol),
        estado: usuario.estado, // Pasas el estado actual
        genero: form.genero,
        fechaNacimiento: form.fechaNacimiento
      })
      toast.success("Usuario actualizado correctamente")
      onGuardado()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al actualizar el usuario")
    } finally {
      setCargando(false)
    }
  }

  return (
    <Modal titulo="Editar Usuario" onClose={onClose} ancho="max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CampoForm label="Nombres" nombre="nombres" valor={form.nombres} disabled={true} />
        <CampoForm label="Apellidos" nombre="apellidos" valor={form.apellidos} disabled={true} />
        <CampoForm label="Correo" nombre="correo" valor={form.correo} onChange={handleChange} error={errores.correo} type="email" />
        <CampoForm label="Teléfono" nombre="telefono" valor={form.telefono} onChange={handleChange} error={errores.telefono} />
        <CampoForm label="Nro. Puesto" nombre="nroPuesto" valor={form.nroPuesto} onChange={handleChange} error={errores.nroPuesto} />
        <CampoForm label="Género" nombre="genero" valor={form.genero} onChange={handleChange} error={errores.genero}>
          <select
            value={form.genero}
            onChange={(e) => handleChange("genero", e.target.value)}
            className={`bg-[#0f1b2d] border rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors
              ${errores.genero ? "border-red-500" : "border-[#1e3a5f] focus:border-blue-500"}`}
          >
            <option value="">Seleccionar</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
          {errores.genero && <p className="text-red-400 text-xs">{errores.genero}</p>}
        </CampoForm>
        <CampoForm label="Fecha de Nacimiento" nombre="fechaNacimiento" valor={form.fechaNacimiento} onChange={handleChange} error={errores.fechaNacimiento} type="date" />
        <CampoForm label="Rol" nombre="idRol" valor={form.idRol} onChange={handleChange} error={errores.idRol}>
          <select
            value={form.idRol}
            onChange={(e) => handleChange("idRol", e.target.value)}
            className={`bg-[#0f1b2d] border rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors
              ${errores.idRol ? "border-red-500" : "border-[#1e3a5f] focus:border-blue-500"}`}
          >
            <option value="">Seleccionar</option>
            {roles.map(r => (
              <option key={r.idRol} value={r.idRol}>{r.tipoRol}</option>
            ))}
          </select>
          {errores.idRol && <p className="text-red-400 text-xs">{errores.idRol}</p>}
        </CampoForm>
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
          {cargando ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </Modal>
  )
}

// ─── Modal Restablecer Contraseña ──────────────────────────────────────────────
function ModalRestablecerPassword({ usuario, onClose }) {
  const [form, setForm] = useState({ contrasena: "", confirmarContrasena: "" })
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)

  const handleChange = (nombre, valor) => {
    setForm(f => ({ ...f, [nombre]: valor }))
    if (nombre === "contrasena") {
      const err = validarCampo("contrasena", valor)
      setErrores(e => ({ ...e, contrasena: err }))
    }
    if (nombre === "confirmarContrasena") {
      const err = valor !== form.contrasena ? "Las contraseñas no coinciden" : null
      setErrores(e => ({ ...e, confirmarContrasena: err }))
    }
  }

  const handleGuardar = async () => {
    const nuevosErrores = {}
    const errPass = validarCampo("contrasena", form.contrasena)
    if (errPass) nuevosErrores.contrasena = errPass
    if (!form.confirmarContrasena) nuevosErrores.confirmarContrasena = "Confirma tu contraseña"
    else if (form.contrasena !== form.confirmarContrasena) nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden"

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setCargando(true)
    try {
      await api.put("/api/usuarios/restablecer-forzado", {
        dni: usuario.dni, // 🔑 Enviamos el DNI en el cuerpo como pide tu RestablecerFuerzaDTO
        nuevaContrasena: form.contrasena
      })
      toast.success("Contraseña restablecida correctamente")
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al restablecer la contraseña")
    } finally {
      setCargando(false)
    }
  }

  return (
    <Modal titulo={`Restablecer Contraseña — ${usuario.nombres}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-400">
          Establece una nueva contraseña para el usuario. Deberá tener al menos 8 caracteres.
        </p>
        <CampoPassword label="Nueva Contraseña" nombre="contrasena" valor={form.contrasena} onChange={handleChange} error={errores.contrasena} />
        <CampoPassword label="Confirmar Contraseña" nombre="confirmarContrasena" valor={form.confirmarContrasena} onChange={handleChange} error={errores.confirmarContrasena} />
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
          {cargando ? "Guardando..." : "Restablecer"}
        </button>
      </div>
    </Modal>
  )
}

// ─── Badge de Estado ───────────────────────────────────────────────────────────
function BadgeEstado({ activo }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
      ${activo ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${activo ? "bg-emerald-400" : "bg-red-400"}`} />
      {activo ? "Activo" : "Inactivo"}
    </span>
  )
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function MantenimientoUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [modalEditar, setModalEditar] = useState(null)   // usuario seleccionado
  const [modalPassword, setModalPassword] = useState(null) // usuario seleccionado

  // ── Carga inicial ──
  const cargarUsuarios = async () => {
  try {
    const res = await api.get("/api/usuarios/listar")
    setUsuarios(res.data)
  } catch (error) {
    console.log("ERROR USUARIOS:", error.response?.status, error.response?.data)
    toast.error("No se pudo cargar la lista de usuarios")
  } finally {
    setCargando(false)
  }
}

  const cargarRoles = async () => {
  try {
    const res = await api.get("/api/roles")
    setRoles(res.data)
  } catch (error) {
    console.log("ERROR ROLES:", error.response?.status, error.response?.data)
  }
}

useEffect(() => {
  const inicializar = async () => {
    await cargarUsuarios()
    await cargarRoles()
  }
  inicializar()
}, [])

  // ── Eliminar lógico ──
  const handleEliminar = (usuario) => {
    Swal.fire({
      title: "¿Inhabilitar usuario?",
      html: `El usuario <strong>${usuario.nombres} ${usuario.apellidos}</strong> pasará a estado <strong>Inactivo</strong>.<br/>Podrás reactivarlo después si es necesario.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, inhabilitar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#1e3a5f",
      background: "#111e30",
      color: "#f1f5f9",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/usuarios/${usuario.idUsuario}`)
          toast.success(`Usuario ${usuario.nombres} inhabilitado correctamente`)
          cargarUsuarios()
        } catch (error) {
          toast.error(error.response?.data?.error || "Error al inhabilitar el usuario")
        }
      }
    })
  }

  // ── Filtro de búsqueda ──
  const usuariosFiltrados = usuarios.filter(u => {
    const texto = busqueda.toLowerCase()
    return (
      u.dni?.toLowerCase().includes(texto) ||
      u.nombres?.toLowerCase().includes(texto)
    )
  })

  return (
    <div className="p-6 min-h-full">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Mantenimiento de Usuarios</h1>
        <p className="text-gray-400 text-sm mt-1">Gestión centralizada del personal y comerciantes del CC Arenales</p>
      </div>

      {/* ── Barra de búsqueda + contador ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-80">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por DNI, nombre, correo, rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#111e30] border border-[#1e3a5f] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {usuariosFiltrados.length} usuario{usuariosFiltrados.length !== 1 ? "s" : ""} encontrado{usuariosFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Tabla ── */}
      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                {["DNI", "Nombres y Apellidos", "Correo", "Celular", "Nro. Puesto", "Rol", "Estado", "Acciones"].map(col => (
                  <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Cargando usuarios...</span>
                    </div>
                  </td>
                </tr>
              ) : usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-500 text-xs">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u, i) => (
                  <tr
                    key={u.idUsuario}
                    className={`border-b border-[#1e3a5f]/50 transition-colors hover:bg-[#1a2d4a]/40
                      ${i % 2 === 0 ? "" : "bg-[#0f1b2d]/30"}`}
                  >
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">{u.dni}</td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                      {u.nombres} {u.apellidos}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{u.correo || "—"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{u.telefono}</td>
                    <td className="px-4 py-3 text-gray-300 text-center">{u.nroPuesto}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                        {u.tipoRol || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <BadgeEstado activo={u.estado === true || u.estado === 1} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {/* Editar */}
                        <button
                          onClick={() => setModalEditar(u)}
                          title="Editar usuario"
                          className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/15 hover:text-blue-300 transition-colors"
                        >
                          <IconEdit />
                        </button>
                        {/* Restablecer contraseña */}
                        <button
                          onClick={() => setModalPassword(u)}
                          title="Restablecer contraseña"
                          className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/15 hover:text-amber-300 transition-colors"
                        >
                          <IconKey />
                        </button>
                        {/* Eliminar / Inhabilitar */}
                        <button
                          onClick={() => handleEliminar(u)}
                          title="Inhabilitar usuario"
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

      {/* ── Modales ── */}
      {modalEditar && (
        <ModalEditar
          usuario={modalEditar}
          roles={roles}
          onClose={() => setModalEditar(null)}
          onGuardado={cargarUsuarios}
        />
      )}
      {modalPassword && (
        <ModalRestablecerPassword
          usuario={modalPassword}
          onClose={() => setModalPassword(null)}
        />
      )}
    </div>
  )
}