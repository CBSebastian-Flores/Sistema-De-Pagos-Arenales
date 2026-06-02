package com.arenales.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.arenales.dto.UsuarioDTO;
import com.arenales.entities.Usuario;
import com.arenales.services.UsuarioService;

import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            // Se ejecuta la lógica en el servicio (Tu Service Impl se queda intacto)
            Usuario usuarioCreado = usuarioService.registrarUsuario(usuarioDTO);

            // Si todo sale bien, respondemos el estándar REST: 201 Created
            return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            // 🔑 LA CORRECCIÓN CLAVE: Empaquetamos el mensaje en un mapa JSON con la clave "error"
            // Así pasa de ser un String suelto a un JSON estructurado: {"error": "El DNI ya está registrado..."}
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            // Para errores catastróficos inesperados, también usamos la estructura "error"
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Ocurrió un error interno en el servidor al procesar el registro."));
        }
    }
}
