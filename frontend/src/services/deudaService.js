import api from "./axiosConfig"

export const obtenerReporteGeneral = async () => {
  const response = await api.get("/api/deudas/general")
  return response.data
}

export const registrarPagoDeuda = async (formData) => {
  const response = await api.post("/api/deudas/cobrar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export const obtenerHistorialPagos = async () => {
  const response = await api.get("/api/deudas/historial")
  return response.data
}

export const descargarBoleta = async (idDeuda) => {
  const response = await api.get(`/api/deudas/${idDeuda}/boleta`, {
    responseType: "blob",
  })
  return response.data
}