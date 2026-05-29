import { useState } from 'react'

export default function Login({ onLogin }) {
  const [campos, setCampos] = useState({ dni: '', contrasena: '' })
  const [errores, setErrores] = useState({})
  const [verContrasena, setVerContrasena] = useState(false)

  const handleChange = (e) => {
    setCampos({ ...campos, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: null })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevosErrores = {}

    if (!campos.dni.trim()) nuevosErrores.dni = 'El DNI es obligatorio'
    else if (!/^\d{8}$/.test(campos.dni)) nuevosErrores.dni = 'El DNI debe tener 8 dígitos'
    if (!campos.contrasena.trim()) nuevosErrores.contrasena = 'La contraseña es obligatoria'

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    onLogin(campos)
  }

  return (
    <div className="min-h-screen bg-[#0f1b2d] flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">Bienvenido</h1>
          <p className="text-gray-400 mt-2 text-sm">Sistema de Pagos Arenales</p>
        </div>

        <div className="bg-[#1a2d4a] rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label className="block text-white font-semibold mb-2">DNI</label>
              <input
                type="text"
                name="dni"
                value={campos.dni}
                onChange={(e) => {
                  const valor = e.target.value.replace(/[^0-9]/g, '')
                  setCampos({ ...campos, dni: valor })
                  setErrores({ ...errores, dni: null })
                }}
                placeholder="12345678"
                maxLength={8}
                className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 ${errores.dni ? 'bg-red-50 ring-2 ring-red-400' : 'bg-white focus:ring-blue-400'}`}
              />
              {errores.dni && <p className="text-red-400 text-xs mt-1">{errores.dni}</p>}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={verContrasena ? 'text' : 'password'}
                  name="contrasena"
                  value={campos.contrasena}
                  onChange={handleChange}
                  placeholder="Tu contraseña"
                  className={`w-full rounded-lg px-4 py-3 text-gray-800 text-sm pr-12 focus:outline-none focus:ring-2 ${errores.contrasena ? 'bg-red-50 ring-2 ring-red-400' : 'bg-white focus:ring-blue-400'}`}
                />
                <button
                  type="button"
                  onClick={() => setVerContrasena(!verContrasena)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium hover:text-gray-700">
                  {verContrasena ? 'Ocultar' : 'Ver'}
                </button>
              </div>
              {errores.contrasena && <p className="text-red-400 text-xs mt-1">{errores.contrasena}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm mt-2">
              Ingresar
            </button>

            <div className="text-center mt-4">
              <a href="/solicitar-recuperacion" className="text-gray-400 hover:text-white text-sm transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}