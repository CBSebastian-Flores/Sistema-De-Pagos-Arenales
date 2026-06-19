package com.arenales.services.impl;

import java.math.BigDecimal;
import java.time.LocalDate; // Importado correctamente en singular
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.arenales.config.SecurityUtils;
import com.arenales.dto.DeudaRequestDTO;
import com.arenales.dto.DeudaResponseDTO;
import com.arenales.entities.Deuda;
import com.arenales.entities.Servicio;
import com.arenales.entities.Usuario;
import com.arenales.repositories.DeudaRepository;
import com.arenales.repositories.ServicioRepository;
import com.arenales.repositories.UsuarioRepository;
import com.arenales.services.DeudaService;


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
    public void publicarDeudaMasiva(DeudaRequestDTO dto) {

        Servicio servicio = servicioRepository.findById(dto.getIdServicio())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + dto.getIdServicio()));

        // el autor sale del token JWT del Administrador logueado
        Usuario creador = securityUtils.getUsuarioAutenticado();
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

    @Override
    @Transactional
    public List<DeudaResponseDTO> obtenerDeudasNoPagadas(Integer idUsuario) {
        List<Deuda> deudas = deudaRepository.findDeudasNoPagadasPorUsuario(idUsuario);
        List<DeudaResponseDTO> respuesta = new ArrayList<>();

        LocalDate hoy = LocalDate.now();

        for (Deuda deuda : deudas) {
            if (deuda.getEstadoDeuda().equalsIgnoreCase("Pendiente") && hoy.isAfter(deuda.getFechaVencimiento())) {
                deuda.setEstadoDeuda("Vencido");
                
                if (deuda.getMora() == null || deuda.getMora().compareTo(BigDecimal.ZERO) == 0) {
                    deuda.setMora(new BigDecimal("5.00")); 
                }
                deudaRepository.save(deuda);
            }

            BigDecimal moraValue = deuda.getMora() != null ? deuda.getMora() : BigDecimal.ZERO;
            BigDecimal montoTotal = deuda.getMontoBase().add(moraValue);

            DeudaResponseDTO dtoRes = new DeudaResponseDTO(
                    deuda.getIdDeuda(),
                    deuda.getServicio().getNombreServicio(), 
                    deuda.getMontoBase(),
                    moraValue,
                    montoTotal,
                    deuda.getEstadoDeuda()
            );

            respuesta.add(dtoRes);
        }

        return respuesta;
    }
}