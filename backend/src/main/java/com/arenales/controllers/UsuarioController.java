package com.arenales.controllers;

import com.arenales.dto.UsuarioDTO;
import com.arenales.entities.Usuario;
import com.arenales.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            Usuario usuarioCreado = usuarioService.registrarUsuario(usuarioDTO);
            // Retornamos el usuario creado con estatus 201 Created
            return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);
        } catch (Exception e) {
            // Si ocurre un error (ej. rol no encontrado), retornamos 400 Bad Request
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
