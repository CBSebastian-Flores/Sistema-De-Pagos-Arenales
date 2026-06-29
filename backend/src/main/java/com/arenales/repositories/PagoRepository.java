package com.arenales.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.arenales.entities.Pago;

import java.math.BigDecimal;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {

    @Query("SELECT COUNT(p) FROM Pago p")
    long contarTotalPagos();

    @Query("SELECT COALESCE(SUM(p.montoPagado), 0) FROM Pago p")
    BigDecimal sumarTotalIngresos();
}