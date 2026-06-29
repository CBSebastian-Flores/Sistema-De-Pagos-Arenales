package com.arenales.services;

import com.arenales.dto.EgresoRequestDTO;
import com.arenales.dto.EgresoResponseDTO;

import java.math.BigDecimal;
import java.util.List;

public interface EgresoService {
    void registrarEgreso(EgresoRequestDTO dto);
    BigDecimal obtenerTotalEgresos();
    List<EgresoResponseDTO> obtenerUltimosEgresos();
}
