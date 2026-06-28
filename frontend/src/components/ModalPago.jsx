import { useState, useRef } from "react"
import api from "../services/axiosConfig"
import { toast } from "react-toastify"

export default function ModalPago({ deuda, isOpen, onClose, onPagoExitoso }) {
  const [metodoPago, setMetodoPago] = useState("EFECTIVO")
  const [numeroOperacion, setNumeroOperacion] = useState("")
  const [comprobante, setComprobante] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const fileInputRef = useRef(null)

  if (!isOpen || !deuda) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (metodoPago === "TRANSFERENCIA" && !numeroOperacion.trim()) {
      toast.error("Ingresa el número de operación de la transferencia")
      return
    }

    setEnviando(true)

    try {
      const formData = new FormData()
      formData.append("idDeuda", deuda.idDeuda)
      formData.append("metodoPago", metodoPago)
      formData.append("montoPagado", deuda.montoTotalPagar)

      if (metodoPago === "TRANSFERENCIA") {
        formData.append("numeroOperacion", numeroOperacion.trim())
        if (comprobante) {
          formData.append("comprobante", comprobante)
        }
      }

      await api.post("/api/pagos/registrar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success(`Pago registrado correctamente — ${deuda.nombreCompletoSocio}`)
      onPagoExitoso()
      handleCerrar()
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(
          "El endpoint de pagos no está disponible en el backend. " +
          "Notificar al equipo de backend para que implemente POST /api/pagos/registrar"
        )
      } else {
        toast.error(error.response?.data?.mensaje || "Error al registrar el pago")
      }
    } finally {
      setEnviando(false)
    }
  }

  const handleCerrar = () => {
    setMetodoPago("EFECTIVO")
    setNumeroOperacion("")
    setComprobante(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg mx-auto bg-[#111e30] border border-[#1e3a5f] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-[#1e3a5f]">
            <h3 className="text-white font-bold text-lg">Registrar Pago</h3>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div className="bg-[#0f1b2d] border border-[#1e3a5f] rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Datos de la deuda
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">DNI</span>
                  <p className="text-white font-mono">{deuda.dniSocio}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Socio</span>
                  <p className="text-white font-medium">{deuda.nombreCompletoSocio}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Servicio</span>
                  <p className="text-white">{deuda.nombreServicio}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">N° Puesto</span>
                  <p className="text-white font-mono">{deuda.numeroPuesto}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Costo Base</span>
                  <p className="text-gray-300 font-mono">S/. {Number(deuda.montoBase).toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Mora</span>
                  <p className={`font-mono ${Number(deuda.mora) > 0 ? "text-red-400" : "text-gray-500"}`}>
                    S/. {Number(deuda.mora).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#1e3a5f]/40 text-right">
                <span className="text-xs text-gray-400">Total a Pagar: </span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  S/. {Number(deuda.montoTotalPagar).toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Método de Pago
              </label>
              <div className="flex gap-3">
                {["EFECTIVO", "TRANSFERENCIA"].map((metodo) => (
                  <button
                    key={metodo}
                    type="button"
                    onClick={() => setMetodoPago(metodo)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors
                      ${metodoPago === metodo
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-[#0f1b2d] text-gray-400 border-[#1e3a5f] hover:bg-[#1a2d4a] hover:text-white"
                      }`}
                  >
                    {metodo === "EFECTIVO" ? "Efectivo" : "Transferencia"}
                  </button>
                ))}
              </div>
            </div>

            {metodoPago === "TRANSFERENCIA" && (
              <>
                <div>
                  <label
                    htmlFor="numeroOperacion"
                    className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
                  >
                    N° de Operación
                  </label>
                  <input
                    id="numeroOperacion"
                    type="text"
                    value={numeroOperacion}
                    onChange={(e) => setNumeroOperacion(e.target.value)}
                    placeholder="Ej: 00012345"
                    className="w-full bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Comprobante (opcional)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[#0f1b2d] border border-dashed border-[#1e3a5f] rounded-lg px-3 py-4 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
                  >
                    {comprobante ? (
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="text-green-400">{comprobante.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setComprobante(null)
                            if (fileInputRef.current) fileInputRef.current.value = ""
                          }}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          Quitar
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="text-xs text-gray-500">
                          Haz clic para subir comprobante
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setComprobante(e.target.files[0] || null)}
                    className="hidden"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#1e3a5f]">
            <button
              type="button"
              onClick={handleCerrar}
              disabled={enviando}
              className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-[#1e3a5f] hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {enviando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar Pago"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
