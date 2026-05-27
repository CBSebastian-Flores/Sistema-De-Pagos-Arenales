package com.arenales.controllers;

import com.arenales.dto.ReniecResponseDTO;
import com.arenales.repositories.UsuarioRepository;
import com.arenales.services.ReniecService;
import io.swagger.v3.oas.annotations.Operation;
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

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Operation(summary = "Verificar DNI y obtener datos personales")
    @GetMapping("/dni")
    public ResponseEntity<ReniecResponseDTO> verificarDni(@RequestParam String numero) {
        // 400 si el DNI ya está registrado en el sistema
        if (usuarioRepository.existsByDni(numero)) {
            return ResponseEntity.badRequest().build();
        }

        ReniecResponseDTO datos = reniecService.obtenerDatos(numero);

        // 404 si no existe en RENIEC
        if (datos == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(datos);
    }
}