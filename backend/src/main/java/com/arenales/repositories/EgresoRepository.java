package com.arenales.repositories;

import com.arenales.entities.Egreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EgresoRepository extends JpaRepository<Egreso, Integer> {
    @Query("SELECT COUNT(e) FROM Egreso e")
    long contarTotalEgresos();
}
