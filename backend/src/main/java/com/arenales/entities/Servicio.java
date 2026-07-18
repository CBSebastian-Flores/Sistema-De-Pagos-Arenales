package com.arenales.entities;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Servicio")
@Data
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Integer idServicio;

    @Column(name = "nombre_servicio", nullable = false, length = 100)
    private String nombreServicio;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "categoria", nullable = false, length = 20, insertable = false)
    private String categoria;

    // Aquí estaba el error 1: El campo debe llamarse exactamente modalidadCobro en camelCase
    @Column(name = "modalidad_cobro", nullable = false, length = 15, insertable = false)
    private String modalidadCobro;

    @Column(name = "precio_base", nullable = false, precision = 10, scale = 2, insertable = false)
    private BigDecimal precioBase;

    @Column(name = "tarifa_mora", precision = 10, scale = 2, insertable = false)
    private BigDecimal tarifaMora;

    @Column(name = "dia_corte")
    private Integer diaCorte;

    @Column(name = "dias_vencimiento")
    private Integer diasVencimiento;

    @Column(name = "estado", nullable = false, insertable = false)
    private Boolean estado;
}