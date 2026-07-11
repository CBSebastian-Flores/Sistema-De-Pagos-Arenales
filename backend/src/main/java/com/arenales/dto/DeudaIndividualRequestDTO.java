package com.arenales.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.Positive;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class DeudaIndividualRequestDTO {
    @NotNull(message = "El número de puesto es obligatorio.")
        private Integer nroPuesto; // Escenario 2 y 3: Identificador del socio por puesto

        @NotNull(message = "El ID del servicio es obligatorio.")
        private Integer idServicio;

        @NotNull(message = "El monto base es obligatorio.")
        @Positive(message = "El monto debe ser mayor a cero.")
        private BigDecimal montoBase;

        @NotNull(message = "La fecha de vencimiento es obligatoria.")
        private LocalDate fechaVencimiento;
}
