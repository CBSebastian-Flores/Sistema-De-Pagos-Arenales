package com.arenales.controllers;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.arenales.entities.Usuario;
import com.arenales.repositories.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arenales.config.JwtUtil;
import com.arenales.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            // 1. Spring Security valida las credenciales encriptadas
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getDni(), request.getContrasena())
            );

            // 2. Recuperamos el username validado (que es tu DNI)
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String dni = userDetails.getUsername();

            // 3. Buscamos el usuario real en la BD para traer el nombre y objeto limpio
            Usuario usuario = usuarioRepository.findByDni(dni)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado en base de datos"));

            String tipoRol = usuario.getRol().getTipoRol(); // Extrae directamente del objeto de tu BD
            String nombresReales = usuario.getNombres(); // 🚀 Extrae el nombre real del comerciante

            // 4. Generamos el token pasando los parámetros correctos en inglés a tu JwtUtil
            String token = jwtUtil.generateToken(dni, tipoRol, nombresReales);

            // 5. Construimos el mapa dinámico con las 4 llaves que el sessionStorage de React espera
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("dni", dni);
            response.put("nombres", nombresReales);
            response.put("rol", tipoRol);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "DNI o contraseña incorrectos"));
        }
    }
}