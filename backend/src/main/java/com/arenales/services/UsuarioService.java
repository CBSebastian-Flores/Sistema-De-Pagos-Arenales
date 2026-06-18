package com.arenales.services;

import com.arenales.dto.UsuarioRequestDTO;
import com.arenales.dto.UsuarioResponseDTO;
import com.arenales.dto.UsuarioActualizarDTO;
import com.arenales.dto.RestablecerFuerzaDTO;
import com.arenales.entities.Usuario;
import java.util.List;

public interface UsuarioService {
    
    // Método original existente
    Usuario registrarUsuario(UsuarioRequestDTO usuarioRequestDTO);

    // [BACK] Endpoint para Listar Usuarios
    List<UsuarioResponseDTO> listarTodos();

    // [BACK] Endpoint para Actualizar Datos
    Usuario actualizar(Integer id, UsuarioActualizarDTO usuarioActualizarDTO);

    // [BACK] Endpoint de Cambio de Estado / Eliminación Lógica
    void inhabilitar(Integer id, String motivo);
    void habilitar(Integer id, String motivo);

    // [BACK] Endpoint para Restablecimiento Forzado de Contraseña
    void restablecerContrasenaForzado(RestablecerFuerzaDTO restablecerFuerzaDTO);
}