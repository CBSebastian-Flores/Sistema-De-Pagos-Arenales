package com.arenales.controllers;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.arenales.services.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;

    @Operation(
            summary = "Iniciar sesión en el sistema",
            description = "Autentica al usuario mediante DNI y contraseña. Implementa un sistema de bloqueo por fuerza bruta que suspende la cuenta por 15 minutos al quinto intento fallido consecutivo."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Inicio de sesión exitoso. Devuelve el token JWT y datos básicos de la sesión.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{\"token\": \"eyJhbGciOiJIUzI1NiIsInR5...\", \"dni\": \"44444444\", \"nombres\": \"Juan Perez\", \"rol\": \"COMERCIANTE\"}")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos de entrada inválidos o faltantes por validación de campos.",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Credenciales incorrectas (DNI/Contraseña erróneos) o la cuenta se encuentra INACTIVA.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{\"error\": \"DNI o contraseña incorrectos.\"}")
                    )
            ),
            @ApiResponse(
                    responseCode = "423",
                    description = "Cuenta bloqueada temporalmente por superar los 5 intentos permitidos.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{\"error\": \"Ha superado los 5 intentos permitidos. Cuenta bloqueada por 15 minutos.\"}")
                    )
            )
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByDni(request.getDni());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "DNI o contraseña incorrectos"));
        }

        Usuario usuario = usuarioOpt.get();

        if (usuario.getBloqueadoHasta() != null && usuario.getBloqueadoHasta().isAfter(LocalDateTime.now())) {
            // Calculamos la diferencia en minutos entre el "ahora" y la hora del desbloqueo
            long minutosRestantes = ChronoUnit.MINUTES.between(LocalDateTime.now(), usuario.getBloqueadoHasta()) + 1;

            return ResponseEntity.status(HttpStatus.LOCKED)
                    .body(Map.of("error", "Cuenta bloqueada temporalmente por seguridad. Intente de nuevo en " + minutosRestantes + " minutos."));
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
            int intentosMaximos = 5;
            int intentos = usuario.getIntentosFallidos() != null ? usuario.getIntentosFallidos() + 1 : 1;
            usuario.setIntentosFallidos(intentos);

            if (intentos >= intentosMaximos) {
                usuario.setBloqueadoHasta(LocalDateTime.now().plusMinutes(15));
                usuarioRepository.save(usuario);
                return ResponseEntity.status(HttpStatus.LOCKED) 
                        .body(Map.of("error", "Ha superado los 5 intentos permitidos. Cuenta bloqueada por 15 minutos."));
            }

            usuarioRepository.save(usuario);

            int intentosRestantes = intentosMaximos - intentos;
            if (intentosRestantes <= 2) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "DNI o contraseña incorrectos. Intentos restantes: " + intentosRestantes));
            }

            // Para los intentos 1 y 2, el mensaje es completamente opaco y plano
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "DNI o contraseña incorrectos."));
        }
    }

    @Operation(
            summary = "Solicitar enlace de recuperación de contraseña",
            description = "Recibe el DNI del usuario y despacha de manera asíncrona un correo electrónico con un token de un solo uso. Por motivos de ciberseguridad (prevención de enumeración de usuarios), este endpoint siempre responde HTTP 200 OK, incluso si el DNI no existe o está inactivo."
    )
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Objeto JSON que contiene el DNI del usuario a recuperar",
            required = true,
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(example = "{\"dni\": \"44444444\"}") // Muestra el ejemplo real en Swagger
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Procesamiento completado. Si el DNI coincide con una cuenta activa, el correo habrá sido enviado.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{\"mensaje\": \"Si el DNI coincide con una cuenta activa y registrada, recibirá un enlace...\"}")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "El campo DNI es obligatorio o tiene un formato inválido.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{\"error\": \"El campo DNI es obligatorio.\"}")
                    )
            )
    })
    @PostMapping("/solicitar-recuperacion")
    public ResponseEntity<?> solicitarRecuperacion(@RequestBody Map<String, String> request) {
        String dni = request.get("dni");

        if (dni == null || dni.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El campo DNI es obligatorio."));
        }

        Map<String, String> respuestaOpaca = Map.of(
                "mensaje", "Si el DNI coincide con una cuenta activa y registrada, recibirá un enlace de restablecimiento en su correo. De lo contrario, solicite su acceso con el administrador del sistema."
        );

        Optional<Usuario> usuarioOpt = usuarioRepository.findByDni(dni);

        // Filtro 1: Si no existe el usuario, respondemos ÉXITO ficticio
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.ok(respuestaOpaca);
        }

        Usuario usuario = usuarioOpt.get();

        // Filtro 2: Si no tiene correo, respondemos ÉXITO ficticio (No se envía nada)
        if (usuario.getCorreo() == null || usuario.getCorreo().isEmpty()) {
            return ResponseEntity.ok(respuestaOpaca);
        }

        // Filtro 3: Si está inactivo, respondemos ÉXITO ficticio (No se envía nada)
        if (!usuario.getEstado()) {
            return ResponseEntity.ok(respuestaOpaca);
        }

        String tokenRecuperacion = jwtUtil.generateTokenWithCustomExpiration(usuario.getDni(), "RECUPERACION", usuario.getNombres(), 15, usuario.getContrasena());
        String enlace = "http://localhost:5173/restablecer-password?token=" + tokenRecuperacion;

        emailService.enviarCorreoRecuperacion(usuario.getCorreo(), usuario.getNombres(), enlace);

        return ResponseEntity.ok(respuestaOpaca);
    }

    @Operation(
            summary = "Restablecer la contraseña del usuario",
            description = "Utiliza el token JWT dinámico recibido en el correo para actualizar la contraseña del usuario en la base de datos. El token queda inhabilitado inmediatamente después de su primer uso gracias al sistema de firma dinámica basado en el hash de la contraseña anterior."
    )
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Objeto JSON que contiene el token de recuperación y la nueva contraseña",
            required = true,
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(example = "{\"token\": \"eyJhbGciOiJIUzM4NCJ9...\", \"nuevaContrasena\": \"NuevaClave2026!\"}")
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Contraseña actualizada con éxito.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{\"mensaje\": \"Contraseña actualizada con éxito.\"}")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "El token es inválido, ya fue utilizado anteriormente, expiró (límite de 15 minutos) o faltan parámetros requeridos.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{\"error\": \"El enlace de recuperación es inválido, expiró o ya ha sido utilizado.\"}")
                    )
            )
    })
    @PostMapping("/restablecer-password")
    public ResponseEntity<?> restablecerPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String nuevaContrasena = request.get("nuevaContrasena");

        // Validaciones
        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El token es obligatorio."));
        }
        if (nuevaContrasena == null || nuevaContrasena.trim().length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "La contraseña debe tener al menos 8 caracteres."));
        }

        try {
            String dni = jwtUtil.extractDniSinValidarFirma(token);

            Usuario usuario = usuarioRepository.findByDni(dni)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            jwtUtil.validarTokenRecovery(token, usuario.getContrasena());

            usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada con éxito."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El enlace de recuperación es inválido, expiró o ya ha sido utilizado."));
        }
    }
}