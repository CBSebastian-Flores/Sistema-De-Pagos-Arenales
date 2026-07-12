package com.arenales.services.impl;

import com.arenales.services.ComprobanteService;
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

import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ComprobanteService comprobanteService;

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
    public void enviarBoletaPorCorreo(String destinatario, String nombreSocio, String codigoPago, Map<String, Object> datosBoleta) {
        log.info("[CORREO ASYNC] Iniciando hilo en segundo plano para procesar PDF y correo de: {}", codigoPago);
        try {
            // 1. Generar el PDF fuera del hilo transaccional principal
            log.info("[CORREO ASYNC] Generando el binario PDF...");
            byte[] pdfBytes = comprobanteService.generarBoletaPdf("boleta", datosBoleta);

            // 2. Preparar el correo
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("Comprobante de Pago Electrónico - " + codigoPago);

            String cuerpoHtml = "<h3>Estimado(a) " + nombreSocio + ",</h3>"
                    + "<p>Agradecemos el pago realizado. Adjunto a este correo encontrará su boleta electrónica correspondiente al código de transacción <b>" + codigoPago + "</b>.</p>"
                    + "<br><p>Saludos cordiales,<br><b>Administración - Condominio Centro Arenales</b></p>";
            helper.setText(cuerpoHtml, true);

            ByteArrayResource pdfAdjunto = new ByteArrayResource(pdfBytes);
            helper.addAttachment("Boleta_" + codigoPago + ".pdf", pdfAdjunto);

            // 3. Enviar
            mailSender.send(message);
            log.info("[CORREO ASYNC] ¡Éxito! Boleta enviada correctamente al correo: {}", destinatario);

        } catch (Exception ex) {
            log.error("[CORREO ERROR] Fallo crítico al generar/enviar la boleta para el pago {}. Motivo: ", codigoPago, ex);
        }
    }
}