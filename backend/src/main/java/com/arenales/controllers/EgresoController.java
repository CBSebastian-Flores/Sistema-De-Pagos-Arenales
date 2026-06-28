package com.arenales.controllers;

import com.arenales.dto.EgresoRequestDTO;
import com.arenales.services.EgresoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/egresos")
public class EgresoController {
    @Autowired private EgresoService egresoService;

    @PostMapping(value = "/registrar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('ROLE_TESORERO', 'ROLE_ADMINISTRADOR')")
    public ResponseEntity<?> registrarEgreso(@Valid @ModelAttribute EgresoRequestDTO dto) {
        egresoService.registrarEgreso(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "mensaje", "Egreso registrado en caja exitosamente"
        ));
    }
}