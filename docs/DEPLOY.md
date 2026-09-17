# Guia de Despliegue - Medición del Atleta de Hapkido

> Aplicación 100% estática (HTML + CSS + JS). No requiere compilación, build step ni servidor del lado del servidor.

---

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Desarrollo Local](#desarrollo-local)
- [GitHub Pages](#github-pages)
- [Hosting Estático (Netlify, Vercel, Apache, Nginx)](#hosting-estático)
- [PWA y HTTPS](#pwa-y-https)
- [Actualizaciones](#actualizaciones)
- [Gestión de Versiones y Cache Busting](#gestión-de-versiones-y-cache-busting)

---

## Requisitos Previos

- No se necesita Node.js, npm ni ninguna herramienta de build.
- Todos los dependencias están incluidas localmente en la carpeta `vendor/` (Chart.js, FontAwesome, fuentes).
- Solo necesitas un navegador web y un servidor HTTP estático.

---

## Desarrollo Local

### Opción 1: Abrir `index.html` directamente

Doble clic en `index.html` desde el explorador de archivos. Funciona para pruebas rápidas pero **no soporta Service Workers** (requiere HTTP).

### Opción 2: Servidor local (recomendado)

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Node.js (sin instalar nada)
npx serve .

# PHP
php -S localhost:8080
```

Abrir `http://localhost:8080` en el navegador. Esto permite probar la funcionalidad PWA completa incluyendo el Service Worker y la instalación como app.

---

## GitHub Pages

### Paso a paso

1. **Subir el código a GitHub**
   ```bash
   git add .
   git commit -m "Despliegue inicial"
   git push origin main
   ```

2. **Activar GitHub Pages**
   - Ir a **Settings** > **Pages** en el repositorio.
   - En **Source**, seleccionar la rama `main` y la carpeta `/ (raiz)`.
   - Hacer clic en **Save**.

3. **Esperar la propagación**
   - GitHub Pages tarda 1-3 minutos en estar disponible.
   - La URL será: `https://<usuario>.github.io/<nombre-repositorio>/`

4. **Configurar el scope del PWA (opcional)**
   Si el repositorio tiene un nombre (no está en la raíz del usuario), ajustar el `scope` en `manifest.json`:
   ```json
   "start_url": "./index.html",
   "scope": "./"
   ```
   Esto ya está configurado correctamente para subdirectorios.

### Limitaciones de GitHub Pages

- Solo sirve archivos estáticos (este proyecto es 100% estático, no hay problema).
- No soporta headers personalizados de seguridad (CSP está en el HTML vía meta tag).
- El dominio no tiene HTTPS personalizado (usa el de `github.io` que ya es HTTPS).

---

## Hosting Estático

Cualquier servicio de hosting estático funciona. Ejemplos:

### Netlify

1. Arrastrar y soltar la carpeta del proyecto en [app.netlify.com](https://app.netlify.com).
2. O conectar el repositorio de GitHub para deploy automático.

### Vercel

1. Instalar CLI: `npm i -g vercel`
2. Ejecutar `vercel` desde la carpeta del proyecto.
3. Siga las instrucciones en pantalla.

### Apache / Nginx (servidor propio)

Copiar todos los archivos del proyecto a la carpeta de documento raíz del servidor web.

**Apache** (`/etc/apache2/sites-available/hapkido.conf`):
```apache
<VirtualHost *:443>
    ServerName hapkido.ejemplo.com
    DocumentRoot /var/www/hapkido

    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/hapkido.crt
    SSLCertificateKeyFile /etc/ssl/private/hapkido.key

    <Directory /var/www/hapkido>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Nginx** (`/etc/nginx/sites-available/hapkido`):
```nginx
server {
    listen 443 ssl;
    server_name hapkido.ejemplo.com;
    root /var/www/hapkido;
    index index.html;

    ssl_certificate /etc/ssl/certs/hapkido.crt;
    ssl_certificate_key /etc/ssl/private/hapkido.key;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## PWA y HTTPS

El Service Worker (`sw.js`) y la instalación como Progressive Web App **requieren HTTPS** (o `localhost` para desarrollo).

- **GitHub Pages**: Ya provee HTTPS automáticamente.
- **Netlify / Vercel**: Ya incluyen HTTPS.
- **Servidor propio**: Configurar un certificado SSL (Let's Encrypt es gratuito).
- **Desarrollo local**: `localhost` y `127.0.0.1` están exentos del requisito HTTPS.

### Funcionalidades PWA

- **Modo offline**: La app funciona 100% sin internet después de la primera carga.
- **Instalación**: Los usuarios pueden "instalar" la app desde el navegador.
- **Iconos**: Incluye iconos para diferentes resoluciones y máscaras.
- **Service Worker**: Cachea automáticamente el shell de la aplicación.

---

## Actualizaciones

### Cómo funciona

1. Modificar los archivos necesarios.
2. Hacer push a la rama `main`.
3. GitHub Pages (o el hosting configurado) sirve los nuevos archivos.
4. **Los usuarios con la app abierta** recibirán la actualización al recargar la página o al cerrar y volver a abrir.
5. El Service Worker detecta cambios y descarga la versión nueva automáticamente (estrategia Network-First para archivos de aplicación).

### Forzar actualización

Si un usuario tiene una versión cacheada y no actualiza:
- Recargar con `Ctrl + Shift + R` (hard refresh).
- La app también se actualiza sola al detectar que hay una nueva versión del Service Worker.

---

## Gestión de Versiones y Cache Busting

### Estrategia actual: Query strings

Los archivos CSS se cargan con un query string de versión:

```html
<link rel="stylesheet" href="styles.css?v=20260901-2">
```

Cuando se modifique `styles.css`, actualizar el query string:

```html
<link rel="stylesheet" href="styles.css?v=20260902-1">
```

Esto fuerza al navegador a descargar la nueva versión ignorando la caché.

### Service Worker

El Service Worker maneja su propia caché con un nombre de versión:

```javascript
const CACHE_NAME = 'hapkido-tracker-v20260901-23';
```

Al modificar el Service Worker, actualizar la versión para forzar la invalidación:

```javascript
const CACHE_NAME = 'hapkido-tracker-v20260902-1';
```

### Convención de versionado

Se usa el formato `YYYYMMDD-N` donde:
- `YYYYMMDD`: Fecha del cambio.
- `N`: Número secuencial del día (1, 2, 3...).

Ejemplo: `20260901-2` = 1 de septiembre de 2026, segunda versión del día.

### Archivos que requieren actualización del Service Worker

Al agregar un archivo nuevo al proyecto, agregarlo a la lista `CORE_ASSETS` en `sw.js` para que se cachee correctamente.

---

## Notas Adicionales

- Los datos se almacenan en `localStorage` del navegador. No hay base de datos server-side.
- La sincronización con la nube es opcional y se configura desde la interfaz (requiere API key).
- Ver `docs/API_SYNC.md` para documentación del protocolo de sincronización.
