package com.arenales.services;

import java.math.BigDecimal;
import java.util.List;

import com.arenales.entities.Pago;

public interface PagoService {
    BigDecimal obtenerTotalIngresos();
    List<Pago> obtenerHistorialPagosUsuario(Integer idUsuario);
}