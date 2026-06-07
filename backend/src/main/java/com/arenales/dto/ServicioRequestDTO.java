package com.arenales.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServicioRequestDTO {
    @NotBlank(message = "El nombre del servicio es obligatorio.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    private String nombreServicio;

    @Size(max = 255, message = "La descripción no puede superar los 255 caracteres.")
    private String descripcion;

    @NotNull(message = "El monto sugerido es obligatorio.")
    @DecimalMin(value = "0.0", inclusive = true, message = "El monto sugerido no puede ser negativo.")
    private BigDecimal precioBase;
}
