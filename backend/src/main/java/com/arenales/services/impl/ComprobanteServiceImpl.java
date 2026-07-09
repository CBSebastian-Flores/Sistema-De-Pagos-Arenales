package com.arenales.services.impl;

import java.io.ByteArrayOutputStream;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.arenales.services.ComprobanteService;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

@Service
public class ComprobanteServiceImpl implements ComprobanteService {

    @Autowired
    private TemplateEngine templateEngine;

    @Override
    public byte[] generarBoletaPdf(String nombrePlantilla, Map<String, Object> datos) {
        try {
            // cargar las variables en el contexto de Thymeleaf
            Context context = new Context();
            context.setVariables(datos);

            // procesar la plantilla de forma dinámica
            String htmlContenido = templateEngine.process(nombrePlantilla, context);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfRendererBuilder builder = new PdfRendererBuilder();
            
            builder.useFastMode();
            builder.withHtmlContent(htmlContenido, null);
            builder.toStream(outputStream);
            builder.run();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error crítico al compilar el PDF con la plantilla " + nombrePlantilla + ": " + e.getMessage(), e);
        }
    }
}