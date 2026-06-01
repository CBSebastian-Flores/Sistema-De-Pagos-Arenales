package com.arenales.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.arenales.dto.ReniecResponseDTO;
import com.arenales.dto.UsuarioDTO;
import com.arenales.entities.Rol;
import com.arenales.entities.Usuario;
import com.arenales.repositories.RolRepository;
import com.arenales.repositories.UsuarioRepository;
import com.arenales.services.ReniecService; 
import com.arenales.services.UsuarioService;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private ReniecService reniecService; 

    @Override
    public Usuario registrarUsuario(UsuarioDTO dto) {
        ReniecResponseDTO dataReniec = reniecService.obtenerDatosCompletosDni(dto.getDni());
        if (dataReniec == null) {
            throw new RuntimeException("El DNI ingresado no es válido o no existe en los registros oficiales de la RENIEC.");
        }

        if (usuarioRepository.existsByDni(dto.getDni())) {
            throw new RuntimeException("El DNI ya está registrado en el sistema.");
        }

        if (usuarioRepository.existsByCorreo(dto.getCorreo())) {
            throw new RuntimeException("El correo electrónico ya está registrado.");
        }

        // Mapeo de datos (Manteniendo el estado como String y sin el teléfono que quitamos)
        Usuario usuario = new Usuario();
        usuario.setNombres(dto.getNombres());
        usuario.setApellidos(dto.getApellidos());
        usuario.setDni(dto.getDni());
        usuario.setCorreo(dto.getCorreo());
        usuario.setFechaNacimiento(dto.getFechaNacimiento());
        usuario.setNroPuesto(dto.getNroPuesto()); 
        usuario.setGenero(dto.getGenero());
        usuario.setEstado("Activo");

        String passEncriptada = passwordEncoder.encode(dto.getContrasena());
        usuario.setContrasena(passEncriptada);

        Rol rol = rolRepository.findById(dto.getIdRol())
                .orElseThrow(() -> new RuntimeException("El rol especificado no existe."));
        usuario.setRol(rol);

        return usuarioRepository.save(usuario);
    }
}