package com.arenales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeudaResponseDTO {
    private Integer idDeuda;
    private String nombreServicio;
    private BigDecimal montoBase;
    private BigDecimal mora;
    private BigDecimal montoTotalPagar;
    private String estadoDeuda;
    private LocalDate fechaVencimiento;
}