package com.arenales.entities;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Servicio")
public class Servicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Integer idServicio;

    @Column(name = "nombre_servicio", nullable = false, length = 100)
    private String nombreServicio;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "categoria", nullable = false, length = 20)
    private String categoria;

    @Column(name = "modalidad_cobro", nullable = false, length = 15)
    private String modalidadCobro;

    @Column(name = "precio_base", nullable = false)
    private BigDecimal precioBase;

    @Column(name = "tarifa_mora", nullable = false)
    private BigDecimal tarifaMora;

    @Column(name = "estado", nullable = false)
    private Boolean estado;
}
