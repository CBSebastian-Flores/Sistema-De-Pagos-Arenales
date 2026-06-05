package com.arenales.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "Usuario")
public class Usuario {  
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;
    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;
    @Column(name = "dni", nullable = false, unique = true, length = 8)
    private String dni;
    @Column(name = "correo", unique = true, length = 150)
    private String correo;
    @Column(name = "contrasena", nullable = false, length = 255)
    private String contrasena;
    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;
    @Column(name = "genero", nullable = false, length = 20)
    private String genero;
    @Column(name = "nro_puesto", nullable = false)
    private Integer nroPuesto;
    @Column(name = "telefono", nullable = false, length = 9)
    private String telefono;
    @Column(name = "estado", nullable = false)
    private Boolean estado = true; 
    @Column(name = "intentos_fallidos")
    private Integer intentosFallidos = 0;
    @Column(name = "bloqueado_hasta")
    private LocalDateTime bloqueadoHasta;

    @ManyToOne 
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;
}