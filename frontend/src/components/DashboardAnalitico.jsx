import { useEffect, useReducer } from "react";
import api from "../services/axiosConfig";
import StatCard from "./StatCard";
import TablaAuditoria from "./TablaAuditoria";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie
} from "recharts";

// ── LÓGICA DE ESTADOS DE LA RAMA SDPA-153 ──
const ESTADO_INICIAL = Object.freeze({
  cargando: true,
  data: null,
  error: null,
});

function reducer(state, action) {
  switch (action.type) {
    case "CARGAR":
      return { ...state, cargando: true, error: null };
    case "EXITO":
      return { cargando: false, data: action.payload, error: null };
    case "ERROR":
      return { cargando: false, data: null, error: action.payload };
    default:
      return state;
  }
}

// ── SUBTAREA SDPA-149: LOADING SKELETONS ──
function SkeletonCard() {
  return (
    <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-5 space-y-3 animate-pulse">
      <div className="h-3 w-24 bg-[#1e3a5f] rounded" />
      <div className="h-7 w-32 bg-[#1e3a5f] rounded" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-5 space-y-4 animate-pulse">
      <div className="h-4 w-40 bg-[#1e3a5f] rounded mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 py-2.5 border-b border-[#1e3a5f]/20 last:border-0">
          <div className="h-3 w-16 bg-[#1e3a5f] rounded" />
          <div className="h-3 w-24 bg-[#1e3a5f] rounded" />
          <div className="h-3 w-32 bg-[#1e3a5f] rounded" />
        </div>
      ))}
    </div>
  );
}

const iconos = {
  ingresos: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  egresos: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  balance: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  alerta: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
};

const DONUT_COLORS = ["#34d399", "#fbbf24", "#f87171"];

export default function DashboardAnalitico() {
  // 💡 Usamos el estado global unificado de la rama SDPA-153
  const [{ cargando, data, error }, dispatch] = useReducer(reducer, ESTADO_INICIAL);

  useEffect(() => {
    let cancelado = false;

    const cargarDashboard = async () => {
      dispatch({ type: "CARGAR" });
      try {
        // Consumimos tu endpoint consolidado real del backend
        const res = await api.get("/api/dashboard/summary");
        if (!cancelado) {
          dispatch({ type: "EXITO", payload: res.data });
        }
      } catch (err) {
        console.error("Error cargando dashboard:", err);
        if (!cancelado) {
          dispatch({ type: "ERROR", payload: err });
        }
      }
    };

    cargarDashboard();
    return () => { cancelado = true; }; // Protección contra race conditions
  }, []);

  // ── EXTRACCIÓN DE TU DATA UNIFICADA REAL ──
  const totalIngresos = data?.sumaHistoricaIngresos || 0;
  const totalEgresosMapeado = data?.sumaHistoricaEgresos || 0;
  const balanceNeto = data?.balanceNeto || 0;

  const deudasPendientes = data?.deudasPorEstado?.["Pendiente"] || 0;
  const deudasPagadas = data?.deudasPorEstado?.["Pagado"] || 0;
  const deudasVencidas = data?.deudasPorEstado?.["Vencido"] || 0;

  const dataBar = [
    { name: "Ingresos", monto: totalIngresos },
    { name: "Egresos", monto: totalEgresosMapeado },
  ];

  const dataDonut = [
    { name: "Pagadas", value: deudasPagadas },
    { name: "Pendientes", value: deudasPendientes },
    { name: "Vencidas", value: deudasVencidas },
  ].filter((d) => d.value > 0);

  // ── TU MAPEADO SEGURO PARA LA TABLA MODULAR ──
  const movimientosUnificados = (data?.ultimosMovimientos || []).map((m) => {
    const fechaOriginal = m.fecha;
    const fechaLimpia = fechaOriginal && !fechaOriginal.includes("T") 
      ? `${fechaOriginal}T00:00:00` 
      : fechaOriginal;

    return {
      tipo: m.tipo,
      fecha: fechaLimpia,
      monto: m.monto || 0,
      descripcion: m.descripcion
    };
  });

  // Pantalla de Error con botón de Reintentar de la rama SDPA-153
  if (error) {
    return (
      <div className="p-6 min-h-full flex items-center justify-center">
        <div className="text-center bg-[#111e30] border border-red-500/30 p-6 rounded-xl max-w-sm">
          <p className="text-red-400 text-sm mb-3 font-semibold">Error al conectar con el servidor</p>
          <p className="text-gray-400 text-xs mb-4">No se pudo recuperar el consolidado financiero.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-500/20 transition-colors font-medium"
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard Analítico</h1>
        <p className="text-gray-400 text-sm mt-1">Resumen financiero consolidado</p>
      </div>

      {cargando ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonTable />
        </div>
      ) : (
        <>
          {/* Grilla de 6 tarjetas fijas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard titulo="Total Ingresos" valor={totalIngresos} icono={iconos.ingresos} formato="S/." />
            <StatCard titulo="Total Egresos" valor={totalEgresosMapeado} icono={iconos.egresos} formato="S/." color={{ texto: "text-red-400", bg: "bg-red-500/10 border-red-500/20" }} />
            <StatCard titulo="Balance Neto" valor={balanceNeto} icono={iconos.balance} formato="S/." />
            <StatCard titulo="Deudas Pendientes" valor={deudasPendientes} icono={iconos.alerta} color={{ texto: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" }} />
            <StatCard titulo="Deudas Pagadas" valor={deudasPagadas} icono={iconos.check} />
            <StatCard titulo="Deudas Vencidas" valor={deudasVencidas} icono={iconos.warning} color={{ texto: "text-red-400", bg: "bg-red-500/10 border-red-500/20" }} />
          </div>

          {/* Gráficos grandes con Tooltip Blanco arreglado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-4 flex flex-col justify-between">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Balance Bruto</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dataBar} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" opacity={0.2} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={{ stroke: "#1e3a5f" }} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={{ stroke: "#1e3a5f" }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f1b2d", border: "1px solid #1e3a5f", borderRadius: 8 }}
                    labelStyle={{ color: "#fff", fontWeight: "bold"}}
                    itemStyle={{ color: "#fff" }}
                    formatter={(value) => [`S/. ${value.toFixed(2)}`, "Total"]}
                  />
                  <Bar dataKey="monto" radius={[4, 4, 0, 0]} maxBarSize={150} animationDuration={400}>
                    <Cell fill="#34d399" />
                    <Cell fill="#f87171" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Estado de Deudas</h3>
              {dataDonut.length === 0 ? (
                <p className="text-center py-16 text-gray-500 text-xs">Sin deudas en el sistema</p>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1">
                  <ResponsiveContainer width="100%" height={210}>
                    <PieChart>
                      <Pie 
                        data={dataDonut} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={85} 
                        paddingAngle={5} 
                        dataKey="value"
                        animationDuration={800}
                      >
                        {dataDonut.map((_, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} style={{ outline: 'none' }} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#0f1b2d", border: "1px solid #1e3a5f", borderRadius: 8 }} itemStyle={{ color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="flex gap-6 mt-3 justify-center">
                    {dataDonut.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                        <span className="text-xs text-gray-400 font-medium">{d.name}: <span className="text-white font-semibold font-mono">{d.value}</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Inyección modular de tu tabla externa limpia */}
          <TablaAuditoria movimientos={movimientosUnificados} cargando={cargando} />
        </>
      )}
    </div>
  );
}