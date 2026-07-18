import api from "./axiosConfig";

export const listarEgresosPaginados = async ({
  criterio,
  categoria,
  desde,
  hasta,
  page = 0,
  size = 10,
  sort = "fechaGasto,desc",
} = {}) => {
  const params = new URLSearchParams();
  if (criterio) params.append("criterio", criterio);
  if (categoria) params.append("categoria", categoria);
  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);
  params.append("page", page);
  params.append("size", size);
  params.append("sort", sort);

  const response = await api.get(`/api/egresos?${params.toString()}`);
  return response.data;
};
