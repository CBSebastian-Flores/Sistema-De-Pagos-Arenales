package com.arenales.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arenales.config.SecurityUtils;
import com.arenales.dto.DeudaDetalleTesoreriaDTO;
import com.arenales.dto.DeudaRequestDTO;
import com.arenales.dto.DeudaResponseDTO;
import com.arenales.entities.Usuario;
import com.arenales.services.DeudaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/deudas")
public class DeudaController {

    @Autowired
    private DeudaService deudaService;

    @Autowired
    private SecurityUtils securityUtils;

    @PostMapping("/publicar-masivo")
    public ResponseEntity<?> publicarDeudaMasiva(@Valid @RequestBody DeudaRequestDTO dto) {
        deudaService.publicarDeudaMasiva(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "mensaje", "La cuota del servicio se ha publicado de forma masiva y exitosa para todos los socios activos."
        ));
    }

    @GetMapping("/pendiente")
    @PreAuthorize("hasAnyAuthority('Socio', 'Administrador', 'Tesorero')")
    public ResponseEntity<List<DeudaResponseDTO>> obtenerDeudasPendientesSocio() {
        Usuario socioLogueado = securityUtils.getUsuarioAutenticado();
        Integer idSocio = socioLogueado.getIdUsuario();
        List<DeudaResponseDTO> deudasNoPagadas = deudaService.obtenerDeudasNoPagadas(idSocio);

        return ResponseEntity.ok(deudasNoPagadas);
    }

    @GetMapping("/general")
    @PreAuthorize("hasAnyAuthority('Tesorero', 'Administrador')")
    public ResponseEntity<List<DeudaDetalleTesoreriaDTO>> obtenerReporteGeneralDeudas() {
        List<DeudaDetalleTesoreriaDTO> reporte = deudaService.obtenerReporteGeneralDeudas();
        return ResponseEntity.ok(reporte);
    }
}