package com.arenales.services;

import com.arenales.entities.Servicio;
import com.arenales.entities.Usuario;

public interface AuditoriaService {
    // Registra el historial de cambios de un Servicio
    void registrarHistorialServicio(Servicio servicio, String tipoAccion, String motivo, Usuario administrador);

    // Registra el historial de cambios de un Usuario
    void registrarHistorialUsuario(Usuario usuarioAfectado, String tipoAccion, String motivo, Usuario administrador);
}
