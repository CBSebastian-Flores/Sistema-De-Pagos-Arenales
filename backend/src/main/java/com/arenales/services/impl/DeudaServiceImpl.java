package com.arenales.services.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.arenales.config.SecurityUtils;
import com.arenales.dto.DeudaDetalleTesoreriaDTO;
import com.arenales.dto.DeudaRequestDTO;
import com.arenales.dto.DeudaResponseDTO; 
import com.arenales.dto.PagoRequestDTO;
import com.arenales.entities.Deuda;
import com.arenales.entities.Pago;
import com.arenales.entities.Servicio;
import com.arenales.entities.Usuario;
import com.arenales.repositories.DeudaRepository;
import com.arenales.repositories.PagoRepository;
import com.arenales.repositories.ServicioRepository;
import com.arenales.repositories.UsuarioRepository;
import com.arenales.services.ComprobanteService;
import com.arenales.services.DeudaService;
import com.arenales.services.EmailService; // <-- Inyección del creador de PDF

@Service
public class DeudaServiceImpl implements DeudaService {

    private static final Logger log = LoggerFactory.getLogger(DeudaServiceImpl.class);

    @Autowired
    private DeudaRepository deudaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private SecurityUtils securityUtils;

    @Autowired
    private ComprobanteService comprobanteService; // <-- Nuevo

    @Autowired
    private EmailService emailService;             // <-- Nuevo

