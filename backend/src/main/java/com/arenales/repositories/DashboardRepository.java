package com.arenales.repositories;

import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.List;

@Repository
public class DashboardRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerUltimosCincoMovimientos() {
        // 💡 Query optimizada aplicando el TOP 5 interno a cada consulta antes de unirlas
        String sql = "SELECT TOP 5 * FROM (" +
                "  (SELECT TOP 5 'INGRESO' as tipo, 'Pago recibido de socio' as descripcion, monto_pagado as monto, fecha_pago as fecha FROM Pago ORDER BY fecha_pago DESC) " +
                "  UNION ALL " +
                "  (SELECT TOP 5 'EGRESO' as tipo, descripcion, monto, fecha_gasto as fecha FROM Egreso WHERE categoria_egreso != 'Anulado' ORDER BY fecha_gasto DESC)" +
                ") as movimientos " +
                "ORDER BY fecha DESC";

        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList();
    }
}