import { useState, useEffect } from "react";
import api from "../services/axiosConfig";
import { obtenerServiciosActivos } from "../services/servicioService";
import { obtenerReporteGeneral } from "../services/deudaService";

function SkeletonCard() {
  return (
    <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-5 space-y-3 animate-pulse">
      <div className="h-3 w-24 bg-[#1e3a5f] rounded" />
      <div className="h-7 w-32 bg-[#1e3a5f] rounded" />
      <div className="h-2.5 w-20 bg-[#1e3a5f]/60 rounded" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-5 space-y-4 animate-pulse">
      <div className="h-4 w-40 bg-[#1e3a5f] rounded" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-3 flex-1 bg-[#1e3a5f] rounded" />
          <div className="h-3 w-24 bg-[#1e3a5f] rounded" />
          <div className="h-3 w-20 bg-[#1e3a5f] rounded" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardAnalitico() {
  const [cargando, setCargando] = useState(true);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalEgresos, setTotalEgresos] = useState(0);
  const [serviciosActivos, setServiciosActivos] = useState(0);
  const [deudasPendientes, setDeudasPendientes] = useState(0);
  const [deudasPagadas, setDeudasPagadas] = useState(0);
  const [deudasVencidas, setDeudasVencidas] = useState(0);
  const [ultimosEgresos, setUltimosEgresos] = useState([]);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const [resIngresos, resEgresos, resEgresosUlt, deudas, servicios] =
          await Promise.all([
            api.get("/api/pagos/total"),
            api.get("/api/egresos/total"),
            api.get("/api/egresos/ultimos"),
            obtenerReporteGeneral(),
            obtenerServiciosActivos(),
          ]);

        setTotalIngresos(
          resIngresos?.data?.total != null ? Number(resIngresos.data.total) : 0,
        );
        setTotalEgresos(
          resEgresos?.data?.total != null ? Number(resEgresos.data.total) : 0,
        );
        setUltimosEgresos(Array.isArray(resEgresosUlt?.data) ? resEgresosUlt.data : []);
        setServiciosActivos(Array.isArray(servicios) ? servicios.length : 0);

        if (Array.isArray(deudas)) {
          setDeudasPendientes(deudas.filter((d) => d.estadoDeuda?.toUpperCase() === "PENDIENTE").length);
          setDeudasPagadas(deudas.filter((d) => d.estadoDeuda?.toUpperCase() === "PAGADO").length);
          setDeudasVencidas(deudas.filter((d) => d.estadoDeuda?.toUpperCase() === "VENCIDO").length);
        }
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDashboard();
  }, []);

  const balanceNeto = totalIngresos - totalEgresos;

  const metricas = [
    {
      label: "Total Ingresos",
      valor: `S/. ${totalIngresos.toFixed(2)}`,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      icono: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      label: "Total Egresos",
      valor: `S/. ${totalEgresos.toFixed(2)}`,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
      icono: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
    {
      label: "Balance Neto",
      valor: `S/. ${balanceNeto.toFixed(2)}`,
      color: balanceNeto >= 0 ? "text-emerald-400" : "text-red-400",
      bg: balanceNeto >= 0
        ? "bg-emerald-500/10 border-emerald-500/20"
        : "bg-red-500/10 border-red-500/20",
      icono: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      label: "Deudas Pendientes",
      valor: deudasPendientes,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      icono: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      label: "Deudas Pagadas",
      valor: deudasPagadas,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      icono: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      label: "Deudas Vencidas",
      valor: deudasVencidas,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
      icono: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    },
    {
      label: "Servicios Activos",
      valor: serviciosActivos,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      icono: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    {
      label: "Socios Activos",
      valor: "—",
      color: "text-gray-400",
      bg: "bg-gray-500/10 border-gray-500/20",
      icono: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    },
  ];

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    try {
      return new Date(fechaStr).toLocaleDateString("es-PE", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch { return fechaStr; }
  };

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard Analítico</h1>
        <p className="text-gray-400 text-sm mt-1">
          Resumen general del sistema de pagos
        </p>
      </div>

      {cargando ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i + 4} />)}
          </div>
          <SkeletonTable />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metricas.map((m) => (
              <div
                key={m.label}
                className={`${m.bg} border rounded-xl p-5 flex items-start gap-4 transition-colors`}
              >
                <div className={`p-2 rounded-lg ${m.bg}`}>
                  <svg className={`w-6 h-6 ${m.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={m.icono} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {m.label}
                  </p>
                  <p className={`text-xl font-bold font-mono mt-1 ${m.color}`}>
                    {m.valor}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e3a5f]">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Últimos Egresos Registrados
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                    {["Beneficiario", "Concepto", "Monto", "Método", "Fecha"].map((col) => (
                      <th key={col} className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3a5f]/40">
                  {ultimosEgresos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400 text-xs">
                        No hay egresos registrados aún
                      </td>
                    </tr>
                  ) : (
                    ultimosEgresos.map((eg) => (
                      <tr key={eg.idEgreso} className="text-center transition-colors hover:bg-[#1a2d4a]/40">
                        <td className="px-4 py-3 text-white font-medium">{eg.beneficiario}</td>
                        <td className="px-4 py-3 text-gray-300">{eg.categoriaEgreso}</td>
                        <td className="px-4 py-3 text-red-400 font-mono font-semibold">
                          -S/. {Number(eg.monto).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-400 bg-[#0f1b2d] px-2 py-0.5 rounded border border-[#1e3a5f]/40">
                            {eg.metodoRetiro}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                          {formatearFecha(eg.fechaGasto)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
