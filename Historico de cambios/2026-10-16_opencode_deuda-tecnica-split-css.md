# Registro de Cambios

## Cabecera
- **Modelo / Autor**: `opencode / mimo-v2.6-flash-free`
- **Fecha**: `2026-10-16`
- **Dia**: `Jueves`
- **Herramienta**: `opencode`

## Descripcion del Cambio
**Deuda tecnica CSS: division del monolito `styles.css` en 9 archivos tematicos.**

Motivacion: `styles.css` alcanzo 6409 lineas (~148 KB), lo que el HARNESS marca como deuda tecnica a vigilar. Dividido con **corte secuencial puro** (sin reordenar ni reescribir reglas) para que la concatenacion en orden de carga reproduzca el original byte a byte — garantia de que la cascada CSS queda identica.

### Archivos creados (`css/`, en orden de carga)
1. `base.css` (1-89): variables del design system, reset, tipografia, scrollbar
2. `layout.css` (90-398): grid de la app, header, sidebar, main
3. `components.css` (399-1096): paneles, tablas, botones, badges, modales, toasts, charts
4. `combat.css` (1097-1701): scoreboard, log, panel de completitud + sus medias queries
5. `physical.css` (1702-2518): plan de entrenamiento, fichas, protocolos, tecnicas, pasos, rangos, vocab
6. `roles-auth.css` (2519-2996): login, logout, profile card, reglas de visibilidad por rol, banner del atleta
7. `dashboard-manual.css` (2997-4582): curriculum manual, badge de sesion, guia de protocolo, responsive general, print #1
8. `history-torneos-timer.css` (4583-5708): timeframe, H2H, podium, brackets, match cards, tatami timer + medias/print
9. `themes-analysis.css` (5709-fin): temas de rol, accordion login, modo Dojang, print #2, estilos del analizador de combate (cp-*/ca-*)

### Verificacion (tres capas)
1. Concatenacion de los 9 trozos === working-tree original (script node dedicado, luego borrado)
2. Llaves balanceadas por archivo y total 955/955 (igual al original)
3. Concatenacion === `git show HEAD:styles.css` (148,636 chars identicos) — la prueba definitiva contra el binario commiteado

### Cambios asociados
- `index.html`: 1 `<link>` por 9 links en orden; version unificada `?v=20261016-02` (CSS y scripts)
- `sw.js`: CORE_ASSETS con los 9 css + **`hapkido-analysis.js` agregado al precache (faltaba desde la Fase 1 del analizador)**; CACHE_NAME `v20261016-02`
- `styles.css` eliminado del arbol (historial en git)
- Documentacion actualizada: HARNESS.md (arbol, reglas de impresion, 7.2 monoliticos + politica de markup nuevo via JS), README.md (arbol), docs/ARQUITECTURA.md (2 refs), docs/DEPLOY.md (procedimiento de versionado de los 9 links)

### Politica queda (HARNESS 7.2)
- Estilos nuevos van al archivo tematico correspondiente; NO reordenar los `<link>`
- Markup nuevo (modales/paneles) se inyecta desde JS; no crecer index.html con secciones estaticas

## Archivos Modificados
- `css/*.css` (9 nuevos), `styles.css` (eliminado)
- `index.html`, `sw.js`, `HARNESS.md`, `README.md`, `CHANGELOG.md`
- `docs/ARQUITECTURA.md`, `docs/DEPLOY.md`

## Verificacion
- Ver Git VERIFY GIT: IDENTICO (148,636 chars); `node --check sw.js` limpio; 0 referencias runtime a styles.css
- Pendiente: smoke test visual en navegador (Ctrl+Shift+R) — el usuario debe verificar secciones principales (dashboard, ficha, combate, historial, torneos, timer, print)

## Siguientes Pasos
- Extraer baremos/reportes de `hapkido-physical.js` (frente 2 de deuda tecnica)
- Modales de index.html a JS (frente 3, opcional)
