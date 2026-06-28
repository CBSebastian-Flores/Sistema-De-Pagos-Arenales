package com.arenales.services.impl;

import com.arenales.config.SecurityUtils;
import com.arenales.dto.EgresoRequestDTO;
import com.arenales.entities.Egreso;
import com.arenales.entities.Usuario;
import com.arenales.repositories.EgresoRepository;
import com.arenales.services.EgresoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
}