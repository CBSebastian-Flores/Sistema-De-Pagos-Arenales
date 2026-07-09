package com.arenales.services;

import java.util.Map;

public interface EmailService {
    void enviarCorreoRecuperacion(String correo, String nombres, String enlace);
    
    void enviarBoletaPorCorreo(String destinatario, String nombreSocio, String codigoPago, Map<String, Object> datosBoleta);
}