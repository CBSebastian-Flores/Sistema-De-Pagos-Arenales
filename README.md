# Sistema de Gestión de Pagos y Recaudación - CC Arenales

Plataforma web integral diseñada para la administración financiera, control de recaudación por cuotas de mantenimiento, validación y liquidación de pagos, gestión de egresos y trazabilidad de acciones operativas para el Centro Comercial Arenales.

Proyecto concebido y desarrollado de forma colaborativa bajo marco de trabajo ágil (**Scrum**), priorizando una arquitectura desacoplada, control transaccional estricto y separación clara de responsabilidades.

---

## 🛠️ Tecnologías y Arquitectura

El sistema implementa una arquitectura cliente-servidor desacoplada (**SPA + RESTful API**):

### Backend
* **Lenguaje y Framework:** Java 21 con Spring Boot 3.x
* **Documentación de API:** SpringDoc OpenAPI / Swagger UI
* **Seguridad:** Spring Security con autenticación Stateless mediante JWT (JSON Web Tokens) y control granular de accesos por roles (`@PreAuthorize`)
* **Persistencia y ORM:** Spring Data JPA con Hibernate (`PhysicalNamingStrategyStandardImpl`)
* **Consultas Dinámicas:** JPA Specifications (`EgresoSpecification`) para filtros combinados y paginados[cite: 1]
* **Base de Datos:** Microsoft SQL Server / PostgreSQL (soporte híbrido mediante dialectos configurables)
* **Integraciones y Servicios Externos:**
  * Almacenamiento en la nube de comprobantes digitales mediante **Cloudinary API** (`StorageService`)[cite: 1]
  * Notificaciones automáticas por correo electrónico mediante **Gmail SMTP** (`EmailService`)[cite: 1]
  * Validación y consulta de documentos de identidad con **RENIEC API** (`ReniecService`)[cite: 1]

### Frontend
* **Framework:** React con Vite
* **Estilizado:** Tailwind CSS
* **Cliente HTTP:** Axios estructurado con interceptores para tokens JWT y captura centralizada de errores
* **Notificaciones:** React Toastify

---

## 🏛️ Estructura del Backend

```text
backend/src/main/java/com/arenales/

├── config/           # Seguridad (Spring Security), CORS, Swagger y filtros JWT
├── controllers/      # Endpoints REST expuestos para la SPA
├── dto/              # Clases DTO para validación estricta de entradas/salidas
├── entities/         # Modelos relacionales JPA (Mapeo de base de datos)
├── repositories/     # Interfaces JPA Repository
├── services/         # Interfaces de servicios de negocio
│   ├── AuditoriaService.java
│   ├── ComprobanteService.java
│   ├── DashboardService.java
│   ├── DeudaService.java
│   ├── EgresoService.java
│   ├── EmailService.java
│   ├── HistorialServicioService.java
│   ├── HistorialUsuarioService.java
│   ├── PagoService.java
│   ├── ReniecService.java
│   ├── RolService.java
│   ├── ServicioService.java
│   ├── StorageService.java
│   ├── UsuarioService.java
│   └── impl/         # Implementaciones de lógica y transacciones (@Service)
├── specifications/   # Filtros dinámicos de consulta (JPA Criteria / Specifications)
│   └── EgresoSpecification.java
└── StPagosApplication.java
```

---

## 🚀 Módulos Funcionales

* **Gestión de Cuotas y Obligaciones:** Generación y administración de conceptos fijos y variables para los puestos del centro comercial.
* **Validación y Liquidación de Pagos:** Registro de operaciones (efectivo y transferencias bancarias), recepción de comprobantes digitales con subida a Cloudinary, y validación/conciliación manual de estados de cuenta con actualización atómica de saldos.
* **Control y Fiscalización de Egresos:** Registro detallado de egresos con paginación desde el servidor y filtros dinámicos por rango de fechas, categorías y beneficiarios.
* **Trazabilidad y Auditoría:** Módulos de seguimiento para registrar modificaciones críticas en usuarios y cambios de tarifas o condiciones en el catálogo de servicios.
* **Notificaciones por Correo:** Envío automatizado de alertas de estado de pagos y avisos de cobranza vía Gmail SMTP.
* **Dashboard Analítico:** Visualización de métricas de recaudación, saldos pendientes y balance global de tesorería.

---

## 🔐 Matriz de Acceso por Roles

| Módulo / Funcionalidad | Administrador | Tesorero | Socio / Puesto |
| :--- | :---: | :---: | :---: |
| **Consulta de Pagos / Deudas Propias** | ✅ | ✅ | ✅ |
| **Validación y Aprobación de Pagos** | ✅ | ✅ | ❌ |
| **Registro y Control de Egresos** | ✅ | ✅ | ❌ |
| **Generación y Asignación de Cuotas** | ✅ | ✅ | ❌ |
| **Catálogo de Servicios y Conceptos** | ✅ | ✅ | ❌ |
| **Dashboard y Métricas** | ✅ | ✅ | ❌ |
| **Gestión y Registro de Usuarios** | ✅ | ❌ | ❌ |
| **Auditoría de Acciones y Servicios** | ✅ | ❌ | ❌ |

---

## ⚙️ Puesta en Marcha Local

### Prerrequisitos
* Java JDK 21 instalado
* Node.js v18+ y npm
* Microsoft SQL Server o PostgreSQL según la configuración elegida

---

### 1. Base de Datos
1. Abrir el gestor de base de datos (SSMS para SQL Server o DBeaver/pgAdmin para PostgreSQL).
2. Ejecutar el script `database/BD_CC_Arenales.sql`.
3. Confirmar la creación de las tablas base y registros iniciales.

---

### 2. Configuración del Backend (Spring Boot)
1. Ingresar al directorio del backend:
   cd backend

2. Configurar las variables de entorno en el sistema o en el archivo `.env` para resolver los valores en `src/main/resources/application.properties`:
   ```text
   DB_URL_SQL=jdbc:sqlserver://localhost:1433;databaseName=CC_Arenales;encrypt=true;trustServerCertificate=true;
   DB_USERNAME_SQL=tu_usuario_sql
   DB_PASSWORD_SQL=tu_password_sql
   MAIL_USERNAME=tu_correo@gmail.com
   MAIL_PASSWORD=tu_app_password_gmail
   RENIEC_API_TOKEN=tu_token_reniec
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

4. Ejecutar la aplicación:
   ./mvnw spring-boot:run

   * La API estará disponible en: http://localhost:8080/sistemapagoarenales
   * Documentación OpenAPI / Swagger: http://localhost:8080/sistemapagoarenales/swagger-ui.html

---

### 3. Configuración del Frontend (React + Vite)
1. Ingresar al directorio del frontend:
   cd ../frontend

2. Instalar dependencias:
   npm install

3. Iniciar el servidor de desarrollo:
   npm run dev

   * La interfaz web estará accesible en: http://localhost:5173
