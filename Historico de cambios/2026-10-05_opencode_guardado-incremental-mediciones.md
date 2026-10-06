# Registro de Cambios

## Cabecera
- **Modelo / Autor**: `opencode / mimo-v2.6-flash-free`
- **Fecha**: `2026-10-05`
- **Dia**: `Lunes`
- **Herramienta**: `opencode`

## Descripcion del Cambio
**Guardado incremental de las mediciones fisicas**: la ficha fisica ya no exige todas las metricas para poder guardarse. Ahora solo son obligatorios **atleta y fecha**; el resto se captura en varias sesiones (no siempre hay equipo/condiciones para todo en una sola), y la interfaz muestra que falta para completar el perfil.

Comportamiento nuevo:
- **Obligatorio unico**: `physical-athlete-select` + `physical-date`. Se quito `required` de P1/P2/P3 (Ruffier) en `index.html`; el indice de Ruffier solo se calcula cuando los 3 pulsos existen (si no, `ruffierIndex/ruffierLevel = null`).
- **Upsert por atleta+fecha**: nuevo `getPhysicalRecordForDate()`; si ya existe ficha FISICA para ese atleta y fecha se **actualiza** (merge campo a campo: solo sobrescriben las metricas tipeadas, las vacias conservan lo guardado). Se elimino la creacion de registros duplicados por sesion.
- **Panel "Completitud de la ficha"** (`#measure-progress-panel`) en el formulario: contador `N/Total`, badge (`Sin datos` / `%` / `Completa`), barra de progreso y lista de metricas faltantes, actualizado en vivo (`physicalForm.oninput/onchange`). El Total usa `getPhysicalMetricCatalog()` (28 metricas base + 5 pruebas deportivas solo si el atleta es modalidad Deportiva; `fit-fat` excluido por ser derivado). Las etiquetas se leen del DOM (se adaptan a "Flexiones adaptadas" en infantil).
- **Retroalimentacion al guardar**: toast `Progreso guardado (N/Total). Faltan: ...` o `Ficha completa guardada (N/N)`; ya **no** se redirige ni limpia el formulario, para que se siga midiendo en la misma sesion (el modal de plan de entrenamiento sigue abriendose en la primera ficha del atleta).
- **Recarga inteligente**: `prefillPhysicalForm()` al cambiar atleta o fecha -> limpia el formulario (evita arrastrar datos de otro atleta), carga la ficha guardada de esa fecha si existe, o si no autocompleta estatura/peso del perfil. Fecha por defecto = hoy.
- **Boton** renombrado a "Guardar Mediciones"; "Limpiar" (reset) ahora tambien limpia el panel del Ruffier y el de completitud.

Hardening por fichas parciales (evita `null`/`NaN`/crashes en reportes):
- `evaluatePhysicalMetrics()`: `ruffierEval` ahora es `null` cuando no hay indice (antes `null <= 0` lo marcaba "Excelente" y contaminaba el promedio); `globalLevel = "Sin datos"` si no hay metricas evaluables.
- Null-safety con `!= null` en las filas de la tabla de impresion (`generatePrintTableRows`, 17 ocurrencias), en el reporte individual (Índice Ruffier), y en la fila Ruffier (ademas: corregidas las claves legacy `details.p1/p2/p3` -> `pulseP1/pulseP2/pulseP3`).
- `hapkido-athletes.js`: dashboard del atleta (badge "Pendiente" si no hay Ruffier), banner de evolucion (deltas `hasRuffier`/`hasKickSpeed`, "Pulsos pendientes") e historial de fichas (fila sin pulsos muestra `Ficha parcial (sin pulsos registrados)`).

## Archivos Modificados
- `index.html` — panel `#measure-progress-panel`, `required` removido de P1/P2/P3, boton "Guardar Mediciones", query strings -> `?v=20261005-04`
- `styles.css` — estilos `.measure-progress-panel` (barra, badge, estado `.is-complete`)
- `hapkido-physical.js` — `PHYSICAL_METRIC_CATALOG`, `getPhysicalMetricCatalog()`, `parsePhysicalInput()`, `getPhysicalRecordForDate()`, `updateMeasureProgressPanel()`, `prefillPhysicalForm()`, `savePhysicalTest()` reescrito (upsert + merge), null-safety en evaluacion/reportes
- `app.js` — `physSelect.onchange` y `physical-date.onchange` -> `prefillPhysicalForm()`, fecha por defecto hoy, `oninput/onchange/onreset` del formulario -> panel de completitud
- `hapkido-athletes.js` — guards de Ruffier/kickSpeed en dashboard, banner de evolucion e historial
- `hapkido-init.js` — 5 metodos nuevos agregados a `requiredMethods`
- `TEST_MANUALES.md` — nuevo `FLUJO 13: Guardado Incremental de Mediciones Fisicas (ALTO)`
- `sw.js` — `CACHE_NAME` -> `hapkido-tracker-v20261005-04`

## Estado y Verificacion
- [x] Sintaxis verificada (`node --check` en app.js, hapkido-physical.js, hapkido-athletes.js, hapkido-init.js, sw.js — sin errores)
- [x] Llaves de CSS balanceadas (929/929)
- [ ] Navegacion OK (guardar parcial -> recargar misma fecha conserva datos -> completar sin duplicar fila; reporte/historial sin `null`/`NaN`)
- [x] Contratos respetados (estructura de records sin cambios: se reutiliza la fila FISICA de la fecha; metodos nuevos registrados en `requiredMethods`)
- [ ] Pruebas manuales realizadas: pendiente en navegador (ver `TEST_MANUALES.md` FLUJO 13; Ctrl+Shift+R / actualizar service worker)
- [x] Sin secretos expuestos

## Notas
- Un campo vacio **no borra** lo ya guardado en esa fecha: para corregir un valor se vuelve a escribir encima. La fecha por defecto es hoy (se puede cambiar para backfill).
- El "perfil completo" se mide sobre las metricas visibles del formulario (28 base, +5 si el atleta es modalidad Deportiva).
