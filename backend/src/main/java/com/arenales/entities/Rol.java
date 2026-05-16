package com.arenales.entities;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Rol")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor

public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Integer idRol;

    @Column(name = "tipo_rol", nullable = false, unique = true, length = 50)
    private String tipoRol;
}