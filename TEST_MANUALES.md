# Test Manuales - Hapkido Athlete Tracker

> Flujos de verificacion manual para validar los fixes de precaucion antes de implementarlos.
> Ejecutar en navegador (Chrome/Edge) despues de aplicar los fixes seguros.

---

## Pre-requisitos

1. Abrir la app en Chrome/Edge
2. Hacer login con `admin` / `123`
3. Tener al menos 1 atleta registrado con evaluacion fisica
4. Abrir DevTools (F12) -> pestaña Console para monitorear errores

---

## TEST 1: Timer skipToNextTimerPhase (Fix #2 - Critico)

**Objetivo:** Verificar que el salto de fase funciona correctamente desde RESTING.

**Pasos:**
1. Navegar a `#timer`
2. Seleccionar modo "Combate Oficial"
3. Configurar: Round 10s, Descanso 5s, 2 rounds
4. Hacer clic en "Iniciar" (play)
5. **Esperar a que termine el Round 1** (10 segundos)
6. Verificar que el timer cambia automaticamente a "DESCANSO" (RESTING)
7. **En vez de esperar, hacer clic en "Siguiente Fase"** (skip)
8. **VERIFICAR:** El timer debe avanzar al Round 2 inmediatamente
9. **VERIFICAR:** No debe quedarse en PAUSED/DESCANSO

**Resultado esperado:** El skip funciona desde cualquier fase (RUNNING, PAUSED, RESTING).

**Si falla:** El timer se queda en PAUSED sin avanzar. Investigar `hapkido-timer.js:154-181`.

---

## TEST 2: Timer AudioContext Memory (Fix #3 - Critico)

**Objetivo:** Verificar que no se crean AudioContexts nuevos en cada sonido.

**Pasos:**
1. Navegar a `#timer`
2. Abrir DevTools -> pestaña "Application" -> "Service Workers" o "Memory"
3. Seleccionar modo "Combate Oficial", configurar rondas cortas (5s round, 3s descanso)
4. Iniciar timer y dejar que pasen **5+ rondas completas**
5. Abrir DevTools -> Console
6. Ejecutar: `performance.getEntriesByType('resource').filter(r => r.name.includes('audio')).length`
7. **VERIFICAR:** El numero no debe crecer exponencialmente
8. Tambien verificar en DevTools -> Memory -> "Take Heap Snapshot" antes y despues
9. **VERIFICAR:** El uso de memoria no debe crecer significativamente

**Si falla:** La memoria crece con cada ronda. Investigar singleton AudioContext en `hapkido-timer.js:325-409`.

---

## TEST 3: Impresion Consolidada (Fix #4 - Critico)

**Objetivo:** Verificar que la impresion funciona para planilla, certificado y reporte.

### Sub-test 3a: Planilla de Campo
1. Navegar a `#dashboard` o `#fisica`
2. Hacer clic en "Planilla de Campo"
3. Seleccionar "Planilla Colectiva con Atletas Registrados"
4. **VERIFICAR:** Se abre dialogo de impresion del navegador
5. **VERIFICAR:** La planilla se muestra en formato LANDSCAPE
6. **VERIFICAR:** La tabla tiene headers con colores (Bio=azul, Cardio=rojo, etc.)
7. **VERIFICAR:** Los nombres de atletas aparecen (si se selecciono "con atletas")
8. Cancelar impresion

### Sub-test 3b: Certificado
1. Navegar a `#examenes`
2. Seleccionar un atleta y cargar examen
3. Completar el examen y guardarlo (si hay promocion de cinta)
4. Hacer clic en ver/imprimir certificado
5. **VERIFICAR:** El certificado se muestra en formato PORTRAIT (no landscape)
6. **VERIFICAR:** El borde dorado y el layout se ven correctos

### Sub-test 3c: Reporte de Evaluacion
1. Navegar a `#fisica`
2. Seleccionar un atleta con evaluacion guardada
3. Hacer clic en "Ver Reporte" o "Imprimir Reporte"
4. **VERIFICAR:** El reporte se muestra correctamente
5. **VERIFICAR:** Los graficos y metricas se ven

