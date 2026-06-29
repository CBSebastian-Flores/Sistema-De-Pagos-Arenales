package com.arenales.services.impl;

import com.arenales.config.SecurityUtils;
import com.arenales.dto.EgresoRequestDTO;
import com.arenales.dto.EgresoResponseDTO;
import com.arenales.entities.Egreso;
import com.arenales.entities.Usuario;
import com.arenales.repositories.EgresoRepository;
import com.arenales.services.EgresoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EgresoServiceImpl implements EgresoService {

    @Autowired private EgresoRepository egresoRepository;
    @Autowired private SecurityUtils securityUtils;

    @Override
    @Transactional
    public void registrarEgreso(EgresoRequestDTO dto) {
        Usuario tesorero = securityUtils.getUsuarioAutenticado();
        if (tesorero == null) {
            throw new RuntimeException("No se encontró una sesión válida para auditar el egreso.");
        }

        long totalEgresos = egresoRepository.contarTotalEgresos();
        String correlativo = String.format("EGR-%03d", totalEgresos + 1);

        Egreso nuevoEgreso = new Egreso();
        nuevoEgreso.setCodigoEgreso(correlativo);
        nuevoEgreso.setDescripcion(dto.getDescripcion());
        nuevoEgreso.setMonto(dto.getMonto());
        nuevoEgreso.setFechaGasto(LocalDateTime.now());
        nuevoEgreso.setCategoriaEgreso(dto.getCategoriaEgreso());
        nuevoEgreso.setMetodoRetiro(dto.getMetodoRetiro());
        nuevoEgreso.setBeneficiario(dto.getBeneficiario());
        nuevoEgreso.setUsuarioRegistro(tesorero);

        // Bloque listo para Cloudinary u otra solución de almacenamiento
        // if (dto.getComprobante() != null && !dto.getComprobante().isEmpty()) {
        //     String url = storageService.subirArchivo(dto.getComprobante());
        //     nuevoEgreso.setComprobanteUrl(url);
        // }

        egresoRepository.save(nuevoEgreso);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal obtenerTotalEgresos() {
        return egresoRepository.sumarTotalEgresos();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EgresoResponseDTO> obtenerUltimosEgresos() {
        // PageRequest IMPLEMENTA la interfaz Pageable, por lo que este casteo es automático si los imports son correctos
        List<Egreso> listaEntidades = egresoRepository.obtenerUltimosEgresos(PageRequest.of(0, 10));

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