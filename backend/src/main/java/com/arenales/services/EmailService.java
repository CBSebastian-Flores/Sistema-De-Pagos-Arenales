package com.arenales.services;

public interface EmailService {
    void enviarCorreoRecuperacion(String correo, String nombres, String enlace);
    
    void enviarBoletaPorCorreo(String destinatario, String nombreSocio, String codigoPago, byte[] pdfBytes);
}