package com.arenales.services.impl;

import com.arenales.dto.DashboardResponseDTO;
import com.arenales.dto.MovimientoRecienteDTO;
import com.arenales.repositories.DeudaRepository;
import com.arenales.repositories.EgresoRepository;
import com.arenales.repositories.PagoRepository;
import com.arenales.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {
    
    @Autowired private PagoRepository pagoRepository;
    @Autowired private EgresoRepository egresoRepository;
    @Autowired private DeudaRepository deudaRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponseDTO obtenerConsolidadoFinanciero() {
        DashboardResponseDTO dto = new DashboardResponseDTO();

        BigDecimal ingresos = pagoRepository.obtenerSumaHistoricaIngresos();
        BigDecimal egresos = egresoRepository.obtenerSumaHistoricaEgresos();

        if (ingresos == null) ingresos = BigDecimal.ZERO;
        if (egresos == null) egresos = BigDecimal.ZERO;

        BigDecimal balanceNeto = ingresos.subtract(egresos);

        dto.setSumaHistoricaIngresos(ingresos);
        dto.setSumaHistoricaEgresos(egresos);
        dto.setBalanceNeto(balanceNeto);

        List<Object[]> conteoLista = deudaRepository.obtenerConteoDeudasPorEstado();
        Map<String, Long> mapaEstados = new HashMap<>();
        if (conteoLista != null) {
            for (Object[] fila : conteoLista) {
                String estado = (String) fila[0];
                Long cantidad = (Long) fila[1];
                mapaEstados.put(estado, cantidad);
            }
        }
        dto.setDeudasPorEstado(mapaEstados);

        List<Object[]> movimientosLista = egresoRepository.obtenerUltimosCincoMovimientosNativo();
        List<MovimientoRecienteDTO> ultimosMovimientos = new ArrayList<>();
        
        if (movimientosLista != null) {
            for (Object[] fila : movimientosLista) {
                MovimientoRecienteDTO mov = new MovimientoRecienteDTO();
                mov.setTipo((String) fila[0]);
                mov.setDescripcion((String) fila[1]);
                mov.setMonto((BigDecimal) fila[2]);
                
                if (fila[3] != null) {
                    mov.setFecha(((java.sql.Timestamp) fila[3]).toLocalDateTime().toLocalDate());
                }
                ultimosMovimientos.add(mov);
            }
        }
        dto.setUltimosMovimientos(ultimosMovimientos);

        return dto;
    }

}
