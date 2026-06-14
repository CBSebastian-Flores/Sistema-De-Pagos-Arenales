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

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            Usuario usuarioCreado = usuarioService.registrarUsuario(usuarioDTO);

            return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            "Ocurrió un error interno en el servidor al procesar el registro."));
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<UsuarioListadoDTO>> listarUsuarios() {
        List<UsuarioListadoDTO> lista = usuarioService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/restablecer-forzado")
    public ResponseEntity<?> restablecerContrasenaForzado(@RequestBody RestablecerFuerzaDTO dto) {
        try {
            usuarioService.restablecerContrasenaForzado(dto);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "mensaje",
                    "La contraseña ha sido restablecida con éxito. La cuenta ha sido desbloqueada y restaurada a 0 intentos fallidos."));

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "error", e.getMessage()));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "error",
                    "Ocurrió un error inesperado al procesar el restablecimiento de contraseña."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody UsuarioActualizarDTO dto) {
        try {
            Usuario usuarioActualizado = usuarioService.actualizar(id, dto);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "mensaje", "Los datos del usuario han sido actualizados correctamente en el sistema.",
                    "usuario", usuarioActualizado));

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "error", e.getMessage()));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "error",
                    "Ocurrió un error inesperado en el servidor al procesar la actualización."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarLogicamente(@PathVariable Integer id, @RequestParam(defaultValue = "Inhabilitación por desuso") String motivo) {
        try {
            usuarioService.delete(id, motivo);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "mensaje",
                    "El usuario ha sido deshabilitado del sistema correctamente sin perder su historial financiero."));

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "error", e.getMessage()));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "error",
                    "Ocurrió un error inesperado al procesar la deshabilitación."));
        }
    }
}