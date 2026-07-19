package com.arenales.services;

import com.arenales.dto.HistorialServicioResponseDTO;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface HistorialServicioService {
    List<HistorialServicioResponseDTO> obtenerHistorialCompleto();

}
