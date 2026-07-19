import api from "./axiosConfig"

export const listarHistorialServicios = async (params = {}) => {
  const response = await api.get("api/historial-servicios/listar", { params })
  return response.data
}