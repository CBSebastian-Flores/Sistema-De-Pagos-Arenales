package com.arenales.controllers;

import com.arenales.repositories.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    @Autowired
    private RolRepository rolRepository;

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        // Toca la base de datos con una consulta rápida
        long count = rolRepository.count();
        return ResponseEntity.ok("OK - Roles registrados: " + count);
    }
}
