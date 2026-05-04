package com.arenales.entities;
import jakarta.persistence.*; // api para la persistencia
import java.time.LocalDate; // para fechas
import lombok.*;

@Entity // para marcar que esta clase es una de la bd
@Table(name = "Usuarios") // y aquí la nombro exactamente como está ahí
@Getter @Setter @NoArgsConstructor @AllArgsConstructor

public class Usuario {  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdUsuario") // aqui pongo el nombre exacto de la columna también

    private Integer idUsuario;
    @Column(name = "Nombre", nullable = false, length = 100)
    private String nombre;
    @Column(name = "Apellidos", nullable = false, length = 100)
    private String apellidos;
    @Column(name = "DNI", nullable = false, unique = true, length = 8) // unique para no repetir
    private String dni;
    @Column(name = "Correo", length = 150)
    private String correo;
    @Column(name = "Contrasena", nullable = false, length = 255) // dejo espacio para un hash largo
    private String contrasena; 
    @Column(name = "FechaNacimiento", nullable = false)
    private LocalDate fechaNacimiento;
    @Column(name = "Genero", nullable = false, length = 20) 
    private String genero;
    @Column(name = "NroPuesto", nullable = false)
    private Integer nroPuesto;

    @ManyToOne 
    @JoinColumn(name = "IdRol", nullable = false) // para la fk
    private Rol rol;
}