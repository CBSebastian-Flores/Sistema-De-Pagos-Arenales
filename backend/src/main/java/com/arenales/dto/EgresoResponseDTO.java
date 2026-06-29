package com.arenales.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EgresoResponseDTO {
    private Integer idEgreso;
    private String codigoEgreso;
    private String descripcion;
    private BigDecimal monto;
    private LocalDateTime fechaGasto;
    private String categoriaEgreso;
    private String metodoRetiro;
    private String beneficiario;
    private String usernameRegistro; // Enviamos solo el nombre del usuario si se requiere, evita la entidad pesada
}