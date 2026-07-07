package com.arenales.services.impl;

import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import com.arenales.entities.Pago;
import com.arenales.repositories.PagoRepository;
import com.arenales.services.PagoService;

@Service
public class PagoServiceImpl implements PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Override
    @Transactional(readOnly = true)
    public BigDecimal obtenerTotalIngresos() {
        return pagoRepository.sumarTotalIngresos();
    }

    @Override
    public List<Pago> obtenerHistorialPagosUsuario(Integer idUsuario) {
        return pagoRepository.findHistorialPagosCompletados(idUsuario);
    }
}