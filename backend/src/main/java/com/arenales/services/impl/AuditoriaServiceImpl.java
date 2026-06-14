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
import org.springframework.stereotype.Service;

@Service
public class AuditoriaServiceImpl implements AuditoriaService {
    @Autowired
    private HistorialServicioRepository historialServicioRepository;

    @Autowired
    private HistorialUsuarioRepository historialUsuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Usuario clonarUsuarioSeguro(Usuario original) {
        if (original == null) return null;

        Usuario copia = new Usuario();
        copia.setIdUsuario(original.getIdUsuario());
        copia.setNombres(original.getNombres());
        copia.setApellidos(original.getApellidos());
        copia.setDni(original.getDni());
        copia.setCorreo(original.getCorreo());
        copia.setFechaNacimiento(original.getFechaNacimiento());
        copia.setGenero(original.getGenero());
        copia.setNroPuesto(original.getNroPuesto());
        copia.setTelefono(original.getTelefono());
        copia.setEstado(original.getEstado());
        copia.setIntentosFallidos(original.getIntentosFallidos());
        copia.setBloqueadoHasta(original.getBloqueadoHasta());
        copia.setRol(original.getRol());

        // 🔑 Enmascaramiento estricto exigido por la tarea:
        copia.setContrasena("[PROTEGIDO_POR_SEGURIDAD]");

        return copia;
    }

    @Override
    @Transactional
    public void registrarHistorialServicio(Servicio servicio, String tipoAccion, String motivo, Usuario administrador) {
        try {
            HistorialServicio historial = new HistorialServicio();
            historial.setServicio(servicio);
            historial.setTipoAccion(tipoAccion);
            historial.setMotivo(motivo);
            historial.setUsuarioCreador(clonarUsuarioSeguro(administrador));

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

            // Clonamos de forma segura el usuario afectado y el administrador creador
            Usuario usuarioAfectadoSeguro = clonarUsuarioSeguro(usuarioAfectado);

            historial.setUsuario(usuarioAfectado);
            historial.setTipoAccion(tipoAccion);
            historial.setMotivo(motivo);
            historial.setUsuarioCreador(clonarUsuarioSeguro(administrador));

            // Guardamos los datos previos del usuario afectado en formato JSON
            if (!"REGISTRAR".equals(tipoAccion) && usuarioAfectado != null) {
                String jsonAnterior = objectMapper.writeValueAsString(usuarioAfectadoSeguro);
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
