package com.arenales.services;

import java.math.BigDecimal;
import java.util.List;

import com.arenales.dto.PagoResponseDTO;
import com.arenales.entities.Pago;

public interface PagoService {
    BigDecimal obtenerTotalIngresos();
    List<PagoResponseDTO> obtenerHistorialPagosUsuario(Integer idUsuario);
}