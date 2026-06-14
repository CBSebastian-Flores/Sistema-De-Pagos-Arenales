package com.arenales.repositories;

import com.arenales.entities.HistorialUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistorialUsuarioRepository extends JpaRepository<HistorialUsuario, Integer> {
    // Listo para operaciones estandar de inserción inmutable
}
