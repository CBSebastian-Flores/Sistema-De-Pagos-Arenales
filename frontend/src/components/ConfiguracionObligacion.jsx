import { useState, useEffect } from "react";
import api from "../services/axiosConfig";
import { toast } from "react-toastify";

// Helpers para automatizar fechas por defecto
const obtenerFechaHoy = () => new Date().toISOString().split("T")[0];
const obtenerFechaUnMesDespues = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split("T")[0];
};

export default function ConfiguracionObligacion() {
  const [servicios, setServicios] = useState([]);
  const [socios, setSocios] = useState(0);
  const [cargandoServicios, setCargandoServicios] = useState(true);
  const [cargandoSocios, setCargandoSocios] = useState(true);

  const [idServicio, setIdServicio] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [facturaTotal, setFacturaTotal] = useState("");

  // Estados de fecha inicializados dinámicamente
  const [fechaEmision, setFechaEmision] = useState(obtenerFechaHoy());
  const [fechaVencimiento, setFechaVencimiento] = useState(
    obtenerFechaUnMesDespues(),
  );

  const [errores, setErrores] = useState({});
  const [generando, setGenerando] = useState(false);

  // ── Carga de servicios activos ──
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

  // ── Carga de socios activos (real, calculado desde /listar) ──
  useEffect(() => {
    const cargarSocios = async () => {
      try {
        const res = await api.get("/api/usuarios/listar");
        // Administradores y Tesoreros también tienen puestos y pagan
        const rolesQuePagan = ["Socio", "Tesorero", "Administrador"];
        const activos = res.data.filter(
          (u) =>
            rolesQuePagan.includes(u.tipoRol) &&
            (u.estado === true || u.estado === 1),
        );
        setSocios(activos.length);
      } catch {
        toast.error("No se pudo calcular la cantidad de usuarios activos");
      } finally {
        setCargandoSocios(false);
      }
    };
    cargarSocios();
  }, []);

  const esFijo = servicioSeleccionado?.modalidadCobro === "FIJO";
  const esVariable = servicioSeleccionado?.modalidadCobro === "VARIABLE";

  // Cuota por socio: en vivo según modalidad
  const cuotaPorSocio = (() => {
    if (!servicioSeleccionado) return null;
    if (esFijo) return Number(servicioSeleccionado.precioBase);
    if (esVariable) {
      const total = Number(facturaTotal);
      if (!total || !socios) return 0;
      return total / socios;
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
      return;
    }

    const servicio = servicios.find((s) => String(s.idServicio) === id);
    setServicioSeleccionado(servicio || null);
    setFacturaTotal("");
  };

  const handleFacturaTotalChange = (e) => {
    const valor = e.target.value;
    setFacturaTotal(valor);
    setErrores((prev) => ({ ...prev, facturaTotal: null }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!idServicio) nuevosErrores.idServicio = "Selecciona un servicio";
    if (esVariable) {
      if (!facturaTotal || Number(facturaTotal) <= 0) {
        nuevosErrores.facturaTotal = "Ingresa el monto de la factura recibida";
      }
    }
    if (!fechaEmision)
      nuevosErrores.fechaEmision = "Selecciona la fecha de emisión";
    if (!fechaVencimiento)
      nuevosErrores.fechaVencimiento = "Selecciona la fecha de vencimiento";
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
      // SDPA-76: el payload solo envía la Cuota por Socio ya calculada.
      // La Factura Total fue solo un insumo para el cálculo en el frontend y se desecha aquí.
      const payload = {
        idServicio: Number(idServicio),
        montoCuotaSocio: cuotaPorSocio,
        fechaEmision,
        fechaVencimiento,
        ...(esVariable && { facturaTotal: Number(facturaTotal) }),
      };

      // 🚀 Endpoint real corregido
      await api.post("/api/deudas/publicar-masivo", payload);
      toast.success(
        `Obligación generada para ${socios} socio${socios !== 1 ? "s" : ""}`,
      );

      // Resetear formulario tras éxito
      setIdServicio("");
      setServicioSeleccionado(null);
      setFacturaTotal("");
      setFechaEmision(obtenerFechaHoy());
      setFechaVencimiento(obtenerFechaUnMesDespues());
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Error al generar la obligación",
      );
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
            Selecciona el servicio y el sistema calculará la cuota por socio automáticamente
          </p>
        </div>

        <div className="bg-[#111e30] border border-[#1e3a5f] rounded-2xl p-8 flex flex-col gap-7">
          {/* Selector de servicio */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Servicio
            </label>
            <select
              value={idServicio}
              onChange={handleSeleccionarServicio}
              disabled={cargandoServicios}
              className={`bg-[#0f1b2d] border rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors
                ${errores.idServicio ? "border-red-500" : "border-[#1e3a5f] focus:border-blue-500"}`}
            >
              <option value="" disabled>
                {cargandoServicios
                  ? "Cargando servicios..."
                  : "Selecciona un servicio"}
              </option>
              {servicios.map((s) => (
                <option key={s.idServicio} value={s.idServicio}>
                  {s.nombreServicio}
                </option>
              ))}
            </select>
            {errores.idServicio && (
              <p className="text-red-400 text-xs">{errores.idServicio}</p>
            )}

            {/* Badge de modalidad */}
            {servicioSeleccionado && (
              <div className="flex flex-col gap-1.5 pt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap w-fit
                  ${
                    esFijo
                      ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${esFijo ? "bg-blue-400" : "bg-amber-400"}`}
                  />
                  Modalidad {esFijo ? "Fija" : "Variable"}
                </span>
                <span className="text-xs text-gray-500">
                  {esFijo
                    ? "El monto se autocompleta con el precio base"
                    : "Ingresa la factura para calcular la cuota"}
                </span>
              </div>
            )}
          </div>

          {/* Bloque de montos: factura + cuota */}
          {servicioSeleccionado && (
            <div className="flex flex-col gap-5 pt-7 border-t border-[#1e3a5f]/60">
              {/* Factura Total — solo visible si es VARIABLE */}
              {esVariable && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Factura Total (S/.)
                  </label>
                  <input
                    type="number"
                    value={facturaTotal}
                    onChange={handleFacturaTotalChange}
                    placeholder="Ej: 1500.00"
                    className={`bg-[#0f1b2d] border rounded-lg px-3 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors
                      ${errores.facturaTotal ? "border-red-500" : "border-[#1e3a5f] focus:border-blue-500"}`}
                  />
                  {errores.facturaTotal && (
                    <p className="text-red-400 text-xs">
                      {errores.facturaTotal}
                    </p>
                  )}
                </div>
              )}

              {/* Cuota por Socio */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Cuota por Socio (S/.)
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    cuotaPorSocio !== null
                      ? `S/. ${cuotaPorSocio.toFixed(2)}`
                      : "—"
                  }
                  className="bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-3 text-base text-emerald-400 font-mono font-semibold opacity-90 cursor-not-allowed"
                />
                {esVariable && (
                  <p className="text-xs text-gray-500">
                    {cargandoSocios
                      ? "Calculando socios activos..."
                      : `Calculado entre ${socios} socio${socios !== 1 ? "s" : ""} activo${socios !== 1 ? "s" : ""}`}
                  </p>
                )}
              </div>
              {/* Indicador visual de la Tarifa de Mora */}
              {servicioSeleccionado && (
                <div className="flex flex-col gap-2 pt-7 border-t border-[#1e3a5f]/60">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Tarifa de Mora (S/.)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      servicioSeleccionado.tarifaMora !== undefined
                        ? `S/. ${Number(servicioSeleccionado.tarifaMora).toFixed(2)}`
                        : "S/. 0.00"
                    }
                    className="bg-[#0f1b2d] border border-[#1e3a5f] rounded-lg px-3 py-3 text-base text-gray-500 font-mono font-semibold opacity-70 cursor-not-allowed"
                  />
                  <p className="text-xs text-amber-500/90 mt-1">
                    * Esta penalidad se sumará automáticamente al saldo si la
                    deuda no se cancela hasta el{" "}
                    {fechaVencimiento.split("-").reverse().join("/")}.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Fecha de Emisión */}
          <div className="flex flex-col gap-2 pt-7 border-t border-[#1e3a5f]/60">
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
            {errores.fechaEmision && (
              <p className="text-red-400 text-xs">{errores.fechaEmision}</p>
            )}
          </div>

          {/* Fecha de vencimiento */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              value={fechaVencimiento}
              onChange={(e) => {
                setFechaVencimiento(e.target.value);
                setErrores((prev) => ({ ...prev, fechaVencimiento: null }));
              }}
              style={{ colorScheme: "dark" }}
              className={`bg-[#0f1b2d] border rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors
                ${errores.fechaVencimiento ? "border-red-500" : "border-[#1e3a5f] focus:border-blue-500"}`}
            />
            {errores.fechaVencimiento && (
              <p className="text-red-400 text-xs">{errores.fechaVencimiento}</p>
            )}
          </div>

          {/* Botón generar */}
          <button
            onClick={handleGenerar}
            disabled={generando || !servicioSeleccionado}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 mt-2 rounded-lg transition-colors text-sm"
          >
            {generando ? "Generando obligación..." : "Generar Obligación"}
          </button>
        </div>
      </div>
    </div>
  );
}
