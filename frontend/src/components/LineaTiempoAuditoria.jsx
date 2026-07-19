import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { listarHistorialUsuarios } from "../services/auditoriaUsuarioService";

const ICONO_ACCION = {
  REGISTRAR: { color: "text-emerald-400", bg: "bg-emerald-500/15", ring: "ring-emerald-500/30", label: "Registro" },
  ACTUALIZAR: { color: "text-blue-400", bg: "bg-blue-500/15", ring: "ring-blue-500/30", label: "Actualización" },
  INHABILITAR: { color: "text-red-400", bg: "bg-red-500/15", ring: "ring-red-500/30", label: "Inhabilitación" },
  HABILITAR: { color: "text-emerald-400", bg: "bg-emerald-500/15", ring: "ring-emerald-500/30", label: "Habilitación" },
  PASSWORD_RESET: { color: "text-amber-400", bg: "bg-amber-500/15", ring: "ring-amber-500/30", label: "Reset de contraseña" },
};

// 💡 Extractor seguro para mitigar diferencias de nombres entre Front y Back
const obtenerFechaOriginal = (r) => r?.fechaAccion || r?.fechaRegistro;

function BadgeAccion({ tipoAccion }) {
  const config = ICONO_ACCION[tipoAccion] || { color: "text-gray-400", bg: "bg-gray-500/15", ring: "ring-gray-500/30", label: tipoAccion };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ring-1 ${config.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace("text-", "bg-")}`} />
      {config.label}
    </span>
  );
}

// 💡 Muestra la fecha limpia en la burbuja superior general
function formatearFechaGeneral(fechaIso) {
  if (!fechaIso) return "Fecha No Definida";
  try {
    const fechaLimpia = typeof fechaIso === "string" ? fechaIso.replace("T", " ") : fechaIso;
    const d = new Date(fechaLimpia);
    return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "Fecha No Definida";
  }
}

// 💡 SOLUCIÓN 1: Muestra la fecha exacta y hora en cada registro individual
function formatearFechaHoraExacta(fechaIso) {
  if (!fechaIso) return "—";
  try {
    const fechaLimpia = typeof fechaIso === "string" ? fechaIso.replace("T", " ") : fechaIso;
    const d = new Date(fechaLimpia);
    return d.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

function agruparPorFecha(registros) {
  const grupos = {};
  for (const r of registros) {
    const fechaBase = obtenerFechaOriginal(r);
    const fechaFormateada = formatearFechaGeneral(fechaBase);
    if (!grupos[fechaFormateada]) grupos[fechaFormateada] = [];
    grupos[fechaFormateada].push(r);
  }
  return grupos;
}

function parseDatosAnteriores(json) {
  if (!json) return null;
  try { return JSON.parse(json); } catch { return null; }
}

// 💡 SOLUCIÓN 2: Desglose y formateo del objeto [object Object]
function DetalleDatosAnteriores({ datos }) {
  const parsed = parseDatosAnteriores(datos);
  if (!parsed) return null;

  const campos = Object.entries(parsed).filter(
    ([k]) => !["contrasena", "intentosFallidos", "bloqueadoHasta"].includes(k),
  );

  return (
    <div className="mt-2 bg-[#0a1628] rounded-lg p-3 border border-[#1e3a5f]/50">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Datos anteriores
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
        {campos.map(([k, v]) => {
          let valorMostrar = "—";

          if (v != null) {
            if (typeof v === "object") {
              // Si es el objeto de Rol, extrae el nombre descriptivo directamente
              valorMostrar = v.tipoRol;
            } else {
              valorMostrar = String(v);
            }
          }

          return (
            <div key={k} className="text-xs">
              <span className="text-gray-500">{k}: </span>
              <span className="text-gray-300 font-mono">
                {valorMostrar}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventoTimeline({ registro, esPrimero }) {
  const config = ICONO_ACCION[registro.tipoAccion] || ICONO_ACCION.REGISTRAR;
  const fechaBase = obtenerFechaOriginal(registro);

  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ring-4 ${config.ring} ${config.bg} z-10 shrink-0 mt-1`} />
        {!esPrimero && <div className="w-px flex-1 bg-[#1e3a5f]/50" />}
      </div>

      <div className="flex-1 pb-6">
        <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-4 hover:border-blue-500/30 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-3">
              <BadgeAccion tipoAccion={registro.tipoAccion} />
              <span className="text-white text-sm font-medium">
                {registro.nombreUsuario || "Usuario No Definido"}
              </span>
            </div>
            {/* 💡 Modificado: Ahora muestra la fecha exacta y hora en la cabecera del registro */}
            <div className="flex items-center gap-2 text-xs text-blue-400 font-mono bg-[#0f1b2d] px-2 py-0.5 rounded border border-[#1e3a5f]/40">
              <span>{formatearFechaHoraExacta(fechaBase)}</span>
            </div>
          </div>

          <p className="text-gray-400 text-xs mb-1">
            Ejecutado por{" "}
            <span className="text-gray-300 font-medium">
              {registro.nombreUsuarioCreador || "Sistema"}
            </span>
          </p>

          {registro.motivo && (
            <div className="mt-2 bg-[#0a1628] rounded-lg px-3 py-2 border border-[#1e3a5f]/50">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                Justificación / Motivo
              </p>
              <p className="text-xs text-gray-300">{registro.motivo}</p>
            </div>
          )}

          <DetalleDatosAnteriores datos={registro.datosAnteriores} />
        </div>
      </div>
    </div>
  );
}

