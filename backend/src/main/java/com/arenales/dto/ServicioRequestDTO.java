package com.arenales.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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

    @NotBlank(message = "La categoría es obligatoria.")
    @Pattern(regexp = "ORDINARIO|EXTRAORDINARIO", message = "La categoría debe ser ORDINARIO o EXTRAORDINARIO.")
    private String categoria;

    @NotBlank(message = "La modalidad de cobro es obligatoria.")
    @Pattern(regexp = "FIJO|VARIABLE", message = "La modalidad de cobro debe ser FIJO o VARIABLE.")
    private String modalidadCobro;

    @NotNull(message = "El monto sugerido es obligatorio.")
    @DecimalMin(value = "0.0", inclusive = true, message = "El monto sugerido no puede ser negativo.")
    private BigDecimal precioBase;

    @NotNull(message = "La tarifa de mora es obligatoria")
    @DecimalMin(value = "0.0", message = "La tarifa de mora no puede ser negativa")
    private BigDecimal tarifaMora;
}