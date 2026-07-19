import { useState, useEffect } from "react";
import api from "../services/axiosConfig";
import { toast } from "react-toastify";
import SwitchModalidad from "./SwitchModalidad";
import BuscadorSocio from "./BuscadorSocio";
import { listarSociosActivos } from "../services/usuarioService";

const obtenerFechaHoy = () => new Date().toISOString().split("T")[0];

export default function ConfiguracionObligacion() {
  const [servicios, setServicios] = useState([]);
  const [cantidadSocios, setCantidadSocios] = useState(0);
  const [cargandoServicios, setCargandoServicios] = useState(true);
  const [cargandoSocios, setCargandoSocios] = useState(true);

  // Estados del Formulario
  const [idServicio, setIdServicio] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [facturaTotal, setFacturaTotal] = useState("");
  const [fechaEmision, setFechaEmision] = useState(obtenerFechaHoy());

  // Modalidad de Emisión
  const [esIndividual, setEsIndividual] = useState(false);
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [montoIndividual, setMontoIndividual] = useState("");

  const [errores, setErrores] = useState({});
  const [generando, setGenerando] = useState(false);

  // Cargar Catálogo Completo de Servicios Activos
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const res = await api.get("/api/servicios/activos");
        setServicios(res.data);
      } catch {
        toast.error("No se pudo cargar el catálogo de servicios");
      } finally {
        setCargandoServicios(false);
      }
    };
    cargarServicios();
  }, []);

  // Cargar y Calcular Socios Activos
  useEffect(() => {
    const calcularSocios = async () => {
      try {
        const sociosActivos = await listarSociosActivos();
        setCantidadSocios(sociosActivos.length);
      } catch {
        toast.error("No se pudo calcular la cantidad de usuarios activos");
      } finally {
        setCargandoSocios(false);
      }
    };
    calcularSocios();
  }, []);

  const esFijo = servicioSeleccionado?.modalidadCobro === "FIJO";
  const esVariable = servicioSeleccionado?.modalidadCobro === "VARIABLE";

  // Cálculo automático de cuota masiva
  const cuotaPorSocio = (() => {
    if (!servicioSeleccionado || !cantidadSocios) return null;
    if (esFijo) return Number(servicioSeleccionado.precioBase) / cantidadSocios;
    if (esVariable) {
      const total = Number(facturaTotal);
      return total ? total / cantidadSocios : 0;
    }
    return null;
  })();

  const handleSeleccionarServicio = (e) => {
    const id = e.target.value;
    setIdServicio(id);
    setErrores((prev) => ({ ...prev, idServicio: null, facturaTotal: null }));

    if (!id) {
      setServicioSeleccionado(null);
      setFacturaTotal("");
      setMontoIndividual("");
      setEsIndividual(false);
      return;
    }

    const servicio = servicios.find((s) => String(s.idServicio) === id);
    setServicioSeleccionado(servicio || null);

    if (servicio && servicio.modalidadCobro === "FIJO") {
      setFacturaTotal(String(servicio.precioBase));
      setMontoIndividual(String(servicio.precioBase));
      setEsIndividual(false); // Regla: Fijo es obligatoriamente masivo
    } else {
      setFacturaTotal("");
      setMontoIndividual("");
      setEsIndividual(false); // Por defecto inicia en masivo para variables
    }
  };

  const handleCambioModalidad = (individual) => {
    setEsIndividual(individual);
    setSocioSeleccionado(null);
    setMontoIndividual("");
    setErrores({});
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!idServicio) nuevosErrores.idServicio = "Selecciona un servicio";

    if (esIndividual) {
      if (!socioSeleccionado) nuevosErrores.socioSeleccionado = "Selecciona un socio";
      if (!montoIndividual || Number(montoIndividual) <= 0) {
        nuevosErrores.montoIndividual = "Ingresa un monto válido";
      }
    } else if (esVariable) {
      if (!facturaTotal || Number(facturaTotal) <= 0) {
        nuevosErrores.facturaTotal = "Ingresa el monto de la factura recibida";
      }
    }

    if (!fechaEmision) nuevosErrores.fechaEmision = "Selecciona la fecha requerida";
    return nuevosErrores;
  };

  const handleGenerar = async () => {
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setGenerando(true);
    try {
      if (esIndividual) {
        const payload = {
          nroPuesto: socioSeleccionado.nroPuesto,
          idServicio: Number(idServicio),
          montoBase: Number(montoIndividual),
          fechaVencimiento: fechaEmision,
        };
        await api.post("/api/deudas/individual", payload);
        toast.success(`Obligación generada para Puesto N° ${socioSeleccionado.nroPuesto}`);
      } else {
        const payload = {
          idServicio: Number(idServicio),
          montoCuotaSocio: cuotaPorSocio,
          fechaEmision,
        };
        await api.post("/api/deudas/publicar-masivo", payload);
        toast.success(`Obligación masiva generada correctamente`);
      }

      setIdServicio("");
      setServicioSeleccionado(null);
      setFacturaTotal("");
      setMontoIndividual("");
      setSocioSeleccionado(null);
      setFechaEmision(obtenerFechaHoy());
      setEsIndividual(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al generar la obligación");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="p-6 min-h-full flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Configuración de Nueva Obligación</h1>
          <p className="text-gray-400 text-sm mt-1">
            Selecciona un servicio del catálogo para comenzar la configuración.
          </p>
        </div>

        <div className="bg-[#111e30] border border-[#1e3a5f] rounded-2xl p-8 flex flex-col gap-7">
          
          {/* 1. SELECTOR DE SERVICIO (PRIMER PASO ABSOLUTO) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Servicio</label>
            <select
              value={idServicio}
              onChange={handleSeleccionarServicio}
              disabled={cargandoServicios}
              className={`bg-[#0f1b2d] border rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors
                ${errores.idServicio ? "border-red-500" : "border-[#1e3a5f] focus:border-blue-500"}`}
            >
              <option value="" disabled>
                {cargandoServicios ? "Cargando servicios..." : "Selecciona un servicio"}
              </option>
              {servicios.map((s) => (
                <option key={s.idServicio} value={s.idServicio}>{s.nombreServicio}</option>
              ))}
            </select>
            {errores.idServicio && <p className="text-red-400 text-xs">{errores.idServicio}</p>}

            {servicioSeleccionado && (
              <div className="flex flex-col gap-1.5 pt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit
                  ${esFijo ? "bg-blue-500/15 text-blue-400 border border-blue-500/30" : "bg-amber-500/15 text-amber-400 border border-amber-500/30"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${esFijo ? "bg-blue-400" : "bg-amber-400"}`} />
                  Modalidad {esFijo ? "Fija" : "Variable"}
                </span>
              </div>
            )}
          </div>

          {/* 2. DESPLIEGUE CONDICIONAL (SOLO SI HAY UN SERVICIO SELECCIONADO) */}
          {servicioSeleccionado && (
            <div className="flex flex-col gap-7 pt-4 border-t border-[#1e3a5f]/40">
              
              {/* 💡 REGLA DE LA ASOCIACIÓN: Solo se muestra el switch si el servicio es VARIABLE */}
              {esVariable && (
                <SwitchModalidad esIndividual={esIndividual} onChange={handleCambioModalidad} />
              )}

              {/* FLUJO INTERNO SEGÚN MODO INDIVIDUAL O MASIVO */}
              {esIndividual ? (
                /* ── CASO: INDIVIDUAL VARIABLE (Cobro específico por puesto) ── */
                <>
                  <BuscadorSocio socioSeleccionado={socioSeleccionado} onSeleccionar={setSocioSeleccionado} />
                  {errores.socioSeleccionado && <p className="text-red-400 text-xs">{errores.socioSeleccionado}</p>}

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monto consumido a Cobrar (S/.)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={montoIndividual}
                      onChange={(e) => {
                        setMontoIndividual(e.target.value);
                        setErrores((prev) => ({ ...prev, montoIndividual: null }));
                      }}
                      placeholder="Ej: 84.50"
                      className={`bg-[#0f1b2d] border rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors
                        ${errores.montoIndividual ? "border-red-500" : "border-[#1e3a5f] focus:border-blue-500"}`}
                    />
                    {errores.montoIndividual && <p className="text-red-400 text-xs">{errores.montoIndividual}</p>}
                  </div>
                </>
              ) : (
                /* ── CASO: MASIVO (Fijos como Seguridad o Variables Globales divididos entre todos) ── */
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {esFijo ? "Costo Fijo Total del Servicio (S/.)" : "Factura Global Recibida (S/.)"}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={facturaTotal}
                      onChange={(e) => {
                        setFacturaTotal(e.target.value);
                        setErrores((prev) => ({ ...prev, facturaTotal: null }));
                      }}
                      readOnly={esFijo}
                      placeholder="Ej: 2400.00"
                      className={`bg-[#0f1b2d] border rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors
                        ${esFijo ? "opacity-70 cursor-not-allowed border-[#1e3a5f]" : errores.facturaTotal ? "border-red-500" : "border-[#1e3a5f] focus:border-blue-500"}`}
                    />
                    {errores.facturaTotal && esVariable && <p className="text-red-400 text-xs">{errores.facturaTotal}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cuota correspondiente por Socio (S/.)</label>
                    <div className="bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-3 text-base text-emerald-400 font-mono font-semibold opacity-90">
                      {cuotaPorSocio !== null ? `S/. ${cuotaPorSocio.toFixed(2)}` : "—"}
                    </div>
                    <p className="text-xs text-gray-500">
                      {cargandoSocios ? "Calculando socios..." : `Monto total dividido equitativamente entre los ${cantidadSocios} socios activos.`}
                    </p>
                  </div>
                </>
              )}

              {/* TARIFA DE MORA INFORMATIVA */}
              <div className="flex flex-col gap-2 pt-4 border-t border-[#1e3a5f]/40">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tarifa de Mora Aplicable (S/.)</label>
                <div className="bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-3 text-base text-gray-500 font-mono font-semibold opacity-70">
                  S/. {Number(servicioSeleccionado.tarifaMora || 0).toFixed(2)}
                </div>
                <p className="text-xs text-amber-500/90">* Recargo automático si la obligación vence sin registrar pago.</p>
              </div>

              {/* FECHA DE EMISIÓN / VENCIMIENTO */}
              <div className="flex flex-col gap-2 pt-4 border-t border-[#1e3a5f]/40">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Fecha de Emisión
                </label>
                <input
                  type="date"
                  value={fechaEmision}
                  onChange={(e) => {
                    setFechaEmision(e.target.value);
                    setErrores((prev) => ({ ...prev, fechaEmision: null }));
                  }}
                  style={{ colorScheme: "dark" }}
                  className={`bg-[#0f1b2d] border rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors
                    ${errores.fechaEmision ? "border-red-500" : "border-[#1e3a5f] focus:border-blue-500"}`}
                />
                {errores.fechaEmision && <p className="text-red-400 text-xs">{errores.fechaEmision}</p>}
              </div>

              {/* BOTÓN ACCIÓN */}
              <button
                onClick={handleGenerar}
                disabled={generando}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 mt-2 rounded-lg transition-colors text-sm cursor-pointer"
              >
                {generando ? "Procesando..." : esIndividual ? "Generar Obligación Individual" : "Generar Obligación Masiva"}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}