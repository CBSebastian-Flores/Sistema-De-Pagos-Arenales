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
@Table(name = "Historial_Usuario")
public class HistorialUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial_usuario")
    private Integer idHistorialUsuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario; // El usuario que ha sido afectado o modificado

    @Column(name = "datos_anteriores", columnDefinition = "NVARCHAR(MAX)")
    private String datosAnteriores; // Guardaremos el JSON del estado anterior del usuario

    @Column(name = "tipo_accion", nullable = false, length = 50)
    private String tipoAccion; // REGISTRAR, ACTUALIZAR, INHABILITAR, HABILITAR, PASSWORD_RESET

    @Column(name = "motivo", length = 255)
    private String motivo; // Justificación obligatoria del por qué de la acción

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_creador", nullable = false)
    private Usuario usuarioCreador; // El administrador autenticado que ejecutó la acción (OWASP)

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;
}
