import { useState } from "react"
import Sidebar from "./Sidebar"
import RegisterForm from "./RegisterForm"

function Placeholder({ titulo }) {
  return (
    <div className="flex items-center justify-center h-full">
      <h2 className="text-3xl font-bold text-white opacity-30">{titulo}</h2>
    </div>
  )
}

export default function Layout() {
  const [paginaActiva, setPaginaActiva] = useState("Registro de Usuario")

  const renderPagina = () => {
    switch (paginaActiva) {
      case "Registro de Usuario":
        return <RegisterForm onSubmit={(e) => e.preventDefault()} />
      default:
        return <Placeholder titulo={paginaActiva} />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0f1b2d]">
      <Sidebar paginaActiva={paginaActiva} setPaginaActiva={setPaginaActiva} />
      <main className="flex-1 overflow-y-auto">
        {renderPagina()}
      </main>
    </div>
  )
}