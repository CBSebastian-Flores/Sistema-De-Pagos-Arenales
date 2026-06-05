package com.arenales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioListadoDTO {
    private Integer idUsuario;
    private String dni;
    private String nombres;
    private String nombreRol;
    private Boolean estado;
}