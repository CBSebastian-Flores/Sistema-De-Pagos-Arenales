package com.arenales.repositories;

import com.arenales.entities.HistorialServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialServicioRepository extends JpaRepository<HistorialServicio, Integer> {
    // Solo hereda los métodos estándar, no requerimos consultas personalizadas por ahora
    @Query("SELECT hs FROM HistorialServicio hs ORDER BY hs.idHistorialServicio DESC")
    List<HistorialServicio> obtenerHistorialOrdenado();
}