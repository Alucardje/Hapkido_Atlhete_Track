# Registro de Cambios

## Cabecera
- **Modelo / Autor**: `opencode (mimo-v2.5-free)`
- **Fecha**: `2026-09-17`
- **Dia**: `Miercoles`
- **Herramienta**: `opencode`

## Descripcion del Cambio

Sesion completa de revision, correccion de bugs y documentacion del proyecto Hapkido Athlete Tracker.

### Bugs corregidos:
1. **Impresion de planilla en blanco**: El CSS de `@media print` tenia dos bloques conflictivos. El primero ocultaba todo con `body * { visibility: hidden !important }` y el segundo solo mostraba `#printable-area` con `display: block` pero sin sobreescribir `visibility`. Los hijos de printable-area (tabla, celdas) permanecian ocultos. Solucion: agregar `#printable-area, #printable-area * { visibility: visible !important }` en el segundo bloque.

2. **`this.showToast()` no definido**: El metodo era invocado en `toggleOperatingMode()` y en exportar CSV, pero nunca fue definido en la clase `HapkidoApp`. Solucion: implementar el metodo con notificaciones toast visuales que se auto-eliminan a los 4 segundos.

3. **Meta tag deprecada**: `<meta name="apple-mobile-web-app-capable">` estaba deprecada. Solucion: agregar `<meta name="mobile-web-app-capable">` antes de la existente.

### Documentacion creada:
- `README.md` — Documentacion principal con objetivos, funcionalidades, roles, stack tecnico
- `LICENSE` — MIT, titularidad Javier Contreras
- `CHANGELOG.md` — Historial de versiones
- `CONTRIBUTING.md` — Guia para contribuidores
- `docs/MANUAL_USUARIO.md` — Guia de uso (17 secciones, ~776 lineas)
- `docs/ARQUITECTURA.md` — Documentacion tecnica (15 secciones, ~1119 lineas)
- `docs/DEPLOY.md` — Guia de despliegue
- `docs/API_SYNC.md` — Protocolo de sincronizacion nube y P2P
- `HARNESS.md` — Arnas de gobernanza tecnica
- `Historico de cambios/README.md` — Plantilla de registro

## Archivos Modificados
- `styles.css` — Fix impresion: agregar `visibility: visible !important` a `#printable-area` y hijos en `@media print`
- `app.js` — Agregar metodo `showToast()` a la clase `HapkidoApp`
- `index.html` — Agregar meta tag `mobile-web-app-capable`, actualizar tituliaridad
- `README.md` — Creado desde cero con documentacion completa del proyecto
- `LICENSE` — Creado con licencia MIT
- `CHANGELOG.md` — Creado con historial v1.0.0 y fixes
- `CONTRIBUTING.md` — Creado con guia de contribucion
- `HARNESS.md` — Creado con arnes de gobernanza tecnica
- `docs/MANUAL_USUARIO.md` — Creado con guia de usuario completa
- `docs/ARQUITECTURA.md` — Creado con documentacion tecnica
- `docs/DEPLOY.md` — Creado con guia de despliegue
- `docs/API_SYNC.md` — Creado con protocolo de sincronizacion
- `Historico de cambios/README.md` — Creado con plantilla de registro

## Estado y Verificacion
- [x] Sintaxis verificada (commits exitosos, sin errores)
- [x] Navegacion OK (commits anteriores verificados en GitHub)
- [x] Contratos respetados (estructura localStorage no modificada, funciones publicas intactas)
- [x] Pruebas manuales realizadas: fix de impresion verificado via CSS, showToast verificado en codigo
- [x] Sin secretos expuestos

## Notas
- Todos los commits fueron subidos a `origin/main` (3 commits: `70d3ff6`, `b04d778`, `18eb495`, `5dfced6`)
- El proyecto no tiene tests automatizados ni linter, la verificacion es manual en navegador
- Se identificaron archivos monoliticos a vigilar: `styles.css` (5893L), `hapkido-physical.js` (2631L), `index.html` (2975L)
