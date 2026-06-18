package com.arenales.config;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice // Intercepta dinámicamente cualquier error de tus controladores
public class GlobalExceptionHandler {
    // CAPTURA ERRORES DE NEGOCIO (Los RuntimeException lanzados desde el ServiceImpl)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> manejarRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "success", false,
                        "error", ex.getMessage()
                ));
    }

    // CAPTURA ERRORES DE VALIDACIÓN DTO (Cuando el @Valid rebota campos vacíos o negativos)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarErroresValidacion(MethodArgumentNotValidException ex) {
        String mensajeDetallado = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "success", false,
                        "error", mensajeDetallado
                ));
    }

    // CAPTURA ERRORES GENÉRICOS / INESPERADOS (Caídas de BD o excepciones de sistema)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> manejarErroresGlobales(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "success", false,
                        "error", "Ocurrió un error interno e inesperado en el servidor."
                ));
    }

    // CAPTURA ERRORES GENÉRICOS / INESPERADOS (Caídas de BD o excepciones de sistema)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> manejarIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "success", false,
                        "error", ex.getMessage() // Escupe directo: "El precioBase para un servicio FIJO..."
                ));
    }
}
