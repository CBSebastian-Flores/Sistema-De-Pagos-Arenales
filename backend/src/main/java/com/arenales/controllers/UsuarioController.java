package com.arenales.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.arenales.dto.AuditoriaRequestDTO;
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

    @GetMapping("/listar")
    public ResponseEntity<List<UsuarioListadoDTO>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        return new ResponseEntity<>(usuarioService.registrarUsuario(usuarioDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody UsuarioActualizarDTO dto) {
        Usuario usuarioActualizado = usuarioService.actualizar(id, dto);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "Los datos del usuario han sido actualizados correctamente en el sistema.",
                "usuario", usuarioActualizado));
    }

    @PutMapping("/{id}/inhabilitar")
    public ResponseEntity<?> inhabilitarUsuario(@PathVariable Integer id, @jakarta.validation.Valid @RequestBody AuditoriaRequestDTO dto) {
        try {
            usuarioService.inhabilitar(id, dto.getMotivo());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "El usuario ha sido deshabilitado del sistema correctamente sin perder su historial financiero."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/habilitar")
    public ResponseEntity<?> habilitarUsuario(@PathVariable Integer id, @jakarta.validation.Valid @RequestBody AuditoriaRequestDTO dto) {
        try {
            usuarioService.habilitar(id, dto.getMotivo());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "El usuario ha sido habilitado nuevamente en el sistema."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    @PutMapping("/restablecer-forzado")
    public ResponseEntity<?> restablecerContrasenaForzado(@RequestBody RestablecerFuerzaDTO dto) {
        usuarioService.restablecerContrasenaForzado(dto);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "La contraseña ha sido restablecida con éxito. La cuenta ha sido desbloqueada y restaurada a 0 intentos fallidos."));
    }
}