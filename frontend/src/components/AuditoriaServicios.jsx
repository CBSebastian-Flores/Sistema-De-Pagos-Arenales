import { useState, useEffect, useMemo, Fragment } from "react";
import { toast } from "react-toastify";
import { listarHistorialServicios } from "../services/auditoriaServicioService";

const CONFIG_ACCION = {
  REGISTRAR: { color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30", label: "Registro" },
  ACTUALIZAR: { color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30", label: "Actualización" },
  INHABILITAR: { color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30", label: "Inhabilitación" },
  HABILITAR: { color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30", label: "Habilitación" },
};

// 💡 Extractor seguro para mitigar variaciones entre DTOs de Backend
const obtenerFechaOriginal = (r) => r?.fechaAccion || r?.fechaRegistro;

const obtenerNombreCreador = (r) => {
  if (r?.nombreUsuarioCreador) return r.nombreUsuarioCreador;
  if (r?.creadorNombres) return `${r.creadorNombres} ${r.creadorApellidos || ""}`.trim();
  return "Sistema";
};

function BadgeAccion({ tipoAccion }) {
  const c = CONFIG_ACCION[tipoAccion] || { color: "text-gray-400", bg: "bg-gray-500/15", border: "border-gray-500/30", label: tipoAccion };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.color} border ${c.border} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.color.replace("text-", "bg-")}`} />
      {c.label}
    </span>
  );
}

// 💡 Muestra la fecha exacta y hora formateada correctamente
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

function parseDatos(json) {
  if (!json) return null;
  try { return JSON.parse(json); } catch { return null; }
}

// 💡 Renderizador seguro que previene el [object Object] en las tablas expandidas
function RenderCamposValores({ campos }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
      {campos.map(([k, v]) => {
        let valorMostrar = "—12";
        if (v != null) {
          if (typeof v === "object") {
            valorMostrar = v.nombre || v.descripcion || v.nombreRol || JSON.stringify(v);
          } else {
            valorMostrar = String(v);
          }
        }
        return (
          <div key={k} className="text-xs">
            <span className="text-gray-500">{k}: </span>
            <span className="text-gray-300 font-mono">{valorMostrar}</span>
          </div>
        );
      })}
    </div>
  );
}

function DetalleExpandido({ registro }) {
  const datos = parseDatos(registro.datosAnteriores);
  const campos = datos
    ? Object.entries(datos).filter(([k]) => !["contrasena", "intentosFallidos", "bloqueadoHasta"].includes(k))
    : [];

  return (
    <tr>
      <td colSpan={6} className="px-4 py-4 bg-[#0a1628] border-b border-[#1e3a5f]/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Datos anteriores protegidos contra objetos anidados */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Estado anterior del servicio
            </p>
            {campos.length > 0 ? (
              <RenderCamposValores campos={campos} />
            ) : (
              <p className="text-xs text-gray-600 italic">No existen registros previos (Es un Registro Nuevo)</p>
            )}
          </div>

          {/* Justificación */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Justificación registrada
            </p>
            {registro.motivo ? (
              <div className="bg-[#111e30] rounded-lg p-3 border border-[#1e3a5f]/50 max-h-32 overflow-y-auto">
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{registro.motivo}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-600 italic">Sin justificación registrada</p>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function ModalJustificacion({ registro, onClose }) {
  if (!registro) return null;
  const fechaBase = obtenerFechaOriginal(registro);
  const datos = parseDatos(registro.datosAnteriores);
  const campos = datos ? Object.entries(datos).filter(([k]) => !["contrasena", "intentosFallidos", "bloqueadoHasta"].includes(k)) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-[#111e30] border border-[#1e3a5f] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a5f]">
          <div className="flex items-center gap-3">
            <BadgeAccion tipoAccion={registro.tipoAccion} />
            <h3 className="text-white font-bold text-base">Detalle de Modificación</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0a1628] p-3 rounded-xl border border-[#1e3a5f]/30">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Servicio afectado</p>
              <p className="text-sm text-white font-semibold truncate">{registro.nombreServicio || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Fecha y Hora Exacta</p>
              <p className="text-sm text-blue-400 font-mono">{formatearFechaHoraExacta(fechaBase)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Ejecutado por</p>
              <p className="text-sm text-gray-300 font-medium truncate">{obtenerNombreCreador(registro)}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Justificación técnica</p>
            <div className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f]/50 min-h-[80px]">
              {registro.motivo ? (
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{registro.motivo}</p>
              ) : (
                <p className="text-sm text-gray-600 italic">No se registró justificación para esta acción.</p>
              )}
            </div>
          </div>

          {/* Historial anterior con extractor seguro anti-objetos */}
          {campos.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Estado anterior del servicio</p>
              <div className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f]/50">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                  {campos.map(([k, v]) => {
                    let val = "—";
                    if (v != null) val = typeof v === "object" ? (v.nombre || v.descripcion || JSON.stringify(v)) : String(v);
                    return (
                      <div key={k} className="text-xs">
                        <span className="text-gray-500 block text-[10px] uppercase">{k}</span>
                        <span className="text-gray-200 font-mono text-[13px]">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-[#1e3a5f]">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-[#1e3a5f] hover:border-gray-500 hover:text-white transition-colors cursor-pointer">
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuditoriaServicios() {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [filaExpandida, setFilaExpandida] = useState(null);
  const [modalJustificacion, setModalJustificacion] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await listarHistorialServicios();
        setRegistros(Array.isArray(data) ? data : data.content || []);
      } catch (error) {
        console.error("ERROR AUDITORÍA SERVICIOS:", error.response?.status, error.response?.data);
        toast.error("No se pudo cargar el historial de auditoría de servicios");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const registrosFiltrados = useMemo(() => {
    let resultado = [...registros];

    if (busqueda.trim()) {
      const texto = busqueda.trim().toLowerCase();
      resultado = resultado.filter((r) =>
        r.servicioNombre?.toLowerCase().includes(texto) ||
        r.creadorNombres?.toLowerCase().includes(texto) ||
        r.nombreUsuarioCreador?.toLowerCase().includes(texto)
      );
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
  }, [registros, busqueda, fechaDesde, fechaHasta]);

  const toggleFila = (id) => {
    setFilaExpandida((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Auditoría de Servicios</h1>
        <p className="text-gray-400 text-sm mt-1">Panel de fiscalización de modificaciones al catálogo de conceptos de cobro</p>
      </div>

      {/* Filtros Integrados */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Concepto / Operador</label>
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar servicio u operador..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full sm:w-56 bg-[#111e30] border border-[#1e3a5f] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#111e30] border border-[#1e3a5f] rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
          <span className="text-xs text-gray-500 font-semibold uppercase select-none">Desde:</span>
          <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} style={{ colorScheme: "dark" }} className="bg-transparent text-sm text-white outline-none cursor-pointer" />
        </div>

        <div className="flex items-center gap-2 bg-[#111e30] border border-[#1e3a5f] rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
          <span className="text-xs text-gray-500 font-semibold uppercase select-none">Hasta:</span>
          <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} style={{ colorScheme: "dark" }} className="bg-transparent text-sm text-white outline-none cursor-pointer" />
        </div>

        {(busqueda || fechaDesde || fechaHasta) && (
          <button onClick={() => { setBusqueda(""); setFechaDesde(""); setFechaHasta(""); }} className="px-3 py-2 rounded-lg text-xs text-gray-400 border border-[#1e3a5f] hover:border-gray-500 hover:text-white transition-colors cursor-pointer">
            Limpiar filtros
          </button>
        )}

        <span className="text-xs text-gray-500 whitespace-nowrap sm:ml-auto font-mono">
          {registrosFiltrados.length} registro{registrosFiltrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tabla de Fiscalización */}
      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                {["Fecha y Hora", "Servicio / Concepto", "Acción Ejecutada", "Ejecutado por", "Justificación Corta", "Acciones"].map((col) => (
                  <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a5f]/30">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-gray-400">Cargando historial de servicios...</span>
                    </div>
                  </td>
                </tr>
              ) : registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500 text-xs">No se encontraron registros de auditoría de conceptos.</td>
                </tr>
              ) : (
                registrosFiltrados.map((r, i) => {
                  const expandida = filaExpandida === r.idHistorialServicio;
                  const fechaBase = obtenerFechaOriginal(r);
                  return (
                    <Fragment key={r.idHistorialServicio || i}>
                      <tr
                        onClick={() => toggleFila(r.idHistorialServicio)}
                        className={`transition-colors cursor-pointer ${expandida ? "bg-[#1a2d4a]/60" : "hover:bg-[#1a2d4a]/40"} ${i % 2 === 0 ? "" : "bg-[#0f1b2d]/10"}`}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-blue-400 whitespace-nowrap">
                          {formatearFechaHoraExacta(fechaBase)}
                        </td>
                        <td className="px-4 py-3 text-white font-medium text-xs whitespace-nowrap">
                          {r.nombreServicio || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <BadgeAccion tipoAccion={r.tipoAccion} />
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-xs whitespace-nowrap">
                          {obtenerNombreCreador(r)}
                        </td>
                        <td className="px-4 py-3 max-w-[220px]">
                          {r.motivo ? (
                            <p className="text-xs text-gray-400 truncate">{r.motivo}</p>
                          ) : (
                            <span className="text-xs text-gray-600 italic">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); setModalJustificacion(r); }}
                              title="Ver justificación completa"
                              className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/15 hover:text-blue-300 transition-colors cursor-pointer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleFila(r.idHistorialServicio); }}
                              title={expandida ? "Contraer" : "Expandir"}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-500/15 hover:text-gray-300 transition-colors cursor-pointer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform ${expandida ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandida && <DetalleExpandido registro={r} />}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Justificación Técnica */}
      <ModalJustificacion registro={modalJustificacion} onClose={() => setModalJustificacion(null)} />
    </div>
  );
}