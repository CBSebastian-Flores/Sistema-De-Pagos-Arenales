import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { validarFormulario } from '../utils/validaciones'
import { verificarDni, listarRoles } from '../services/authService';

const Campo = ({ nombre, tipo, placeholder, colSpan, valor, onChange, error, children }) => (
  <div className={colSpan ? "col-span-2" : ""}>
    <label className="block text-white font-semibold mb-2">
        {nombre === 'dni'                ? 'DNI' :
         nombre === 'correo'             ? 'Correo electrónico (opcional)' :
         nombre === 'nombre'             ? 'Nombre' :
         nombre === 'apellidos'          ? 'Apellidos' :
         nombre === 'fechaNacimiento'    ? 'Fecha de nacimiento' :
         nombre === 'nroPuesto'          ? 'N° de Puesto' :
         nombre === 'genero'             ? 'Género' :
         nombre === 'contrasena'         ? 'Contraseña' :
         nombre === 'confirmarContrasena'? 'Confirmar contraseña' : nombre}
    </label>
    {children ? children : (
      <input
        type={tipo}
        name={nombre}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={nombre === 'dni' ? 8 : undefined}
        className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm
          focus:outline-none focus:ring-2
          ${error
            ? 'bg-red-50 ring-2 ring-red-400 focus:ring-red-400'
            : 'bg-white focus:ring-blue-400'
          }`}
      />
    )}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
)

export default function RegisterForm({ onSubmit }) {
  const [campos, setCampos] = useState({
    nombre: '', apellidos: '', dni: '', correo: '',
    contrasena: '', confirmarContrasena: '', fechaNacimiento: '',
    genero: '', nroPuesto: '', telefono: '', idRol: ''
  })

  const [roles, setRoles] = useState([])

  useEffect(() => {
    const cargarRoles = async () => {
    try {
        const data = await listarRoles()
        setRoles(data) // Guardamos los roles de la base de datos
      } catch {
        toast.error('No se pudieron cargar los roles del sistema')
      }
    }
    cargarRoles()
  }, [])

  const [errores, setErrores] = useState({})
  const [verContrasena, setVerContrasena] = useState(false)
  const [verConfirmar, setVerConfirmar] = useState(false)
  const [isDniVerificado, setIsDniVerificado] = useState(false)
  const [verificando, setVerificando] = useState(false)

  const obtenerFechaMaximaPermitida = () => {
    const hoy = new Date()
    const anioMaximo = hoy.getFullYear() - 18
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const dia = String(hoy.getDate()).padStart(2, '0')
    return `${anioMaximo}-${mes}-${dia}`
  }

  const handleChange = (e) => {
    setCampos({ ...campos, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: null })
  }

  const handleVerificarDni = async () => {
    if (!campos.dni || campos.dni.length !== 8) {
      setErrores({ ...errores, dni: 'Ingresa un DNI válido de 8 dígitos para verificar' })
      return
    }

    setVerificando(true)
    try {
      // Consumimos la función acoplada a tus interceptores
      const existeDni = await verificarDni(campos.dni)

      if (existeDni === false) {
        setIsDniVerificado(false)
        toast.error('DNI Inexistente — no se encontró en los registros oficiales')
      } else {
        setIsDniVerificado(true)
        toast.success('DNI Verificado correctamente')
        /* Esto se conversara
        // Autocompletar nombre y apellidos si la API los devuelve
        if (data.nombres || data.apellidoPaterno) {
          setCampos(prev => ({
            ...prev,
            nombre: data.nombres ?? prev.nombre,
            apellidos: `${data.apellidoPaterno ?? ''} ${data.apellidoMaterno ?? ''}`.trim()
          }))
        }*/
      }
    } catch {
      setIsDniVerificado(false)
      toast.error('Error al conectar con el servicio de verificación')
    } finally {
      setVerificando(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const nuevosErrores = validarFormulario(campos)

    if (!campos.idRol) {
      nuevosErrores.idRol = 'Selecciona un rol'
    }

    if (!campos.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Confirma tu contraseña'
    } else if (campos.contrasena !== campos.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden'
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    const datosParaBackend = {
      nombres: campos.nombre,
      apellidos: campos.apellidos,
      dni: campos.dni,
      correo: campos.correo || null,
      contrasena: campos.contrasena,
      fechaNacimiento: campos.fechaNacimiento,
      genero: campos.genero,
      nroPuesto: parseInt(campos.nroPuesto),
      telefono: campos.telefono,
      idRol: parseInt(campos.idRol)
    }

    console.log('📤 datosParaBackend:', JSON.stringify(datosParaBackend, null, 2))
    onSubmit(datosParaBackend)
  }

  return (
    <div className="flex items-center justify-center p-6 h-full">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Crear Cuenta
        </h1>
        <div className="bg-[#1a2d4a] rounded-3xl p-8">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-6">

              {/* Nombre */}
              <Campo nombre="nombre" tipo="text" placeholder="Juan" valor={campos.nombre} onChange={handleChange} error={errores.nombre} />

              {/* Apellidos */}
              <Campo nombre="apellidos" tipo="text" placeholder="Pérez López" valor={campos.apellidos} onChange={handleChange} error={errores.apellidos} />

              {/* DNI con botón Verificar */}
              <div className="col-span-2">
                <label className="block text-white font-semibold mb-2">DNI</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="dni"
                    value={campos.dni}
                    onChange={(e) => {
                      const valor = e.target.value
                      if (/[^0-9]/.test(valor)) {
                        setErrores({ ...errores, dni: "El DNI solo acepta números" })
                      } else {
                        setErrores({ ...errores, dni: null })
                        setIsDniVerificado(false)
                      }
                      setCampos({ ...campos, dni: valor.replace(/[^0-9]/g, '') })
                    }}
                    placeholder="12345678"
                    maxLength={8}
                    className={`flex-1 rounded-lg px-4 py-3 text-gray-800 text-sm
                      focus:outline-none focus:ring-2
                      ${errores.dni ? 'bg-red-50 ring-2 ring-red-400 focus:ring-red-400' : 'bg-white focus:ring-blue-400'}`}
                  />
                  <button
                    type="button"
                    onClick={handleVerificarDni}
                    disabled={verificando || isDniVerificado}
                    className={`px-5 py-3 rounded-lg text-sm font-semibold transition-colors
                      ${isDniVerificado
                        ? 'bg-green-500 text-white cursor-default'
                        : verificando
                          ? 'bg-gray-400 text-white cursor-wait'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                    {isDniVerificado ? '✓ Verificado' : verificando ? 'Verificando...' : 'Verificar'}
                  </button>
                </div>
                {errores.dni && <p className="text-red-400 text-xs mt-1">{errores.dni}</p>}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-white font-semibold mb-2">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={campos.telefono}
                  onChange={(e) => {
                    const valor = e.target.value
                    if (/[^0-9]/.test(valor)) {
                      setErrores({ ...errores, telefono: "El teléfono solo acepta números" })
                    } else {
                      setErrores({ ...errores, telefono: null })
                    }
                    setCampos({ ...campos, telefono: valor.replace(/[^0-9]/g, '') })
                  }}
                  placeholder="987654321"
                  maxLength={9}
                  className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm
                    focus:outline-none focus:ring-2
                    ${errores.telefono ? 'bg-red-50 ring-2 ring-red-400 focus:ring-red-400' : 'bg-white focus:ring-blue-400'}`}
                />
                {errores.telefono && <p className="text-red-400 text-xs mt-1">{errores.telefono}</p>}
              </div>

              {/* N° de Puesto */}
              <Campo nombre="nroPuesto" tipo="number" placeholder="Ej: 12" valor={campos.nroPuesto} onChange={handleChange} error={errores.nroPuesto} />

              {/* Fecha de nacimiento */}
              <div>
                <label className="block text-white font-semibold mb-2">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={campos.fechaNacimiento}
                  onChange={handleChange}
                  max={obtenerFechaMaximaPermitida()}
                  className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm
                    focus:outline-none focus:ring-2
                    ${errores.fechaNacimiento ? 'bg-red-50 ring-2 ring-red-400 focus:ring-red-400' : 'bg-white focus:ring-blue-400'}`}
                />
                {errores.fechaNacimiento && <p className="text-red-400 text-xs mt-1">{errores.fechaNacimiento}</p>}
              </div>

              {/* Género */}
              <Campo nombre="genero" tipo="" placeholder="" valor={campos.genero} onChange={handleChange} error={errores.genero}>
                <select
                  name="genero"
                  value={campos.genero}
                  onChange={handleChange}
                  className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm
                    focus:outline-none focus:ring-2
                    ${errores.genero ? 'bg-red-50 ring-2 ring-red-400' : 'bg-white focus:ring-blue-400'}`}>
                  <option value="" disabled hidden>Seleccionar...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </Campo>

              {/* Correo opcional */}
              <Campo nombre="correo" tipo="email" placeholder="juan@email.com (opcional)" colSpan={true} valor={campos.correo} onChange={handleChange} error={errores.correo} />

              {/* Rol */}
              <div className="col-span-2">
                <label className="block text-white font-semibold mb-2">Rol</label>
                  <select
                    name="idRol"
                    value={campos.idRol}
                    onChange={handleChange}
                    className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 ${errores.idRol ? 'bg-red-50 ring-2 ring-red-400' : 'bg-white focus:ring-blue-400'}`}>
                    <option value="" disabled hidden>Seleccionar rol...</option>
                    {roles.map((rol) => (
                      <option key={rol.idRol} value={rol.idRol}>
                        {rol.tipoRol}
                      </option>
                    ))}
                  </select>
                  {errores.idRol && <p className="text-red-400 text-xs mt-1">{errores.idRol}</p>}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-white font-semibold mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={verContrasena ? 'text' : 'password'}
                    name="contrasena"
                    value={campos.contrasena}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm pr-12
                      focus:outline-none focus:ring-2
                      ${errores.contrasena ? 'bg-red-50 ring-2 ring-red-400 focus:ring-red-400' : 'bg-white focus:ring-blue-400'}`}
                  />
                  <button type="button" onClick={() => setVerContrasena(!verContrasena)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium hover:text-gray-700">
                    {verContrasena ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
                {errores.contrasena && <p className="text-red-400 text-xs mt-1">{errores.contrasena}</p>}
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="block text-white font-semibold mb-2">Confirmar contraseña</label>
                <div className="relative">
                  <input
                    type={verConfirmar ? 'text' : 'password'}
                    name="confirmarContrasena"
                    value={campos.confirmarContrasena}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm pr-12
                      focus:outline-none focus:ring-2
                      ${errores.confirmarContrasena ? 'bg-red-50 ring-2 ring-red-400 focus:ring-red-400' : 'bg-white focus:ring-blue-400'}`}
                  />
                  <button type="button" onClick={() => setVerConfirmar(!verConfirmar)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium hover:text-gray-700">
                    {verConfirmar ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
                {errores.confirmarContrasena && <p className="text-red-400 text-xs mt-1">{errores.confirmarContrasena}</p>}
              </div>

              {/* Botón deshabilitado hasta verificar DNI */}
              <div className="col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={!isDniVerificado}
                  className={`w-full font-semibold py-3 rounded-lg transition-colors text-sm
                    ${isDniVerificado
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}>
                  {isDniVerificado ? 'Registrarse' : 'Verifica el DNI para continuar'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}