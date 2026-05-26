package com.arenales.controllers;

import com.arenales.services.ReniecService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/validaciones")
public class ValidacionController {
    @Autowired
    private ReniecService reniecService;

    @Operation(summary = "Verificar existencia de un DNI", description = "Conecta con la API de RENIEC para validar la identidad de un usuario antes del registro.")
    // Endpoint listo para Axios: GET /api/validaciones/dni?numero=XXXXXXXX
    @GetMapping("/dni")
    public ResponseEntity<Boolean> verificarDni(@RequestParam String numero) {
        // Pasa directamente por la lógica de Mocks de tu ReniecServiceImpl
        boolean existe = reniecService.existeDni(numero);
        return ResponseEntity.ok(existe);
    }
}
