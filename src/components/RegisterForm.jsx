export default function RegisterForm({ onSubmit }) {
  return (
<div className="min-h-screen bg-[#0f1b2d] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Crear Cuenta
        </h1>

        <div className="bg-[#1a2d4a] rounded-3xl p-8">
          <form onSubmit={onSubmit} noValidate>
            <div className="grid grid-cols-2 gap-6">

              {/* Nombre completo */}
              <div className="col-span-2">
                <label className="block text-white font-semibold mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Juan Pérez"
                  className="w-full bg-white rounded-lg px-4 py-3 text-gray-800
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* DNI */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  DNI
                </label>
                <input
                  type="text"
                  name="dni"
                  placeholder="12345678"
                  maxLength={8}
                  className="w-full bg-white rounded-lg px-4 py-3 text-gray-800
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Correo */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="juan@email.com"
                  className="w-full bg-white rounded-lg px-4 py-3 text-gray-800
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-white rounded-lg px-4 py-3 text-gray-800
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  placeholder="987654321"
                  maxLength={9}
                  className="w-full bg-white rounded-lg px-4 py-3 text-gray-800
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Botón */}
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