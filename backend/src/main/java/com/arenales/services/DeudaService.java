package com.arenales.services;

import java.util.List;
import java.util.Map;

import com.arenales.dto.DeudaDetalleTesoreriaDTO;
import com.arenales.dto.DeudaIndividualRequestDTO;
import com.arenales.dto.DeudaRequestDTO;
import com.arenales.dto.DeudaResponseDTO;
import com.arenales.dto.PagoRequestDTO;
import com.arenales.entities.Usuario;

public interface DeudaService {
    void publicarDeudaMasiva(DeudaRequestDTO dto);
    
    List<DeudaResponseDTO> obtenerDeudasNoPagadas(Integer idUsuario);
    List<DeudaDetalleTesoreriaDTO> obtenerReporteGeneralDeudas();

    Map<String, String> registrarPagoDeuda(PagoRequestDTO dto);

    void registrarDeudaIndividual(DeudaIndividualRequestDTO dto);
}