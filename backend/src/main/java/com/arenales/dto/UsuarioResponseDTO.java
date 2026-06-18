package com.arenales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponseDTO {
    private Integer idUsuario;
    private String dni;
    private String nombres;
    private String apellidos;
    private String tipoRol;
    private String correo;
    private String telefono;
    private Integer nroPuesto;
    private String genero;
    private LocalDate fechaNacimiento;
    private Boolean estado;
}