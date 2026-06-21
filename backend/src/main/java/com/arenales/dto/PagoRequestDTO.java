package com.arenales.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PagoRequestDTO {
    private BigDecimal montoPagado;
    private String metodoPago;
    private String nroOperacion;
    private String voucherUrl;
    private Integer idDeuda;
}