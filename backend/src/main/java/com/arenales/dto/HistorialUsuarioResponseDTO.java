package com.arenales.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HistorialUsuarioResponseDTO {

    private Integer idHistorialUsuario;
    private Integer idUsuario;           
    private String nombreUsuario;       
    private String datosAnteriores;       
    private String tipoAccion;             
    private String motivo;                
    private String nombreUsuarioCreador;
    private LocalDateTime fechaRegistro;
}
