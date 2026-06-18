package com.arenales.controllers;

import com.arenales.dto.RolResponseDTO;
import com.arenales.services.RolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@Tag(name = "Roles", description = "Endpoints para la gestión y extracción de roles del sistema") // Agrupa y nombra la sección
public class RolController {
    @Autowired
    private RolService rolService;

    @Operation(
            summary = "Listar todos los roles",
            description = "Extrae de SQL Server la lista completa de roles disponibles (Administrador, Comerciante, etc.) mapeada a un DTO limpio."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de roles devuelta con éxito"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor al consultar la base de datos")
    })

    @GetMapping
    public ResponseEntity<List<RolResponseDTO>> listarRoles() {
        // Llamamos al servicio que extrae de SQL Server y limpia los datos en el DTO
        List<RolResponseDTO> roles = rolService.listarRoles();

        // Retornamos la lista con el Status Code 200 OK nativo
        return ResponseEntity.ok(roles);
    }
}
