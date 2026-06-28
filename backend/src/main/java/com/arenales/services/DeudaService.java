package com.arenales.services;

import java.util.List;

import com.arenales.dto.DeudaDetalleTesoreriaDTO;
import com.arenales.dto.DeudaRequestDTO;
import com.arenales.dto.DeudaResponseDTO;
import com.arenales.dto.PagoRequestDTO;

public interface DeudaService {
    void publicarDeudaMasiva(DeudaRequestDTO dto);
    
    List<DeudaResponseDTO> obtenerDeudasNoPagadas(Integer idUsuario);
    List<DeudaDetalleTesoreriaDTO> obtenerReporteGeneralDeudas();

    void registrarPagoDeuda(PagoRequestDTO dto);
}