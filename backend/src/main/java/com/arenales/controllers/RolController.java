package com.arenales.controllers;

import com.arenales.dto.RolDTO;
import com.arenales.services.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {
    @Autowired
    private RolService rolService;

    // URL final para Axios: GET http://localhost:8080/sistemapagoarenales/api/roles
    @GetMapping
    public ResponseEntity<List<RolDTO>> listarRoles() {
        // Llamamos al servicio que extrae de SQL Server y limpia los datos en el DTO
        List<RolDTO> roles = rolService.listarRoles();

        // Retornamos la lista con el Status Code 200 OK nativo
        return ResponseEntity.ok(roles);
    }
}
