package com.arenales.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.arenales.entities.Deuda;

public interface DeudaRepository extends JpaRepository<Deuda, Integer> {

    @Query("SELECT d FROM Deuda d WHERE d.usuarioSocio.idUsuario = :idUsuario AND d.estadoDeuda IN ('Pendiente', 'Vencido')")
    List<Deuda> findDeudasNoPagadasPorUsuario(@Param("idUsuario") Integer idUsuario);

    @Query("SELECT d FROM Deuda d JOIN FETCH d.usuarioSocio JOIN FETCH d.servicio")
    List<Deuda> findAllWithSocioAndServicio();
    
}