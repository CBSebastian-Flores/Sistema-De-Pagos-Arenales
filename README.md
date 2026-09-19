# Sistema de Gestión de Pagos y Recaudación - CC Arenales

Plataforma web integral diseñada para la administración financiera, control de recaudación por cuotas de mantenimiento, validación y liquidación de pagos, gestión de egresos y trazabilidad de acciones operativas para el Centro Comercial Arenales.

Proyecto concebido y desarrollado de forma colaborativa bajo marco de trabajo ágil (**Scrum**), priorizando una arquitectura desacoplada, control transaccional estricto y separación clara de responsabilidades.

---

## 🛠️ Tecnologías y Arquitectura

El sistema implementa una arquitectura cliente-servidor desacoplada (**SPA + RESTful API**):

### **Backend**
* **Lenguaje y Framework:** Java 21 con Spring Boot 3.x / 4
* **Seguridad:** Spring Security con autenticación Stateless mediante JWT (JSON Web Tokens) y control granular de accesos por roles (`@PreAuthorize`)
* **Persistencia y ORM:** Spring Data JPA con Hibernate
* **Consultas Dinámicas:** JPA Specifications (`EgresoSpecification`) para filtros combinados y paginados
* **Base de Datos:** Microsoft SQL Server
* **Integraciones y Servicios:**
  * Almacenamiento y gestión de comprobantes digitales (`StorageService`)
  * Notificaciones automáticas por correo electrónico (`EmailService`)
  * Validación de identidad y consulta de documentos (`ReniecService`)

### **Frontend**
* **Framework:** React con Vite
* **Estilizado:** Tailwind CSS
* **Cliente HTTP:** Axios estructurado con interceptores para tokens JWT y captura centralizada de errores
* **Notificaciones:** React Toastify

---

## 🏛️ Estructura del Backend

```text
backend/src/main/java/com/arenales/
├── config/           # Seguridad (Spring Security), CORS y filtros JWT
├── controllers/      # Endpoints REST expuestos para la SPA
├── dto/              # Clases DTO para validación estricta de entradas/salidas
├── entities/         # Modelos relacionales JPA (Mapeo de base de datos)
├── repositories/     # Interfaces JPA Repository
├── services/         # Interfaces de servicios de negocio
│   ├── impl/         # Implementaciones de lógica y transacciones
├── specifications/   # Filtros dinámicos de consulta (JPA Criteria / Specifications)
└── StPagosApplication.java
