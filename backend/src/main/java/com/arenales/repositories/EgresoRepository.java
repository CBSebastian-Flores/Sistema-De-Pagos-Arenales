package com.arenales.repositories;

import com.arenales.entities.Egreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface EgresoRepository extends JpaRepository<Egreso, Integer> {
    @Query("SELECT COUNT(e) FROM Egreso e")
    long contarTotalEgresos();

    @Query("SELECT COALESCE(SUM(e.monto), 0) FROM Egreso e")
    BigDecimal sumarTotalEgresos();

    @Query("SELECT e FROM Egreso e ORDER BY e.fechaGasto DESC")
    List<Egreso> obtenerUltimosEgresos(Pageable pageable);

    @Query("SELECT COALESCE(SUM(e.monto), 0) FROM Egreso e WHERE e.categoriaEgreso != 'Anulado'")
    BigDecimal obtenerSumaHistoricaEgresos();

    @Query(value = "SELECT TOP 5 * FROM (" +
               "  SELECT 'INGRESO' as tipo, 'Pago recibido de socio' as descripcion, monto_pagado as monto, fecha_pago as fecha " +
               "  FROM Pago " +
               "  UNION ALL " +
               "  SELECT 'EGRESO' as tipo, descripcion, monto, fecha_gasto as fecha " +
               "  FROM Egreso WHERE categoria_egreso != 'Anulado'" +
               ") as movimientos " +
               "ORDER BY fecha DESC", nativeQuery = true)
    List<Object[]> obtenerUltimosCincoMovimientosNativo();
}
