package com.arenales.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class EgresoRequestDTO {
    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotNull(message = "El monto es obligatorio")
    @Positive(message = "El monto debe ser mayor a cero")
    private BigDecimal monto;

    @NotBlank(message = "La categoría es obligatoria")
    private String categoriaEgreso;

    @NotBlank(message = "El método de retiro es obligatorio")
    private String metodoRetiro;

    @NotBlank(message = "El beneficiario es obligatorio")
    private String beneficiario;

    // Preparado para cuando conectes la imagen desde el frontend
    private MultipartFile comprobante;
}
