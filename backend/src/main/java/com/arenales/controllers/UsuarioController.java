package com.arenales.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; // Importación del nuevo DTO
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arenales.dto.RestablecerFuerzaDTO; 
import com.arenales.dto.UsuarioActualizarDTO;
import com.arenales.dto.UsuarioDTO;
import com.arenales.dto.UsuarioListadoDTO;
import com.arenales.entities.Usuario;
import com.arenales.services.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            Usuario usuarioCreado = usuarioService.registrarUsuario(usuarioDTO);
            return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Ocurrió un error interno en el servidor al procesar el registro.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ===================================================================
    // 1️⃣ [BACK] Endpoint para Listar Usuarios
    // ===================================================================
    @GetMapping("/listar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UsuarioListadoDTO>> listarUsuarios() {
        List<UsuarioListadoDTO> lista = usuarioService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    // ===================================================================
    // 2️⃣ [BACK] Endpoint para Actualizar Datos
    // ===================================================================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody UsuarioActualizarDTO dto) {
        try {
            Usuario usuarioActualizado = usuarioService.actualizar(id, dto);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "Los datos del usuario han sido actualizados correctamente en el sistema."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", "Ocurrió un error inesperado en el servidor al procesar la actualización."
            ));
        }
    }

    // ===================================================================
    // 3️⃣ [BACK] Endpoint de Cambio de Estado / Eliminación Lógica
    // ===================================================================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> eliminarLogicamente(@PathVariable Integer id) {
        try {
            usuarioService.delete(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "El usuario ha sido deshabilitado del sistema correctamente sin perder su historial financiero."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", "Ocurrió un error inesperado al procesar la deshabilitación."
            ));
        }
    }

    // ===================================================================
    // 4️⃣ [BACK] Endpoint para Restablecimiento Forzado de Contraseña
    // ===================================================================
    @PostMapping("/restablecer-forzado")
    @PreAuthorize("hasRole('ADMINISTRADOR')") // Solo el administrador puede forzar el reseteo
    public ResponseEntity<?> restablecerContrasenaForzado(@RequestBody RestablecerFuerzaDTO dto) {
        try {
            // Ejecuta la lógica para encriptar la clave y desbloquear intentos en la BD
            usuarioService.restablecerContrasenaForzado(dto);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "La contraseña ha sido restablecida con éxito. La cuenta ha sido desbloqueada y restaurada a 0 intentos fallidos."
            ));
        } catch (RuntimeException e) {
            // Captura si el DNI no existe o si la contraseña no cumple la longitud mínima
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", "Ocurrió un error inesperado al procesar el restablecimiento de contraseña."
            ));
        }
    }
}