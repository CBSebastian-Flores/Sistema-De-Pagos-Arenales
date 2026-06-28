import { useState } from "react"
import Sidebar from "./Sidebar"
import RegisterForm from "./RegisterForm"
import AccesoDenegado from "./AccesoDenegado"
import MantenimientoUsuarios from "./MantenimientoUsuarios"
import MantenimientoServicios from "./MantenimientoServicios"
import ConfiguracionObligacion from "./ConfiguracionObligacion"
import MisPagosPendientes from "./MisPagosPendientes"
import TablaTesoreria from "./TablaTesoreria"
import RegistrarEgresos from "./RegistrarEgresos"

function Placeholder({ titulo }) {
  return (
    <div className="flex items-center justify-center h-full">
      <h2 className="text-3xl font-bold text-white opacity-30">{titulo}</h2>
    </div>
  )
}

const paginasRestringidas = {
  "Registro de Usuario": ["Administrador"],
  "Mantenimiento de Usuarios": ["Administrador"],
  "Mantenimiento de Servicios": ["Administrador", "Tesorero"],
  "Generación de Pagos": ["Administrador", "Tesorero"],
  "Vista de Pagos": ["Administrador", "Tesorero"],
  "Registrar Egresos": ["Administrador", "Tesorero"],
}

export default function Layout({ onSubmit, onCerrarSesion }) {
  const [paginaActiva, setPaginaActiva] = useState("Mis Pagos Pendientes")
  const rolActual = sessionStorage.getItem("rol")

  const renderPagina = () => {
    const rolesPermitidos = paginasRestringidas[paginaActiva]
    if (rolesPermitidos && !rolesPermitidos.includes(rolActual)) {
      return <AccesoDenegado />
    }

    switch (paginaActiva) {
      case "Registro de Usuario":
        return <RegisterForm onSubmit={onSubmit} />
      case "Mantenimiento de Usuarios":
        return <MantenimientoUsuarios />
      case "Mantenimiento de Servicios":
        return <MantenimientoServicios />
      case "Generación de Pagos":
        return <ConfiguracionObligacion />
      case "Vista de Pagos":
        return <TablaTesoreria />
      case "Mis Pagos Pendientes":
        return <MisPagosPendientes />
      case "Registrar Egresos":
        return <RegistrarEgresos />
      default:
        return <Placeholder titulo={paginaActiva} />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0f1b2d]">
      <Sidebar paginaActiva={paginaActiva} onCerrarSesion={onCerrarSesion} setPaginaActiva={setPaginaActiva} />
      <main className="flex-1 overflow-y-auto">
        {renderPagina()}
      </main>
    </div>
  )
}