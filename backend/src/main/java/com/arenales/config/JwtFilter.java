package com.arenales.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Capturamos el Header que viene desde React
        final String authHeader = request.getHeader("Authorization");
        final String dni;
        final String jwt;

        // Si la petición no tiene token o no empieza con "Bearer ", la ignoramos y que siga su camino
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraemos el token puro (quitando la palabra "Bearer ")
        jwt = authHeader.substring(7);

        // Sacamos el DNI del token usando tu JwtUtil
        dni = jwtUtil.extractDni(jwt);

        // Si hay un DNI y el usuario aún no está autenticado en este hilo de Spring
        if (dni != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Buscamos el usuario en la BD
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(dni);

            // Validamos si el token no ha caducado y le pertenece al DNI
            if (jwtUtil.isTokenValid(jwt, userDetails.getUsername())) {

                // Todo es correcto, creamos el pase de acceso oficial para Spring Security
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Guardamos la autenticación en el contexto. Usuario logueado exitosamente
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 9. Continuamos con la cadena de filtros para que llegue al Controlador
        filterChain.doFilter(request, response);
    }
}