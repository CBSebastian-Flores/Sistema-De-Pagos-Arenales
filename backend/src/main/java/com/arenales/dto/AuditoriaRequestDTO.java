package com.arenales.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuditoriaRequestDTO {
    @NotBlank(message = "El motivo o justificación de la acción es obligatorio.")
    @Size(max = 255, message = "El motivo no puede exceder los 255 caracteres.")
    private String motivo;
}
