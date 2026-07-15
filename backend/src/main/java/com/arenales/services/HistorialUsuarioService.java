package com.arenales.services;

import com.arenales.dto.HistorialUsuarioResponseDTO;
import java.util.List;

public interface HistorialUsuarioService {
    List<HistorialUsuarioResponseDTO> obtenerHistorialCompleto();
}
