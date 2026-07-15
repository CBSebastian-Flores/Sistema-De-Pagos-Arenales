package com.arenales.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;

import com.arenales.dto.HistorialServicioResponseDTO;
import com.arenales.services.HistorialServicioService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
@RequestMapping("/api/historial-servicio")
public class HistorialServicioController {

    @Autowired
    private HistorialServicioService historialServicioService;

    @GetMapping("/listar")
    @PreAuthorize("hasAnyAuthority('Administrador')")
    public ResponseEntity<List<HistorialServicioResponseDTO>> obtenerHistorialServicios() {
        List<HistorialServicioResponseDTO> historial = historialServicioService.obtenerHistorialCompleto();
        return ResponseEntity.ok(historial);
    }

}
