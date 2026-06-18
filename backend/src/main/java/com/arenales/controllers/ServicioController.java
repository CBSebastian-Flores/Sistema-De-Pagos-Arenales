package com.arenales.controllers;

import com.arenales.dto.AuditoriaRequestDTO;
import com.arenales.dto.ServicioRequestDTO;
import com.arenales.dto.ServicioResponseDTO;
import com.arenales.services.ServicioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {
    @Autowired
    private ServicioService servicioService;

    // Listar TODOS los servicios (Para la tabla de mantenimiento del Admin)
    @GetMapping("/listar")
    public ResponseEntity<List<ServicioResponseDTO>> listarTodos() {
        return ResponseEntity.ok(servicioService.listarTodos());
    }

    // Listar SOLO los activos (Para los ComboBox de generación de deudas)
    @GetMapping("/activos")
    public ResponseEntity<List<ServicioResponseDTO>> listarActivos() {
        return ResponseEntity.ok(servicioService.listarActivos());
    }

    // Buscar un servicio específico por su ID (Con control de error manual)
    @GetMapping("/{id}")
    public ResponseEntity<ServicioResponseDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(servicioService.buscarPorId(id));
    }

    // Crear un nuevo concepto de cobro (Con control de error manual)
    @PostMapping("/crear")
    public ResponseEntity<ServicioResponseDTO> crear(@Valid @RequestBody ServicioRequestDTO dto) {
        return new ResponseEntity<>(servicioService.crear(dto), HttpStatus.CREATED);
    }

    // Actualizar los datos de un servicio existente (Con control de error manual)
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<ServicioResponseDTO> actualizar(@PathVariable Integer id,
            @Valid @RequestBody ServicioRequestDTO dto) {
        return ResponseEntity.ok(servicioService.actualizar(id, dto));
    }

    // Eliminación lógica / Inhabilitar servicio (Con control de error manual)

    @PutMapping("/{id}/inhabilitar")
    public ResponseEntity<?> inhabilitar(@PathVariable Integer id, @Valid @RequestBody AuditoriaRequestDTO dto) {
        servicioService.inhabilitar(id, dto.getMotivo());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "El servicio ha sido inhabilitado correctamente en el sistema."));
    }

    @PutMapping("/{id}/habilitar")
    public ResponseEntity<?> habilitar(@PathVariable Integer id, @Valid @RequestBody AuditoriaRequestDTO dto) {
        servicioService.habilitar(id, dto.getMotivo());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "El servicio ha sido habilitado correctamente en el sistema."));
    }
}
