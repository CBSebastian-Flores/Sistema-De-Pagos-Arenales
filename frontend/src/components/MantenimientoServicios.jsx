import { useState, useEffect, useCallback } from "react";
import api from "../services/axiosConfig";
import { toast } from "react-toastify";
import ModalAuditoria from "../components/ModalAuditoria";
import {
  inhabilitarServicio,
  habilitarServicio,
} from "../services/servicioService";

// ─── Íconos inline ────────────────────────────────────────────────────────────
const IconEdit = () => (
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
      d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213l-4.5 1.5 1.5-4.5 12.362-12.226z"
    />
  </svg>
);
const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const IconPlus = () => (
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
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);
const IconUserBlock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
  </svg>
)

const IconUserCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

// ─── Modal base ───────────────────────────────────────────────────────────────
function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-[#111e30] border border-[#1e3a5f] rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e3a5f]">
          <h3 className="text-white font-bold text-base">{titulo}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <IconClose />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Campo de formulario ──────────────────────────────────────────────────────
function CampoForm({
  label,
  nombre,
  valor,
  onChange,
  error,
  type = "text",
  disabled = false,
  placeholder = "",
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={valor}
        onChange={(e) => onChange(nombre, e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`bg-[#0f1b2d] border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors
          ${error ? "border-red-500 focus:border-red-400" : "border-[#1e3a5f] focus:border-blue-500"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ─── Campo de selección (select) reutilizable ──────────────────────────────────
function CampoSelect({ label, nombre, valor, onChange, opciones, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <select
        value={valor}
        onChange={(e) => onChange(nombre, e.target.value)}
        className={`bg-[#0f1b2d] border rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors
          ${error ? "border-red-500 focus:border-red-400" : "border-[#1e3a5f] focus:border-blue-500"}`}
      >
        {opciones.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ─── Modal Crear / Editar Servicio ────────────────────────────────────────────
function ModalServicio({ servicio, onClose, onGuardado }) {
  const esEdicion = !!servicio;

  const [form, setForm] = useState({
    nombreServicio: servicio?.nombreServicio || "",
    descripcion: servicio?.descripcion || "",
    categoria: servicio?.categoria || "ORDINARIO",
    modalidadCobro: servicio?.modalidadCobro || "FIJO",
    precioBase:
      servicio?.precioBase !== undefined ? String(servicio.precioBase) : "",
    tarifaMora: servicio?.tarifaMora != null ? String(servicio.tarifaMora) : "", // 🚀 Agregado
  });

  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const handleChange = (nombre, valor) => {
    setForm((f) => {
      if (nombre === "modalidadCobro" && valor === "VARIABLE") {
        return {
          ...f,
          modalidadCobro: valor,
          precioBase: "0.00",
        };
      }
      return {
        ...f,
        [nombre]: valor,
      };
    });
    setErrores((e) => ({ ...e, [nombre]: null }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombreServicio.trim())
      nuevosErrores.nombreServicio = "El nombre es obligatorio";
    if (form.precioBase === "" || form.precioBase === null) {
      nuevosErrores.precioBase = "El precio base es obligatorio";
    } else if (isNaN(Number(form.precioBase)) || Number(form.precioBase) < 0) {
      nuevosErrores.precioBase = "El precio base no puede ser menor a 0";
    }
    return nuevosErrores;
  };

  const handleGuardar = async () => {
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const payload = {
      nombreServicio: form.nombreServicio.trim(),
      descripcion: form.descripcion.trim() || null,
      categoria: form.categoria,
      modalidadCobro: form.modalidadCobro,
      precioBase: Number(form.precioBase),
      tarifaMora: form.tarifaMora ? Number(form.tarifaMora) : null, // 🚀 Agregado
    };

    setCargando(true);
    try {
      if (esEdicion) {
        await api.put(
          `/api/servicios/actualizar/${servicio.idServicio}`,
          payload,
        );
        toast.success("Servicio actualizado correctamente");
      } else {
        await api.post("/api/servicios/crear", payload);
        toast.success("Servicio registrado correctamente");
      }
      onGuardado();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Error al guardar el servicio",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal
      titulo={esEdicion ? "Editar Servicio" : "Registrar Nuevo Servicio"}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        {esEdicion && (
          <CampoForm
            label="ID Servicio"
            nombre="idServicio"
            valor={String(servicio.idServicio)}
            onChange={() => {}}
            disabled
          />
        )}
        <CampoForm
          label="Nombre del Servicio"
          nombre="nombreServicio"
          valor={form.nombreServicio}
          onChange={handleChange}
          error={errores.nombreServicio}
          placeholder="Ej: Limpieza, Seguridad..."
        />
        <CampoForm
          label="Descripción (opcional)"
          nombre="descripcion"
          valor={form.descripcion}
          onChange={handleChange}
          error={errores.descripcion}
          placeholder="Descripción breve del servicio"
        />

        <div className="grid grid-cols-2 gap-4">
          <CampoSelect
            label="Categoría"
            nombre="categoria"
            valor={form.categoria}
            onChange={handleChange}
            error={errores.categoria}
            opciones={[
              { value: "ORDINARIO", label: "Ordinario" },
              { value: "EXTRAORDINARIO", label: "Extraordinario" },
            ]}
          />
          <CampoSelect
            label="Modalidad de Cobro"
            nombre="modalidadCobro"
            valor={form.modalidadCobro}
            onChange={handleChange}
            error={errores.modalidadCobro}
            opciones={[
              { value: "FIJO", label: "Fijo" },
              { value: "VARIABLE", label: "Variable" },
            ]}
          />
        </div>

        {/* 🚀 Campos de precios alineados */}
        <div className="grid grid-cols-2 gap-4">
          <CampoForm
            label={
              form.modalidadCobro === "VARIABLE"
                ? "Precio Base Ref. (S/.)"
                : "Precio Base (S/.)"
            }
            nombre="precioBase"
            valor={form.precioBase}
            onChange={handleChange}
            error={errores.precioBase}
            type="number"
            placeholder="0.00"
            disabled={form.modalidadCobro === "VARIABLE"}
          />
          <CampoForm
            label="Tarifa de Mora (S/.)"
            nombre="tarifaMora"
            valor={form.tarifaMora}
            onChange={handleChange}
            error={errores.tarifaMora}
            type="number"
            placeholder="Opcional (Ej: 10.00)"
          />
        </div>

        {form.modalidadCobro === "VARIABLE" && (
          <p className="text-xs text-gray-500 -mt-2">
            En servicios variables, este monto es solo referencial. La cuota
            real se calculará a partir de la factura recibida.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-[#1e3a5f] hover:border-gray-500 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={cargando}
          className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
        >
          {cargando
            ? "Guardando..."
            : esEdicion
              ? "Guardar Cambios"
              : "Registrar Servicio"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Badge de Estado ──────────────────────────────────────────────────────────
function BadgeEstado({ activo }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
      ${activo ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${activo ? "bg-emerald-400" : "bg-red-400"}`}
      />
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}

// ─── Badge de Modalidad de Cobro ────────────────────────────────────────────────
function BadgeModalidad({ modalidad }) {
  const esFijo = modalidad === "FIJO";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
      ${
        esFijo
          ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${esFijo ? "bg-blue-400" : "bg-amber-400"}`}
      />
      {esFijo ? "Fijo" : "Variable"}
    </span>
  );
}

function BadgeCategoria({ categoria }) {
  const esOrdinario = categoria === "ORDINARIO";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
        ${
          esOrdinario
            ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
            : "bg-orange-500/15 text-orange-400 border border-orange-500/30"
        }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${esOrdinario ? "bg-purple-400" : "bg-orange-400"}`}
      />
      {esOrdinario ? "Ordinario" : "Extraordinario"}
    </span>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function MantenimientoServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalServicio, setModalServicio] = useState(undefined);
  const [modalAuditoria, setModalAuditoria] = useState(false);
  const [idServicioSeleccionado, setIdServicioSeleccionado] = useState(null);
  const [accionPendiente, setAccionPendiente] = useState(null);

  const cargarServicios = useCallback(async () => {
    try {
      const res = await api.get("/api/servicios/listar");
      setServicios(res.data);
    } catch (error) {
      console.error(
        "ERROR SERVICIOS:",
        error.response?.status,
        error.response?.data,
      );
      toast.error("No se pudo cargar la lista de servicios");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const inicializar = async () => {
      await cargarServicios();
    };
    inicializar();
  }, [cargarServicios]);

  const abrirModalSuspension = (servicio, accion) => {
    setIdServicioSeleccionado(servicio.idServicio);
    setAccionPendiente(accion);
    setModalAuditoria(true);
  };

  const handleCambioEstadoServicio = async (motivo) => {
    try {
      if (!idServicioSeleccionado) return;

      if (accionPendiente === "inhabilitar") {
        await inhabilitarServicio(idServicioSeleccionado, motivo);
        toast.success("Servicio inhabilitado correctamente");
      } else {
        await habilitarServicio(idServicioSeleccionado, motivo);
        toast.success("Servicio habilitado correctamente");
      }

      setModalAuditoria(false);
      setIdServicioSeleccionado(null);
      setAccionPendiente(null);

      await cargarServicios();
    } catch (error) {
      toast.error(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          "Error al actualizar el estado del servicio",
      );
    }
  };

  const serviciosFiltrados = servicios.filter((s) => {
    const texto = busqueda.toLowerCase();
    return s.nombreServicio?.toLowerCase().includes(texto);
  });

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Mantenimiento de Servicios
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Catálogo centralizado de conceptos de cobro del CC Arenales
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
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
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#111e30] border border-[#1e3a5f] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {serviciosFiltrados.length} servicio
            {serviciosFiltrados.length !== 1 ? "s" : ""} encontrado
            {serviciosFiltrados.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setModalServicio(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
          >
            <IconPlus />
            Nuevo Servicio
          </button>
        </div>
      </div>

      <div className="bg-[#111e30] border border-[#1e3a5f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] bg-[#0f1b2d]">
                {[
                  "ID",
                  "Nombre",
                  "Descripción",
                  "Categoría",
                  "Modalidad",
                  "Precio Base",
                  "Tarifa Mora",
                  "Estado",
                  "Acciones",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Cargando servicios...</span>
                    </div>
                  </td>
                </tr>
              ) : serviciosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-16 text-gray-500 text-xs"
                  >
                    No se encontraron servicios
                  </td>
                </tr>
              ) : (
                serviciosFiltrados.map((s, i) => (
                  <tr
                    key={s.idServicio}
                    className={`border-b border-[#1e3a5f]/50 transition-colors hover:bg-[#1a2d4a]/40
                      ${i % 2 === 0 ? "" : "bg-[#0f1b2d]/30"}`}
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {s.idServicio}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {s.nombreServicio}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {s.descripcion || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <BadgeCategoria categoria={s.categoria} />
                    </td>
                    <td className="px-4 py-3">
                      <BadgeModalidad modalidad={s.modalidadCobro} />
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs font-mono">
                      S/. {Number(s.precioBase).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs font-mono">
                      {s.tarifaMora != null
                        ? `S/. ${Number(s.tarifaMora).toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <BadgeEstado
                        activo={s.estado === true || s.estado === 1}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setModalServicio(s)}
                          title="Editar servicio"
                          className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/15 hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          <IconEdit />
                        </button>
                        {s.estado === true || s.estado === 1 ? (
                          <button
                            onClick={() =>
                              abrirModalSuspension(s, "inhabilitar")
                            }
                            title="Inhabilitar servicio"
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors cursor-pointer"
                          >
                            <IconUserBlock/>
                          </button>
                        ) : (
                          <button
                            onClick={() => abrirModalSuspension(s, "habilitar")}
                            title="Habilitar servicio"
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-300 transition-colors cursor-pointer"
                          >
                            <IconUserCheck/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalServicio !== undefined && (
        <ModalServicio
          servicio={modalServicio}
          onClose={() => setModalServicio(undefined)}
          onGuardado={cargarServicios}
        />
      )}

      <ModalAuditoria
        isOpen={modalAuditoria}
        titulo={
          accionPendiente === "inhabilitar"
            ? "Suspender Servicio"
            : "Habilitar Servicio"
        }
        mensajeAdvertencia={
          accionPendiente === "inhabilitar"
            ? "¿Está seguro que desea detener la emisión de deudas para este concepto? El historial de recibos anteriores no se borrará."
            : "¿Está seguro que desea habilitar nuevamente este concepto de cobro?"
        }
        onClose={() => {
          setModalAuditoria(false);
          setIdServicioSeleccionado(null);
          setAccionPendiente(null);
        }}
        onConfirm={handleCambioEstadoServicio}
      />
    </div>
  );
}
