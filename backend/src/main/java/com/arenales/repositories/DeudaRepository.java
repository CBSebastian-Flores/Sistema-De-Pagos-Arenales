package com.arenales.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import com.arenales.entities.Deuda;

public interface DeudaRepository extends JpaRepository<Deuda, Integer> {

}
