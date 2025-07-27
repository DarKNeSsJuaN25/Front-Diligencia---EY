# Documentación - Diligencia de Proveedores - FrontEnd React

# Visión General del Frontend

El frontend es una **Single Page Application (SPA)** interactiva que permite a los usuarios gestionar proveedores y lanzar procesos de *screening* a través de una interfaz de usuario intuitiva. Se conecta a la API de Diligencia de Proveedores para todas las operaciones de datos.

### Tecnologías Usadas

- **React:** Biblioteca principal para construir la interfaz de usuario.
- **Vite:** Herramienta de construcción de próxima generación que ofrece un desarrollo frontend ultrarrápido.
- **Gestión de Estado:** **React Hooks** (`useState`, `useEffect`) y el **Context API de React** para gestionar el estado de los componentes y el estado global de la aplicación, respectivamente.
- **Enrutamiento:** **React Router Dom** para manejar la navegación del lado del cliente entre las diferentes vistas de la aplicación.
- **Llamadas a API:** La **Fetch API** nativa de JavaScript se utiliza para todas las interacciones con el backend RESTful.
- **Diseño UI/UX:** **Material Design** (probablemente a través de una librería como Material UI o una implementación personalizada) para un diseño consistente y moderno de la interfaz de usuario.

# Estructura del Proyecto

### Carpetas Principales

- **`src/`**: Contiene todo el **código fuente de la aplicación React**. Aquí es donde se desarrolla la lógica de la UI, los componentes, las páginas, los servicios que interactúan con la API y la configuración.
    - **`src/pages/`**: Agrupa los **componentes principales de cada vista o pantalla** de la aplicación (ej., `LoginPage`, `ProviderListPage`).
    - **`src/components/`**: Contiene los **componentes React reutilizables** de la interfaz de usuario. Aquí encontrarás tanto componentes genéricos (`common/`) como específicos de cada funcionalidad (`providers/`) y los elementos de diseño (`SharedLayout/`).
    - **`src/services/`**: Módulos dedicados a la **comunicación con la API del backend**. Cada archivo aquí encapsula la lógica para interactuar con un recurso específico de la API (ej., `authService.jsx`, `providerService.jsx`).
    - **`src/context/`**: Aloja los **Contextos de React** que gestionan el estado global de la aplicación, como el `AuthContext` para la información de autenticación del usuario.
    - **`src/config/`**: Almacena **archivos de configuración** para la aplicación, como `apiConfig.jsx` que define las URLs del backend.
    - **`src/theme/`**: Define la **configuración del tema de Material Design**, asegurando una apariencia consistente en toda la aplicación.
    - **`src/utils/`**: Contiene **funciones de utilidad y helpers** que son reutilizables en diferentes partes de la aplicación.
- **`public/`**: Contiene **archivos estáticos** que se sirven directamente y se copian tal cual a la raíz de la compilación de producción. Aquí encontrarás activos como imágenes (`ey_logo.png`) y el crucial `web.config` para la configuración del servidor en Azure.
- **`dist/`**: Esta carpeta se **genera automáticamente** cuando compilas la aplicación para producción (`npm run build`). Contiene la versión optimizada y empaquetada del frontend, lista para ser desplegada.
- **`.github/`**: Contiene las **configuraciones de los flujos de trabajo de GitHub Actions** para la Integración Continua (CI) y el Despliegue Continuo (CD) de la aplicación en Azure.

### Archivos Clave en la Raíz

- **`package.json`**: Define el proyecto, sus scripts y todas las **dependencias de Node.js** (librerías que la aplicación necesita).
- **`vite.config.js`**: El archivo de configuración para **Vite**, la herramienta de construcción que usas para el desarrollo y la compilación.
- **`index.html`**: La plantilla HTML base de la Single Page Application.
- **`.env`**: Archivo para las **variables de entorno**, como la URL base de la API de backend.

## Flujo de Autenticación en el Frontend

La aplicación gestiona la autenticación del usuario usando el token JWT provisto por el backend.

1. **Login de Usuario:**
    - Cuando un usuario ingresa sus credenciales en la página de login (`/login`), el frontend envía una solicitud `POST` al endpoint `/api/auth/login` del backend.
    - Si las credenciales son válidas, el backend devuelve un **token JWT**, el `userId`, `email` y los `roles` del usuario.
2. **Almacenamiento del Token:**
    - El token JWT y la información del usuario (incluyendo roles) se almacenan de forma segura en el **localStorage** o **sessionStorage** del navegador.
    - Adicionalmente, esta información se guarda en un **estado global** (ej., usando `AuthContext`) para que sea accesible en toda la aplicación.
3. **Inclusión del Token en Solicitudes:**
    - Para todas las solicitudes subsiguientes a endpoints protegidos de la API, el frontend recupera el token del almacenamiento y lo incluye en el encabezado `Authorization` como `Bearer Token`.
    - Generalmente, esto se maneja centralmente en un **servicio de API** o un interceptor (si usas Axios).
4. **Rutas Protegidas:**
    - El enrutamiento (con React Router Dom) está configurado para **proteger rutas** (ej., `/providers`, `/providers/:id`). Si un usuario intenta acceder a una ruta protegida sin un token válido o con un rol insuficiente, será redirigido a la página de login.
    - El **estado de autenticación** se verifica al cargar la aplicación para determinar si el usuario ya está logueado.
5. **Cierre de Sesión (Logout):**
    - Al cerrar sesión, el token y la información del usuario se eliminan del almacenamiento del navegador y del estado global, y el usuario es redirigido a la página de login.

# Despliegue en Azure App Service

## **Compilación del Proyecto:**

- Antes de desplegar, se debe compilar la aplicación React para producción:
    
    `npm run build`
    
- Esto genera una carpeta `dist/` (por defecto de Vite) que contiene los archivos estáticos optimizados (`index.html`, CSS, JS, etc.).

## **Configuración de `web.config` para Rutas:**

- Para asegurar que el enrutamiento del lado del cliente funcione correctamente al recargar la página o al acceder directamente a una sub-ruta (evitando errores 404 en el servidor IIS de Azure App Service), es crucial incluir un archivo `web.config` en la carpeta `public/` del proyecto React.
- Este archivo debe contener reglas de reescritura para que todas las solicitudes que no correspondan a archivos estáticos existentes se redirijan a `index.html`.
- **Contenido de `public/web.config`:**
    
    ```xml
    <?xml version="1.0"?>
    <configuration>
      <system.webServer>
        <rewrite>
          <rules>
            <rule name="React Routes" stopProcessing="true">
              <match url=".*" />
              <conditions logicalGrouping="MatchAll">
                <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
              </conditions>
              <action type="Rewrite" url="/index.html" />
            </rule>
          </rules>
        </rewrite>
        <staticContent>
          <mimeMap fileExtension=".json" mimeType="application/json" />
          <remove fileExtension=".woff" />
          <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
          <remove fileExtension=".woff2" />
          <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
        </staticContent>
      </system.webServer>
    </configuration>
    ```
    

## **Despliegue:**

- La carpeta `dist/` (que ahora incluye `web.config`) se despliega en el Azure App Service configurado para el frontend.
- El despliegue es automatizado cuando se pushea en el github.
