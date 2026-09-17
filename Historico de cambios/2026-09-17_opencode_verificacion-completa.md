# Registro de Cambios

## Cabecera
- **Modelo / Autor**: `opencode (mimo-v2.5-free)`
- **Fecha**: `2026-09-17`
- **Dia**: `Miercoles`
- **Herramienta**: `opencode`

## Descripcion del Cambio

Verificacion completa del proyecto siguiendo el protocolo del HARNESS.md. Se revisaron los 13 modulos JS, index.html, styles.css, manifest.json y sw.js. Se identificaron 31 hallazgos clasificados por severidad.

### Metodologia
Se lanzaron 4 tareas de verificacion en paralelo:
1. HTML: estructura, CSP, accesibilidad, form validation, duplicate IDs, script order
2. JS core: app.js, hapkido-data.js, hapkido-auth.js, hapkido-init.js
3. JS modulos: athletes, physical, combat, exams, schools, torneos
4. JS remaining + CSS + PWA: vocab, timer, sync, styles.css, manifest.json, sw.js

### Hallazgos por Severidad

**CRITICO (5):**
1. XSS via innerHTML sin escapeHTML() en app.js:373-378, 415-425, 831
2. Timer skipToNextTimerPhase() roto — pauseTatamiTimer() cambia status antes de verificar RESTING
3. AudioContext memory leak — se crea nuevo AudioContext en cada llamada a playBellSound/playWarningWoodSound
4. Tres bloques @media print conflictivos con @page size: auto vs landscape
5. Admin password "123" como override universal (backdoor)

**ALTO (8):**
6. JSON.parse(sessionUser) sin try/catch en app.js:50
7. Null checks faltantes en 10+ ubicaciones de app.js
8. Contrasenas SHA-256 de "123" visibles en source code (hapkido-data.js)
9. localStorage.setItem sin try/catch en hapkido-data.js
10. hashPassword() fallback retorna plaintext si Web Crypto no disponible
11. requiredMethods en hapkido-init.js solo valida 16 de 60+ metodos
12. Timer drift por setInterval sin correccion
13. Token P2P es Base64 (no encriptado) con label "Seguro" enganoso

**MEDIO (10):**
14. ~20 inline onclick handlers sin abstraccion app.*
15. z-index sin escala (sidebar y modales comparten 1000)
16. @page conflict entre bloques print
17. Responsive breakpoints inconsistentes (992px vs 1024px superpuestos)
18. Service Worker offline fallback retorna undefined
19. API key en localStorage plaintext
20. __proto__ deletion es no-op en sync
21. Timer state leak entre navegaciones
22. Chart.js loaded sin defer (bloquea render)
23. 191 inline styles en index.html

**BAJO (8):**
24. Modales sin role="dialog"
25. Divs con onclick sin role="button"
26. Icons FA sin aria-hidden
27. Links externos sin rel=noopener
28. Typos foneticos en numeros coreanos
29. manifest.json incompleto
30. Bloques @media 768px duplicados 5 veces
31. Falta meta description para SEO

### Clasificacion de Riesgo de Correccion

**Seguros (no afectan funcionamiento):**
- escapeHTML() en innerHTML (solo agrega sanitizacion)
- try/catch en JSON.parse (solo evita crash)
- Expandir requiredMethods (solo agrega alertas)
- defer en Chart.js (no cambia carga)
- Aria labels y roles (solo accesibilidad)
- Fix typos coreanos (corrige datos)
- Mejorar manifest.json (solo agrega campos)

**Con precaucion (pueden afectar):**
- Fix skipToNextTimerPhase (cambia logica timer)
- Singleton AudioContext (cambia lifecycle)
- Consolidar @media print (puede romper impresion)
- Eliminar admin backdoor (cambia login)
- Null checks defensivos (pueden enmascarar bugs)
- hashPassword fallback (cambia comportamiento)
- P2P token encryption (rompe compatibilidad)
- z-index scale (afecta stacking)
- @page conflict fix (cambia impresion)
- Responsive breakpoints (cambia layout)

## Archivos Revisados
- `index.html` — 2975 lineas
- `styles.css` — 5893 lineas
- `app.js` — 908 lineas
- `hapkido-data.js` — 388 lineas
- `hapkido-auth.js` — 615 lineas
- `hapkido-athletes.js` — 1633 lineas
- `hapkido-physical.js` — 2631 lineas
- `hapkido-combate.js` — 584 lineas
- `hapkido-exams.js` — 603 lineas
- `hapkido-schools.js` — 341 lineas
- `hapkido-torneos.js` — 1021 lineas
- `hapkido-vocab.js` — 386 lineas
- `hapkido-timer.js` — 436 lineas
- `hapkido-sync.js` — 424 lineas
- `hapkido-init.js` — 42 lineas
- `manifest.json`
- `sw.js`

## Estado y Verificacion
- [x] Revision documentada por completo
- [x] Sin cambios en codigo (solo diagnostico)
- [x] Clasificacion de riesgo de correccion realizada
- [ ] Pendiente: aplicar fixes seguros (Fase 1)
- [ ] Pendiente: aplicar fixes con precaucion (Fase 2)

## Notas
- La app esta en fase de pruebas, se recomienda aplicar solo los fixes seguros por ahora
- Los 31 hallazgos no son bloquean el uso actual pero deben corregirse antes de produccion
- Prioridad: XSS (critico #1) es el mas urgente por riesgo de seguridad
