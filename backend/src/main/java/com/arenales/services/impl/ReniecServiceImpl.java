package com.arenales.services.impl;

import com.arenales.dto.ReniecResponseDTO;
import com.arenales.services.ReniecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class ReniecServiceImpl implements ReniecService {
    @Autowired
    private RestTemplate restTemplate;

    @Value("${reniec.api.token}")
    private String apiToken;

    private final String API_URL = "https://api.decolecta.com/v1/reniec/dni?numero=";

    @Override
    public ReniecResponseDTO obtenerDatosCompletosDni(String dni) {
        String url = API_URL + dni;
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Consumimos la API externa esperando el DTO estructurado
            ResponseEntity<ReniecResponseDTO> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, ReniecResponseDTO.class
            );

            // Retornamos el cuerpo del JSON recibido (nombres, apellidoPaterno, etc.)
            return response.getBody();
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        } catch (Exception e) {
            System.err.println("Fallo de comunicación con API RENIEC externa: " + e.getMessage());
            return null;
        }
    }
}