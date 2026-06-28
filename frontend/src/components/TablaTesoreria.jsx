import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { obtenerReporteGeneral } from "../services/deudaService"

export default function TablaTesoreria() {
  const [deudas, setDeudas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState("TODOS")

  // 🚀 Se definen las clases completas para que Tailwind las compile correctamente en Producción
  const filtros = [
    { valor: "TODOS", label: "Ver Todos", clasesActivo: "bg-blue-600 text-white border-blue-500 shadow-md" },
    { valor: "PENDIENTE", label: "Solo Pendientes", clasesActivo: "bg-amber-600 text-white border-amber-500 shadow-md" },
    { valor: "VENCIDO", label: "Solo Vencidos", clasesActivo: "bg-red-600 text-white border-red-500 shadow-md" },
    { valor: "PAGADO", label: "Solo Pagados", clasesActivo: "bg-emerald-600 text-white border-emerald-500 shadow-md" },
  ]

  const deudasFiltradas = filtroEstado === "TODOS"
    ? deudas
    : deudas.filter(d => d.estadoDeuda?.toUpperCase() === filtroEstado)

  useEffect(() => {
    const cargarDeudas = async () => {
      try {
        const data = await obtenerReporteGeneral()
        setDeudas(data)
      } catch (error) {
        toast.error("No se pudieron cargar las deudas, ", error)
      } finally {
        setCargando(false)
      }
    }
    cargarDeudas()
  }, [])

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Vista de Pagos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Reporte general de todas las deudas registradas en el sistema
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {filtros.map((f) => (
              <button
                key={f.valor}
                onClick={() => setFiltroEstado(f.valor)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors
                  ${filtroEstado === f.valor
                    ? f.clasesActivo
                    : "bg-[#0f1b2d] text-gray-400 border-[#1e3a5f] hover:bg-[#1a2d4a] hover:text-white"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {!cargando && deudas.length > 0 && (
          <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl px-5 py-3 text-right shrink-0">
            <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">
              {filtroEstado === "TODOS" ? "Total Registros" : "Filtrados"}
            </span>
            <span className="text-2xl font-bold text-blue-400 font-mono">
              {deudasFiltradas.length} <span className="text-sm text-gray-500">/ {deudas.length}</span>
            </span>
          </div>
        )}
      </div>

      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                {["DNI", "Socio", "N° Puesto", "Servicio", "Costo Base", "Mora", "Total a Pagar", "Estado", "Acción"].map((col) => (
                  <th
                    key={col}
                    className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a5f]/40">
              {cargando ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Cargando deudas...</span>
                    </div>
                  </td>
                </tr>
              ) : deudasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400 text-xs">
                    {filtroEstado === "TODOS"
                      ? "No se encontraron deudas registradas."
                      : `No hay deudas con el estado "${filtroEstado}".`}
                  </td>
                </tr>
              ) : (
                deudasFiltradas.map((d, i) => {
                  const esVencido = d.estadoDeuda?.toUpperCase() === "VENCIDO"
                  const esPagado = d.estadoDeuda?.toUpperCase() === "PAGADO"

                  return (
                    <tr
                      key={d.idDeuda}
                      className={`text-center transition-colors hover:bg-[#1a2d4a]/40
                        ${esVencido ? "bg-red-500/10 hover:bg-red-500/20" : i % 2 === 0 ? "" : "bg-[#0f1b2d]/20"}`}
                    >
                      <td className="px-4 py-3 text-white font-mono text-xs">{d.dniSocio}</td>
                      <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{d.nombreCompletoSocio}</td>
                      <td className="px-4 py-3 text-gray-300 font-mono">{d.numeroPuesto}</td>
                      <td className="px-4 py-3 text-white whitespace-nowrap">{d.nombreServicio}</td>
                      <td className="px-4 py-3 text-gray-300 font-mono">S/. {Number(d.montoBase).toFixed(2)}</td>
                      
                      <td className={`px-4 py-3 font-mono ${Number(d.mora) > 0 ? "text-red-400 font-bold" : "text-gray-500"}`}>
                        S/. {Number(d.mora).toFixed(2)}
                      </td>
                      
                      <td className="px-4 py-3 text-emerald-400 font-mono font-bold text-base">
                        S/. {Number(d.montoTotalPagar).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider
                          ${esPagado
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : esVencido
                              ? "bg-red-500/15 text-red-400 border border-red-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                          }`}
                        >
                          {esPagado ? "Pagado" : esVencido ? "Vencido" : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {esPagado ? (
                          <span className="text-gray-500 text-xs font-semibold select-none">Cancelado</span>
                        ) : (
                          <button
                            onClick={() => toast.info(`Registrar pago para ${d.nombreCompletoSocio}`)}
                            className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 font-medium text-xs px-3 py-1.5 rounded transition-colors border border-emerald-600/40"
                          >
                            Pagar
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}