package com.arenales.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UsuarioActualizarDTO {
    private String correo;
    private String telefono;
    private Integer nroPuesto;
    private Integer idRol;
    private Boolean estado;
    private LocalDate fechaNacimiento;
}