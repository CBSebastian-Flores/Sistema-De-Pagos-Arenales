package com.arenales.repositories;

import com.arenales.entities.Egreso;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
