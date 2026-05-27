package com.arenales.controllers;

import com.arenales.dto.ReniecResponseDTO;
import com.arenales.repositories.UsuarioRepository;
import com.arenales.services.ReniecService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Operation(summary = "Verificar existencia de un DNI", description = "Conecta con la API de RENIEC para validar la identidad de un usuario antes del registro.")
    // Endpoint listo para Axios: GET /api/validaciones/dni?dni=XXXXXXXX
    @GetMapping("/dni")
    public ResponseEntity<?> verificarDni(
            @Parameter(description = "Número de DNI de 8 dígitos", example = "11111111")
            @RequestParam String numero
    ) {
        // Validar si ya existe en la Base de Datos
        if (usuarioRepository.existsByDni(numero)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"El DNI ingresado ya se encuentra registrado en el sistema.\"}");
        }

        // MOCK DE ÉXITO (DNI nuevo y libre para pruebas)
        if ("11111112".equals(numero)) {
            ReniecResponseDTO mockExito = new ReniecResponseDTO("11111111", "Christian Bruno", "Flores", "Salas");
            return ResponseEntity.ok(mockExito);
        }

        // MOCK DE ERROR (Fuerza el 404 en el Front de Joaquín)
        if ("99999999".equals(numero)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\": \"DNI Inexistente — no se encontró en los registros de RENIEC.\"}");
        }

        // CONSULTA A LA API
        try {
            ReniecResponseDTO persona = reniecService.obtenerDatosCompletosDni(numero);

            if (persona == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"error\": \"El DNI no existe en el padrón electoral.\"}");
            }

            // Forzamos a que el JSON de respuesta incluya el DNI consultado
            return ResponseEntity.ok(persona);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error interno al procesar la verificación de identidad.\"}");
        }
    }
}