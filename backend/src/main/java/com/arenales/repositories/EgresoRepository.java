package com.arenales.repositories;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.arenales.entities.Egreso;

@Repository
public interface EgresoRepository extends JpaRepository<Egreso, Integer>, JpaSpecificationExecutor<Egreso> {

    @Query("SELECT COUNT(e) FROM Egreso e")
    long contarTotalEgresos();

    @Query("SELECT COALESCE(SUM(e.monto), 0) FROM Egreso e")
    BigDecimal sumarTotalEgresos();

    @Query("SELECT e FROM Egreso e ORDER BY e.fechaGasto DESC")
    List<Egreso> obtenerUltimosEgresos(Pageable pageable);
}