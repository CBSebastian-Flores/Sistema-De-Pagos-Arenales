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
import com.arenales.services.ReniecService;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private ReniecService reniecService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public Usuario registrarUsuario(UsuarioDTO dto) {

        // Validaciones
        // VALIDACIÓN DE NEGOCIO: Evitar DNI duplicado
        if (usuarioRepository.existsByDni(dto.getDni())) {
            throw new RuntimeException("El DNI ya está registrado en el sistema.");
        }

        // VALIDACIÓN DE NEGOCIO: Evitar Correo duplicado
        if (usuarioRepository.existsByCorreo(dto.getCorreo())) {
            throw new RuntimeException("El correo electrónico ya está registrado.");
        }

        // Intercepción inmediata antes de procesar cualquier dato
        if (!reniecService.existeDni(dto.getDni())) {
            throw new RuntimeException("El dni no existe en la reniec");
        }

        // Mapeo de datos
        Usuario usuario = new Usuario();

        usuario.setNombres(dto.getNombres());
        usuario.setApellidos(dto.getApellidos());
        usuario.setDni(dto.getDni());
        usuario.setCorreo(dto.getCorreo());
        usuario.setFechaNacimiento(dto.getFechaNacimiento());
        usuario.setNroPuesto(dto.getNroPuesto()); 
        usuario.setGenero(dto.getGenero());
        usuario.setTelefono(dto.getTelefono());
        usuario.setEstado(true);

        // Encriptación de contraseña
        String passEncriptada = passwordEncoder.encode(dto.getContrasena());
        usuario.setContrasena(passEncriptada);

        // Asignación de Rol con Validación de rol existente
        Rol rol = rolRepository.findById(dto.getIdRol())
                .orElseThrow(() -> new RuntimeException("El rol especificado no existe."));
        usuario.setRol(rol);

        return usuarioRepository.save(usuario);
    }
}