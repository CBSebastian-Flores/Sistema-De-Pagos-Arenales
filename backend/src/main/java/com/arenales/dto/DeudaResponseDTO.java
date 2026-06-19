package com.arenales.dto;

import java.math.BigDecimal;

public class DeudaResponseDTO {
    private Integer idDeuda;
    private String nombreServicio;
    private BigDecimal montoBase;
    private BigDecimal mora;
    private BigDecimal montoTotalPagar;
    private String estadoDeuda;

    // Constructor vacío
    public DeudaResponseDTO() {}

    // Constructor lleno
    public DeudaResponseDTO(Integer idDeuda, String nombreServicio, BigDecimal montoBase, BigDecimal mora, BigDecimal montoTotalPagar, String estadoDeuda) {
        this.idDeuda = idDeuda;
        this.nombreServicio = nombreServicio;
        this.montoBase = montoBase;
        this.mora = mora;
        this.montoTotalPagar = montoTotalPagar;
        this.estadoDeuda = estadoDeuda;
    }

    // Getters y Setters
    public Integer getIdDeuda() { return idDeuda; }
    public void setIdDeuda(Integer idDeuda) { this.idDeuda = idDeuda; }

    public String getNombreServicio() { return nombreServicio; }
    public void setNombreServicio(String nombreServicio) { this.nombreServicio = nombreServicio; }

    public BigDecimal getMontoBase() { return montoBase; }
    public void setMontoBase(BigDecimal montoBase) { this.montoBase = montoBase; }

    public BigDecimal getMora() { return mora; }
    public void setMora(BigDecimal mora) { this.mora = mora; }

    public BigDecimal getMontoTotalPagar() { return montoTotalPagar; }
    public void setMontoTotalPagar(BigDecimal montoTotalPagar) { this.montoTotalPagar = montoTotalPagar; }

    public String getEstadoDeuda() { return estadoDeuda; }
    public void setEstadoDeuda(String estadoDeuda) { this.estadoDeuda = estadoDeuda; }
}