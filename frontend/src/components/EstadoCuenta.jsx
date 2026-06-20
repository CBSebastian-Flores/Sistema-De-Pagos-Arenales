import { useState, useEffect } from "react"
import api from "../services/axiosConfig"
import { toast } from "react-toastify"

export default function EstadoCuenta() {
  const [deudas, setDeudas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarDeudas = async () => {
      try {
        const res = await api.get("/api/deudas/pendiente")
        setDeudas(res.data)
      } catch (error) {
        console.log("ERROR DEUDAS:", error.response?.status, error.response?.data)
        toast.error("No se pudieron cargar las deudas pendientes")
      } finally {
        setCargando(false)
      }
    }
    cargarDeudas()
  }, [])

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Estado de Cuenta</h1>
        <p className="text-gray-400 text-sm mt-1">Resumen de deudas pendientes del socio</p>
      </div>

      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                {["Concepto", "Costo Base", "Recargo por Mora", "Total a Pagar", "Estado"].map(col => (
                  <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Cargando deudas...</span>
                    </div>
                  </td>
                </tr>
              ) : deudas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500 text-xs">
                    No tienes deudas pendientes
                  </td>
                </tr>
              ) : (
                deudas.map((d, i) => (
                  <tr
                    key={d.idDeuda}
                    className={`border-b border-[#1e3a5f]/50 transition-colors hover:bg-[#1a2d4a]/40
                      ${i % 2 === 0 ? "" : "bg-[#0f1b2d]/30"}`}
                  >
                    <td className="px-4 py-3 text-white font-medium">{d.nombreServicio}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">S/. {Number(d.montoBase).toFixed(2)}</td>
                    <td className="px-4 py-3 text-red-400 font-mono">S/. {Number(d.mora).toFixed(2)}</td>
                    <td className="px-4 py-3 text-emerald-400 font-mono font-semibold">S/. {Number(d.montoTotalPagar).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider
                        ${d.estadoDeuda === "Pendiente"
                          ? "bg-amber-500/15 text-amber-400"
                          : d.estadoDeuda === "Pagado"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-gray-500/15 text-gray-400"}`}>
                        {d.estadoDeuda}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!cargando && deudas.length > 0 && (
        <div className="mt-4 text-right">
          <span className="text-xs text-gray-500">
            {deudas.length} deuda{deudas.length !== 1 ? "s" : ""} pendiente{deudas.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  )
}
