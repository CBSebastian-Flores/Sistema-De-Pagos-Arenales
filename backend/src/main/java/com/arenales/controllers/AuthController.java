package com.arenales.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.arenales.config.JwtUtil;
import com.arenales.dto.LoginRequest;
import com.arenales.entities.Usuario;
import com.arenales.repositories.UsuarioRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByDni(request.getDni());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "DNI o contraseña incorrectos"));
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getBloqueadoHasta() != null && usuario.getBloqueadoHasta().isAfter(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.LOCKED) 
                    .body(Map.of("error", "Cuenta bloqueada temporalmente. Intente de nuevo después de: " + usuario.getBloqueadoHasta()));
        }

        if (usuario.getEstado() != null && !usuario.getEstado()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED) 
                    .body(Map.of("error", "Cuenta inactiva. Comuníquese con el administrador."));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getDni(), request.getContrasena())
            );

            usuario.setIntentosFallidos(0);
            usuario.setBloqueadoHasta(null);
            usuarioRepository.save(usuario);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String dni = userDetails.getUsername();

            String tipoRol = usuario.getRol().getTipoRol(); 
            String nombresReales = usuario.getNombres(); 

            String token = jwtUtil.generateToken(dni, tipoRol, nombresReales);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("dni", dni);
            response.put("nombres", nombresReales);
            response.put("rol", tipoRol);

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            int intentos = usuario.getIntentosFallidos() != null ? usuario.getIntentosFallidos() + 1 : 1;
            usuario.setIntentosFallidos(intentos);

            if (intentos >= 3) {
                usuario.setBloqueadoHasta(LocalDateTime.now().plusMinutes(15));
                usuarioRepository.save(usuario);
                return ResponseEntity.status(HttpStatus.LOCKED) 
                        .body(Map.of("error", "Ha superado los 3 intentos permitidos. Cuenta bloqueada por 15 minutos."));
            }

            usuarioRepository.save(usuario);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED) 
                    .body(Map.of("error", "Contraseña incorrecta. Intentos restantes: " + (3 - intentos)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Error de autenticación del sistema."));
        }
    }

    @PostMapping("/solicitar-recuperacion")
    public ResponseEntity<?> solicitarRecuperacion(@RequestBody Map<String, String> request) {
        String dni = request.get("dni");

        if (dni == null || dni.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El campo DNI es obligatorio."));
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByDni(dni);
        
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("mensaje", "Si el correo electrónico coincide con una cuenta registrada, recibirá un enlace de restablecimiento."));
        }
        
        Usuario usuario = usuarioOpt.get();
        String tokenRecuperacion = jwtUtil.generateTokenWithCustomExpiration(usuario.getDni(), "RECUPERACION", usuario.getNombres(), 15); 
        
        String enlace = "http://localhost:5173/restablecer-password?token=" + tokenRecuperacion;
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(usuario.getCorreo());
            message.setSubject("Recuperación de Contraseña - CC Arenales");
            message.setText("Hola " + usuario.getNombres() + ",\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace (válido por 15 minutos):\n" + enlace);
            mailSender.send(message);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno al enviar el correo electrónico."));
        }
        
        return ResponseEntity.ok(Map.of("mensaje", "Enlace de recuperación enviado con éxito."));
    }

    @PostMapping("/restablecer-password")
    public ResponseEntity<?> restablecerPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String nuevaContrasena = request.get("nuevaContrasena");

        if (token == null || nuevaContrasena == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Datos insuficientes para procesar la solicitud."));
        }

        try {
            String dni = jwtUtil.extractDni(token); 
            
            Usuario usuario = usuarioRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                
            usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
            usuario.setIntentosFallidos(0);
            usuario.setBloqueadoHasta(null);
            
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada con éxito. Ya puede iniciar sesión."));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El enlace de recuperación es inválido o ha expirado."));
        }
    }
}