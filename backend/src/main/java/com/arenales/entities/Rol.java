package com.arenales.entities;
import jakarta.persistence.*; // api para la persistencia
import lombok.*; 

@Entity // para marcar que esta clase es una de la bd
@Table(name = "Rol") // y aquí la nombro exactamente como está ahí
@Getter @Setter @NoArgsConstructor @AllArgsConstructor

public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // para que se genere automaticamente
    @Column(name = "id_rol") // aqui pongo el nombre exacto de la columna también
    private Integer idRol;

    @Column(name = "tipo_rol", nullable = false, unique = true, length = 50)
    private String tipoRol;
}