package com.arenales.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
@Table(name = "Pago")
@Data
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "id_pago")
    private Integer idPago;

    @Column(name = "fecha_pago", nullable = false, insertable = false, updatable = false)
    private LocalDateTime fechaPago;

    @Column(name = "monto_pagado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoPagado;

    @Column(name = "metodo_pago", nullable = false, length = 50)
    private String metodoPago;

    @Column(name = "nro_operacion", length = 100)
    private String nroOperacion;

    @Column(name = "voucher_url", length = 255)
    private String voucherUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_deuda", nullable = false, foreignKey = @ForeignKey(name = "FK_Pago_Deuda"))
    private Deuda deuda;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_tesorero", nullable = false, foreignKey = @ForeignKey(name = "FK_Pago_Tesorero"))
    private Usuario usuarioTesorero;
}