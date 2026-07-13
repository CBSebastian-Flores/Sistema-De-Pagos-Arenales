package com.arenales.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {
    String subirArchivo(MultipartFile archivo) throws IOException;
}
