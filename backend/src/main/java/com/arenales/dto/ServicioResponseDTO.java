package com.arenales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServicioResponseDTO {
    private Integer idServicio;
    private String nombreServicio;
    private String descripcion;
    private BigDecimal precioBase;
    private Boolean estado;
}
