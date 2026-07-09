package com.arenales.services;

import java.util.Map;

public interface ComprobanteService {
    byte[] generarBoletaPdf(String nombrePlantilla, Map<String, Object> datos);
}