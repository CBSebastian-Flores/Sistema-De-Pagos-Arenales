import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { obtenerHistorialPagos } from "../services/deudaService"; // Ajusta la ruta de importación si es necesario

export default function HistorialPagos() {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await obtenerHistorialPagos();
        // Ordenamiento seguro por fechaPago
        const ordenados = (data || []).sort(
          (a, b) => new Date(b.fechaPago) - new Date(a.fechaPago)
        );
        setPagos(ordenados);
      } catch (error) {
        console.error("ERROR HISTORIAL:", error.response?.status, error.response?.data);
        toast.error("No se pudieron cargar los pagos realizados");
      } finally {
        setCargando(false);
      }
    };
    cargarHistorial();
  }, []);

  const handleVerComprobante = (url) => {
    if (url && url.trim() !== "") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast.warning("El comprobante no está disponible para este pago.");
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    // Asumiendo formato de BD: "YYYY-MM-DDTHH:mm:ss"
    const [datePart] = fecha.split("T"); 
    return datePart.split("-").reverse().join("/");
  };

  const totalPagado = pagos.reduce(
    (sum, p) => sum + Number(p.montoPagado || 0),
    0
  );

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mi Historial de Pagos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Registro de todos tus pagos realizados y comprobantes
          </p>
        </div>
        {!cargando && pagos.length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3 text-right">
            <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">
              Total Pagado Acumulado
            </span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              S/. {totalPagado.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                {[
                  "ID Pago",
                  "ID Deuda",
                  "Fecha de Pago",
                  "Monto Pagado",
                  "Método",
                  "Nro. Operación",
                  "Código",
                  "Comprobante",
                ].map((col) => (
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
                  <td colSpan={8} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Cargando historial de pagos...</span>
                    </div>
                  </td>
                </tr>
              ) : pagos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400 text-xs">
                    No registras pagos realizados hasta el momento.
                  </td>
                </tr>
              ) : (
                pagos.map((p, i) => {
                  const esTransferencia = p.metodoPago?.toUpperCase() === "TRANSFERENCIA";

                  return (
                    <tr
                      key={p.idPago}
                      className={`text-center transition-colors hover:bg-[#1a2d4a]/40 ${
                        i % 2 === 0 ? "" : "bg-[#0f1b2d]/20"
                      }`}
                    >
                      <td className="px-4 py-3 text-white font-medium">{p.idPago}</td>
                      <td className="px-4 py-3 text-gray-400">{p.idDeuda || "—"}</td>
                      <td className="px-4 py-3 text-emerald-400 font-mono text-xs font-semibold">
                        {formatearFecha(p.fechaPago)}
                      </td>
                      <td className="px-4 py-3 text-emerald-400 font-mono font-bold text-base">
                        S/. {Number(p.montoPagado).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            esTransferencia
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              : "bg-gray-500/15 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          {p.metodoPago || "EFECTIVO"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {p.nroOperacion || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {p.codigoPago || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleVerComprobante(p.voucherUrl)}
                          className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 font-medium text-xs px-2.5 py-1.5 rounded transition-colors border border-blue-500/30 flex items-center gap-1.5 mx-auto"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver Voucher
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!cargando && pagos.length > 0 && (
        <div className="mt-4 text-right">
          <span className="text-xs text-gray-400 bg-[#111e30] border border-[#1e3a5f] px-3 py-1.5 rounded-lg">
            Total de pagos registrados:{" "}
            <strong className="text-white">{pagos.length}</strong>
          </span>
        </div>
      )}
    </div>
  );
}