package com.arenales.services;

import com.arenales.dto.ServicioRequestDTO;
import com.arenales.dto.ServicioResponseDTO;

import java.util.List;

public interface ServicioService {
    // Las lecturas devuelven estrictamente RESPONSE
    List<ServicioResponseDTO> listarTodos();
    List<ServicioResponseDTO> listarActivos();
    ServicioResponseDTO buscarPorId(Integer id);

    // Las escrituras reciben REQUEST y devuelven RESPONSE
    ServicioResponseDTO crear(ServicioRequestDTO dto);
    ServicioResponseDTO actualizar(Integer id, ServicioRequestDTO dto);

    void inhabilitarLogico(Integer id);
}
