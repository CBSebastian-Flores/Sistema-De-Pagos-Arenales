package com.arenales.services.impl;

import com.arenales.entities.HistorialUsuario;
import com.arenales.entities.HistorialServicio;
import com.arenales.entities.Servicio;
import com.arenales.entities.Usuario;
import com.arenales.repositories.HistorialServicioRepository;
import com.arenales.repositories.HistorialUsuarioRepository;
import com.arenales.services.AuditoriaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

public class AuditoriaServiceImpl implements AuditoriaService {
    @Autowired
    private HistorialServicioRepository historialServicioRepository;

    @Autowired
    private HistorialUsuarioRepository historialUsuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public void registrarHistorialServicio(Servicio servicio, String tipoAccion, String motivo, Usuario administrador) {
        try {
            HistorialServicio historial = new HistorialServicio();
            historial.setServicio(servicio);
            historial.setTipoAccion(tipoAccion);
            historial.setMotivo(motivo);
            historial.setUsuarioCreador(administrador);

            // Si no es un registro nuevo, guardamos el estado actual como JSON en "datos_anteriores"
            if (!"REGISTRAR".equals(tipoAccion) && servicio != null) {
                String jsonAnterior = objectMapper.writeValueAsString(servicio);
                historial.setDatosAnteriores(jsonAnterior);
            } else {
                historial.setDatosAnteriores(null);
            }

            historialServicioRepository.save(historial);
        } catch (Exception e) {
            // Manejo de error para que la auditoría nunca tumbe la transacción principal
            System.err.println("ERROR CRÍTICO EN AUDITORÍA DE SERVICIO: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void registrarHistorialUsuario(Usuario usuarioAfectado, String tipoAccion, String motivo, Usuario administrador) {
        try {
            HistorialUsuario historial = new HistorialUsuario();
            historial.setUsuario(usuarioAfectado);
            historial.setTipoAccion(tipoAccion);
            historial.setMotivo(motivo);
            historial.setUsuarioCreador(administrador);

            // Guardamos los datos previos del usuario afectado en formato JSON
            if (!"REGISTRAR".equals(tipoAccion) && usuarioAfectado != null) {
                String jsonAnterior = objectMapper.writeValueAsString(usuarioAfectado);
                historial.setDatosAnteriores(jsonAnterior);
            } else {
                historial.setDatosAnteriores(null);
            }

            historialUsuarioRepository.save(historial);
        } catch (Exception e) {
            System.err.println("ERROR CRÍTICO EN AUDITORÍA DE USUARIO: " + e.getMessage());
        }
    }
}
