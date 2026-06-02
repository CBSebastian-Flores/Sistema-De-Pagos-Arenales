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

	//Genera codigos Bycript
	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner generarClave() {
		return args -> {
			System.out.println("=========================================");
			System.out.println("CLAVE EXACTA PARA SQL: " + new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("12345678"));
			System.out.println("=========================================");
		};
	}
}
