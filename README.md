Sistema de Gestión de Pagos - Mercado Arenales
Este proyecto es una plataforma SaaS Multi-tenant diseñada para la gestión financiera y de tesorería del Mercado Arenales en Lima, Perú. Permite la digitalización de comprobantes, control de ingresos/egresos por puesto y monitoreo analítico mediante un dashboard.

🚀 Tecnologías Utilizadas
El sistema utiliza un stack tecnológico moderno enfocado en la escalabilidad y el rendimiento:

Backend: Java 21 con Spring Boot 3.x y Spring Security (JWT).

Frontend: React.js + Vite, utilizando Tailwind CSS para el diseño de interfaz.

Base de Datos: Microsoft SQL Server (SSMS).

Infraestructura: AWS (para despliegues de API).

Gestión: Jira (Scrum) y GitHub para control de versiones.

📂 Estructura del Proyecto
Plaintext
/SISTEMA-DE-PAGOS-ARENALES
│
├── /frontend              # Aplicación React + Vite (Interfaz de usuario)
├── /backend               # API RESTful en Spring Boot (Lógica de negocio)
├── /database              # Scripts DDL/DML de SQL Server y Modelos (ER)
└── README.md              # Documentación principal
🛠️ Configuración e Instalación
Requisitos Previos
Node.js (v18 o superior)

Java JDK 21

Maven

SQL Server Management Studio (SSMS)

Pasos para el Frontend
Entrar a la carpeta: cd frontend

Instalar dependencias: npm install

Ejecutar en desarrollo: npm run dev

Pasos para el Backend
Entrar a la carpeta: cd backend

Configurar las credenciales de SQL Server en src/main/resources/application.properties.

Ejecutar el proyecto: ./mvnw spring-boot:run

Base de Datos
Ejecutar los scripts ubicados en /database en su instancia local de SQL Server para crear las tablas de Usuarios, Rol y configuraciones de integridad.

📋 Funcionalidades del Sprint 1
Módulo de Autenticación: Login seguro mediante JWT.

Gestión de Usuarios: Registro de socios con validación de DNI y asignación de puestos.

Arquitectura Base: Configuración del Layout principal con Sidebar y navegación mediante rutas.

👥 Equipo de Desarrollo
Arquitecto / Líder Técnico: Christian Bruno Sebastian Flores Salas.

Product Owner: Franco.

Notas de Arquitectura
Flujo de Git: Se ha implementado una política de protección de ramas en main. Todo cambio debe realizarse mediante Pull Requests y requiere aprobación previa para asegurar la integridad del código.

Seguridad: Las contraseñas se almacenan mediante hash (BCrypt) y la comunicación entre Front y Back está protegida contra ataques comunes.
