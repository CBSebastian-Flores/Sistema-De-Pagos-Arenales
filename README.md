# Sistema de Pagos Arenales

Sistema web para la gestión de pagos del Centro Comercial Arenales, desarrollado con React + Spring Boot + SQL Server.

---

## 🛠️ Tecnologías utilizadas

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Axios
- React Toastify

**Backend**
- Java 21
- Spring Boot 4
- Hibernate / JPA

**Base de datos**
- SQL Server (SSMS)

---

## ⚙️ Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [JDK 21](https://adoptium.net/)
- [Maven](https://maven.apache.org/)
- [SQL Server](https://www.microsoft.com/es-es/sql-server)
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/es-es/sql/ssms/download-sql-server-management-studio-ssms)
- [VS Code](https://code.visualstudio.com/) con extensiones:
  - Extension Pack for Java
  - Spring Boot Extension Pack

---

## 🗄️ Configuración de la base de datos

1. Abre **SSMS** y conéctate a tu instancia de SQL Server
2. Abre el archivo `BD_CC_Arenales.sql` ubicado en la raíz del proyecto
3. Ejecuta el script completo
4. Verifica que la base de datos `CC_Arenales` fue creada con las tablas `Rol` y `Usuarios`

---

## 🚀 Configuración e Instalación

### 🖥️ Ejecución del Frontend (React + Vite)

1. **Entrar a la carpeta:**
```bash
    cd frontend
```
2. **Instalar las librerías necesarias:**
```bash
    npm install
```
3. **Iniciar el servidor de desarrollo:**
```bash
    npm run dev
```
    *Por defecto, la aplicación será accesible en http://localhost:5173*

### ⚙️ Ejecución del Backend (Spring Boot)

1. **Entrar a la carpeta:**
```bash
    cd backend
```
2. **Configurar credenciales:**
   Modifica el archivo `src/main/resources/application.properties` con tus datos de SQL Server:
```properties
    spring.datasource.username=TU_USUARIO
    spring.datasource.password=TU_CONTRASEÑA
```
3. **Ejecutar el proyecto:**
```bash
    ./mvnw spring-boot:run
```
    *La API estará disponible en http://localhost:8080/sistemapagoarenales*

---

## 📁 Estructura del proyecto

```
Sistema-De-Pagos-Arenales/
├── backend/
│   └── src/main/java/com/arenales/
│       ├── config/           # Configuración CORS y seguridad
│       ├── controllers/      # Endpoints REST
│       ├── dto/              # Objetos de transferencia de datos
│       ├── entities/         # Entidades JPA
│       ├── repositories/     # Repositorios JPA
│       └── services/         # Lógica de negocio
├── frontend/
│   └── src/
│       ├── components/       # RegisterForm, Sidebar, Layout
│       ├── services/         # authService.js (Axios)
│       └── utils/            # validaciones.js (Regex)
└── BD_CC_Arenales.sql        # Script de creación de base de datos
```

---

## 📋 Tareas completadas

| ID | Descripción | Estado |
|---|---|---|
| SDPA-23 | Maquetado del formulario de registro con Tailwind CSS | ✅ |
| SDPA-24 | Validación de campos con Regex en el cliente | ✅ |
| SDPA-25 | Integración Axios + React Toastify + conexión con backend | ✅ |

---

## 👥 Equipo

- **Yo5h1** — Frontend (React + Tailwind)