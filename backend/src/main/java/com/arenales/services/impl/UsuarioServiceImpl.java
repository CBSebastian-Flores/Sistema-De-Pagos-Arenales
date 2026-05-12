package com.arenales.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.arenales.dto.UsuarioDTO;
import com.arenales.entities.Rol;
import com.arenales.entities.Usuario;
import com.arenales.repositories.RolRepository;
import com.arenales.repositories.UsuarioRepository;
import com.arenales.services.UsuarioService;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public Usuario registrarUsuario(UsuarioDTO dto) {
        Usuario usuario = new Usuario();

        // Mapeo de datos
        usuario.setNombres(dto.getNombre());
        usuario.setApellidos(dto.getApellidos());
        usuario.setDni(dto.getDni());
        usuario.setCorreo(dto.getCorreo());
        usuario.setFechaNacimiento(dto.getFechaNacimiento());
        usuario.setNroPuesto(dto.getNroPuesto());
        usuario.setGenero(dto.getGenero());
        //usuario.setEstado(true); // Usuario activo por defecto

        // LOGICA DE ENCRIPTACIÓN (Tu tarea principal)
        String passEncriptada = passwordEncoder.encode(dto.getContrasena());
        usuario.setContrasena(passEncriptada);

        // Asignación de Rol
        Rol rol = rolRepository.findById(dto.getIdRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        usuario.setRol(rol);

        return usuarioRepository.save(usuario);
    }
}
