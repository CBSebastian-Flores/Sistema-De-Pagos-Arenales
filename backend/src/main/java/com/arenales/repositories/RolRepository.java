package com.arenales.repositories;

import com.arenales.entities.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // para que maneje los datos
public interface RolRepository extends JpaRepository<Rol, Integer> {
    // ya tiene todo heredado
}
