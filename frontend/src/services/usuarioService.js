import api from "./axiosConfig";

export const inhabilitarUsuario = async (id, motivo) => {
  const response = await api.put(`/api/usuarios/${id}/inhabilitar`, { motivo });
  return response.data;
};

export const habilitarUsuario = async (id, motivo) => {
  const response = await api.put(`/api/usuarios/${id}/habilitar`, { motivo });
  return response.data;
};

export const listarSociosActivos = async () => {
  const response = await api.get("/api/usuarios/listar");
  const rolesQuePagan = ["Socio", "Tesorero", "Administrador"];
  return response.data.filter(
    (u) =>
      rolesQuePagan.includes(u.tipoRol) &&
      (u.estado === true || u.estado === 1),
  );
};