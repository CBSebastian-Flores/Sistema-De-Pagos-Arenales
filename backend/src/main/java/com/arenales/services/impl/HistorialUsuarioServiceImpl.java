package com.arenales.services.impl;

import com.arenales.dto.HistorialUsuarioResponseDTO;
import com.arenales.entities.HistorialUsuario;
import com.arenales.repositories.HistorialUsuarioRepository;
import com.arenales.services.HistorialUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class HistorialUsuarioServiceImpl implements HistorialUsuarioService {

    @Autowired
    private HistorialUsuarioRepository historialUsuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HistorialUsuarioResponseDTO> obtenerHistorialCompleto() {
        List<HistorialUsuario> logs = historialUsuarioRepository.obtenerHistorialOrdenado();

        return logs.stream().map(log -> {
            HistorialUsuarioResponseDTO dto = new HistorialUsuarioResponseDTO();
            dto.setIdHistorialUsuario(log.getIdHistorialUsuario());
            
            if (log.getUsuario() != null) {
                dto.setIdUsuario(log.getUsuario().getIdUsuario());
                dto.setNombreUsuario(log.getUsuario().getNombres() + " " + log.getUsuario().getApellidos());
            } else {
                dto.setNombreUsuario("N/A");
            }
            
            dto.setDatosAnteriores(log.getDatosAnteriores());
            dto.setTipoAccion(log.getTipoAccion());
            dto.setMotivo(log.getMotivo());
            dto.setFechaRegistro(log.getFechaRegistro());
            
            // Mapeamos el creador (Administrador)
            if (log.getUsuarioCreador() != null) {
                dto.setNombreUsuarioCreador(log.getUsuarioCreador().getNombres() + " " + log.getUsuarioCreador().getApellidos());
            } else {
                dto.setNombreUsuarioCreador("Sistema");
            }
            
            return dto;
        }).collect(Collectors.toList());
    }

}
