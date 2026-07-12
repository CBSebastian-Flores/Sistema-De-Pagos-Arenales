package com.arenales.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.arenales.dto.EgresoRequestDTO;
import com.arenales.dto.EgresoResponseDTO;
import com.arenales.entities.Egreso;

public interface EgresoService {
    Egreso registrarEgreso(EgresoRequestDTO dto);
    BigDecimal obtenerTotalEgresos();
    List<EgresoResponseDTO> obtenerUltimosEgresos();
    
    Page<EgresoResponseDTO> listarEgresosPaginados(String criterio, String categoria, LocalDate desde, LocalDate hasta, Pageable pageable);
}