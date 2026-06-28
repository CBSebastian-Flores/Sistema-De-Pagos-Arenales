import { useState } from "react"
import api from "../services/axiosConfig"
import { toast } from "react-toastify"

export default function ModalPago({ deuda, isOpen, onClose, onPagoExitoso }) {
  const [metodoPago, setMetodoPago] = useState("EFECTIVO")
  const [nroOperacion, setNroOperacion] = useState("")
  const [voucherUrl, setVoucherUrl] = useState("")
  const [enviando, setEnviando] = useState(false)

  if (!isOpen || !deuda) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (metodoPago === "TRANSFERENCIA" && !nroOperacion.trim()) {
      toast.error("Ingresa el número de operación de la transferencia")
      return
    }

    setEnviando(true)

    try {
      const payload = {
        id_deuda: deuda.idDeuda,
        metodo_pago: metodoPago,
        monto_pagado: deuda.montoTotalPagar,
      }

      if (metodoPago === "TRANSFERENCIA") {
        payload.nro_operacion = nroOperacion.trim()
        if (voucherUrl.trim()) {
          payload.voucher_url = voucherUrl.trim()
        }
      }

      await api.post("/api/pagos/registrar", payload)

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
    setNroOperacion("")
    setVoucherUrl("")
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
                    htmlFor="nroOperacion"
                    className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
                  >
                    N° de Operación
                  </label>
                  <input
                    id="nroOperacion"
                    type="text"
                    value={nroOperacion}
                    onChange={(e) => setNroOperacion(e.target.value)}
                    placeholder="Ej: 00012345"
                    className="w-full bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="voucherUrl"
                    className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
                  >
                    Voucher / Comprobante (opcional)
                  </label>
                  <input
                    id="voucherUrl"
                    type="url"
                    value={voucherUrl}
                    onChange={(e) => setVoucherUrl(e.target.value)}
                    placeholder="https://ejemplo.com/comprobante.pdf"
                    className="w-full bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
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
