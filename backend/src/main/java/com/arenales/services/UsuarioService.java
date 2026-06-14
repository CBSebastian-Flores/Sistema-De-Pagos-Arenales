package com.arenales.services;

import com.arenales.dto.UsuarioDTO;
import com.arenales.dto.UsuarioListadoDTO;
import com.arenales.dto.UsuarioActualizarDTO;
import com.arenales.dto.RestablecerFuerzaDTO;
import com.arenales.entities.Usuario;
import java.util.List;

public interface UsuarioService {
    
    // Método original existente
    Usuario registrarUsuario(UsuarioDTO usuarioDTO);

    // [BACK] Endpoint para Listar Usuarios
    List<UsuarioListadoDTO> listarTodos();

    // [BACK] Endpoint para Actualizar Datos
    Usuario actualizar(Integer id, UsuarioActualizarDTO usuarioActualizarDTO);

    // [BACK] Endpoint de Cambio de Estado / Eliminación Lógica
    Usuario delete(Integer id, String motivo);

    // [BACK] Endpoint para Restablecimiento Forzado de Contraseña
    void restablecerContrasenaForzado(RestablecerFuerzaDTO restablecerFuerzaDTO);
}