import api from "./axiosConfig"

export const listarHistorialUsuarios = async (params = {}) => {
  const response = await api.get("/api/auditoria/usuarios", { params })
  return response.data
}
