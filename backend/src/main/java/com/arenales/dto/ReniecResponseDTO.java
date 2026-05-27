package com.arenales.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReniecResponseDTO {
    // Mapeamos "document_number" al campo dni
    @JsonProperty("document_number")
    private String dni;

    // Mapeamos "first_name" al campo nombres
    @JsonProperty("first_name")
    private String nombres;

    // Mapeamos "first_last_name" al apellido paterno
    @JsonProperty("first_last_name")
    private String apellidoPaterno;

    // Mapeamos "second_last_name" al apellido materno
    @JsonProperty("second_last_name")
    private String apellidoMaterno;
}
