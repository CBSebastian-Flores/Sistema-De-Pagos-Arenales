package com.arenales.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String dni;
    private String contrasena;
}