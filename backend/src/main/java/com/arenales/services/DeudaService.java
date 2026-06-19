package com.arenales.services;

import java.util.List;

import com.arenales.dto.DeudaRequestDTO;
import com.arenales.dto.DeudaResponseDTO;

public interface DeudaService {
    
    // Método existente de tus compañeros
    void publicarDeudaMasiva(DeudaRequestDTO dto);
    
    // TAREA 2: Tu nuevo método para el estado de cuenta del socio
    List<DeudaResponseDTO> obtenerDeudasNoPagadas(Integer idUsuario);
}