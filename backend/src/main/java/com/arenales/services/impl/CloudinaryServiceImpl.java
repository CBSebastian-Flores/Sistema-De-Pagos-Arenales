package com.arenales.services.impl;

import com.arenales.services.StorageService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements StorageService {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String subirArchivo(MultipartFile archivo) throws IOException {
        // Subimos los bytes del archivo usando la configuración por defecto de Cloudinary
        Map uploadResult = cloudinary.uploader().upload(archivo.getBytes(), ObjectUtils.emptyMap());

        // Retornamos la URL segura (https) generada por el servidor de Cloudinary
        return uploadResult.get("secure_url").toString();
    }
}