package com.arenales.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponseDTO {
    private BigDecimal sumaHistoricaIngresos;   
    private BigDecimal sumaHistoricaEgresos;   
    private BigDecimal balanceNeto;
    private Map<String, Long> deudasPorEstado;  
    private List<MovimientoRecienteDTO> ultimosMovimientos; 
}
