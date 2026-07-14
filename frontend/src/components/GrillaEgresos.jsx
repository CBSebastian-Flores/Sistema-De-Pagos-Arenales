import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { listarEgresosPaginados } from "../services/egresoService";
import useDebounce from "../hooks/useDebounce";
import ModalComprobante from "./ModalComprobante";

const CATEGORIAS = [
  "Servicios Públicos",
  "Mantenimiento",
  "Suministros",
  "Honorarios",
  "Impuestos",
  "Otros",
];

const OPCIONES_PAGINA = [5, 10, 20, 50];

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "—";
  try {
    return new Date(fechaStr).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return fechaStr;
  }
};

export default function GrillaEgresos() {
  const [egresos, setEgresos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(0);
  const [tamanoPagina, setTamanoPagina] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [egresoSeleccionado, setEgresoSeleccionado] = useState(null);

  const busquedaDebounced = useDebounce(busqueda, 400);

  useEffect(() => {
    let cancelado = false;

    const cargar = async () => {
      setCargando(true);
      try {
        const data = await listarEgresosPaginados({
          criterio: busquedaDebounced || undefined,
          categoria: categoria || undefined,
          desde: desde || undefined,
          hasta: hasta || undefined,
          page: paginaActual,
          size: tamanoPagina,
        });

        if (!cancelado) {
          setEgresos(data.content || []);
          setTotalPaginas(data.totalPages || 0);
          setTotalElementos(data.totalElements || 0);
        }
      } catch {
        if (!cancelado) {
          toast.error("No se pudieron cargar los egresos");
          setEgresos([]);
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargar();
    return () => {
      cancelado = true;
    };
  }, [busquedaDebounced, categoria, desde, hasta, paginaActual, tamanoPagina]);

  const handleCambioFiltro = useCallback((setter) => (e) => {
    setter(e.target.value);
    setPaginaActual(0);
  }, []);

  const handleResetFiltros = () => {
    setBusqueda("");
    setCategoria("");
    setDesde("");
    setHasta("");
    setPaginaActual(0);
  };

  const tieneFiltros = busqueda || categoria || desde || hasta;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Filtros ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-72">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por beneficiario..."
            className="w-full bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <select
          value={categoria}
          onChange={handleCambioFiltro(setCategoria)}
          className="bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={desde}
          onChange={handleCambioFiltro(setDesde)}
          style={{ colorScheme: "dark" }}
          className="bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
        />

        <input
          type="date"
          value={hasta}
          onChange={handleCambioFiltro(setHasta)}
          style={{ colorScheme: "dark" }}
          className="bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
        />

        {tieneFiltros && (
          <button
            onClick={handleResetFiltros}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* ── Tabla ── */}
      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                {[
                  "Código",
                  "Beneficiario",
                  "Categoría",
                  "Monto",
                  "Método",
                  "Fecha",
                  "Acciones",
                ].map((col) => (
                  <th
                    key={col}
                    className={`px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap ${col === "Código" ? "text-left" : col === "Acciones" ? "text-center" : "text-left"}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a5f]/40">
              {cargando ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Cargando egresos...</span>
                    </div>
                  </td>
                </tr>
              ) : egresos.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-gray-500 text-xs"
                  >
                    No se encontraron egresos con los filtros aplicados
                  </td>
                </tr>
              ) : (
                egresos.map((eg, i) => (
                  <tr
                    key={eg.idEgreso}
                    className={`text-center transition-colors hover:bg-[#1a2d4a]/40 ${i % 2 === 0 ? "" : "bg-[#0f1b2d]/20"}`}
                  >
                    <td className="text-left px-4 py-3 text-blue-400 font-mono text-xs font-medium">
                      {eg.codigoEgreso}
                    </td>
                    <td className="text-left px-4 py-3 text-white font-medium whitespace-nowrap">
                      {eg.beneficiario}
                    </td>
                    <td className="text-left px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#1e3a5f]/60 text-gray-300 border border-[#1e3a5f] whitespace-nowrap">
                        {eg.categoriaEgreso}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-red-400 font-mono font-bold text-sm">
                      -S/. {Number(eg.monto).toFixed(2)}
                    </td>
                    <td className="text-left px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {eg.metodoRetiro}
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">
                      {formatearFecha(eg.fechaGasto)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setEgresoSeleccionado(eg)}
                          title="Ver comprobante"
                          className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/15 hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Paginación ── */}
      {totalElementos > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Filas por página:</span>
            <select
              value={tamanoPagina}
              onChange={(e) => {
                setTamanoPagina(Number(e.target.value));
                setPaginaActual(0);
              }}
              className="bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-2 py-1 text-xs text-white outline-none cursor-pointer"
            >
              {OPCIONES_PAGINA.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-500">
              {paginaActual * tamanoPagina + 1}–
              {Math.min((paginaActual + 1) * tamanoPagina, totalElementos)} de{" "}
              {totalElementos}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <PaginationBtn
              onClick={() => setPaginaActual(0)}
              disabled={paginaActual === 0}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </PaginationBtn>
            <PaginationBtn
              onClick={() => setPaginaActual((p) => Math.max(0, p - 1))}
              disabled={paginaActual === 0}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </PaginationBtn>

            {Array.from({ length: Math.min(totalPaginas, 5) }, (_, idx) => {
              let paginaIdx;
              if (totalPaginas <= 5) {
                paginaIdx = idx;
              } else if (paginaActual < 3) {
                paginaIdx = idx;
              } else if (paginaActual >= totalPaginas - 3) {
                paginaIdx = totalPaginas - 5 + idx;
              } else {
                paginaIdx = paginaActual - 2 + idx;
              }

              return (
                <button
                  key={paginaIdx}
                  onClick={() => setPaginaActual(paginaIdx)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer
                    ${
                      paginaActual === paginaIdx
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-[#1e3a5f]"
                    }`}
                >
                  {paginaIdx + 1}
                </button>
              );
            })}

            <PaginationBtn
              onClick={() =>
                setPaginaActual((p) => Math.min(totalPaginas - 1, p + 1))
              }
              disabled={paginaActual >= totalPaginas - 1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </PaginationBtn>
            <PaginationBtn
              onClick={() => setPaginaActual(totalPaginas - 1)}
              disabled={paginaActual >= totalPaginas - 1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 19.5l7.5-7.5 7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
              />
            </PaginationBtn>
          </div>
        </div>
      )}

      {/* ── Modal Comprobante ── */}
      {egresoSeleccionado && (
        <ModalComprobante
          egreso={egresoSeleccionado}
          onClose={() => setEgresoSeleccionado(null)}
        />
      )}
    </div>
  );
}

function PaginationBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e3a5f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        {children}
      </svg>
    </button>
  );
}
