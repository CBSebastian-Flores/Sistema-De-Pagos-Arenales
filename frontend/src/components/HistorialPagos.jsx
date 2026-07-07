import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { obtenerHistorialPagos, descargarBoleta } from "../services/deudaService";

export default function HistorialPagos() {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [descargandoId, setDescargandoId] = useState(null);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const data = await obtenerHistorialPagos();
        const ordenados = (data || []).sort(
          (a, b) => new Date(b.fechaPago || b.fechaVencimiento) - new Date(a.fechaPago || a.fechaVencimiento),
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

  const handleDescargar = async (idDeuda, nombreServicio) => {
    setDescargandoId(idDeuda);
    try {
      const blob = await descargarBoleta(idDeuda);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `boleta-${idDeuda}-${nombreServicio.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Error al descargar la boleta");
    } finally {
      setDescargandoId(null);
    }
  };

  const formatearFecha = (fecha) =>
    fecha ? fecha.split("-").reverse().join("/") : "—";

  const totalPagado = pagos.reduce(
    (sum, p) => sum + Number(p.montoTotalPagar || 0),
    0,
  );

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mi Historial de Pagos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Registro de todos tus pagos realizados y boletas digitales
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
                  "ID",
                  "Concepto",
                  "Vencimiento",
                  "Fecha de Pago",
                  "Monto Base",
                  "Recargo Mora",
                  "Total Pagado",
                  "Método",
                  "Código",
                  "Acción",
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
                  <td colSpan={10} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Cargando historial de pagos...</span>
                    </div>
                  </td>
                </tr>
              ) : pagos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-gray-400 text-xs">
                    No registras pagos realizados hasta el momento.
                  </td>
                </tr>
              ) : (
                pagos.map((p, i) => {
                  const tieneMora = Number(p.mora) > 0;
                  const esTransferencia = p.metodoPago?.toUpperCase() === "TRANSFERENCIA";

                  return (
                    <tr
                      key={p.idDeuda}
                      className={`text-center transition-colors hover:bg-[#1a2d4a]/40 ${
                        i % 2 === 0 ? "" : "bg-[#0f1b2d]/20"
                      }`}
                    >
                      <td className="px-4 py-3 text-white font-medium">{p.idDeuda}</td>
                      <td className="text-left px-4 py-3 text-white font-medium">
                        {p.nombreServicio}
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {formatearFecha(p.fechaVencimiento)}
                      </td>
                      <td className="px-4 py-3 text-emerald-400 font-mono text-xs font-semibold">
                        {formatearFecha(p.fechaPago)}
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-mono">
                        S/. {Number(p.montoBase).toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 font-mono ${
                          tieneMora ? "text-red-400 font-semibold" : "text-gray-500"
                        }`}
                      >
                        S/. {Number(p.mora).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-emerald-400 font-mono font-bold text-base">
                        S/. {Number(p.montoTotalPagar).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            esTransferencia
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              : "bg-gray-500/15 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          {esTransferencia ? "Transferencia" : "Efectivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {p.codigoPago || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDescargar(p.idDeuda, p.nombreServicio)}
                          disabled={descargandoId === p.idDeuda}
                          className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 font-medium text-xs px-2.5 py-1.5 rounded transition-colors border border-blue-500/30 disabled:opacity-50 flex items-center gap-1.5 mx-auto"
                        >
                          {descargandoId === p.idDeuda ? (
                            <>
                              <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                              Descargando...
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Boleta PDF
                            </>
                          )}
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
