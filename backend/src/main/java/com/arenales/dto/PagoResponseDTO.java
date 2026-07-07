package com.arenales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PagoResponseDTO {
    private Integer idPago;
    private String codigoPago;
    private String nombreServicio;
    private BigDecimal montoPagado;
    private String metodoPago;
    private String nroOperacion;
    private String voucherUrl;
    private Integer idDeuda;
    private LocalDateTime fechaPago;
}
