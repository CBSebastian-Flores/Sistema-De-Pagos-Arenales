package com.arenales.controllers;

import com.arenales.dto.EgresoRequestDTO;
import com.arenales.dto.EgresoResponseDTO;
import com.arenales.entities.Egreso;
import com.arenales.services.EgresoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/egresos")
public class EgresoController {
    @Autowired private EgresoService egresoService;

    @PostMapping(value = "/registrar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('Tesorero', 'Administrador')")
    public ResponseEntity<?> registrarEgreso(@Valid @ModelAttribute EgresoRequestDTO dto) {
        egresoService.registrarEgreso(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "mensaje", "Egreso registrado en caja exitosamente"
        ));
    }

    @GetMapping("/total")
    @PreAuthorize("hasAnyAuthority('Tesorero', 'Administrador')")
    public ResponseEntity<?> obtenerTotalEgresos() {
        BigDecimal total = egresoService.obtenerTotalEgresos();
        return ResponseEntity.ok(Map.of("total", total));
    }

    // 🟢 Endpoint para la lista de "Últimos Egresos"
    @GetMapping("/ultimos")
    @PreAuthorize("hasAnyAuthority('Tesorero', 'Administrador')")
    public ResponseEntity<List<EgresoResponseDTO>> obtenerUltimosEgresos() {
        List<EgresoResponseDTO> lista = egresoService.obtenerUltimosEgresos();
        return ResponseEntity.ok(lista);
    }
}