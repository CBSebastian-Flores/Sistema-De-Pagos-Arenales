package com.arenales.services.impl;

import com.arenales.dto.DeudaDTO;
import com.arenales.entities.Deuda;
import com.arenales.entities.Servicio;
import com.arenales.entities.Usuario;
import com.arenales.services.DeudaService;

import com.arenales.config.SecurityUtils;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
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

    @Autowired
    private SecurityUtils securityUtils;

    @Override
    @Transactional
    public void publicarDeudaMasiva(DeudaDTO dto) {

        Servicio servicio = servicioRepository.findById(dto.getIdServicio())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + dto.getIdServicio()));

        if ("VARIABLE".equalsIgnoreCase(servicio.getModalidadCobro())) {
            throw new IllegalArgumentException("No se puede emitir una deuda masiva uniforme para servicios con modalidad VARIABLE (Luz/Agua). Debe ser registro individual.");
        }

        // el autor sale del token JWT del Administrador logueado
        Usuario creador = securityUtils.getUsuarioAutenticado();

        // Consulta filtrada directo desde SQL Server
        List<Usuario> usuariosActivos = usuarioRepository.findByEstadoTrue();

        if (usuariosActivos.isEmpty()) {
            throw new RuntimeException("No se encontraron usuarios activos en el sistema para asignarles la deudas.");
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
            LocalDate vencimiento = (dto.getFechaVencimiento() != null)
                    ? dto.getFechaVencimiento()
                    : dto.getFechaEmision().plusMonths(1);

            deuda.setFechaVencimiento(vencimiento);

            listaDeudas.add(deuda);
        }

        deudaRepository.saveAll(listaDeudas);
    }
}
