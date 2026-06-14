package com.arenales.repositories;

import com.arenales.entities.HistorialServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistorialServicioRepository extends JpaRepository<HistorialServicio, Integer> {
    // Solo hereda los métodos estándar, no requerimos consultas personalizadas por ahora
}