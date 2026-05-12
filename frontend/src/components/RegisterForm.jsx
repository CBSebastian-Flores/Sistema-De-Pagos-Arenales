import { useState } from 'react'
import { validarFormulario } from '../utils/validaciones'

const Campo = ({ nombre, tipo, placeholder, colSpan, valor, onChange, error, children }) => (
  <div className={colSpan ? "col-span-2" : ""}>
    <label className="block text-white font-semibold mb-2">
        {nombre === 'dni'             ? 'DNI' :
        nombre === 'correo'          ? 'Correo electrónico' :
        nombre === 'nombre'          ? 'Nombre' :
        nombre === 'apellidos'       ? 'Apellidos' :
        nombre === 'fechaNacimiento' ? 'Fecha de nacimiento' :
        nombre === 'nroPuesto'       ? 'N° de Puesto' :
        nombre === 'genero'          ? 'Género' :
        nombre === 'contrasena'      ? 'Contraseña' : nombre}
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
  contrasena: '', fechaNacimiento: '', genero: '', nroPuesto: ''
})
  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    setCampos({ ...campos, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: null })
  }

const handleSubmit = (e) => {
  e.preventDefault()
  const nuevosErrores = validarFormulario(campos)
  if (Object.keys(nuevosErrores).length > 0) {
    setErrores(nuevosErrores)
    return
  }
  
  const datosParaBackend = {
    nombres: campos.nombre,    // ← verifica que esta línea exista
    apellidos: campos.apellidos,
    dni: campos.dni,
    correo: campos.correo,
    contrasena: campos.contrasena,
    fechaNacimiento: campos.fechaNacimiento,
    genero: campos.genero,
    nroPuesto: campos.nroPuesto,
    estado: true,
    idRol: 3
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

              <Campo nombre="nombre"          tipo="text"   placeholder="Juan"           valor={campos.nombre}          onChange={handleChange} error={errores.nombre} />
                <Campo nombre="apellidos"       tipo="text"   placeholder="Pérez López"    valor={campos.apellidos}       onChange={handleChange} error={errores.apellidos} />
                
                {/* DNI - solo números */}
                <div>
                <label className="block text-white font-semibold mb-2">DNI</label>
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
                    }
                    setCampos({ ...campos, dni: valor.replace(/[^0-9]/g, '') })
                    }}
                    placeholder="12345678"
                    maxLength={8}
                    className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm
                    focus:outline-none focus:ring-2
                    ${errores.dni
                        ? 'bg-red-50 ring-2 ring-red-400 focus:ring-red-400'
                        : 'bg-white focus:ring-blue-400'
                    }`}
                />
                {errores.dni && <p className="text-red-400 text-xs mt-1">{errores.dni}</p>}
                </div>              <Campo nombre="nroPuesto"       tipo="number" placeholder="Ej: 12"         valor={campos.nroPuesto}       onChange={handleChange} error={errores.nroPuesto} />
                
                <Campo nombre="fechaNacimiento" tipo="date"   placeholder=""               valor={campos.fechaNacimiento} onChange={handleChange} error={errores.fechaNacimiento} />
                <Campo nombre="genero"          tipo=""         placeholder=""               valor={campos.genero}          onChange={handleChange} error={errores.genero}>
                <select
                  name="genero"
                  value={campos.genero}
                  onChange={handleChange}
                  className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm
                    focus:outline-none focus:ring-2
                    ${errores.genero
                      ? 'bg-red-50 ring-2 ring-red-400'
                      : 'bg-white focus:ring-blue-400'
                    }`}>
                  <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                </select>
              </Campo>
              <Campo nombre="correo"    tipo="email"    placeholder="juan@email.com"      colSpan={true} valor={campos.correo}    onChange={handleChange} error={errores.correo} />
              <Campo nombre="contrasena" tipo="password" placeholder="Mínimo 8 caracteres" colSpan={true} valor={campos.contrasena} onChange={handleChange} error={errores.contrasena} />

              <div className="col-span-2 mt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white
                             font-semibold py-3 rounded-lg transition-colors text-sm">
                  Registrarse
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}