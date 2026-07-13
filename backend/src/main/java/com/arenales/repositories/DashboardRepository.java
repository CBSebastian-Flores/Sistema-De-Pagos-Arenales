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
        // 💡 Traemos los campos reales de auditoría manteniendo el TOP 5
        String sql = "SELECT TOP 5 * FROM (" +
                "  (SELECT TOP 5 'INGRESO' as tipo, " +
                "                'Pago recibido de socio' as descripcion, " +
                "                monto_pagado as monto, " +
                "                fecha_pago as fecha, " +
                "                codigo_pago as codigo, " +
                "                metodo_pago as metodo, " +
                "                voucher_url as url, " +
                "                nro_operacion as nro_operacion " +
                "   FROM Pago ORDER BY fecha_pago DESC) " +
                "  UNION ALL " +
                "  (SELECT TOP 5 'EGRESO' as tipo, " +
                "                descripcion, " +
                "                monto, " +
                "                fecha_gasto as fecha, " +
                "                codigo_egreso as codigo, " +
                "                metodo_retiro as metodo, " +
                "                comprobante_url as url, " +
                "                NULL as nro_operacion " + // Mapeamos NULL ya que egreso no usa nro_operacion
                "   FROM Egreso WHERE categoria_egreso != 'Anulado' ORDER BY fecha_gasto DESC)" +
                ") as movimientos " +
                "ORDER BY fecha DESC";

        Query query = entityManager.createNativeQuery(sql);
        return query.getResultList();
    }
}