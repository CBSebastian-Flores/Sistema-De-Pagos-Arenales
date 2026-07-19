import api from "./axiosConfig"

export const listarHistorialUsuarios = async (params = {}) => {
  const response = await api.get("/api/historial-usuarios/listar", { params })
  return response.data
}