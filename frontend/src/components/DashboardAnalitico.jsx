import { useState, useEffect } from "react";
import api from "../services/axiosConfig";
import { toast } from "react-toastify";
import StatCard from "./StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ── SUBTAREA SDPA-149: LOADING SKELETONS ──
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

function SkeletonChart() {
  return (
    <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-5 animate-pulse">
      <div className="h-4 w-40 bg-[#1e3a5f] rounded mb-6" />
      <div className="h-48 bg-[#1e3a5f]/40 rounded" />
    </div>
  );
}

// ── ICONOS DEL LAYOUT ──
const iconos = {
  ingresos:
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  egresos:
    "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  balance:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  alerta: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
  servicios:
    "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  usuarios:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
};

const DONUT_COLORS = ["#34d399", "#fbbf24", "#f87171"];

export default function DashboardAnalitico() {
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        // 🚀 Consumo eficiente de la API Consolidada
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

  // ── EXTRACCIÓN SEGURA DESDE EL DTO CONSOLIDADO ──
  const totalIngresos = datos?.sumaHistoricaIngresos || 0;
  const totalEgresos = datos?.sumaHistoricaEgresos || 0;
  const balanceNeto = datos?.balanceNeto || 0;

  const deudasPendientes = datos?.deudasPorEstado?.["Pendiente"] || 0;
  const deudasPagadas = datos?.deudasPorEstado?.["Pagado"] || 0;
  const deudasVencidas = datos?.deudasPorEstado?.["Vencido"] || 0;

  const serviciosActivos = datos?.serviciosActivos || 0;
  const ultimosMovimientos = datos?.ultimosMovimientos || [];

  // ── ADAPTACIÓN DE DATA PARA RECHARTS ──
  const dataBar = [
    { name: "Ingresos", monto: totalIngresos },
    { name: "Egresos", monto: totalEgresos },
  ];

  const dataDonut = [
    { name: "Pagadas", value: deudasPagadas },
    { name: "Pendientes", value: deudasPendientes },
    { name: "Vencidas", value: deudasVencidas },
  ].filter((d) => d.value > 0);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i + 4} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <SkeletonTable />
        </div>
      ) : (
        <>
          {/* ── GRID DE TARJETAS MODULARES ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              titulo="Total Ingresos"
              valor={totalIngresos}
              icono={iconos.ingresos}
              formato="S/."
            />
            <StatCard
              titulo="Total Egresos"
              valor={totalEgresos}
              icono={iconos.egresos}
              formato="S/."
              color={{
                texto: "text-red-400",
                bg: "bg-red-500/10 border-red-500/20",
              }}
            />
            <StatCard
              titulo="Balance Neto"
              valor={balanceNeto}
              icono={iconos.balance}
              formato="S/."
            />
            <StatCard
              titulo="Deudas Pendientes"
              valor={deudasPendientes}
              icono={iconos.alerta}
              color={{
                texto: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/20",
              }}
            />
            <StatCard
              titulo="Deudas Pagadas"
              valor={deudasPagadas}
              icono={iconos.check}
            />
            <StatCard
              titulo="Deudas Vencidas"
              valor={deudasVencidas}
              icono={iconos.warning}
              color={{
                texto: "text-red-400",
                bg: "bg-red-500/10 border-red-500/20",
              }}
            />
            <StatCard
              titulo="Servicios Activos"
              valor={serviciosActivos}
              icono={iconos.servicios}
              color={{
                texto: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
              }}
            />
            <StatCard
              titulo="Socios Activos"
              valor="—"
              icono={iconos.usuarios}
              color={{
                texto: "text-gray-400",
                bg: "bg-gray-500/10 border-gray-500/20",
              }}
            />
          </div>

          {/* ── SECCIÓN DE GRÁFICOS RECHARTS UNIFICADOS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Ingresos vs Egresos
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dataBar}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#1e3a5f" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#1e3a5f" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f1b2d",
                      border: "1px solid #1e3a5f",
                      borderRadius: 8,
                      color: "#fff",
                    }}
                    formatter={(value) => [`S/. ${value.toFixed(2)}`, "Monto"]}
                  />
                  <Bar dataKey="monto" radius={[6, 6, 0, 0]} maxBarSize={80}>
                    <Cell fill="#34d399" />
                    <Cell fill="#f87171" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Distribución de Deudas
              </h3>
              {dataDonut.length === 0 ? (
                <p className="text-center py-16 text-gray-500 text-xs">
                  Sin datos de deudas
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={dataDonut}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {dataDonut.map((_, i) => (
                        <Cell
                          key={i}
                          fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f1b2d",
                        border: "1px solid #1e3a5f",
                        borderRadius: 8,
                        color: "#fff",
                      }}
                    />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "#9ca3af", fontSize: 12 }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── TABLA DE ACTIVIDAD RECIENTE (ÚLTIMOS MOVIMIENTOS) ── */}
          <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e3a5f]">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actividad Reciente (Últimos Movimientos)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                    {["Tipo", "Descripción", "Monto", "Fecha"].map((col) => (
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
                  {ultimosMovimientos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-12 text-gray-400 text-xs"
                      >
                        No hay movimientos registrados aún
                      </td>
                    </tr>
                  ) : (
                    ultimosMovimientos.map((mov, idx) => (
                      <tr
                        key={idx}
                        className="text-center transition-colors hover:bg-[#1a2d4a]/40"
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded border ${
                              mov.tipo === "INGRESO"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-red-500/15 text-red-400 border-red-500/30"
                            }`}
                          >
                            {mov.tipo}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {mov.descripcion}
                        </td>
                        <td
                          className={`px-4 py-3 font-mono font-semibold ${mov.tipo === "INGRESO" ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {mov.tipo === "INGRESO" ? "+" : "-"}S/.{" "}
                          {Number(mov.monto).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                          {formatearFecha(mov.fecha)}
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
