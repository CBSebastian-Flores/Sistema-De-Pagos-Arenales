package com.arenales.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.arenales.services.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.arenales.dto.ReniecResponseDTO;
import com.arenales.dto.RestablecerFuerzaDTO;
import com.arenales.dto.UsuarioActualizarDTO;
import com.arenales.dto.UsuarioDTO;
import com.arenales.dto.UsuarioListadoDTO;
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

    @Autowired
    private AuditoriaService auditoriaService;

    private Usuario obtenerAdminLogueado() {
        String dniAdmin = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByDni(dniAdmin)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado en la sesión de seguridad activa."));
    }

    @Override
    @Transactional
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

        String passEncriptada = passwordEncoder.encode(dto.getContrasena());
        usuario.setContrasena(passEncriptada);

        Rol rol = rolRepository.findById(dto.getIdRol())
                .orElseThrow(() -> new RuntimeException("El rol especificado no existe."));
        usuario.setRol(rol);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        Usuario admin = obtenerAdminLogueado();
        auditoriaService.registrarHistorialUsuario(usuarioGuardado, "REGISTRAR", "Registro inicial de nuevo usuario socio/empleado.", admin);

        return usuarioGuardado;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioListadoDTO> listarTodos() {
        return usuarioRepository.findAll().stream().map(user -> {
            UsuarioListadoDTO dto = new UsuarioListadoDTO();
            dto.setIdUsuario(user.getIdUsuario());
            dto.setDni(user.getDni());
            dto.setNombres(user.getNombres());
            dto.setApellidos(user.getApellidos());
            dto.setCorreo(user.getCorreo());
            dto.setTelefono(user.getTelefono());
            dto.setNroPuesto(user.getNroPuesto());
            dto.setGenero(user.getGenero());
            dto.setFechaNacimiento(user.getFechaNacimiento());
            dto.setTipoRol(user.getRol() != null ? user.getRol().getTipoRol() : "SIN ROL");

            dto.setEstado(user.getEstado());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Usuario actualizar(Integer id, UsuarioActualizarDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        Usuario admin = obtenerAdminLogueado();
        auditoriaService.registrarHistorialUsuario(usuario, "ACTUALIZAR", "Actualización de datos generales del perfil de usuario.", admin);

        if (dto.getCorreo() != null && !dto.getCorreo().equalsIgnoreCase(usuario.getCorreo())) {
            if (usuarioRepository.existsByCorreo(dto.getCorreo())) {
                throw new RuntimeException("El nuevo correo electrónico ya está en uso por otro usuario.");
            }
            usuario.setCorreo(dto.getCorreo());
        }

        usuario.setTelefono(dto.getTelefono());
        usuario.setNroPuesto(dto.getNroPuesto());
        usuario.setFechaNacimiento(dto.getFechaNacimiento());
        usuario.setEstado(dto.getEstado());

        if (dto.getIdRol() != null) {
            Rol nuevoRol = rolRepository.findById(dto.getIdRol())
                    .orElseThrow(() -> new RuntimeException("El rol especificado no existe."));
            usuario.setRol(nuevoRol);
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public Usuario delete(Integer id, String motivo) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Usuario admin = obtenerAdminLogueado();
        auditoriaService.registrarHistorialUsuario(usuario, "INHABILITAR", motivo, admin);

        usuario.setEstado(false); 
        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void restablecerContrasenaForzado(RestablecerFuerzaDTO dto) {
        if (dto.getNuevaContrasena() == null || dto.getNuevaContrasena().trim().length() < 8) {
            throw new RuntimeException("La nueva contraseña debe tener al menos 8 caracteres.");
        }

        Usuario usuario = usuarioRepository.findByDni(dto.getDni())
                .orElseThrow(() -> new RuntimeException("Usuario con DNI " + dto.getDni() + " no encontrado"));

        Usuario admin = obtenerAdminLogueado();
        auditoriaService.registrarHistorialUsuario(usuario, "PASSWORD_RESET", "Restablecimiento forzado de credenciales de acceso por el Administrador.", admin);

        String passEncriptada = passwordEncoder.encode(dto.getNuevaContrasena().trim());
        usuario.setContrasena(passEncriptada);

        usuario.setIntentosFallidos(0);
        usuario.setBloqueadoHasta(null);

        usuarioRepository.save(usuario);
    }
}