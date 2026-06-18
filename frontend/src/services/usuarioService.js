import api from "./axiosConfig";

export const inhabilitarUsuario = async (id, motivo) => {
  const response = await api.put(`/api/usuarios/${id}/inhabilitar`, { motivo });
  return response.data;
};

export const habilitarUsuario = async (id, motivo) => {
  const response = await api.put(`/api/usuarios/${id}/habilitar`, { motivo });
  return response.data;
};