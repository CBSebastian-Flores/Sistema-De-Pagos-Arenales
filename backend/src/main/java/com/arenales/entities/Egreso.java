package com.arenales.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Egreso")
@Data
public class Egreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_egreso")
    private Integer idEgreso;

    @Column(name = "codigo_egreso", nullable = false, unique = true, length = 20)
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
    private Usuario usuarioRegistro;
}