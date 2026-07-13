package com.arenales.controllers;

import java.math.BigDecimal;
import java.util.Map;

import com.arenales.dto.PagoResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


import com.arenales.config.SecurityUtils;
import com.arenales.entities.Pago;
import com.arenales.entities.Usuario;
import com.arenales.services.PagoService;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "*")
public class PagoController {

    @Autowired
    private PagoService pagoService;
    
    @Autowired
    private SecurityUtils securityUtils; 

    @GetMapping("/total")
    @PreAuthorize("hasAnyAuthority('Tesorero', 'Administrador')")
    public ResponseEntity<?> obtenerTotalIngresos() {
        BigDecimal total = pagoService.obtenerTotalIngresos();
        return ResponseEntity.ok(Map.of("total", total));
    }

    @GetMapping("/historial")
    @PreAuthorize("hasAnyAuthority('Socio', 'Administrador', 'Tesorero')")
    public ResponseEntity<List<PagoResponseDTO>> listarHistorialPagos() {
        Usuario socioLogueado = securityUtils.getUsuarioAutenticado();

        // El servicio ahora debe encargarse de devolver directamente la lista de DTOs
        List<PagoResponseDTO> historialLimpio = pagoService.obtenerHistorialPagosUsuario(socioLogueado.getIdUsuario());

        return ResponseEntity.ok(historialLimpio);
    }
}