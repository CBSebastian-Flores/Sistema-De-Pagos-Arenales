package com.arenales.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Sistema de Pagos Arenales")
                        .version("1.0")
                        .description("Documentación interactiva de los endpoints del backend para el equipo de Frontend."));
    }
}
