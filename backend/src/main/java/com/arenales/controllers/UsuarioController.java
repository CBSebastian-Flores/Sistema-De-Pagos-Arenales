package com.arenales.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarLogicamente(@PathVariable Integer id, @RequestParam(defaultValue = "Inhabilitación por desuso") String motivo) {
        usuarioService.delete(id, motivo);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "El usuario ha sido deshabilitado del sistema correctamente sin perder su historial financiero."));
    }
    
    @PutMapping("/restablecer-forzado")
    public ResponseEntity<?> restablecerContrasenaForzado(@RequestBody RestablecerFuerzaDTO dto) {
        usuarioService.restablecerContrasenaForzado(dto);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "mensaje", "La contraseña ha sido restablecida con éxito. La cuenta ha sido desbloqueada y restaurada a 0 intentos fallidos."));
    }
}