package com.arenales.specifications;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.jpa.domain.Specification;

import com.arenales.entities.Egreso;

public class EgresoSpecification {

    // Filtro por beneficiario
    public static Specification<Egreso> porBeneficiario(String criterio) {
        return (root, query, cb) -> {
            if (criterio == null || criterio.trim().isEmpty()) return null;
            return cb.like(cb.lower(root.get("beneficiario")), "%" + criterio.toLowerCase() + "%");
        };
    }

    // Filtro por categoría
    public static Specification<Egreso> porCategoria(String categoria) {
        return (root, query, cb) -> {
            if (categoria == null || categoria.trim().isEmpty()) return null;
            return cb.equal(root.get("categoriaEgreso"), categoria);
        };
    }

    // Filtro por rango de fechas
    public static Specification<Egreso> porRangoFechas(LocalDate desde, LocalDate hasta) {
        return (root, query, cb) -> {
            if (desde == null && hasta == null) return null;
            if (desde != null && hasta != null) {
                return cb.between(root.get("fechaGasto"), desde.atStartOfDay(), hasta.atTime(LocalTime.MAX));
            }
            if (desde != null) {
                return cb.greaterThanOrEqualTo(root.get("fechaGasto"), desde.atStartOfDay());
            }
            return cb.lessThanOrEqualTo(root.get("fechaGasto"), hasta.atTime(LocalTime.MAX));
        };
    }
}