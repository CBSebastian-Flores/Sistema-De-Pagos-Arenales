package com.arenales.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Historial_Servicio")
public class HistorialServicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial_servicio")
    private Integer idHistorialServicio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_servicio", nullable = false)
    private Servicio servicio;

    @Column(name = "datos_anteriores", columnDefinition = "NVARCHAR(MAX)")
    private String datosAnteriores; // Guardaremos el objeto Servicio viejo como JSON String

    @Column(name = "tipo_accion", nullable = false, length = 50)
    private String tipoAccion; // REGISTRAR, ACTUALIZAR, INHABILITAR, HABILITAR

    @Column(name = "motivo", length = 255)
    private String motivo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_creador", nullable = false)
    private Usuario usuarioCreador; // El administrador que ejecutó la acción
}
