package com.arenales.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;

import com.arenales.dto.HistorialUsuarioResponseDTO;
import com.arenales.services.HistorialUsuarioService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/historial-usuarios")
public class HistorialUsuarioController {

    @Autowired
    private HistorialUsuarioService historialUsuarioService;

    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('Administrador')")
    public ResponseEntity<List<HistorialUsuarioResponseDTO>> obtenerHistorialUsuarios() {
        List<HistorialUsuarioResponseDTO> historial = historialUsuarioService.obtenerHistorialCompleto();
        return ResponseEntity.ok(historial);
    }

}
