package com.arenales.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.arenales.dto.UsuarioDTO;
import com.arenales.entities.Usuario;
import com.arenales.services.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            // Se ejecuta la lógica en el servicio
            Usuario usuarioCreado = usuarioService.registrarUsuario(usuarioDTO);
            
            // Si todo sale bien, respondemos el estándar REST: 201 Created
            return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);
            
        } catch (RuntimeException e) {
            // Aquí atrapamos los "throw new RuntimeException" controlados del Service (duplicados, rol inexistente)
            // Respondemos un 400 Bad Request con el mensaje exacto
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
            
        } catch (Exception e) {
            // Este catch atrapa errores graves e inesperados (ej: se cayó la base de datos)
            return new ResponseEntity<>("Ocurrió un error interno en el servidor al procesar el registro.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}