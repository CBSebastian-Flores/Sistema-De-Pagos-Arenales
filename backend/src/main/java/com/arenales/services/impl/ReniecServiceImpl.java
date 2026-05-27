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
    public boolean existeDni(String dni) {
        if ("99999999".equals(dni)) return false;

        String url = API_URL + dni;
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<ReniecResponseDTO> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, ReniecResponseDTO.class
            );

            return response.getStatusCode() == HttpStatus.OK;

        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (Exception e) {
            System.err.println("❌ Error RENIEC existeDni: " + e.getMessage());
            return false;
        }
    }

    @Override
    public ReniecResponseDTO obtenerDatos(String dni) {
        if ("99999999".equals(dni)) return null;

        String url = API_URL + dni;
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<ReniecResponseDTO> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, ReniecResponseDTO.class
            );

            return response.getStatusCode() == HttpStatus.OK ? response.getBody() : null;

        } catch (Exception e) {
            System.err.println("❌ Error RENIEC obtenerDatos: " + e.getMessage());
            return null;
        }
    }
}