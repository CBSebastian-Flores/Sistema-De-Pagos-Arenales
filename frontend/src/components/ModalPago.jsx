import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { registrarPagoDeuda } from "../services/deudaService";

export default function ModalPago({ deuda, isOpen, onClose, onPagoExitoso }) {
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [numeroOperacion, setNumeroOperacion] = useState("");
  const [comprobante, setComprobante] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen || !deuda) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (metodoPago === "TRANSFERENCIA" && !numeroOperacion.trim()) {
      toast.error("Ingresa el número de operación de la transferencia");
      return;
    }

    setEnviando(true);

    try {
      const formData = new FormData();
      formData.append("idDeuda", deuda.idDeuda);
      formData.append("metodoPago", metodoPago);
      formData.append("montoPagado", deuda.montoTotalPagar);

      if (metodoPago === "TRANSFERENCIA") {
        formData.append("nroOperacion", numeroOperacion.trim());
        if (comprobante) {
          formData.append("comprobante", comprobante);
        }
      }

      await registrarPagoDeuda(formData);

      toast.success(
        `Pago registrado correctamente — ${deuda.nombreCompletoSocio}`,
      );
      onPagoExitoso();
      handleCerrar();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al registrar el pago");
    } finally {
      setEnviando(false);
    }
  };

  const handleCerrar = () => {
    setMetodoPago("EFECTIVO");
    setNumeroOperacion("");
    setComprobante(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg mx-auto bg-[#111e30] border border-[#1e3a5f] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-[#1e3a5f]">
            <h3 className="text-white font-bold text-lg">Registrar Pago</h3>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* 🚀 Datos actualizados de la deuda */}
            <div className="bg-[#0f1b2d] border border-[#1e3a5f] rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Datos de la deuda
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">ID Recibo</span>
                  <p className="text-white font-mono">#{deuda.idDeuda}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Socio</span>
                  <p className="text-white font-medium">
                    {deuda.nombreCompletoSocio}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Servicio</span>
                  <p className="text-white">{deuda.nombreServicio}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Mora</span>
                  <p
                    className={`font-mono ${Number(deuda.mora) > 0 ? "text-red-400" : "text-gray-500"}`}
                  >
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
                      ${
                        metodoPago === metodo
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
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    N° de Operación
                  </label>
                  <input
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
                      <span className="text-green-400 text-sm font-medium">
                        {comprobante.name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">
                        Haz clic para adjuntar imagen/PDF
                      </span>
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
              className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-[#1e3a5f] hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
            >
              {enviando ? "Procesando..." : "Confirmar Pago"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}