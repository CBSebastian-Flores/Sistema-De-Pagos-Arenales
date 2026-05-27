package com.arenales.services;
import com.arenales.dto.ReniecResponseDTO;

public interface ReniecService {
    boolean existeDni(String dni);
    ReniecResponseDTO obtenerDatos(String dni); // ← nuevo
}
