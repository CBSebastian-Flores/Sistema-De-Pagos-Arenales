package com.arenales.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Egreso")
@Data
public class Egreso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_egreso")
    private Integer idEgreso;

    @Column(name = "codigo_egreso", nullable = false, unique = true, length = 50, insertable = false)
    private String codigoEgreso;

    @Column(name = "descripcion", nullable = false, length = 255)
    private String descripcion;

    @Column(name = "monto", nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(name = "fecha_gasto", nullable = false)
    private LocalDateTime fechaGasto;

    @Column(name = "comprobante_url", length = 255)
    private String comprobanteUrl;

    @Column(name = "categoria_egreso", nullable = false, length = 100)
    private String categoriaEgreso;

    @Column(name = "metodo_retiro", nullable = false, length = 50)
    private String metodoRetiro;

    @Column(name = "beneficiario", nullable = false, length = 150)
    private String beneficiario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_registro", nullable = false, foreignKey = @ForeignKey(name = "FK_Egreso_Usuario"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario usuarioRegistro;

    // Se agrega el nombre explícito de la relación FK_Egreso_Servicio e insertable = false para tomar el id_servicio = 1 por defecto.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_servicio", nullable = false, insertable = false, foreignKey = @ForeignKey(name = "FK_Egreso_Servicio"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Servicio servicio;
}