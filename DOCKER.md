# Configuración de Docker para el Marco de Fotos Digital

Este documento explica cómo ejecutar la aplicación de Marco de Fotos Digital usando Docker.

## Inicio Rápido

### Usando Docker Compose (Recomendado)

1. **Copia la configuración del entorno:**
```bash
$ cp .env.example .env
 ```

2. **Edita el archivo .env con tu configuración:**
```bash
# Configuraciones esenciales - cámbialas por seguridad
SESSION_SECRET=your-secure-session-secret-here
ADMIN_PASSWORD=your-secure-admin-password
   
# Opcional: Cambia el puerto (el predeterminado es 3000)
HOST_PORT=8080  # Accede a la app en http://localhost:8080
```

3. **Inicia la aplicación:**
```bash
$ docker compose up -d
```

4. **Accede a la aplicación:**
   - Abre http://localhost:3000 en tu navegador (o el `HOST_PORT` que personalizaste).
   - Contraseña de administrador predeterminada: `admin123` (o la que hayas configurado en `ADMIN_PASSWORD`).

5. **Detén la aplicación:**
```bash
$ docker compose down
```

### Usando Docker Build (Manualmente)

1. **Construye la imagen:**
```bash
$ docker build -t digital-photo-frame .
```

2. **Ejecuta el contenedor:**
```bash
$ docker run -d \
   --name photo-frame \
   -p 3000:3000 \
   -e SESSION_SECRET=your-secure-session-secret \
   -v photo-uploads:/app/uploads \
   -v photo-data:/app/data \
   digital-photo-frame
```

## Configuración

### Ejemplos de Configuración Rápida

**Cambiar el Puerto:**
```bash
# Usa el puerto 8080 en lugar del 3000
$ echo "HOST_PORT=8080" >> .env
$ docker compose up -d
# Accede en http://localhost:8080
```

**Secure Admin Password:**
```bash
# Set custom admin password
$ echo "ADMIN_PASSWORD=MySecurePassword123!" >> .env
$ docker compose up -d
```

**Opciones Multiples:**
```ini
# .env file example
HOST_PORT=8080
ADMIN_PASSWORD=SecurePass123!
SESSION_SECRET=$(openssl rand -base64 32)
```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `HOST_PORT` | External port on host machine | No | 3000 |
| `CONTAINER_PORT` | Internal container port | No | 3000 |
| `NODE_ENV` | Node environment | No | production |
| `SESSION_SECRET` | Session encryption key | **Yes** | - |
| `ADMIN_PASSWORD` | Admin login password | **Recommended** | admin123 |
| `GOOGLE_CLIENT_ID` | Google Photos API client ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google Photos API secret | No | - |
| `GOOGLE_REDIRECT_URI` | Google OAuth redirect URI | No | - |

### Volumenes

La configuracion de docker configura los siguientes volumenes:

- **photo-uploads**: Guarda las imagenes cargadas por los invitados (`/app/uploads`)
- **photo-data**: Guarda los datos de la aplicacion (`/app/data`)
- **photo-logs**: Guarda los registros de la aplicacion (`/app/logs`)

### Password Security

The application supports both plain text and bcrypt hashed passwords:

**En texto plano (para el entorno de desarrollo):**
```ini
ADMIN_PASSWORD=MyPassword123
```

**En hash tipo Bcrypt para producción:**
```bash
# Generate bcrypt hash (example using Node.js)
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('MyPassword123', 10))"
# Copy the output to .env
ADMIN_PASSWORD=$2b$10$xyz...  # Your bcrypt hash
```

### ⚠️ **Advertencia de Seguridad:** La Contraseña por default es `admin123` si no se define ninguna en el archivo `.env` en la variable `ADMIN_PASSWORD`.

## Revision de Salud

El contenedor incluye un chequeo de salud que verifica si la aplicacion esta respondiendo:

```bash
# Check container health
$ docker compose ps

# Test health endpoint directly
$ curl http://localhost:3000/api/health
```

## Troubleshooting

### El contenenedor no inicia:
- Revisa si el puerto 3000 esta disponible y/o protegido por firewall.
- Verifica que las variables de entorno fueron definidas correctamente.
- Revisa los registros del contenedor: `docker compose logs photo-frame`

### Imagenes no persistentes o perdida de las imagenes al reiniciar el contenedor:
- Asegurar que los volumenes fueron creados.
- Asegurar que los volumenes fueron montados correctamente en las rutas especificadas.
- Revisar los permisos de los volumenes: `docker compose exec photo-frame ls -la /app/uploads`

### Integracion con Google Photos:
###### NOTA: Esta  funcion tal vez sea removida puesto que no le encuentro un uso para las metas que tiene este proyecto.
- Asegurar la integracion de Google Photos este comunicandose correctamente.
- Verificar las credenciales de Google OAuth este correctamente declaradas en `.env`
- Revisar que la URI actual y la declarada concuerden correctamente.
- Revisar los registros del contenedor por errores de autenticacion.

## Desarrollo

Para desarrollo, se aceptan sugerencias directamente al correo, no se le dara acceso por el momento y tal vez 
jamas al proyecto a nadie, tampoco se responderan ISSUES estaran desactivados.