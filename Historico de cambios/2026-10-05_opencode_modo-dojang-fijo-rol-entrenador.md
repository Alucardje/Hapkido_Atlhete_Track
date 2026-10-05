# Registro de Cambios

## Cabecera
- **Modelo / Autor**: `opencode / mimo-v2.6-flash-free`
- **Fecha**: `2026-10-05`
- **Dia**: `Lunes`
- **Herramienta**: `opencode`

## Descripcion del Cambio
Se implemento que el **Modo Dojang quede fijo para el rol Entrenador (instructor)**, segun decision del usuario: al iniciar sesion con ese rol, la aplicacion entra siempre en Modo Dojang y **se oculta el badge de alternancia de modo** en el header (el instructor no puede ver ni activar contenido federativo).

Decisiones tomadas:
- Nuevo metodo `enforceRoleOperatingMode()` en `app.js` que centraliza la regla: instructor -> `operatingMode = 'dojang'` en memoria + badge oculto; demas roles -> restaura la preferencia guardada del dispositivo (`hapkido_operating_mode`) + badge visible. El modo forzado del instructor **no escribe en localStorage** para no pisar la preferencia del admin/dispositivo.
- Guard de seguridad en `toggleOperatingMode()` por si el evento se dispara de forma programatica.
- CSS de respaldo `body.role-instructor #mode-toggle-badge` por si el JS no llega a ejecutarse.
- Se llamada `enforceRoleOperatingMode()` en los tres puntos de sesion: restauracion en `init()` (app.js), `login()` y `selectPresentationRole()` (hapkido-auth.js), y `logout()` (restaurar badge al cerrar sesion).

## Archivos Modificados
- `app.js` — nuevo `enforceRoleOperatingMode()`, guard en `toggleOperatingMode()`, llamada en `init()`
- `hapkido-auth.js` — llamadas en `login()`, `selectPresentationRole()` y `logout()`
- `hapkido-init.js` — `enforceRoleOperatingMode` agregado a `requiredMethods`
- `styles.css` — regla `body.role-instructor #mode-toggle-badge { display: none !important; }`
- `sw.js` — `CACHE_NAME` -> `hapkido-tracker-v20261005-02`
- `index.html` — query strings de assets -> `?v=20261005-02`

## Estado y Verificacion
- [x] Sintaxis verificada (`node --check` en app.js, hapkido-auth.js, hapkido-init.js — sin errores)
- [ ] Navegacion OK (login instructor: badge oculto y modo Dojang fijo; login admin: badge visible y alterna; logout: badge restaurado)
- [x] Contratos respetados (estructura localStorage sin cambios, funciones publicas existentes intactas; metodo nuevo agregado a `requiredMethods`)
- [ ] Pruebas manuales realizadas: pendiente en navegador
- [x] Sin secretos expuestos

## Notas
- El modo del instructor es **en memoria**: al cerrar sesion y entrar con admin, se restaura la preferencia guardada del dispositivo.
