package com.arenales.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class DeudaDetalleTesoreriaDTO {
    private Integer idDeuda;
    private String dniSocio;
    private String nombreCompletoSocio;
    private String numeroPuesto;
    private String nombreServicio;
    private BigDecimal montoBase;
    private BigDecimal mora;
    private BigDecimal montoTotalPagar;
    private LocalDate fechaVencimiento;
    private String estadoDeuda;

    public DeudaDetalleTesoreriaDTO() {}

    public DeudaDetalleTesoreriaDTO(Integer idDeuda, String dniSocio, String nombreCompletoSocio, 
                                    String numeroPuesto, String nombreServicio, BigDecimal montoBase, 
                                    BigDecimal mora, BigDecimal montoTotalPagar, LocalDate fechaVencimiento, 
                                    String estadoDeuda) {
        this.idDeuda = idDeuda;
        this.dniSocio = dniSocio;
        this.nombreCompletoSocio = nombreCompletoSocio;
        this.numeroPuesto = numeroPuesto;
        this.nombreServicio = nombreServicio;
        this.montoBase = montoBase;
        this.mora = mora;
        this.montoTotalPagar = montoTotalPagar;
        this.fechaVencimiento = fechaVencimiento;
        this.estadoDeuda = estadoDeuda;
    }
}