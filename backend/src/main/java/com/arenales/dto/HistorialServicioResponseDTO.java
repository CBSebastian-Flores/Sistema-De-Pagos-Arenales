package com.arenales.dto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HistorialServicioResponseDTO {

    private Integer idHistorialServicio;
    private Integer idServicio;
    private String nombreServicio;
    private String datosAnteriores;
    private String tipoAccion;
    private String motivo;
    private String nombreUsuarioCreador;
    private LocalDateTime fechaRegistro;
}
