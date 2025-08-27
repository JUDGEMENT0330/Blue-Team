# Guía de Despliegue - Cyber Audit Platform

Esta guía proporciona instrucciones para desplegar la aplicación en GitHub y en un entorno de hosting como Hostinger.

## Estructura del Proyecto

- `/client`: Aplicación frontend creada con React, Vite y TypeScript.
- `/server`: Aplicación backend creada con Node.js, Express y TypeScript.

---

## 1. Despliegue en GitHub

Para subir tu proyecto a un repositorio de GitHub, sigue estos pasos:

1.  **Inicializa Git:**
    ```bash
    git init
    git branch -M main
    ```

2.  **Crea un archivo `.gitignore`:**
    Asegúrate de tener un archivo `.gitignore` en la raíz de tu proyecto para excluir `node_modules` y otros archivos innecesarios. Debería contener al menos:

    ```
    # Dependencias
    node_modules/
    /client/node_modules
    /server/node_modules

    # Archivos de build
    /client/dist
    /server/dist

    # Logs
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*

    # Archivos de entorno
    .env
    ```

3.  **Añade y confirma tus archivos:**
    ```bash
    git add .
    git commit -m "Initial commit: Setup functional cyber audit platform"
    ```

4.  **Conecta tu repositorio remoto y sube los cambios:**
    Reemplaza `<TU_URL_DE_REPOSITORIO>` con la URL de tu repositorio de GitHub.
    ```bash
    git remote add origin <TU_URL_DE_REPOSITORIO>
    git push -u origin main
    ```

---

## 2. Despliegue en Hostinger

El despliegue en Hostinger requiere dos partes: desplegar el **frontend estático** y el **backend de Node.js**.

### Parte A: Desplegar el Frontend (Client)

La aplicación de React se compila como un conjunto de archivos estáticos (HTML, CSS, JS) que pueden ser alojados fácilmente.

1.  **Compila la aplicación de React:**
    Navega al directorio del cliente y ejecuta el comando de build.
    ```bash
    cd client
    npm run build
    ```
    Esto creará una carpeta `dist` dentro de `/client` con los archivos listos para producción.

2.  **Sube los archivos a Hostinger:**
    - Accede al panel de control de Hostinger.
    - Ve al **Administrador de Archivos** (`File Manager`).
    - Navega a la carpeta raíz de tu dominio (normalmente `public_html`).
    - Sube **el contenido** de la carpeta `client/dist` a `public_html`.

3.  **Configuración Adicional (para React Router):**
    Como la aplicación usa React Router, necesitas redirigir todas las peticiones al `index.html` para que el enrutamiento del lado del cliente funcione. Crea o edita el archivo `.htaccess` en tu carpeta `public_html` con el siguiente contenido:
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteCond %{REQUEST_FILENAME} !-l
      RewriteRule . /index.html [L]
    </IfModule>
    ```

### Parte B: Desplegar el Backend (Server)

Hostinger (en planes de hosting compartido) no es ideal para aplicaciones Node.js. Necesitarás un plan **VPS (Servidor Privado Virtual)** para tener control total sobre el entorno.

1.  **Prepara tu aplicación de Node.js:**
    - **Actualiza la URL de la API en el cliente:** Antes de compilar el cliente, asegúrate de que la variable `API_URL` en `client/src/App.tsx` apunta a tu dominio de producción donde residirá el backend (ej: `https://api.tudominio.com/api`).
    - **Compila el servidor:**
        ```bash
        cd server
        npm run build
        ```
        Esto generará una carpeta `dist` en `/server`.

2.  **Sube los archivos del servidor a tu VPS:**
    - Conéctate a tu VPS mediante **SSH**.
    - Crea un directorio para tu aplicación (ej: `/var/www/cyber-audit-api`).
    - Sube el contenido de la carpeta `/server` (incluyendo `dist`, `package.json`, y `node_modules`) a este directorio.

3.  **Instala dependencias y ejecuta el servidor:**
    - En tu VPS, navega al directorio de la aplicación:
        ```bash
        cd /var/www/cyber-audit-api
        npm install --production
        ```
    - **Usa un gestor de procesos (PM2):** PM2 es una herramienta que mantendrá tu aplicación de Node.js corriendo de forma continua.
        ```bash
        npm install pm2 -g
        pm2 start dist/index.js --name "cyber-audit-api"
        ```

4.  **Configura un Reverse Proxy (con Nginx o Apache):**
    Para que tu API sea accesible a través de un dominio (ej: `api.tudominio.com`), configura un reverse proxy. Esto redirigirá las peticiones de tu dominio al puerto donde corre tu aplicación (en este caso, el puerto 5000).

    **Ejemplo de configuración de Nginx:**
    Crea un nuevo archivo de configuración en `/etc/nginx/sites-available/api.tudominio.com`:
    ```nginx
    server {
        listen 80;
        server_name api.tudominio.com;

        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    Luego, habilita el sitio y reinicia Nginx.

---

### Alternativa: WP Headless

La mención de "WP Headless" implica una arquitectura diferente. En ese caso, WordPress serviría como backend (a través de su API REST o GraphQL), y tu frontend de React consumiría los datos desde WordPress. El proyecto actual **no** sigue esta arquitectura; utiliza un backend de Node.js personalizado.

Para usar un enfoque headless con Hostinger:
1.  Instalarías WordPress en tu plan de hosting.
2.  Usarías la API REST de WordPress para gestionar tu contenido (auditorías, escaneos, etc.).
3.  Tu frontend de React se desplegaría como un sitio estático (como en la Parte A) y obtendría los datos de tu instalación de WordPress en lugar del servidor de Node.js.
