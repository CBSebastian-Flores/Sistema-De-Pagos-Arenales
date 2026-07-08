package com.arenales.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeudaDetalleTesoreriaDTO {
    private Integer idDeuda;
    private String dniSocio;
    private String nombreCompletoSocio;
    private String numeroPuesto;
    private String nombreServicio;
    private BigDecimal montoBase;
    private BigDecimal mora;
    private BigDecimal montoTotalPagar;
    private LocalDate fechaVencimiento;
    private String estadoDeuda;
}