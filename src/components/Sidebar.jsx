const menuItems = [
  { section: "Usuario", items: ["Mis Pagos Pendientes", "Mi Historial de Pagos"] },
  { section: "Gestión de Recaudación", items: ["Vista de Pagos", "Registrar Egresos"] },
  { section: "Panel de Gráficos", items: ["Dashboard Analítico"] },
  { section: "Configuración", items: ["Generación de Pagos", "Registro de Usuario"] },
]

export default function Sidebar({ paginaActiva, setPaginaActiva }) {
  return (
    <div className="w-56 min-h-screen bg-[#0f1b2d] border-r border-[#1e3a5f] flex flex-col">

      {/* Header usuario */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#1e3a5f]">
        <span className="text-white font-semibold text-sm">User</span>
        <span className="text-gray-400 text-xs">{">"}</span>
      </div>

      {/* Menú */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((grupo) => (
          <div key={grupo.section} className="mb-4">
            <p className="text-gray-500 text-xs px-4 mb-1">{grupo.section}</p>
            {grupo.items.map((item) => (
              <button
                key={item}
                onClick={() => setPaginaActiva(item)}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors
                  ${paginaActiva === item
                    ? "bg-[#1e3a5f] text-white"
                    : "text-gray-300 hover:bg-[#1a2d4a] hover:text-white"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div className="border-t border-[#1e3a5f] p-4">
        <button className="text-gray-400 hover:text-white text-sm transition-colors">
          Cerrar Sesión
        </button>
      </div>

    </div>
  )
}