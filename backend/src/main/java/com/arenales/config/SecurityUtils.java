package com.arenales.config;

import com.arenales.entities.Usuario;
import com.arenales.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario getUsuarioAutenticado() {
        String dniAdmin = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByDni(dniAdmin)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en la sesión activa."));
    }
}
