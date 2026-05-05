## 🛠️ Configuración e Instalación

### Requisitos Previos
*   **Node.js** (v18 o superior)
*   **Java JDK 21**
*   **Maven**
*   **SQL Server Management Studio (SSMS)**

### 🖥️ Ejecución del Frontend (React + Vite)
Para levantar la interfaz de usuario, sigue estos pasos desde la terminal:

1.  **Entrar a la carpeta:**
    ```bash
    cd frontend
    ```
2.  **Instalar las librerías necesarias:**
    ```bash
    npm install
    ```
3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    *   *Por defecto, la aplicación será accesible en http://localhost:5173*

### ⚙️ Ejecución del Backend (Spring Boot)
1.  **Entrar a la carpeta:**
    ```bash
    cd backend
    ```
2.  **Configurar credenciales:** 
    Modifica el archivo `src/main/resources/application.properties` con tus datos de SQL Server.
3.  **Ejecutar el proyecto con Maven:**
    
```bash
    ./mvnw spring-boot:run
    ```
    *   *La API estará disponible en http://localhost:8080*