export default function LineaTiempoAuditoria() {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await listarHistorialUsuarios();
        setRegistros(Array.isArray(data) ? data : data.content || []);
      } catch (error) {
        console.error("ERROR AUDITORÍA:", error.response?.status, error.response?.data);
        toast.error("No se pudo cargar el historial de auditoría");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const registrosFiltrados = useMemo(() => {
    let resultado = [...registros];

    if (filtroNombre.trim()) {
      const texto = filtroNombre.trim().toLowerCase();
      resultado = resultado.filter((r) => r.nombreUsuario?.toLowerCase().includes(texto));
    }

    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      resultado = resultado.filter((r) => new Date(obtenerFechaOriginal(r)) >= desde);
    }
    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59, 999);
      resultado = resultado.filter((r) => new Date(obtenerFechaOriginal(r)) <= hasta);
    }

    resultado.sort((a, b) => new Date(obtenerFechaOriginal(b)) - new Date(obtenerFechaOriginal(a)));
    return resultado;
  }, [registros, filtroNombre, fechaDesde, fechaHasta]);

  // 💡 SOLUCIÓN 3: La burbuja general superior leerá de este agrupador dinámico corregido
  const grupos = useMemo(() => agruparPorFecha(registrosFiltrados), [registrosFiltrados]);

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Auditoría de Usuarios</h1>
        <p className="text-gray-400 text-sm mt-1">Línea de tiempo cronológica de acciones registradas sobre el personal</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Buscar Usuario</label>
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Nombre del usuario..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="w-full sm:w-56 bg-[#111e30] border border-[#1e3a5f] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Desde</label>
          <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} style={{ colorScheme: "dark" }} className="bg-[#111e30] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hasta</label>
          <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} style={{ colorScheme: "dark" }} className="bg-[#111e30] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
        </div>

        {(filtroNombre || fechaDesde || fechaHasta) && (
          <button onClick={() => { setFiltroNombre(""); setFechaDesde(""); setFechaHasta(""); }} className="px-3 py-2 rounded-lg text-xs text-gray-400 border border-[#1e3a5f] hover:border-gray-500 hover:text-white transition-colors cursor-pointer">
            Limpiar filtros
          </button>
        )}

        <span className="text-xs text-gray-500 whitespace-nowrap ml-auto font-mono">
          {registrosFiltrados.length} registro{registrosFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Contenedor Línea de tiempo */}
      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl p-6 shadow-xl">
        {cargando ? (
          <div className="flex flex-col items-center gap-2 py-16">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-500">Cargando historial...</span>
          </div>
        ) : registrosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xs">No se encontraron registros de auditoría</div>
        ) : (
          <div className="space-y-2">
            {Object.entries(grupos).map(([fecha, eventos]) => (
              <div key={fecha}>
                {/* Burbuja General del Día */}
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="h-px flex-1 bg-[#1e3a5f]/30" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-[#0f1b2d] px-3 py-1 rounded-full border border-[#1e3a5f]">
                    {fecha}
                  </span>
                  <div className="h-px flex-1 bg-[#1e3a5f]/30" />
                </div>

                {/* Listado de eventos bajo este mismo día */}
                {eventos.map((registro, idx) => (
                  <EventoTimeline key={registro.idHistorialUsuario || idx} registro={registro} esPrimero={idx === eventos.length - 1} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}