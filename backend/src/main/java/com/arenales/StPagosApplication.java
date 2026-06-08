package com.arenales;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class StPagosApplication {
	public static void main(String[] args) {
		SpringApplication.run(StPagosApplication.class, args);
	}

	//Genera codigos Bycript para varias cuentas
	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner generarClaves() {
		return args -> {
			int cantidadAGenerar = 16;
			String contrasenaComun = "12345678";
			org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder =
					new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();

			System.out.println("=========================================");
			System.out.println("GENERANDO " + cantidadAGenerar + " CLAVES CON LA MISMA CONTRASEÑA");
			System.out.println("=========================================");

			for (int i = 1; i <= cantidadAGenerar; i++) {
				String claveEncriptada = encoder.encode(contrasenaComun);
				System.out.println("Usuario " + i + " [Texto: " + contrasenaComun + "] -> Clave SQL: " + claveEncriptada);
			}

			System.out.println("=========================================");
		};
	}
}
