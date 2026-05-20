package com.arenales.config;

import com.arenales.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");
    System.out.println("=== JWT FILTER ===");
    System.out.println("URI: " + request.getRequestURI());
    System.out.println("Auth Header: " + authHeader);

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        boolean valido = jwtUtil.validarToken(token);
        System.out.println("Token válido: " + valido);
        if (valido) {
            String dni = jwtUtil.extraerDni(token);
            String rol = jwtUtil.extraerRol(token);
            System.out.println("DNI: " + dni + " | Rol: " + rol);
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            dni, null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + rol))
                    );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
    }

    filterChain.doFilter(request, response);

    System.out.println("Autenticación establecida: " + SecurityContextHolder.getContext().getAuthentication());
filterChain.doFilter(request, response);
}
    
}