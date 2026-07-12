import { useState, useEffect } from "react";
import api from "../services/axiosConfig";
import { toast } from "react-toastify";

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
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const res = await api.get("/api/dashboard/summary");
        setDatos(res.data);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
        toast.error("No se pudo cargar el consolidado financiero.");
      } finally {
        setCargando(false);
      }
    };
    cargarDashboard();
  }, []);

  // Helpers para extraer valores de manera segura previniendo nulos
  const ingresos = datos?.sumaHistoricaIngresos || 0;
  const egresos = datos?.sumaHistoricaEgresos || 0;
  const balanceNeto = datos?.balanceNeto || 0;

  const deudasPendientes = datos?.deudasPorEstado?.["Pendiente"] || 0;
  const deudasPagadas = datos?.deudasPorEstado?.["Pagado"] || 0;
  const deudasVencidas = datos?.deudasPorEstado?.["Vencido"] || 0;

  const ultimosMovimientos = datos?.ultimosMovimientos || [];

  const metricas = [
    {
      label: "Total Ingresos",
      valor: `S/. ${ingresos.toFixed(2)}`,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      icono:
        "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      label: "Total Egresos",
      valor: `S/. ${egresos.toFixed(2)}`,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
      icono:
        "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
    {
      label: "Balance Neto",
      valor: `S/. ${balanceNeto.toFixed(2)}`,
      color: balanceNeto >= 0 ? "text-emerald-400" : "text-red-400",
      bg:
        balanceNeto >= 0
          ? "bg-emerald-500/10 border-emerald-500/20"
          : "bg-red-500/10 border-red-500/20",
      icono:
        "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
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
      icono:
        "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    },
  ];

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    try {
      return new Date(fechaStr + "T00:00:00").toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <SkeletonTable />
        </div>
      ) : (
        <>
          {/* Grid de Tarjetas Informativas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {metricas.map((m) => (
              <div
                key={m.label}
                className={`${m.bg} border rounded-xl p-5 flex items-start gap-4`}
              >
                {" "}
                <div className={`p-2 rounded-lg ${m.bg}`}>
                  {" "}
                  <svg
                    className={`w-6 h-6 ${m.color}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={m.icono}
                    />{" "}
                  </svg>{" "}
                </div>{" "}
                <div className="min-w-0">
                  {" "}
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {m.label}
                  </p>{" "}
                  <p className={`text-xl font-bold font-mono mt-1 ${m.color}`}>
                    {m.valor}
                  </p>{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>
          {/* Tabla Unificada de Actividad Reciente */}
          <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
            {" "}
            <div className="px-5 py-4 border-b border-[#1e3a5f]">
              {" "}
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actividad Reciente (Últimos Movimientos)
              </h3>{" "}
            </div>{" "}
            <div className="overflow-x-auto">
              {" "}
              <table className="w-full text-sm">
                {" "}
                <thead>
                  {" "}
                  <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                    {" "}
                    {["Tipo", "Descripción", "Monto", "Fecha"].map((col) => (
                      <th
                        key={col}
                        className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody className="divide-y divide-[#1e3a5f]/40">
                  {" "}
                  {ultimosMovimientos.length === 0 ? (
                    <tr>
                      {" "}
                      <td
                        colSpan={4}
                        className="text-center py-12 text-gray-400 text-xs"
                      >
                        No hay movimientos registrados aún
                      </td>{" "}
                    </tr>
                  ) : (
                    ultimosMovimientos.map((mov, idx) => (
                      <tr
                        key={idx}
                        className="text-center transition-colors hover:bg-[#1a2d4a]/40"
                      >
                        {" "}
                        <td className="px-4 py-3">
                          {" "}
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded border ${mov.tipo === "INGRESO" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-red-500/15 text-red-400 border-red-500/30"}`}
                          >
                            {" "}
                            {mov.tipo}{" "}
                          </span>{" "}
                        </td>{" "}
                        <td className="px-4 py-3 text-gray-300">
                          {mov.descripcion}
                        </td>{" "}
                        <td
                          className={`px-4 py-3 font-mono font-semibold ${mov.tipo === "INGRESO" ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {" "}
                          {mov.tipo === "INGRESO" ? "+" : "-"}S/.{" "}
                          {Number(mov.monto).toFixed(2)}{" "}
                        </td>{" "}
                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                          {formatearFecha(mov.fecha)}
                        </td>{" "}
                      </tr>
                    ))
                  )}{" "}
                </tbody>{" "}
              </table>{" "}
            </div>{" "}
          </div>{" "}
        </>
      )}
    </div>
  );
}
