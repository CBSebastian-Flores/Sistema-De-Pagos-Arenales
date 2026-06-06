-- ============================================
-- SCRIPT DE CREACIÓN - CC_Arenales
-- ============================================

-- Crear base de datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CC_Arenales')
BEGIN
    CREATE DATABASE CC_Arenales;
END
GO

-- Usar la base de datos
USE CC_Arenales;
GO

-- ============================================
-- LIMPIEZA DE TABLAS (Orden por Foreign Keys)
-- ============================================
IF OBJECT_ID('Pago', 'U') IS NOT NULL DROP TABLE Pago;
IF OBJECT_ID('Egreso', 'U') IS NOT NULL DROP TABLE Egreso;
IF OBJECT_ID('Deuda', 'U') IS NOT NULL DROP TABLE Deuda;
IF OBJECT_ID('Servicio', 'U') IS NOT NULL DROP TABLE Servicio;
IF OBJECT_ID('Usuario', 'U') IS NOT NULL DROP TABLE Usuario;
IF OBJECT_ID('Rol', 'U') IS NOT NULL DROP TABLE Rol;
GO

-- ============================================
-- CREACION DE TABLAS - CC_Arenales
-- ============================================
CREATE TABLE Rol (
    id_rol INT PRIMARY KEY IDENTITY(1,1),
    tipo_rol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni CHAR(8) NOT NULL UNIQUE,
    correo VARCHAR(150) NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(20) NOT NULL
    CHECK (genero IN ('Masculino', 'Femenino', 'Otro')),
    nro_puesto INT NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    estado BIT NOT NULL DEFAULT 1,
    intentos_fallidos INT NOT NULL DEFAULT 0,
	bloqueado_hasta DATETIME NULL,
    id_rol INT NOT NULL,

    -- Llave foránea
    CONSTRAINT FK_Usuario_Rol FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);
GO

CREATE TABLE Servicio (
    id_servicio INT PRIMARY KEY IDENTITY(1,1),
    nombre_servicio VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL
);
GO

CREATE TABLE Deuda (
    id_deuda INT PRIMARY KEY IDENTITY(1,1),
    monto_base DECIMAL(10,2) NOT NULL,
    mora DECIMAL(10,2) NOT NULL DEFAULT 0,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado_deuda VARCHAR(20) NOT NULL CHECK (estado_deuda IN ('Pendiente', 'Pagado', 'Vencido')),

    id_servicio INT NOT NULL,
    id_usuario INT NOT NULL,

    -- Llaves foráneas
    CONSTRAINT FK_Deuda_Servicio FOREIGN KEY (id_servicio) REFERENCES Servicio(id_servicio),
    CONSTRAINT FK_Deuda_Usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);
GO

CREATE TABLE Pago (
    id_pago INT PRIMARY KEY IDENTITY(1,1),
    fecha_pago DATETIME NOT NULL DEFAULT GETDATE(),
    monto_pagado DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL
    CHECK (metodo_pago IN ('Efectivo', 'Transferencia', 'Yape', 'Plin')),
    nro_operacion VARCHAR(100) NULL,
    voucher_url VARCHAR(255) NULL,
    id_deuda INT NOT NULL,

    -- Llave foránea
    CONSTRAINT FK_Pago_Deuda FOREIGN KEY (id_deuda) REFERENCES Deuda(id_deuda)
);
GO

CREATE TABLE Egreso (
    id_egreso INT PRIMARY KEY IDENTITY(1,1),
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_gasto DATE NOT NULL,
    comprobante_url VARCHAR(255) NULL,
    categoria_egreso VARCHAR(100) NOT NULL,
    metodo_retiro VARCHAR(50) NOT NULL CHECK (metodo_retiro IN ('Efectivo', 'Transferencia', 'Yape', 'Plin')),
    beneficiario VARCHAR(150) NOT NULL,
    id_usuario INT NOT NULL,

    -- Llave foránea
    CONSTRAINT FK_Egreso_Usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);
GO

-- ============================================
-- SCRIPT DE DATOS DE PRUEBA - CC_Arenales
-- ============================================
-- Insertar roles iniciales
INSERT INTO Rol (tipo_rol) VALUES ('Socio');
INSERT INTO Rol (tipo_rol) VALUES ('Tesorero');
INSERT INTO Rol (tipo_rol) VALUES ('Administrador');
GO

INSERT INTO Usuario (nombres, apellidos, dni, correo, contrasena, fecha_nacimiento, genero, nro_puesto, telefono, estado, id_rol)
VALUES 
    ('Carlos Jose', 'Mendoza Lara', '11111111', 'carlos.dir@email.com', '$2a$10$S/zkpjsyP7lZNr4b8uWFaOuaZPfGkN9KeQT6ttmKWZbq.WIJ2pt5u', '1980-05-15', 'Masculino', 10, '999111222', 1, 1), -- Socio
    ('Ana Maria', 'Suarez Bello', '22222222', 'ana.tes@email.com', '$2a$10$ux7q1iRII.hhFHs6kUKJHebi5lGr81NG1ewW5NxEeRKMBDXevFwp6', '1985-08-22', 'Femenino', 20, '999333444', 1, 2), -- Tesorero
    ('Admin Maestro', 'Bot Test', '33333333', 'corrtest.adm@email.com', '$2a$10$mj2TqSSoSv7qU59pd6V1TeFFLUjz1mre0CVxRYAQqQO.QX6qubZDW', '1995-10-10', 'Masculino', 30, '999555666', 1, 3); -- Administrador
GO

-- ============================================
-- SCRIPT DE CONSULTA - CC_Arenales
-- ============================================
SELECT * FROM Deuda
SELECT * FROM Egreso
SELECT * FROM Pago
SELECT * FROM Rol
SELECT * FROM Servicio
SELECT * FROM Usuario
