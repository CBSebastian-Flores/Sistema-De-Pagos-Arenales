package com.arenales.config;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private static final String SECRET_KEY = "EstaEsUnaClaveSecretaMuyLargaYSeguraParaElSistemaArenales2026";
    private static final long EXPIRATION_TIME = 3600000 * 10; // 10 horas
    // private static final long EXPIRATION_TIME = 60000 * 2; // 2 minutos

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Generacion del token
    public String generateToken(String dni, String rol, String nombres) {
        return Jwts.builder()
                .setSubject(dni)
                .claim("rol", rol) // Guardamos el rol como un Claim personalizado
                .claim("nombres", nombres) // Guardamos el rol como un Claim personalizado
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key) // El algoritmo HS256 se infiere automáticamente de la llave de forma moderna
                .compact();
    }

    // Extraccion del DNI del token
    public String extractDni(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extraccion del ROL del token
    public String extractRol(String token) {
        return extractAllClaims(token).get("rol", String.class);
    }

    // Extraccion de los Nombres del token
    public String extractNombres(String token) {
        return extractAllClaims(token).get("nombres", String.class);
    }

    // Validar si el token se puede usar todavia
    public boolean isTokenValid(String token, String dni) {
        final String tokenDni = extractDni(token);
        return (tokenDni.equals(dni) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    // Métodos utilitarios genéricos para procesar los Claims
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token); // Trae el mapa completo del token
        return claimsResolver.apply(claims); // Ejecuta la función específica para extraer el dato
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key) // Usa la clave maestra para verificar la firma
                .build()
                .parseClaimsJws(token) // Desencripta el Base64 y procesa el token
                .getBody(); // Devuelve el cuerpo del token (un mapa de clave-valor)
    }

    // 1. Generación del token dinámico basado en la contraseña actual de la BD
    public String generateTokenWithCustomExpiration(String dni, String rol, String nombres, int minutos, String contrasenaActual) {
        // Combinamos la SECRET_KEY maestra con el hash actual de la clave
        String secretoDinamico = SECRET_KEY + contrasenaActual;
        Key llaveDinamica = Keys.hmacShaKeyFor(secretoDinamico.getBytes());

        long tiempoEnMilisegundos = 60000L * minutos;
        return Jwts.builder()
                .setSubject(dni)
                .claim("rol", rol)
                .claim("nombres", nombres)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + tiempoEnMilisegundos))
                .signWith(llaveDinamica, SignatureAlgorithm.HS384) // 🔑 Usa la llave dinámica
                .compact();
    }

    // 2. Extraer el DNI sin validar la firma (Lectura cruda para saber qué usuario es en la BD)
    public String extractDniSinValidarFirma(String token) {
        // Se divide el token por los puntos (Header.Payload.Signature) y se agarra el Payload
        String[] partes = token.split("\\.");
        if (partes.length < 2) throw new IllegalArgumentException("Token JWT inválido");

        String payloadJson = new String(java.util.Base64.getUrlDecoder().decode(partes[1]));
        // Buscamos el valor de "sub" que contiene el DNI en el JSON crudo
        int subIndex = payloadJson.indexOf("\"sub\":\"");
        if (subIndex == -1) throw new IllegalArgumentException("No se encontró el DNI en el token");

        int start = subIndex + 7;
        int end = payloadJson.indexOf("\"", start);
        return payloadJson.substring(start, end);
    }

    // 3. Validar el token usando la contraseña de la BD
    public void validarTokenRecovery(String token, String contrasenaActual) {
        String secretoDinamico = SECRET_KEY + contrasenaActual;
        Key llaveDinamica = Keys.hmacShaKeyFor(secretoDinamico.getBytes());

        // Si la contraseña cambió, la llave será diferente, la firma fallará aquí y lanzará Exception
        Jwts.parserBuilder()
                .setSigningKey(llaveDinamica)
                .build()
                .parseClaimsJws(token);
    }
}