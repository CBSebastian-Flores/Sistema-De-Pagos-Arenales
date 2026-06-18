package com.arenales.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsuarioRequestDTO {
    @JsonProperty("nombres")
    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombres;

    @NotBlank(message = "Los apellidos no pueden estar vacíos")
    private String apellidos;

    @NotBlank(message = "El DNI es obligatorio")
    @Size(min = 8, max = 8, message = "El DNI debe tener exactamente 8 caracteres")
    @Pattern(regexp = "^[0-9]+$", message = "El DNI debe contener solo números")
    private String dni;

    @Email(message = "Debe proporcionar un correo electrónico válido")
    private String correo; // opcional

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String contrasena;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser una fecha pasada")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El género es obligatorio")
    @Pattern(regexp = "^(Masculino|Femenino|Otro)$", message = "Género inválido")
    private String genero;

    @NotNull(message = "El número de puesto es obligatorio")
    @Min(value = 1, message = "El número de puesto debe ser mayor a 0")
    private Integer nroPuesto;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\d{9}$", message = "El teléfono debe tener exactamente 9 dígitos")
    private String telefono;

    @NotNull(message = "El ID de rol es obligatorio")
    private Integer idRol;
}