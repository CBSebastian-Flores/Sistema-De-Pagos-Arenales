import api from "./axiosConfig"

export const obtenerReporteGeneral = async () => {
  const response = await api.get("/api/deudas/general")
  return response.data
}
