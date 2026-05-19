package com.arenales.repositories;

import com.arenales.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    boolean existsByDni(String dni);
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findByDni(String dni);
}