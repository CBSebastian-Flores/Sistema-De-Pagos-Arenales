package com.arenales.scheduler;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.arenales.entities.Deuda;
import com.arenales.entities.Servicio;
import com.arenales.entities.Usuario;
import com.arenales.repositories.DeudaRepository;
import com.arenales.repositories.ServicioRepository;
import com.arenales.repositories.UsuarioRepository;

@Component
public class DeudaTaskScheduler {

    @Autowired private ServicioRepository servicioRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private DeudaRepository deudaRepository;

    @Scheduled(cron = "*/10 * * * * ?")
    @Transactional
    public void generarDeudasMensualesEnLote() {
        System.out.println("⏳ [AUTOMATIZACIÓN] Iniciando motor de inyección de deudas en lote...");

        List<Servicio> serviciosAutomáticos = servicioRepository.findAll().stream()
                .filter(s -> Boolean.TRUE.equals(s.getEstado()) && "FIJO".equalsIgnoreCase(s.getModalidadCobro()))
                .toList();

        List<Usuario> sociosActivos = usuarioRepository.findAll().stream()
                .filter(u -> Boolean.TRUE.equals(u.getEstado()) && 
                             u.getRol() != null && "SOCIO".equalsIgnoreCase(u.getRol().getNombreRol()))
                .toList();

        if (serviciosAutomáticos.isEmpty() || sociosActivos.isEmpty()) {
            System.out.println("⚠️ [AUTOMATIZACIÓN] Proceso omitido: No hay servicios automáticos activos o socios registrados.");
            return;
        }

        Usuario usuarioSistema = usuarioRepository.findAll().stream()
                .filter(u -> u.getRol() != null && "Administrador".equalsIgnoreCase(u.getRol().getNombreRol()))
                .findFirst()
                .orElse(sociosActivos.get(0));

        List<Deuda> loteNuevasDeudas = new ArrayList<>();
        LocalDate hoy = LocalDate.now();
        LocalDate vencimiento = hoy.plusDays(15);

        for (Servicio servicio : serviciosAutomáticos) {
            for (Usuario socio : sociosActivos) {
                
                Deuda nuevaDeuda = new Deuda();
                nuevaDeuda.setUsuarioSocio(socio);
                nuevaDeuda.setServicio(servicio);
                nuevaDeuda.setMontoBase(servicio.getPrecioBase());
                nuevaDeuda.setMora(BigDecimal.ZERO);
                nuevaDeuda.setFechaEmision(hoy);
                nuevaDeuda.setFechaVencimiento(vencimiento);
                nuevaDeuda.setEstadoDeuda("PENDIENTE");
                nuevaDeuda.setUsuarioCreador(usuarioSistema);   

                loteNuevasDeudas.add(nuevaDeuda);
            }
        }

        if (!loteNuevasDeudas.isEmpty()) {
            deudaRepository.saveAll(loteNuevasDeudas);
            System.out.println("✅ [AUTOMATIZACIÓN] Éxito absoluto: Se han inyectado " + loteNuevasDeudas.size() + " deudas en lote.");
        }
    }
}