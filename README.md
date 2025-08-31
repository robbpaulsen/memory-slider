# Marco de Fotos Digital para Eventos Sociales

Esta es una versión adaptada de la aplicación de marco de fotos digital, diseñada específicamente para ser utilizada en eventos sociales. Permite a los invitados subir fotos fácilmente a través de un código QR, que se añaden al instante a una presentación de diapositivas continua.

## 🌟 Características Principales

-   **Subida de Fotos por QR:** Los invitados escanean un código QR para acceder a una página de subida simple, sin necesidad de credenciales.
-   **Presentación Automática:** La aplicación inicia una presentación de diapositivas en bucle en cuanto se sube la primera imagen.
-   **Actualización en Tiempo Real:** El slideshow busca nuevas imágenes cada 3 minutos y las añade a la cola de reproducción de forma aleatoria.
-   **Directorio Único:** Todas las imágenes se gestionan en una única carpeta (`evento`) para simplificar la configuración.
-   **Sin Límites:** No hay restricciones en el tamaño o la resolución de las imágenes subidas.
-   **Despliegue Sencillo con Docker:** Optimizado para un despliegue rápido en dispositivos como un Raspberry Pi.

## 🚀 Despliegue Rápido con Docker

Sigue estos pasos para desplegar la aplicación en tu dispositivo (ej. Raspberry Pi).

### Prerrequisitos

-   Tener [Docker](https://docs.docker.com/engine/install/) y [Docker Compose](https://docs.docker.com/compose/install/) instalados en el dispositivo.

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/sorbh/digital-photo-frame.git
cd digital-photo-frame
```

### Paso 2: Configurar el Entorno

Dentro del directorio `server/`, crea un archivo llamado `.env` a partir del ejemplo proporcionado.

```bash
cd server
cp .env.example .env
```

Abre el archivo `.env` con un editor de texto (como `nano`) y asegúrate de que las siguientes variables estén configuradas. **Es crucial que establezcas una contraseña de administrador segura.**

```env
# Server Configuration
PORT=3000

# Environment
NODE_ENV=production

# Authentication - ¡CAMBIA ESTOS VALORES!
ADMIN_PASSWORD=tu_contraseña_segura_aqui
SESSION_SECRET=genera_una_clave_secreta_aleatoria_de_32_caracteres

# Upload Configuration (los límites han sido eliminados en el código)
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Image Processing
IMAGE_QUALITY=85
MAX_RESOLUTION_WIDTH=1080
MAX_RESOLUTION_HEIGHT=1090

# Slideshow Configuration
DEFAULT_SLIDESHOW_INTERVAL=15000 # Intervalo en milisegundos (15 segundos)

# Default Folders
DEFAULT_FOLDERS=evento
```

### Paso 3: Desplegar la Aplicación

Regresa al directorio raíz del proyecto (donde se encuentra `docker-compose.yml`) y ejecuta el siguiente comando:

```bash
cd ..
docker compose up --build -d
```

Este comando construirá la imagen de Docker y ejecutará la aplicación en segundo plano (`-d`).

##  Uso

Una vez desplegada, la aplicación estará accesible en la red local de tu dispositivo.

1.  **Acceder al Slideshow:**
    *   Abre un navegador web en la pantalla del evento (ej. la TV conectada al Raspberry Pi) y navega a `http://<IP_DEL_DISPOSITIVO>:3000`.
    *   La presentación de diapositivas comenzará automáticamente.

2.  **Subir Fotos (Invitados):**
    *   Genera un **código QR** que apunte a la siguiente URL: `http://<IP_DEL_DISPOSITIVO>:3000/qr-upload`.
    *   Imprime este código QR y colócalo en un lugar visible para los invitados.
    *   Al escanearlo, los invitados serán llevados a una página donde podrán seleccionar y subir sus fotos directamente al evento.

3.  **Acceso de Administrador:**
    *   Para gestionar la aplicación, puedes acceder al panel de administración en `http://<IP_DEL_DISPOSITIVO>:3000/admin`.
    *   Usa la contraseña que estableciste en el archivo `.env`.

## 🛠️ Pila Tecnológica

-   **Backend:** Node.js, Express
-   **Frontend:** HTML, CSS, JavaScript (sin frameworks)
-   **Procesamiento de Imágenes:** Sharp
-   **Contenerización:** Docker, Docker Compose
