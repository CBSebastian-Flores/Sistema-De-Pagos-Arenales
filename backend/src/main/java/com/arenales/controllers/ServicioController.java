package com.arenales.controllers;

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
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(servicioService.buscarPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Error interno al buscar el servicio."));
        }
    }

    // Crear un nuevo concepto de cobro (Con control de error manual)
    @PostMapping("/crear")
    public ResponseEntity<?> crear(@Valid @RequestBody ServicioRequestDTO dto) {
        try {
            ServicioResponseDTO nuevoServicio = servicioService.crear(dto);
            return new ResponseEntity<>(nuevoServicio, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Ocurrió un error inesperado al registrar el servicio."));
        }
    }

    // Actualizar los datos de un servicio existente (Con control de error manual)
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @Valid @RequestBody ServicioRequestDTO dto) {
        try {
            ServicioResponseDTO actualizado = servicioService.actualizar(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Ocurrió un error inesperado en el servidor al procesar la actualización."));
        }
    }

    // Eliminación lógica / Inhabilitar servicio (Con control de error manual)
    @DeleteMapping("/inhabilitar/{id}")
    public ResponseEntity<?> inhabilitarLogico(@PathVariable Integer id, @RequestParam(defaultValue = "Inhabilitación por desuso") String motivo) {
        try {
            servicioService.inhabilitarLogico(id, motivo);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "mensaje", "El servicio ha sido inhabilitado correctamente en el sistema."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "Ocurrió un error al intentar inhabilitar el servicio."));
        }
    }
}
