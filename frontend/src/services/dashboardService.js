import api from "./axiosConfig"
import { obtenerReporteGeneral } from "./deudaService"

const obtenerTotalIngresos = async () => {
  const res = await api.get("/api/pagos/total")
  return res?.data?.total != null ? Number(res.data.total) : 0
}

const obtenerTotalEgresos = async () => {
  const res = await api.get("/api/egresos/total")
  return res?.data?.total != null ? Number(res.data.total) : 0
}

const obtenerUltimosEgresos = async () => {
  const res = await api.get("/api/egresos/ultimos")
  return Array.isArray(res?.data) ? res.data : []
}

const obtenerUltimosPagos = async () => {
  try {
    const res = await api.get("/api/pagos/ultimos")
    return Array.isArray(res?.data) ? res.data : []
  } catch {
    return []
  }
}

const obtenerServiciosActivos = async () => {
  try {
    const res = await api.get("/api/servicios/activos")
    return Array.isArray(res?.data) ? res.data : []
  } catch {
    return []
  }
}

function computarMetricasDeudas(deudas) {
  if (!Array.isArray(deudas)) {
    return { deudasPendientes: 0, deudasPagadas: 0, deudasVencidas: 0 }
  }
  return {
    deudasPendientes: deudas.filter((d) => d.estadoDeuda?.toUpperCase() === "PENDIENTE").length,
    deudasPagadas: deudas.filter((d) => d.estadoDeuda?.toUpperCase() === "PAGADO").length,
    deudasVencidas: deudas.filter((d) => d.estadoDeuda?.toUpperCase() === "VENCIDO").length,
  }
}

export async function obtenerResumenDashboard() {
  try {
    const res = await api.get("/api/dashboard/resumen")
    return res.data
  } catch (error) {
    if (error.response?.status !== 404) throw error
  }

  const [
    totalIngresos,
    totalEgresos,
    ultimosEgresos,
    deudas,
    ultimosPagos,
    servicios,
  ] = await Promise.all([
    obtenerTotalIngresos(),
    obtenerTotalEgresos(),
    obtenerUltimosEgresos(),
    obtenerReporteGeneral(),
    obtenerUltimosPagos(),
    obtenerServiciosActivos(),
  ])

  return {
    totalIngresos,
    totalEgresos,
    balanceNeto: totalIngresos - totalEgresos,
    ...computarMetricasDeudas(deudas),
    serviciosActivos: servicios.length,
    ultimosEgresos,
    ultimosPagos,
  }
}
