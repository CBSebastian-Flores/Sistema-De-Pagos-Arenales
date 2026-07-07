package com.arenales.controllers;

import java.math.BigDecimal;
import java.util.Map;
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
    @PreAuthorize("hasAnyAuthority('Socio', 'Administrador', 'Tesarero')")
    public ResponseEntity<?> listarHistorialPagos() {
        // 1. Obtenemos el usuario autenticado desde el contexto de seguridad
        Usuario socioLogueado = securityUtils.getUsuarioAutenticado();
        Integer idSocio = socioLogueado.getIdUsuario();
        
        // 2. Consultamos el historial desde tu servicio
        List<Pago> historial = pagoService.obtenerHistorialPagosUsuario(idSocio);

        // 3. Mapeamos manualmente a una estructura limpia para Jackson (Evita el ByteBuddyInterceptor)
        // 3. Mapeamos manualmente a una estructura limpia (Evita el ByteBuddyInterceptor)
        List<java.util.Map<String, Object>> respuestaLimpia = historial.stream().map(pago -> {
            java.util.Map<String, Object> mapa = new java.util.LinkedHashMap<>();
            
            mapa.put("idPago", pago.getIdPago());
            mapa.put("codigoPago", pago.getCodigoPago());
            mapa.put("montoPagado", pago.getMontoPagado());
            mapa.put("metodoPago", pago.getMetodoPago());
            mapa.put("nroOperacion", pago.getNroOperacion() != null ? pago.getNroOperacion() : "");
            mapa.put("voucherUrl", pago.getVoucherUrl() != null ? pago.getVoucherUrl() : "");
            mapa.put("idDeuda", pago.getDeuda() != null ? pago.getDeuda().getIdDeuda() : null);
            
            return mapa;
        }).toList();

        // 4. Retornamos la respuesta segura
        return ResponseEntity.ok(respuestaLimpia);
    }
}