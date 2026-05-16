package com.arenales.repositories;
import com.arenales.entities.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // ve si existe el dni
    boolean existsByDni(String dni);
    // ve si existe el correo
    boolean existsByCorreo(String correo);
    // busca por correo
    Optional<Usuario> findByCorreo(String correo);
    // busca por dni
    Optional<Usuario> findByDni(String dni);
}