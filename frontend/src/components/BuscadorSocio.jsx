import { useState, useEffect, useRef } from "react";
import { listarSociosActivos } from "../services/usuarioService";

export default function BuscadorSocio({ socioSeleccionado, onSeleccionar }) {
  const [socios, setSocios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const contenedorRef = useRef(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await listarSociosActivos();
        setSocios(data);
      } catch {
        /* ya notificado por el servicio */
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  const sociosFiltrados = socios.filter((s) => {
    const texto = textoBusqueda.toLowerCase();
    return (
      s.dni?.toLowerCase().includes(texto) ||
      s.nombres?.toLowerCase().includes(texto) ||
      s.apellidos?.toLowerCase().includes(texto) ||
      String(s.nroPuesto).includes(texto)
    );
  });

  const handleSeleccionar = (socio) => {
    onSeleccionar(socio);
    setTextoBusqueda("");
    setDropdownAbierto(false);
  };

  const handleLimpiar = () => {
    onSeleccionar(null);
    setTextoBusqueda("");
  };

  return (
    <div className="flex flex-col gap-2" ref={contenedorRef}>
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Buscar Socio
      </label>

      {socioSeleccionado ? (
        <div className="bg-[#0f1b2d] border border-blue-500/30 rounded-lg px-3 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">
              {socioSeleccionado.nombres} {socioSeleccionado.apellidos}
            </span>
            <span className="text-gray-400 text-xs">
              DNI: {socioSeleccionado.dni} &middot; Puesto N°{" "}
              {socioSeleccionado.nroPuesto}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLimpiar}
            className="text-gray-500 hover:text-red-400 transition-colors text-xs font-medium cursor-pointer"
          >
            Cambiar
          </button>
        </div>
      ) : (
        <div className="relative">
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
            value={textoBusqueda}
            onChange={(e) => {
              setTextoBusqueda(e.target.value);
              setDropdownAbierto(true);
            }}
            onFocus={() => setDropdownAbierto(true)}
            placeholder={
              cargando
                ? "Cargando socios..."
                : "Buscar por DNI, nombre o puesto..."
            }
            disabled={cargando}
            className="w-full bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg pl-9 pr-3 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
          />
          {dropdownAbierto && textoBusqueda && (
            <div className="absolute z-20 mt-1 w-full bg-[#111e30] border border-[#1e3a5f] rounded-lg shadow-xl max-h-56 overflow-y-auto">
              {sociosFiltrados.length === 0 ? (
                <div className="px-3 py-4 text-center text-gray-500 text-xs">
                  No se encontraron socios
                </div>
              ) : (
                sociosFiltrados.map((s) => (
                  <button
                    key={s.idUsuario}
                    type="button"
                    onClick={() => handleSeleccionar(s)}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#1a2d4a] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-white text-sm">
                        {s.nombres} {s.apellidos}
                      </span>
                      <span className="text-gray-500 text-xs">
                        DNI: {s.dni}
                      </span>
                    </div>
                    <span className="text-blue-400 text-xs font-medium">
                      Puesto N° {s.nroPuesto}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
