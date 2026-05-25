# Sistema de Pagos Arenales

Sistema web para la gestión de pagos del Centro Comercial Arenales, desarrollado con React + Spring Boot + SQL Server.

---

## 🛠️ Tecnologías utilizadas

**Frontend**
- React 19 + Vite
- Tailwind CSS
- Axios
- React Toastify

**Backend**
- Java 21
- Spring Boot 4
- Hibernate / JPA
- JWT (JSON Web Tokens)
- Spring Security

**Base de datos**
- SQL Server (SSMS)

---

## ⚙️ Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [JDK 21](https://adoptium.net/)
- [SQL Server](https://www.microsoft.com/es-es/sql-server)
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/es-es/sql/ssms/download-sql-server-management-studio-ssms)
- [VS Code](https://code.visualstudio.com/) con extensiones:
  - Extension Pack for Java
  - Spring Boot Extension Pack

---

## 🗄️ Configuración de la base de datos

1. Abre **SSMS** y conéctate a tu instancia de SQL Server
2. Abre el archivo `BD_CC_Arenales.sql` ubicado en la carpeta `database/`
3. Ejecuta el script completo
4. Verifica que la base de datos `CC_Arenales` fue creada con las tablas `Rol` y `Usuario`

---

## 🚀 Configuración e Instalación

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
3. **Ejecutar el proyecto desde VS Code:**
   Abre `src/main/java/com/arenales/StPagosApplication.java` y haz clic en **▶ Run**

   *La API estará disponible en http://localhost:8080/sistemapagoarenales*

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

---

## 📁 Estructura del proyecto

```
Sistema-De-Pagos-Arenales/
├── backend/
│   └── src/main/java/com/arenales/
│       ├── config/           # Configuración CORS, seguridad y JWT
│       ├── controllers/      # Endpoints REST
│       ├── dto/              # Objetos de transferencia de datos
│       ├── entities/         # Entidades JPA
│       ├── repositories/     # Repositorios JPA
│       ├── services/         # Lógica de negocio
│       └── utils/            # Utilidades JWT
├── frontend/
│   └── src/
│       ├── components/       # RegisterForm, Sidebar, Layout
│       ├── pages/            # Login
│       ├── services/         # authService, loginService, axiosConfig
│       └── utils/            # validaciones.js (Regex)
└── database/
    └── BD_CC_Arenales.sql    # Script de creación de base de datos
```

---
