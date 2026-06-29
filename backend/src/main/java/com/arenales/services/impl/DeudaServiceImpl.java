package com.arenales.services.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private PagoRepository pagoRepository;

    @Autowired
    private SecurityUtils securityUtils;

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

            // Lógica de Jira: Si está pendiente pero la fecha ya pasó, calcular en caliente
            if ("Pendiente".equalsIgnoreCase(estadoActual) && hoy.isAfter(deuda.getFechaVencimiento())) {
                estadoActual = "Vencido";

                if (moraCalculada.compareTo(BigDecimal.ZERO) == 0) {
                    // 🚀 CORRECCIÓN 1: Se elimina el 10.00 hardcodeado. Se jala directo de la BD.
                    moraCalculada = servicio.getTarifaMora() != null ? servicio.getTarifaMora() : BigDecimal.ZERO;
                }
            }

            // 🚀 CORRECCIÓN 2: Blindaje contra NullPointerException en montos
            BigDecimal montoBaseSeguro = deuda.getMontoBase() != null ? deuda.getMontoBase() : BigDecimal.ZERO;
            BigDecimal montoTotalPagar = montoBaseSeguro.add(moraCalculada);

            // Validar nulos en nombres para evitar espacios vacíos raros (ej: "null null")
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
        // nuevoPago.setFechaPago(LocalDateTime.now()); // No es necesario setearlo si en SQL le pusiste DEFAULT GETDATE()
        nuevoPago.setCodigoPago(correlativoPAG);
        nuevoPago.setMontoPagado(dto.getMontoPagado());
        nuevoPago.setMetodoPago(dto.getMetodoPago());
        nuevoPago.setNroOperacion(dto.getNroOperacion());
        nuevoPago.setDeuda(deuda);
        nuevoPago.setUsuarioRegistro(tesorero);

        if ("TRANSFERENCIA".equalsIgnoreCase(dto.getMetodoPago()) && dto.getComprobante() != null && !dto.getComprobante().isEmpty()) {

            // Aquí se sube la imagen a un servidor (AWS, Cloudinary o tu VPS local)
            // String urlGenerada = storageService.subirArchivo(dto.getComprobante());
            // nuevoPago.setVoucherUrl(urlGenerada);

        }

        pagoRepository.save(nuevoPago);

        deuda.setEstadoDeuda("Pagado");
        deudaRepository.save(deuda);
    }
}