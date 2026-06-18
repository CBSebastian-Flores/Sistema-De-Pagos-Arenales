package com.arenales.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arenales.dto.DeudaDTO;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;
import com.arenales.services.DeudaService;

@RestController
@RequestMapping("/api/deudas")
public class DeudaController {
    @Autowired
    private DeudaService deudaService;

    @PostMapping("/publicar-masivo")
    public ResponseEntity<?> publicarDeudaMasiva(@Valid @RequestBody DeudaDTO dto) {
        deudaService.publicarDeudaMasiva(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "mensaje", "La cuota del servicio se ha publicado de forma masiva y exitosa para todos los socios activos."
        ));
    }
}
