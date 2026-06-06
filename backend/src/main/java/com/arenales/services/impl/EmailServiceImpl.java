package com.arenales.services.impl;

import com.arenales.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    @Async
    public void enviarCorreoRecuperacion(String correo, String nombres, String enlace) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(correo);
            message.setSubject("Recuperación de Contraseña - CC Arenales");
            message.setText("Hola " + nombres + ",\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace (válido por 15 minutos):\n" + enlace);
            mailSender.send(message);
        } catch (Exception ex) {
            System.err.println("Error asíncrono al enviar el correo: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}