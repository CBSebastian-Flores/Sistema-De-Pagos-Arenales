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
        // MOCK DE DESARROLLO: Para pruebas del Frontend sin gastar consultas
        if ("99999999".equals(dni)) {
            return false;
        }
        if ("11111111".equals(dni)) {
            return true;
        }

        String url = API_URL + dni;

        try {
            // 1. Preparamos la cabecera de seguridad con tu Token
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiToken);

            // 2. Empaquetamos la cabecera
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // 3. Hacemos la petición GET con la cabecera incluida
            ResponseEntity<ReniecResponseDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    ReniecResponseDTO.class
            );

            return response.getStatusCode() == HttpStatus.OK;

        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (Exception e) {
            System.err.println("Fallo de comunicación con API RENIEC: " + e.getMessage());
            return false;
        }
    }
}
