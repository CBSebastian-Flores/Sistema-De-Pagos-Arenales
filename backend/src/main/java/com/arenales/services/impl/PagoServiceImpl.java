package com.arenales.services.impl;

import java.math.BigDecimal;

import com.arenales.dto.PagoResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

import com.arenales.entities.Pago;
import com.arenales.repositories.PagoRepository;
import com.arenales.services.PagoService;

@Service
public class PagoServiceImpl implements PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Override
    @Transactional(readOnly = true)
    public BigDecimal obtenerTotalIngresos() {
        return pagoRepository.sumarTotalIngresos();
    }

    @Override
    public List<PagoResponseDTO> obtenerHistorialPagosUsuario(Integer idUsuario) {
        // 1. Obtenemos la lista de entidades desde el repositorio
        List<Pago> historialEntidad = pagoRepository.findHistorialPagosByUsurioId(idUsuario);

        // 2. Mapeamos la lista de Entidades a una lista de DTOs
        return historialEntidad.stream().map(pago -> {
            PagoResponseDTO dto = new PagoResponseDTO();

            dto.setIdPago(pago.getIdPago());
            dto.setCodigoPago(pago.getCodigoPago());
            dto.setMontoPagado(pago.getMontoPagado());
            dto.setMetodoPago(pago.getMetodoPago());

            dto.setNroOperacion(pago.getNroOperacion() != null ? pago.getNroOperacion() : "");
            dto.setVoucherUrl(pago.getVoucherUrl() != null ? pago.getVoucherUrl() : "");
            dto.setIdDeuda(pago.getDeuda() != null ? pago.getDeuda().getIdDeuda() : null);

            dto.setFechaPago(pago.getFechaPago());

            return dto;
        }).collect(Collectors.toList());
    }
}