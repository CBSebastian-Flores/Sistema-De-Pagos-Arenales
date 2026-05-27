package com.arenales.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReniecResponseDTO {
    // Mapeamos "document_number" al campo dni
    @JsonAlias("document_number")
    private String dni;

    // Mapeamos "first_name" al campo nombres
    @JsonAlias("first_name")
    private String nombres;

    // Mapeamos "first_last_name" al apellido paterno
    @JsonAlias("first_last_name")
    private String apellidoPaterno;

    // Mapeamos "second_last_name" al apellido materno
    @JsonAlias("second_last_name")
    private String apellidoMaterno;
}