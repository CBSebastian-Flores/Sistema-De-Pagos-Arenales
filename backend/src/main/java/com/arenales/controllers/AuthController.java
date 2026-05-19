package com.arenales.controllers;

import com.arenales.dto.LoginDTO;
import com.arenales.entities.Usuario;
import com.arenales.repositories.UsuarioRepository;
import com.arenales.utils.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findByDni(loginDTO.getDni());

        if (usuarioOpt.isEmpty()) {
            return new ResponseEntity<>("DNI no encontrado", HttpStatus.UNAUTHORIZED);
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(loginDTO.getContrasena(), usuario.getContrasena())) {
            return new ResponseEntity<>("Contraseña incorrecta", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtUtil.generarToken(
                usuario.getDni(),
                usuario.getRol().getTipoRol()
        );

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("token", token);
        respuesta.put("dni", usuario.getDni());
        respuesta.put("nombres", usuario.getNombres());
        respuesta.put("rol", usuario.getRol().getTipoRol());

        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

    @GetMapping("/test-hash")
public String testHash() {
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    return encoder.encode("Admin123");
}

@PostMapping("/registrar-debug")
public ResponseEntity<?> debug() {
    var auth = SecurityContextHolder.getContext().getAuthentication();
    return ResponseEntity.ok("Auth: " + auth.getName() + " | Authorities: " + auth.getAuthorities());
}
}