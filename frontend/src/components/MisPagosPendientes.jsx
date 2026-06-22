import { useState, useEffect } from "react"
import api from "../services/axiosConfig"
import { toast } from "react-toastify"

/**
 * Componente: MisPagosPendientes
 * Propósito: Muestra el estado de cuenta para cualquier usuario logueado.
 * Permite visualizar deudas, fechas de vencimiento, moras aplicadas y el total acumulado a pagar físicamente.
 */
export default function MisPagosPendientes() {
  // Almacena la lista de deudas devueltas por el backend
  const [deudas, setDeudas] = useState([])
  // Bandera para mostrar el spinner de carga mientras se resuelve la petición HTTP
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarDeudas = async () => {
      try {
        // Consume el endpoint protegido. El backend ya sabe de qué usuario se trata por el token JWT.
        const res = await api.get("/api/deudas/pendiente")
        
        // Ordenamos las deudas cronológicamente (las fechas más antiguas o ya vencidas van primero).
        // Esto evita que el usuario tenga que buscar entre la lista lo que urge pagar.
        const deudasOrdenadas = res.data.sort(
          (a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento)
        )
        setDeudas(deudasOrdenadas)
      } catch (error) {
        console.error("ERROR DEUDAS:", error.response?.status, error.response?.data)
        toast.error("No se pudieron cargar tus deudas pendientes")
      } finally {
        // Independientemente de si la petición falla o acierta, retiramos el estado de carga
        setCargando(false)
      }
    }
    cargarDeudas()
  }, [])

  // Calculamos el dinero total que el usuario necesita llevar físicamente para liquidar todas sus deudas.
  // Iteramos el array de deudas y sumamos la propiedad montoTotalPagar de cada una.
  const totalMontoAcumulado = deudas.reduce((sum, d) => sum + Number(d.montoTotalPagar || 0), 0)

  return (
    <div className="p-6 min-h-full">
      {/* --- SECCIÓN 1: Encabezado y Tarjeta de Resumen Financiero --- */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Pagos Pendientes</h1>
          <p className="text-gray-400 text-sm mt-1">
            Resumen de tus obligaciones financieras y fechas límite de pago
          </p>
        </div>
        
        {/* Renderizamos el acumulado total solo si la petición ya terminó y el usuario tiene deudas reales */}
        {!cargando && deudas.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-right">
            <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">
              Total a Pagar Acumulado
            </span>
            <span className="text-2xl font-bold text-red-400 font-mono">
              S/. {totalMontoAcumulado.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* --- SECCIÓN 2: Tabla de Datos --- */}
      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                {["Concepto", "Vencimiento", "Costo Base", "Recargo Mora", "Total a Pagar", "Estado", "Acción"].map(col => (
                  col === "Concepto" ? (
                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ) : (
                    <th key={col} className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a5f]/40">
              
              {/* Escenario A: La petición HTTP sigue en curso */}
              {cargando ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Cargando cuentas pendientes...</span>
                    </div>
                  </td>
                </tr>
              ) : deudas.length === 0 ? (
                /* Escenario B: Petición exitosa, pero el usuario está al día y no debe nada */
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400 text-xs">
                    No registras deudas pendientes en este momento.
                  </td>
                </tr>
              ) : (
                /* Escenario C: Petición exitosa y el usuario tiene deudas. Construimos cada fila. */
                deudas.map((d, i) => {
                  // Banderas lógicas para definir estilos condicionales (HU-124)
                  const tieneMora = Number(d.mora) > 0
                  const esVencido = d.estadoDeuda?.toUpperCase() === "VENCIDO"
                  
                  // Formateamos la fecha a un estándar latino (DD/MM/YYYY).
                  // Si el backend envía null por error, imprimimos un guion para no romper la interfaz.
                  const fechaFormateada = d.fechaVencimiento 
                    ? d.fechaVencimiento.split("-").reverse().join("/") 
                    : "—"

                  return (
                    <tr
                      key={d.idDeuda}
                      // Si la deuda venció, pintamos toda la fila con un fondo rojo de alerta sutil.
                      // De lo contrario, aplicamos un color cebra tradicional para las filas impares.
                      className={`text-center transition-colors hover:bg-[#1a2d4a]/40
                        ${esVencido ? "bg-red-500/5 hover:bg-red-500/10" : i % 2 === 0 ? "" : "bg-[#0f1b2d]/20"}`}
                    >
                      {/* Nombre del servicio facturado */}
                      <td className="text-left px-4 py-3 text-white font-medium">{d.nombreServicio}</td>
                      
                      {/* Si la fecha ya expiró, el texto se pinta de rojo y en negrita para llamar la atención */}
                      <td className={`px-4 py-3 font-mono text-xs ${esVencido ? "text-red-400 font-bold" : "text-gray-400"}`}>
                        {fechaFormateada}
                      </td>
                      
                      {/* Monto base sin penalidades, formateado estrictamente a 2 decimales monetarios */}
                      <td className="px-4 py-3 text-gray-300 font-mono">
                        S/. {Number(d.montoBase).toFixed(2)}
                      </td>
                      
                      {/* Si hay mora cobrada, resalta en rojo. Si no, se atenúa en color gris para reducir carga visual */}
                      <td className={`px-4 py-3 font-mono ${tieneMora ? "text-red-400 font-semibold" : "text-gray-500"}`}>
                        S/. {Number(d.mora).toFixed(2)}
                      </td>
                      
                      {/* Monto final que impacta el bolsillo del usuario */}
                      <td className="px-4 py-3 text-emerald-400 font-mono font-bold text-base">
                        S/. {Number(d.montoTotalPagar).toFixed(2)}
                      </td>
                      
                      {/* Badge visual de estado. Alterna sus colores de borde y fondo entre naranja (Pendiente) y rojo (Vencido) */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider
                          ${esVencido 
                            ? "bg-red-500/15 text-red-400 border border-red-500/30" 
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                          }`}
                        >
                          {esVencido ? "Vencido" : "Pendiente"}
                        </span>
                      </td>

                      {/* 
                        * Botón Informativo:
                        * Ya que la recaudación es estrictamente física en el centro, esto evita
                        * confusiones de UX. Le dice al usuario exactamente qué ID dictarle al Tesorero.
                        */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toast.info(
                            `Para pagar S/. ${Number(d.montoTotalPagar).toFixed(2)}, acércate a Tesorería e indica el ID de Deuda: #${d.idDeuda}`,
                            { autoClose: 6000 }
                          )}
                          className="bg-[#1e3a5f]/40 hover:bg-[#1e3a5f] text-gray-300 font-medium text-xs px-2.5 py-1.5 rounded transition-colors border border-[#1e3a5f]/80"
                        >
                          ¿Cómo pagar?
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SECCIÓN 3: Pie de tabla --- */}
      {/* Contador simple de filas renderizadas en pantalla */}
      {!cargando && deudas.length > 0 && (
        <div className="mt-4 text-right">
          <span className="text-xs text-gray-400 bg-[#111e30] border border-[#1e3a5f] px-3 py-1.5 rounded-lg">
            Total obligaciones activas: <strong className="text-white">{deudas.length}</strong>
          </span>
        </div>
      )}
    </div>
  )
}