package com.arenales.services.impl;

import com.arenales.dto.DeudaDTO;
import com.arenales.entities.Deuda;
import com.arenales.entities.Servicio;
import com.arenales.entities.Usuario;
import com.arenales.services.DeudaService;

import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.arenales.repositories.DeudaRepository;
import com.arenales.repositories.UsuarioRepository;
import com.arenales.repositories.ServicioRepository;


@Service
public class DeudaServiceImpl implements DeudaService {

    @Autowired
    private DeudaRepository deudaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Override
    @Transactional
    public void publicarDeudaMasiva(DeudaDTO dto) {

        Servicio servicio = servicioRepository.findById(dto.getIdServicio().intValue())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + dto.getIdServicio()));

        
        if ("VARIABLE".equalsIgnoreCase(servicio.getModalidadCobro())) {
            
        }

        Usuario creador = usuarioRepository.findById(dto.getIdUsuarioCreador().intValue())
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado con ID: " + dto.getIdUsuarioCreador()));

        List<Usuario> usuariosActivos = usuarioRepository.findAll().stream()
                .filter(u -> u.getEstado() != null && u.getEstado()) // true = Estado 1 (Activo)
                .toList();

        if (usuariosActivos.isEmpty()) {
            throw new RuntimeException("No se encontraron usuarios activos en el sistema para asignarles la deuda.");
        }

        List<Deuda> listaDeudas = new ArrayList<>();

        
        for (Usuario comerciante : usuariosActivos) {
            Deuda deuda = new Deuda();
            
            deuda.setServicio(servicio);
            deuda.setMontoBase(dto.getMontoCuotaSocio()); 
            deuda.setFechaEmision(dto.getFechaEmision()); 
            deuda.setUsuarioCreador(creador);             
            
            deuda.setUsuarioSocio(comerciante);          
            deuda.setMora(BigDecimal.ZERO);              
            deuda.setEstadoDeuda("Pendiente");           
            deuda.setFechaVencimiento(dto.getFechaEmision().plusMonths(1));
            
            listaDeudas.add(deuda);
        }

        deudaRepository.saveAll(listaDeudas);
    }
}
