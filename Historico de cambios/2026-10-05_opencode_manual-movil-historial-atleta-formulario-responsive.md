# Registro de Cambios

## Cabecera
- **Modelo / Autor**: `opencode / mimo-v2.6-flash-free`
- **Fecha**: `2026-10-05`
- **Dia**: `Lunes`
- **Herramienta**: `opencode`

## Descripcion del Cambio
Tres mejoras reportadas por el usuario:

1. **Icono de Manual visible en la barra inferior movil** para los roles Entrenador (instructor) y Mesa Tecnica (ayudante). Antes estaba ocultado por CSS para ambos roles, pero ambos pueden acceder a `#manual` (lo veian en el sidebar de escritorio). Ahora ambos roles ven los 7 grupos moviles igual que el resto.

2. **Rol Estudiante (athlete) solo consulta su propio historial**: antes el desplegable `analysis-athlete-select` (y el comparador H2H) listaba todos los atletas de la escuela, permitiendo a cualquier estudiante ver datos de sus companeros. Restricciones aplicadas:
   - `populateAthleteDropdowns()` y `populateH2HDropdowns()` filtran por `currentUser.athleteId` cuando el rol es `athlete`.
   - `loadAthleteAnalysis()` fuerza siempre `athleteId = currentUser.athleteId` para el rol athlete (proteccion tambien contra `viewAthleteHistory()` y `btn-ath-history`).
   - `switchHistorySubTab('h2h')` redirige a `'progreso'` para el rol athlete.
   - CSS: `body.role-athlete` oculta el boton `#subtab-btn-hist-h2h` y `#subtab-hist-h2h-container`.
   - `handleRouting('#historial')` ahora siempre puebla los desplegables y, para el athlete, selecciona su propio id y fuerza la sub-tab `progreso`.

3. **Fix responsive del formulario de Medicion Fisica** (desborde horizontal en movil): en `@media (max-width: 768px)` la grilla `.form-row` usaba `grid-template-columns: 1fr 1fr`, y `1fr` equivale a `minmax(auto, 1fr)` cuyo minimo es el tamano intrinseco de los inputs (~200px c/u), desbordando el viewport. Corregido con `repeat(2, minmax(0, 1fr))` + `min-width: 0` en los `.form-group` e `inputs/selects/textarea` (`width: 100%`, `box-sizing: border-box`). Extras: `.dashboard-grid > .panel-card[style*="grid-column"]` a `1 / -1` en movil (evita columna implicita por `grid-column: span 2`), y `flex-wrap: wrap` en `.form-actions` y `.radio-checkbox-group`.

## Archivos Modificados
- `styles.css` — reglas moviles de `.form-row` (minmax), ocultamiento del H2H para `role-athlete`, liberacion de `data-nav="manual"` para instructor y ayudante
- `hapkido-athletes.js` — filtros por atleta propio en `populateAthleteDropdowns()`, `populateH2HDropdowns()`, guard en `loadAthleteAnalysis()` y `switchHistorySubTab()`
- `app.js` — `handleRouting('#historial')` puebla desplegables y selecciona atleta propio
- `sw.js` — `CACHE_NAME` -> `hapkido-tracker-v20261005-03`
- `index.html` — query strings de assets -> `?v=20261005-03`

## Estado y Verificacion
- [x] Sintaxis verificada (`node --check` en app.js, hapkido-athletes.js, hapkido-init.js, sw.js — sin errores)
- [x] Llaves de CSS balanceadas (918/918)
- [ ] Navegacion OK (Entrenador/Mesa Tecnica ven icono Manual en movil; Estudiante solo ve sus datos y no el comparador H2H; formulario de medicion fisica sin scroll horizontal en movil)
- [x] Contratos respetados (sin cambios de estructura localStorage, sin metodos nuevos en prototype)
- [ ] Pruebas manuales realizadas: pendiente en navegador (recordar Ctrl+Shift+R / actualizar service worker)
- [x] Sin secretos expuestos

## Notas
- El desplegable de atleta sigue visible para el Estudiante (solo contiene su propio registro), ya que `filterHistoryTimeframe()` lee su valor para aplicar los filtros Todo/1 Año/6 Meses/3 Meses.
