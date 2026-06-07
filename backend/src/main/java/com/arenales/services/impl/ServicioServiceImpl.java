package com.arenales.services.impl;

import com.arenales.dto.ServicioResponseDTO;
import com.arenales.dto.ServicioRequestDTO;
import com.arenales.entities.Servicio;

import com.arenales.repositories.ServicioRepository;
import com.arenales.services.ServicioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicioServiceImpl implements ServicioService {
    @Autowired
    private ServicioRepository servicioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ServicioResponseDTO> listarTodos() {
        return servicioRepository.findAll().stream()
                .map(s -> new ServicioResponseDTO(
                        s.getIdServicio(),
                        s.getNombreServicio(),
                        s.getDescripcion(),
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
                servicio.getPrecioBase(),
                servicio.getEstado());
    }

    @Override
    @Transactional
    public ServicioResponseDTO crear(ServicioRequestDTO dto) {
        Servicio servicio = new Servicio();
        servicio.setNombreServicio(dto.getNombreServicio());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setPrecioBase(dto.getPrecioBase());
        servicio.setEstado(true);

        Servicio guardado = servicioRepository.save(servicio);

        return new ServicioResponseDTO(
                guardado.getIdServicio(),
                guardado.getNombreServicio(),
                guardado.getDescripcion(),
                guardado.getPrecioBase(),
                guardado.getEstado());
    }

    @Override
    @Transactional
    public ServicioResponseDTO actualizar(Integer id, ServicioRequestDTO dto) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));

        servicio.setNombreServicio(dto.getNombreServicio());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setPrecioBase(dto.getPrecioBase());

        Servicio actualizado = servicioRepository.save(servicio);

        return new ServicioResponseDTO(
                actualizado.getIdServicio(),
                actualizado.getNombreServicio(),
                actualizado.getDescripcion(),
                actualizado.getPrecioBase(),
                actualizado.getEstado());
    }

    @Override
    @Transactional
    public void inhabilitarLogico(Integer id) {
        Servicio servicio = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));

        servicio.setEstado(false);
        servicioRepository.save(servicio);
    }
}