**Si falla:** Algun formato de impresion se rompio. Verificar bloques `@media print` consolidados en `styles.css`.

---

## TEST 4: Admin Backdoor (Fix #5 - Critico)

**Objetivo:** Verificar comportamiento del override de admin.

**Pasos:**
1. Hacer logout (boton "Cerrar Sesion")
2. En el login, ingresar:
   - Usuario: `admin`
   - Contrasena: `123`
3. **VERIFICAR:** Login exitoso, se muestra dashboard
4. Hacer logout
5. Intentar con:
   - Usuario: `admin`
   - Contrasena: `contrasena_incorrecta`
6. **VERIFICAR:** Login falla (mensaje de error)
7. **VERIFICAR:** En DevTools -> Console no hay errores inesperados

**Nota:** Este test es para documentar el comportamiento actual. El admin override es intencional pero debe documentarse como riesgo conocido.

---

## TEST 5: Null Checks - Navegacion Completa (Fix #6 - Alto)

**Objetivo:** Verificar que la app no crashea al navegar por todas las secciones.

**Pasos:**
1. Login como `admin` / `123`
2. Navegar a CADA seccion en orden:
   - `#dashboard`
   - `#atletas`
   - `#fisica`
   - `#combate`
   - `#examenes`
   - `#historial`
   - `#timer`
   - `#torneos`
   - `#manual`
   - `#escuelas`
   - `#usuarios`
   - `#ajustes`
3. **VERIFICAR:** En CADA seccion, no hay errores en Console (F12)
4. **VERIFICAR:** Las secciones cargan sin errores de "Cannot read property of null"
5. En `#fisica`, seleccionar un atleta
6. En `#combate`, verificar que los selects se poblaron
7. En `#examenes`, cargar un examen
8. En `#historial`, seleccionar un atleta y ver graficos

**Si falla:** Anotar cual seccion y cual error aparece. Será un null check faltante.

---

## TEST 6: localStorage Quota (Fix #7 - Alto)

**Objetivo:** Verificar que la app maneja storage lleno.

**Pasos:**
1. Login como `admin`
2. Abrir DevTools -> Console
3. Ejecutar:
   ```js
   // Llenar localStorage artificialmente
   try {
       for (let i = 0; i < 100; i++) {
           localStorage.setItem('test_fill_' + i, 'x'.repeat(50000));
       }
   } catch(e) {
       console.log('Storage lleno:', e.message);
   }
   ```
4. Intentar guardar un atleta o evaluacion
5. **VERIFICAR:** La app muestra un mensaje de error (no crashea)
6. Limpiar el storage de prueba:
   ```js
   for (let i = 0; i < 100; i++) {
       localStorage.removeItem('test_fill_' + i);
   }
   ```

**Si falla:** La app crashea con `QuotaExceededError`. Agregar try/catch en `saveData()`.

---

## TEST 7: hashPassword Fallback (Fix #8 - Alto)

**Objetivo:** Verificar login en contexto no seguro (HTTP local).

**Pasos:**
1. Servir la app via `python -m http.server 8000` (HTTP, no HTTPS)
2. Abrir `http://localhost:8000`
3. Login con `admin` / `123`
4. **VERIFICAR:** Login funciona (puede usar fallback plaintext)
5. Abrir DevTools -> Console
6. **VERIFICAR:** No hay errores de "Cannot read property 'digest'"
7. Verificar que Web Crypto API esta disponible:
   ```js
   console.log('Crypto available:', typeof window.crypto.subtle !== 'undefined');
   ```

---

## TEST 8: requiredMethods Validation (Fix #9 - Medio)

**Objetivo:** Verificar que la validacion de metodos detecta problemas.

