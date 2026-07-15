package com.arenales.repositories;

import com.arenales.entities.HistorialUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialUsuarioRepository extends JpaRepository<HistorialUsuario, Integer> {
    // Listo para operaciones estandar de inserción inmutable

    @Query("SELECT hu FROM HistorialUsuario hu ORDER BY hu.idHistorialUsuario DESC")
    List<HistorialUsuario> obtenerHistorialOrdenado();
}
