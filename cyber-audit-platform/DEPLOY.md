# Guía de Despliegue - Cyber Audit Platform

Esta guía proporciona instrucciones para ejecutar y desplegar la aplicación **Cyber Audit Platform** utilizando Docker.

## Estructura del Proyecto

- `/client`: Aplicación frontend creada con React, Vite y TypeScript, servida con Nginx.
- `/server`: Aplicación backend creada con Node.js, Express y TypeScript.
- `docker-compose.yml`: Archivo para orquestar los contenedores de cliente y servidor.

---

## 1. Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (generalmente incluido con Docker Desktop)

---

## 2. Desarrollo y Ejecución Local

El proyecto está completamente contenerizado, lo que facilita su ejecución en cualquier entorno con un solo comando.

1.  **Clona el Repositorio:**
    ```bash
    git clone <TU_URL_DE_REPOSITORIO>
    cd cyber-audit-platform
    ```

2.  **Configura las Variables de Entorno:**
    El proyecto utiliza archivos `.env` para la configuración. Hemos incluido archivos de ejemplo.
    - **Para el cliente:** Revisa `client/.env.example`. No se necesita configuración inicial para el desarrollo local.
    - **Para el servidor:** Revisa `server/.env.example`. La configuración por defecto permite la comunicación desde el cliente local.

3.  **Levanta los Contenedores:**
    Desde la raíz del directorio `cyber-audit-platform`, ejecuta el siguiente comando:
    ```bash
    docker-compose up --build
    ```
    - `--build`: Este flag reconstruye las imágenes de Docker si ha habido cambios en el código (ej., en un `Dockerfile` o en el código fuente).
    - La primera vez, Docker descargará las imágenes base y construirá los contenedores, lo que puede tardar unos minutos.

4.  **Accede a la Aplicación:**
    - **Frontend (Cliente):** Abre tu navegador y visita [http://localhost:8080](http://localhost:8080)
    - **Backend (Servidor):** La API estará disponible en [http://localhost:5000](http://localhost:5000)

5.  **Para detener la aplicación:**
    Presiona `Ctrl + C` en la terminal donde se está ejecutando `docker-compose`. Para eliminar los contenedores, puedes ejecutar:
    ```bash
    docker-compose down
    ```

---

## 3. Despliegue en Producción (VPS o Cloud)

La contenerización simplifica enormemente el despliegue. En lugar de configurar Node.js, Nginx y PM2 manualmente, solo necesitas desplegar los contenedores.

### Paso 1: Construir y Subir las Imágenes de Docker

Puedes construir las imágenes en tu máquina local o en un servidor de CI/CD y subirlas a un registro de contenedores como [Docker Hub](https://hub.docker.com/) o [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

```bash
# Inicia sesión en tu registro de contenedores
docker login

# Construye y etiqueta las imágenes (reemplaza 'tu-usuario' con tu nombre de usuario del registro)
docker-compose build
docker tag cyber_audit_client tu-usuario/cyber-audit-client:latest
docker tag cyber_audit_server tu-usuario/cyber-audit-server:latest

# Sube las imágenes al registro
docker push tu-usuario/cyber-audit-client:latest
docker push tu-usuario/cyber-audit-server:latest
```

### Paso 2: Desplegar en un Servidor (VPS)

1.  **Conéctate a tu VPS por SSH.**
2.  **Instala Docker y Docker Compose** si no lo has hecho ya.
3.  **Crea un archivo `docker-compose.prod.yml`:**
    Este archivo será similar al `docker-compose.yml` local, pero usará las imágenes que subiste al registro y contendrá la configuración de producción.

    ```yaml
    version: '3.8'

    services:
      server:
        image: tu-usuario/cyber-audit-server:latest
        restart: always
        ports:
          - "5000:5000"
        environment:
          # Asegúrate de que el origen CORS apunte a tu dominio de producción
          CORS_ORIGIN: https://tu-dominio.com
        networks:
          - app-network

      client:
        image: tu-usuario/cyber-audit-client:latest
        restart: always
        ports:
          - "80:80" # Sirve en el puerto 80 estándar
        depends_on:
          - server
        networks:
          - app-network

    networks:
      app-network:
        driver: bridge
    ```
    **Nota:** En un entorno de producción real, probablemente querrás poner un **Reverse Proxy** (como Nginx o Traefik) delante de tus contenedores para gestionar el tráfico, los dominios y los certificados SSL.

4.  **Inicia la aplicación en tu VPS:**
    ```bash
    docker-compose -f docker-compose.prod.yml up -d
    ```
    - `-f`: Especifica el archivo de compose de producción.
    - `-d`: Ejecuta los contenedores en modo "detached" (en segundo plano).
