import { useState } from "react";

const menuItems = [
  {
    section: "Usuario",
    items: [
      { nombre: "Mis Pagos Pendientes", roles: ["ADMINISTRADOR", "DIRECTIVA", "TESORERO"] },
      { nombre: "Mi Historial de Pagos", roles: ["ADMINISTRADOR", "DIRECTIVA", "TESORERO"] },
    ],
  },
  {
    section: "Gestión de Recaudación",
    items: [
      { nombre: "Vista de Pagos", roles: ["ADMINISTRADOR", "TESORERO"] },
      { nombre: "Registrar Egresos", roles: ["ADMINISTRADOR", "TESORERO"] },
    ],
  },
  {
    section: "Panel de Gráficos",
    items: [
      { nombre: "Dashboard Analítico", roles: ["ADMINISTRADOR", "TESORERO"] }
    ]
  },
  {
    section: "Configuración",
    items: [
      { nombre: "Generación de Pagos", roles: ["ADMINISTRADOR", "TESORERO"] },
      { nombre: "Registro de Usuario", roles: ["ADMINISTRADOR"] },
      { nombre: "Mantenimiento de Usuarios", roles: ["ADMINISTRADOR"] },
      { nombre: "Mantenimiento de Servicios", roles: ["ADMINISTRADOR", "TESORERO"] },
    ],
  },
];

export default function Sidebar({ paginaActiva, setPaginaActiva, onCerrarSesion }) {
  const [usuarioInfo] = useState(() => {
    const nombres = sessionStorage.getItem("nombres");
    const rol = (sessionStorage.getItem("rol") || "").toUpperCase();
    return { nombres: nombres || "Usuario", rol };
  });

  return (
    <div className="w-56 min-h-screen bg-[#0f1b2d] border-r border-[#1e3a5f] flex flex-col">
      {/* Header usuario dinámico */}
      <div className="flex flex-col px-4 py-4 border-b border-[#1e3a5f]">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold text-sm truncate max-w-37.5">
            {usuarioInfo.nombres}
          </span>
          <span className="text-gray-400 text-xs">{">"}</span>
        </div>
        {usuarioInfo.rol && (
          <span className="text-blue-400 text-[11px] font-bold mt-0.5 uppercase tracking-wider">
            {usuarioInfo.rol}
          </span>
        )}
      </div>

      {/* Menú */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((grupo) => {
          const itemsFiltrados = grupo.items.filter(item =>
            item.roles.includes(usuarioInfo.rol)
          );

          if (itemsFiltrados.length === 0) return null;

          return (
            <div key={grupo.section} className="mb-4">
              <p className="text-gray-500 text-xs px-4 mb-1">{grupo.section}</p>
              {itemsFiltrados.map((item) => (
                <button
                  key={item.nombre}
                  onClick={() => setPaginaActiva(item.nombre)}
                  className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors
                    ${paginaActiva === item.nombre
                      ? "bg-[#1e3a5f] text-white"
                      : "text-gray-300 hover:bg-[#1a2d4a] hover:text-white"
                    }`}
                >
                  {item.nombre}
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Cerrar sesión */}
      <div className="border-t border-[#1e3a5f] p-4">
        <button
          onClick={onCerrarSesion}
          className="w-full cursor-pointer text-left text-gray-400 hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}