    @Override
    @Transactional
    public void publicarDeudaMasiva(DeudaRequestDTO dto) {
        Servicio servicio = servicioRepository.findById(dto.getIdServicio())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + dto.getIdServicio()));
                
        Usuario creador = securityUtils.getUsuarioAutenticado();
        List<Usuario> usuariosActivos = usuarioRepository.findByEstadoTrue();

        if (usuariosActivos.isEmpty()) {
            throw new RuntimeException("No se encontraron usuarios activos en el sistema para asignarles la deudas.");
        }

        List<Deuda> listaDeudas = new ArrayList<>();

        int diaFijoCorte = 15;
        LocalDate vencimientoAutomatico = calcularFechaVencimientoAutomatica(diaFijoCorte);

        for (Usuario comerciante : usuariosActivos) {
            Deuda deuda = new Deuda();
            deuda.setServicio(servicio);
            deuda.setMontoBase(dto.getMontoCuotaSocio());

            deuda.setFechaEmision(dto.getFechaEmision() != null ? dto.getFechaEmision() : LocalDate.now());
            deuda.setUsuarioCreador(creador);
            deuda.setUsuarioSocio(comerciante);
            deuda.setMora(BigDecimal.ZERO);
            deuda.setEstadoDeuda("Pendiente");

            deuda.setFechaVencimiento(vencimientoAutomatico);

            listaDeudas.add(deuda);
        }

        deudaRepository.saveAll(listaDeudas);
    }

    private LocalDate calcularFechaVencimientoAutomatica(int diaVencimientoProgramado) {
        LocalDate fechaHoy = LocalDate.now();
        LocalDate fechaVencimientoTentativa = fechaHoy.withDayOfMonth(diaVencimientoProgramado);

        if (fechaHoy.isAfter(fechaVencimientoTentativa)) {
            return fechaVencimientoTentativa.plusMonths(1);
        }
        return fechaVencimientoTentativa;
    }

    @Override
    @Transactional
    public List<DeudaResponseDTO> obtenerDeudasNoPagadas(Integer idUsuario) {
        List<Deuda> deudas = deudaRepository.findDeudasNoPagadasPorUsuario(idUsuario);
        List<DeudaResponseDTO> respuesta = new ArrayList<>();

        LocalDate hoy = LocalDate.now();

        for (Deuda deuda : deudas) {
            boolean seModifico = false;

            if (deuda.getEstadoDeuda().equalsIgnoreCase("Pendiente") && hoy.isAfter(deuda.getFechaVencimiento())) {
                deuda.setEstadoDeuda("Vencido");

                BigDecimal tarifaMoraServicio = deuda.getServicio().getTarifaMora();
                if (tarifaMoraServicio == null) {
                    tarifaMoraServicio = new BigDecimal("10.00");
                }

                if (deuda.getMora() == null || deuda.getMora().compareTo(BigDecimal.ZERO) == 0) {
                    deuda.setMora(tarifaMoraServicio);
                }
                seModifico = true;
            }

            if (seModifico) {
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
                    deuda.getEstadoDeuda(),
                    deuda.getFechaVencimiento()
            );

            respuesta.add(dtoRes);
        }

        return respuesta;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeudaDetalleTesoreriaDTO> obtenerReporteGeneralDeudas() {
        List<Deuda> deudas = deudaRepository.findAllWithSocioAndServicio();
        List<DeudaDetalleTesoreriaDTO> respuesta = new ArrayList<>();

        LocalDate hoy = LocalDate.now();

        for (Deuda deuda : deudas) {
            Usuario socio = deuda.getUsuarioSocio();
            Servicio servicio = deuda.getServicio();

            String estadoActual = deuda.getEstadoDeuda();
            BigDecimal moraCalculada = deuda.getMora() != null ? deuda.getMora() : BigDecimal.ZERO;

            if ("Pendiente".equalsIgnoreCase(estadoActual) && hoy.isAfter(deuda.getFechaVencimiento())) {
                estadoActual = "Vencido";

                if (moraCalculada.compareTo(BigDecimal.ZERO) == 0) {
                    moraCalculada = servicio.getTarifaMora() != null ? servicio.getTarifaMora() : BigDecimal.ZERO;
                }
            }

            BigDecimal montoBaseSeguro = deuda.getMontoBase() != null ? deuda.getMontoBase() : BigDecimal.ZERO;
            BigDecimal montoTotalPagar = montoBaseSeguro.add(moraCalculada);

            String nombreSeguro = socio.getNombres() != null ? socio.getNombres() : "";
            String apellidoSeguro = socio.getApellidos() != null ? socio.getApellidos() : "";
            String nombreCompletoSocio = (nombreSeguro + " " + apellidoSeguro).trim();

            DeudaDetalleTesoreriaDTO dto = new DeudaDetalleTesoreriaDTO(
                    deuda.getIdDeuda(),
                    socio.getDni(),
                    nombreCompletoSocio,
                    String.valueOf(socio.getNroPuesto()),
                    servicio.getNombreServicio(),
                    montoBaseSeguro,
                    moraCalculada,
                    montoTotalPagar,
                    deuda.getFechaVencimiento(),
                    estadoActual
            );

            respuesta.add(dto);
        }

        return respuesta;
    }

    @Override
    @Transactional
    public void registrarPagoDeuda(PagoRequestDTO dto) {
        log.info("[PAGO] Solicitud entrante para registrar el pago de la deuda ID: {}", dto.getIdDeuda());

        Deuda deuda = deudaRepository.findById(dto.getIdDeuda())
                .orElseThrow(() -> new RuntimeException("Deuda no encontrada con ID: " + dto.getIdDeuda()));

        if ("Pagado".equalsIgnoreCase(deuda.getEstadoDeuda())) {
            throw new RuntimeException("Esta deuda ya se encuentra cancelada.");
        }

        BigDecimal mora = deuda.getMora() != null ? deuda.getMora() : BigDecimal.ZERO;
        BigDecimal totalExigido = deuda.getMontoBase().add(mora);

        if (dto.getMontoPagado().compareTo(totalExigido) != 0) {
            throw new RuntimeException("Rechazado: El monto ingresado (S/. " + dto.getMontoPagado() + ") no coincide con el total adeudado (S/. " + totalExigido + ").");
        }

        Usuario tesorero = securityUtils.getUsuarioAutenticado();
        if (tesorero == null) {
            throw new RuntimeException("No se encontró una sesión de usuario válida para auditar el pago.");
        }

        long totalPagosExistentes = pagoRepository.contarTotalPagos();
        String correlativoPAG = String.format("PAG-%03d", totalPagosExistentes + 1);

        Pago nuevoPago = new Pago();
        nuevoPago.setCodigoPago(correlativoPAG);
        nuevoPago.setMontoPagado(dto.getMontoPagado());
        nuevoPago.setMetodoPago(dto.getMetodoPago());
        nuevoPago.setNroOperacion(dto.getNroOperacion());
        nuevoPago.setDeuda(deuda);
        nuevoPago.setUsuarioRegistro(tesorero);

        if ("TRANSFERENCIA".equalsIgnoreCase(dto.getMetodoPago()) && dto.getComprobante() != null && !dto.getComprobante().isEmpty()) {
        }

        pagoRepository.save(nuevoPago);

        deuda.setEstadoDeuda("Pagado");
        deudaRepository.save(deuda);
        
        log.info("[PAGO] Registro en base de datos completado con éxito. Correlativo generado: {}", correlativoPAG);

        try {
            Usuario socio = deuda.getUsuarioSocio();
            String correoSocio = socio.getCorreo();

            if (correoSocio == null || correoSocio.trim().isEmpty()) {
                log.warn("[POST-PAGO] El socio {} no tiene un correo registrado. Se omitirá el envío del comprobante.", socio.getNombres());
                return;
            }

            log.info("[POST-PAGO] Compilando datos para el mapa de variables de la plantilla Thymeleaf...");
            Map<String, Object> data = new HashMap<>();
            data.put("codigo_pago", correlativoPAG);
            data.put("socio_nombre", (socio.getNombres() + " " + socio.getApellidos()).trim());
            data.put("nro_puesto", socio.getNroPuesto() != null ? String.valueOf(socio.getNroPuesto()) : "---");
            data.put("socio_dni", socio.getDni() != null ? socio.getDni() : "---");
            data.put("fecha_pago", LocalDate.now().toString());
            data.put("metodo_pago", dto.getMetodoPago());
            data.put("concepto", deuda.getServicio().getNombreServicio());
            data.put("monto_pagado", dto.getMontoPagado().toString());

            log.info("[POST-PAGO] Generando el archivo binario PDF en la memoria RAM...");
            byte[] pdfBytes = comprobanteService.generarBoletaPdf("boleta", data);

            log.info("[POST-PAGO] Disparando hilo asíncrono para el envío del correo electrónico.");
            emailService.enviarBoletaPorCorreo(
                correoSocio, 
                socio.getNombres(), 
                correlativoPAG, 
                pdfBytes
            );

        } catch (Exception e) {
            log.error("[POST-PAGO EXCEPCIÓN] El pago se procesó en BD pero falló el flujo de comprobación/correo: ", e);
        }
    }
}