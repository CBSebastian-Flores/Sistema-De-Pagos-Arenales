package com.arenales.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {

    @NotBlank(message = "El DNI es obligatorio")
    private String dni;

    @NotBlank(message = "La contraseña es obligatoria")
    private String contrasena;
}