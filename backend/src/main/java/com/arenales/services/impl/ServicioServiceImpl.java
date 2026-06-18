package com.arenales.services.impl;

import com.arenales.config.SecurityUtils;
import com.arenales.dto.ServicioResponseDTO;
import com.arenales.dto.ServicioRequestDTO;
import com.arenales.entities.Servicio;

import com.arenales.entities.Usuario;
import com.arenales.repositories.ServicioRepository;
import com.arenales.repositories.UsuarioRepository;
import com.arenales.services.AuditoriaService;
import com.arenales.services.ServicioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicioServiceImpl implements ServicioService {
    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuditoriaService auditoriaService;

    @Autowired
    private SecurityUtils securityUtils;

    @Override
    @Transactional(readOnly = true)
    public List<ServicioResponseDTO> listarTodos() {
        return servicioRepository.findAll().stream()
                .map(s -> new ServicioResponseDTO(
                        s.getIdServicio(),
                        s.getNombreServicio(),
                        s.getDescripcion(),
                        s.getCategoria(),
                        s.getModalidadCobro(),
                        s.getPrecioBase(),
                        s.getEstado()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServicioResponseDTO> listarActivos() {
        return servicioRepository.findByEstadoTrue().stream()
                .map(s -> new ServicioResponseDTO(
                        s.getIdServicio(),
                        s.getNombreServicio(),
                        s.getDescripcion(),
                        s.getCategoria(),
                        s.getModalidadCobro(),
                        s.getPrecioBase(),
                        s.getEstado()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ServicioResponseDTO buscarPorId(Integer id) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));

        return new ServicioResponseDTO(
                servicio.getIdServicio(),
                servicio.getNombreServicio(),
                servicio.getDescripcion(),
                servicio.getCategoria(),
                servicio.getModalidadCobro(),
                servicio.getPrecioBase(),
                servicio.getEstado());
    }

    @Override
    @Transactional
    public ServicioResponseDTO crear(ServicioRequestDTO dto) {
        // Crear y guardar el servicio
        Servicio nuevoServicio = new Servicio();
        nuevoServicio.setNombreServicio(dto.getNombreServicio());
        nuevoServicio.setDescripcion(dto.getDescripcion());
        nuevoServicio.setCategoria(dto.getCategoria());
        nuevoServicio.setModalidadCobro(dto.getModalidadCobro());
        nuevoServicio.setPrecioBase(dto.getPrecioBase());
        nuevoServicio.setEstado(true);

        Servicio servicioGuardado = servicioRepository.save(nuevoServicio);

        Usuario admin = securityUtils.getUsuarioAutenticado();

        // Registrar Historial (Como es nuevo, datos_anteriores será automáticamente null internamente)
        auditoriaService.registrarHistorialServicio(servicioGuardado, "REGISTRAR", "Registro inicial de nuevo servicio.", admin);

        return new ServicioResponseDTO(
                servicioGuardado.getIdServicio(),
                servicioGuardado.getNombreServicio(),
                servicioGuardado.getDescripcion(),
                servicioGuardado.getCategoria(),
                servicioGuardado.getModalidadCobro(),
                servicioGuardado.getPrecioBase(),
                servicioGuardado.getEstado());
    }

    @Override
    @Transactional
    public ServicioResponseDTO actualizar(Integer id, ServicioRequestDTO dto) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));

        // Extraer el Administrador logueado
        Usuario admin = securityUtils.getUsuarioAutenticado();

        // Enviamos el objeto "servicio" tal como está antes de modificar sus campos
        auditoriaService.registrarHistorialServicio(servicio, "ACTUALIZAR", "Actualización de datos generales del servicio.", admin);

        // Aplicar los cambios y guardar
        servicio.setNombreServicio(dto.getNombreServicio());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setCategoria(dto.getCategoria());
        servicio.setModalidadCobro(dto.getModalidadCobro());
        servicio.setPrecioBase(dto.getPrecioBase());

        Servicio actualizado = servicioRepository.save(servicio);

        return new ServicioResponseDTO(
                actualizado.getIdServicio(),
                actualizado.getNombreServicio(),
                actualizado.getDescripcion(),
                actualizado.getCategoria(),
                actualizado.getModalidadCobro(),
                actualizado.getPrecioBase(),
                actualizado.getEstado());
    }

    @Override
    @Transactional
    public void inhabilitarLogico(Integer id, String motivo) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));

        // Extraer el Administrador logueado
        Usuario admin = securityUtils.getUsuarioAutenticado();

        // Antes de cambiar el estado a false
        auditoriaService.registrarHistorialServicio(servicio, "INHABILITAR", motivo, admin);

        // Aplicar la inhabilitación lógica
        servicio.setEstado(false);
        servicioRepository.save(servicio);
    }
}