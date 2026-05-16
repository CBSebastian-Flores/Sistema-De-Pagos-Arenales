package com.arenales.controllers;

import com.arenales.dto.UsuarioDTO;
import com.arenales.entities.Usuario;
import com.arenales.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

@PostMapping("/registrar")
public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
    try {
        Usuario usuarioCreado = usuarioService.registrarUsuario(usuarioDTO);
        return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);
    } catch (Exception e) {
        String mensaje = e.getMessage();
        System.out.println("=== ERROR CAPTURADO ===");
        System.out.println(mensaje);
        System.out.println("======================");

        if (mensaje != null && mensaje.toLowerCase().contains("duplicate key")) {
            if (mensaje.toLowerCase().contains("'dni'") || mensaje.contains("UQ__Usuario__D87608")) {
                return new ResponseEntity<>("El DNI ya está registrado", HttpStatus.BAD_REQUEST);
            } else if (mensaje.toLowerCase().contains("'telefono'")) {
                return new ResponseEntity<>("El teléfono ya está registrado", HttpStatus.BAD_REQUEST);
            } else if (mensaje.toLowerCase().contains("'correo'")) {
                return new ResponseEntity<>("El correo ya está registrado", HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity<>("El registro ya existe en el sistema", HttpStatus.BAD_REQUEST);
            }
        }

        return new ResponseEntity<>(mensaje, HttpStatus.BAD_REQUEST);
    }
} 
}