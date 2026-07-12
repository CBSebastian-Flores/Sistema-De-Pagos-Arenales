package com.arenales.services;

import com.arenales.dto.EgresoRequestDTO;
import com.arenales.dto.EgresoResponseDTO;
import com.arenales.entities.Egreso;

import java.math.BigDecimal;
import java.util.List;

public interface EgresoService {
    Egreso registrarEgreso(EgresoRequestDTO dto);
    BigDecimal obtenerTotalEgresos();
    List<EgresoResponseDTO> obtenerUltimosEgresos();

}