**Pasos:**
1. Login como `admin`
2. Abrir DevTools -> Console
3. **VERIFICAR:** No hay mensajes "MISSING PROTOTYPE METHOD:"
4. Si los hubiera, indicarian que un modulo no cargo correctamente
5. Verificar que los metodos criticos estan validados:
   - `showAlert`, `showConfirm`, `showToast`
   - `escapeHTML`, `navigateTo`
   - `initTatamiTimer`, `toggleTimer`, `resetTimer`

---

## TEST 9: XSS escapeHTML (Fix #10 - Critico)

**Objetivo:** Verificar que los datos de atletas se escapan correctamente.

**Pasos:**
1. Login como `admin`
2. Navegar a `#atletas`
3. Crear un nuevo atleta con nombre:
   ```
   Test <img src=x onerror=alert('XSS')>
   ```
4. Guardar el atleta
5. Navegar a `#dashboard`
6. **VERIFICAR:** El nombre aparece como texto literal, NO se ejecuta el alert
7. **VERIFICAR:** En la lista de "Atletas Recientes" se ve el texto completo
8. Navegar a `#atletas` y verificar en la tabla
9. **VERIFICAR:** El nombre se muestra como `<img src=x...>` (texto plano)
10. Eliminar el atleta de prueba

**Si falla:** Aparece un alert o el HTML se renderiza. Verificar `escapeHTML()` en `app.js`.

---

## TEST 10: Chart.js Defer (Fix #11 - Bajo)

**Objetivo:** Verificar que Chart.js no bloquea la carga.

**Pasos:**
1. Abrir la app en Chrome
2. Abrir DevTools -> pestaña "Network"
3. Recargar la pagina (Ctrl+Shift+R para hard reload)
4. En Network, buscar `chart.umd.min.js`
5. **VERIFICAR:** El tipo es "script" y tiene "defer" indicado
6. En DevTools -> Console, verificar que no hay errores
7. Navegar a `#historial` y seleccionar un atleta
8. **VERIFICAR:** Los graficos se renderizan correctamente

---

## TEST 11: Aria Labels y Roles (Fix #12 - Bajo)

**Objetivo:** Verificar accesibilidad basica.

**Pasos:**
1. Login como `admin`
2. Usar tab para navegar por la interfaz
3. **VERIFICAR:** El foco visible pasa por los botones principales
4. Verificar que los modales tienen `role="dialog"`:
   - Abrir modal de nuevo atleta
   - En DevTools -> Elements, buscar `role="dialog"` en `#athlete-modal`
5. Verificar que el badge de modo tiene `role="button"`

---

## TEST 12: Manifest PWA (Fix #13 - Bajo)

**Objetivo:** Verificar que el manifest es valido.

**Pasos:**
1. Abrir la app en Chrome
2. Abrir DevTools -> pestaña "Application" -> "Manifest"
3. **VERIFICAR:** El manifest carga sin errores
4. **VERIFICAR:** Muestra nombre, iconos, color de tema
5. **VERIFICAR:** El campo `id` esta presente
6. **VERIFICAR:** `prefer_related_applications` es `false`
7. Intentar instalar como PWA (boton de instalar en barra de direcciones)

---

## Registro de Resultados

Copia esta tabla y completa despues de ejecutar los tests:

| Test | Nombre | Estado | Notas |
|------|--------|--------|-------|
| 1 | Timer skipToNextTimerPhase | | |
| 2 | Timer AudioContext Memory | | |
| 3a | Impresion Planilla | | |
| 3b | Impresion Certificado | | |
| 3c | Impresion Reporte | | |
| 4 | Admin Backdoor | | |
| 5 | Navegacion Completa (Null Checks) | | |
| 6 | localStorage Quota | | |
| 7 | hashPassword Fallback | | |
| 8 | requiredMethods Validation | | |
| 9 | XSS escapeHTML | | |
| 10 | Chart.js Defer | | |
| 11 | Aria Labels y Roles | | |
| 12 | Manifest PWA | | |

**Leyenda:** OK = pasa | FAIL = falla (indicar detalle) | SKIP = no aplica
