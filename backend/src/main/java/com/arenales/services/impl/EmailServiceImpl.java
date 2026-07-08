package com.arenales.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.arenales.services.EmailService;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

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
            log.info("[CORREO] Recuperación enviada con éxito a: {}", correo);
        } catch (Exception ex) {
            log.error("[CORREO ERROR] Error asíncrono al enviar correo de recuperación: ", ex);
        }
    }

    @Override
    @Async
    public void enviarBoletaPorCorreo(String destinatario, String nombreSocio, String codigoPago, byte[] pdfBytes) {
        log.info("[CORREO] Iniciando el envío asíncrono de boleta para el pago: {}", codigoPago);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            
            // el parámetro true habilita la carga de archivos adjuntos 
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(destinatario);
            helper.setSubject("Comprobante de Pago Electrónico - " + codigoPago);

            String cuerpoHtml = "<h3>Estimado(a) " + nombreSocio + ",</h3>"
                    + "<p>Agradecemos el pago realizado. Adjunto a este correo encontrará su boleta electrónica correspondiente al código de transacción <b>" + codigoPago + "</b>.</p>"
                    + "<br><p>Saludos cordiales,<br><b>Administración - Condominio Centro Arenales</b></p>";
            
            helper.setText(cuerpoHtml, true);

            // convertimos el flujo de bytes a un recurso acoplable sin tocar el disco duro
            ByteArrayResource pdfAdjunto = new ByteArrayResource(pdfBytes);
            String nombreArchivo = "Boleta_" + codigoPago + ".pdf";
            helper.addAttachment(nombreArchivo, pdfAdjunto);

            mailSender.send(message);
            log.info("[CORREO] ¡Éxito! Boleta enviada correctamente al correo: {}", destinatario);
            
        } catch (Exception ex) {
            // Captura el error en consola/logs de Spring sin interrumpir o alterar la transacción de pago
            log.error("[CORREO ERROR] No se pudo despachar la boleta para el pago " + codigoPago + ". Motivo: ", ex);
        }
    }
}