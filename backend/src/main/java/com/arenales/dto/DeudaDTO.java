package com.arenales.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class DeudaDTO {

    @NotNull(message = "El ID del servicio es obligatorio.")
    private Long idServicio;

    @NotNull(message = "El monto de la cuota del socio es obligatorio.")
    @Positive(message = "El monto de la cuota debe ser estrictamente mayor a 0.")
    private BigDecimal montoCuotaSocio;

    @NotNull(message = "La fecha de emisión es obligatoria.")
    private LocalDate fechaEmision;

    @NotNull(message = "El ID del usuario creador es obligatorio.")
    private Long idUsuarioCreador;

}
