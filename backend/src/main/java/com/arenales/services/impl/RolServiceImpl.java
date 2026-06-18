package com.arenales.services.impl;

import com.arenales.dto.RolResponseDTO;
import com.arenales.entities.Rol;
import com.arenales.repositories.RolRepository;
import com.arenales.services.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

import java.util.List;

@Service
public class RolServiceImpl implements RolService {
    @Autowired
    private RolRepository rolRepository;

    @Override
    public List<RolResponseDTO> listarRoles() {
        // Extraemos las entidades puras de SQL Server
        List<Rol> rolesEntidad = rolRepository.findAll();

        // Mapeamos y limpiamos los datos transformándolos a DTO
        return rolesEntidad.stream().map(rol -> {
            RolResponseDTO dto = new RolResponseDTO();
            dto.setIdRol(rol.getIdRol());
            dto.setTipoRol(rol.getTipoRol());
            return dto;
        }).collect(Collectors.toList());
    }
}
