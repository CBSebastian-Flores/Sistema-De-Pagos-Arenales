package com.arenales.services.impl;

import com.arenales.dto.DashboardResponseDTO;
import com.arenales.dto.MovimientoRecienteDTO;
import com.arenales.repositories.DashboardRepository;
import com.arenales.repositories.DeudaRepository;
import com.arenales.repositories.EgresoRepository;
import com.arenales.repositories.PagoRepository;
import com.arenales.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {
    
    @Autowired private PagoRepository pagoRepository;
    @Autowired private EgresoRepository egresoRepository;
    @Autowired private DeudaRepository deudaRepository;
    @Autowired private DashboardRepository dashboardRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponseDTO obtenerConsolidadoFinanciero() {
        DashboardResponseDTO dto = new DashboardResponseDTO();

        BigDecimal ingresos = pagoRepository.obtenerSumaHistoricaIngresos();
        BigDecimal egresos = egresoRepository.obtenerSumaHistoricaEgresos();
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

        List<Object[]> movimientosLista = dashboardRepository.obtenerUltimosCincoMovimientos();
        List<MovimientoRecienteDTO> ultimosMovimientos = new ArrayList<>();
        
        if (movimientosLista != null) {
            for (Object[] fila : movimientosLista) {
                String tipo = (String) fila[0];
                String descripcion = (String) fila[1];
                BigDecimal monto = (BigDecimal) fila[2];
                java.time.LocalDate fecha = null;

                if (fila[3] != null) {
                    if (fila[3] instanceof Timestamp) {
                        fecha = ((Timestamp) fila[3]).toLocalDateTime().toLocalDate();
                    } else if (fila[3] instanceof Date) {
                        fecha = ((Date) fila[3]).toLocalDate();
                    } else {
                        fecha = java.time.LocalDate.parse(fila[3].toString());
                    }
                }

                // 💡 En una sola línea creas el objeto con sus datos finales
                ultimosMovimientos.add(new MovimientoRecienteDTO(tipo, descripcion, monto, fecha));
            }
        }
        dto.setUltimosMovimientos(ultimosMovimientos);

        return dto;
    }
}
