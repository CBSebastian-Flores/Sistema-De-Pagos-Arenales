package com.arenales.services.impl;

import com.arenales.dto.HistorialServicioResponseDTO;
import com.arenales.entities.HistorialServicio;
import com.arenales.repositories.HistorialServicioRepository;
import com.arenales.services.HistorialServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistorialServicioServiceImpl implements HistorialServicioService {

    @Autowired
    private HistorialServicioRepository historialServicioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HistorialServicioResponseDTO> obtenerHistorialCompleto() {
        List<HistorialServicio> logs = historialServicioRepository.obtenerHistorialOrdenado();

        return logs.stream().map(log -> {
            HistorialServicioResponseDTO dto = new HistorialServicioResponseDTO();
            dto.setIdHistorialServicio(log.getIdHistorialServicio());
            
            if (log.getServicio() != null) {
                dto.setIdServicio(log.getServicio().getIdServicio());
                dto.setNombreServicio(log.getServicio().getNombreServicio());
            } else {
                dto.setNombreServicio("N/A");
            }
            
            dto.setDatosAnteriores(log.getDatosAnteriores());
            dto.setTipoAccion(log.getTipoAccion());
            dto.setMotivo(log.getMotivo());
            
            if (log.getUsuarioCreador() != null) {
                dto.setNombreUsuarioCreador(log.getUsuarioCreador().getNombres() + " " + log.getUsuarioCreador().getApellidos());
            } else {
                dto.setNombreUsuarioCreador("Sistema");
            }
            
            return dto;
        }).collect(Collectors.toList());
    }

}
