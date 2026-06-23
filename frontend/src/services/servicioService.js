import api from "./axiosConfig"

export const inhabilitarServicio = async (id, motivo) => {
    const response = await api.put(
        `/api/servicios/${id}/inhabilitar`,
        { motivo }
    )

    return response.data
}

export const habilitarServicio = async (id, motivo) => {
    const response = await api.put(
        `/api/servicios/${id}/habilitar`,
        { motivo }
    )

    return response.data
}