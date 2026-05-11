package com.arenales.services;

import com.arenales.dto.UsuarioDTO;
import com.arenales.entities.Usuario;

public interface UsuarioService {
    Usuario registrarUsuario(UsuarioDTO usuarioDTO);
}
