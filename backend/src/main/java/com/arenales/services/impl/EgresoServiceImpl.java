package com.arenales.services.impl;

import com.arenales.config.SecurityUtils;
import com.arenales.dto.EgresoRequestDTO;
import com.arenales.dto.EgresoResponseDTO;
import com.arenales.entities.Egreso;
import com.arenales.entities.Servicio;
import com.arenales.entities.Usuario;
import com.arenales.repositories.EgresoRepository;
import com.arenales.services.EgresoService;
import com.arenales.services.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.arenales.repositories.ServicioRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EgresoServiceImpl implements EgresoService {

    @Autowired private EgresoRepository egresoRepository;
    @Autowired private ServicioRepository servicioRepository;
    @Autowired private SecurityUtils securityUtils;
    @Autowired private StorageService storageService;

    @Override
    @Transactional
    public Egreso registrarEgreso(EgresoRequestDTO dto ) {
        Usuario tesorero = securityUtils.getUsuarioAutenticado();
        if (tesorero == null) {
            throw new RuntimeException("No se encontró una sesión válida para auditar el egreso.");
        }

        if (dto.getIdServicio() == null) {
            throw new RuntimeException("El ID del servicio es obligatorio para registrar un egreso.");
        }

        Servicio servicio = servicioRepository.findById(dto.getIdServicio())
                .orElseThrow(() -> new RuntimeException("El servicio con ID " + dto.getIdServicio() + " no existe o no es válido."));

        if (dto.getComprobante() == null || dto.getComprobante().isEmpty()) {
            throw new RuntimeException("El archivo del comprobante/voucher no puede estar vacío.");
        }

        // Subida a la nube delegada al servicio de Storage (Cloudinary)
        String urlComprobante;
        try {
            urlComprobante = storageService.subirArchivo(dto.getComprobante());
        } catch (Exception e) {
            throw new RuntimeException("Error crítico al subir el comprobante a la nube: " + e.getMessage());
        }

        Egreso nuevoEgreso = new Egreso();
        nuevoEgreso.setServicio(servicio);
        nuevoEgreso.setComprobanteUrl(urlComprobante); // Persistencia de la URL segura

        // Generación de código seguro contra concurrencia
        String codigoSeguro = "EGR-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        nuevoEgreso.setCodigoEgreso(codigoSeguro);

        nuevoEgreso.setDescripcion(dto.getDescripcion());
        nuevoEgreso.setMonto(dto.getMonto());
        nuevoEgreso.setFechaGasto(LocalDateTime.now());
        nuevoEgreso.setCategoriaEgreso(dto.getCategoriaEgreso());
        nuevoEgreso.setMetodoRetiro(dto.getMetodoRetiro());
        nuevoEgreso.setBeneficiario(dto.getBeneficiario());
        nuevoEgreso.setUsuarioRegistro(tesorero);

        return egresoRepository.save(nuevoEgreso);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal obtenerTotalEgresos() {
        return egresoRepository.sumarTotalEgresos();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EgresoResponseDTO> obtenerUltimosEgresos() {
        List<Egreso> listaEntidades = egresoRepository.obtenerUltimosEgresos(PageRequest.of(0, 5));

        return listaEntidades.stream().map(e -> new EgresoResponseDTO(
                e.getIdEgreso(),
                e.getCodigoEgreso(),
                e.getDescripcion(),
                e.getMonto(),
                e.getFechaGasto(),
                e.getCategoriaEgreso(),
                e.getMetodoRetiro(),
                e.getBeneficiario(),
                e.getUsuarioRegistro() != null ? e.getUsuarioRegistro().getNombres() : "Sistema"
        )).collect(Collectors.toList());
    }
}
