package com.arenales.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PagoRequestDTO {
    @NotNull(message = "El ID de la deuda es obligatorio")
    private Integer idDeuda;

    @NotNull(message = "El monto pagado es obligatorio")
    @Positive(message = "El monto debe ser mayor a cero")
    private BigDecimal montoPagado;

    @NotBlank(message = "El método de pago es obligatorio")
    private String metodoPago;

    private String nroOperacion;
    private MultipartFile comprobante;
}