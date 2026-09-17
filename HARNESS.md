# Hapkido Athlete Tracker - SISTEMA DE ARNES Y GUIA DE DESARROLLO

> **Documento de Gobernanza Tecnica y Reglas de Desarrollo para Agentes de IA y Desarrolladores.**
> Este arnes es de **lectura obligatoria** antes de realizar cualquier cambio, adicione o refactorizacion en el repositorio de **Hapkido Athlete Tracker**.

---

## 1. REGLAS DE ORO DEL PROYECTO

Cualquier modelo de lenguaje o programador humano que trabaje en este codigo debe ceñirse estrictamente a los siguientes principios:

### 1.1. Programacion Organizada, Modular y Estructuradamente Limpia
- **Separacion de Responsabilidades (SoC)**: Cada modulo JS extiende `HapkidoApp.prototype` y tiene una responsabilidad unica. No mezclar logica de distintos dominios en un solo archivo.
- **Sin codigo espagueti ni duplicaciones**: Cada funcion debe tener un unico proposito claro, nombres descriptivos, y manejo de excepciones coherente.
- **Legado monolitico - no agravar**: Los archivos grandes son `hapkido-physical.js` (2631 lineas), `index.html` (2975 lineas) y `styles.css` (5893 lineas). NO anadir funcionalidad que los haga crecer innecesariamente. Si un cambio encaja en un modulo existente, usarlo. Si se necesitan muchas funciones nuevas, proponer extraerlas a un modulo nuevo.
- **Mantenibilidad**: Comentar puntos criticos (logica de negocio, algoritmos de baremos, migraciones de datos) y preferir funciones puras.

### 1.2. Evidenciar el Codigo Disponible Antes de Cualquier Cambio
- **Prohibido modificar a ciegas**: Antes de escribir o modificar un archivo, es obligatorio inspeccionar y documentar que modulos existen, que dependencias tienen y como se comunican entre si.
- **Comprobacion de impacto**: Todo cambio debe respetar los contratos existentes (estructura de datos en localStorage, funciones publicas de HapkidoApp, esquema de colecciones).

### 1.3. Analizar Siempre y Consultar Dudas
- **Diagnostico antes de la accion**: Presentar un analisis claro del problema o mejora antes de aplicar cambios estructurales.
- **Consultar al usuario**: Si existen ambiguedades sobre requerimientos, comportamiento o alcance, **preguntar antes de asumir**.
- **Cambios drasticos**: Nunca refactorizar a gran escala sin el visto bueno explicito del usuario.

### 1.4. Seguridad y Secretos (NO NEGOCIABLE)
- **Prohibido hardcodear claves/secretos en el codigo fuente.** El sistema usa SHA-256 via Web Crypto API para contrasenas.
- **Credenciales**: Los usuarios seed usan contrasena "123" (hash SHA-256). La contrasena de admin hardcodeada es "123" (override en `hapkido-auth.js`). **Nunca** subir credenciales reales a repositorios publicos.
- **No exponer informacion interna**: Los error handlers deben devolver mensajes genericos.
- **CSP (Content Security Policy)**: Mantener la meta tag CSP actualizada en `index.html`. No agregar dominios sin justificacion.
- **Sanitizacion P2P**: Todo dato importado via token P2P debe pasar por la validacion de esquema y sanitizacion de campos en `hapkido-sync.js`.

### 1.5. Historico de Cambios Obligatorio (`Historico de cambios/`)
- **Registro Obligatorio por Modelo y Fecha**: Todo modelo de IA o programador que aplique cambios **DEBE crear o actualizar un archivo de registro** en `Historico de cambios/`.
- **Estructura del archivo de registro**:
  - Nombre: `YYYY-MM-DD_<nombre_modelo>_<descripcion_corta>.md`
  - Cabecera obligatoria: **Modelo / Autor** . **Fecha** . **Dia** . **Descripcion del Cambio** . **Archivos Modificados** . **Estado y Verificacion**.
- Consulta la plantilla en `Historico de cambios/README.md`.

---

## 2. MAPA DE ARQUITECTURA Y CODIGO DISPONIBLE

```
Hapkido Athlete Tracker/
├── HARNESS.md                          # Este arnes de gobernanza tecnica (LEER PRIMERO)
├── LICENSE                             # Licencia MIT
├── README.md                           # Documentacion principal
├── CHANGELOG.md                        # Historial de versiones
├── CONTRIBUTING.md                     # Guia para contribuidores
├── index.html                          # Punto de entrada SPA (2975 lineas)
├── styles.css                          # Sistema de disenno completo (5893 lineas)
├── manifest.json                       # Web App Manifest (PWA)
├── sw.js                               # Service Worker (caché offline)
├── app.js                              # Clase core: routing, RBAC, sidebar, dashboard
├── hapkido-data.js                     # Capa de datos: carga, guardado, migracion, seed
├── hapkido-auth.js                     # Autenticacion: login, CRUD usuarios, SHA-256
├── hapkido-athletes.js                 # Gestion de atletas: CRUD, categorias, exportacion
├── hapkido-physical.js                 # Evaluacion fisica: metricas, baremos, reportes (2631 lineas)
├── hapkido-combate.js                  # Sistema de combate: marcador, rondas, penalizaciones
├── hapkido-exams.js                    # Examenes de cinta: checklist, puntuacion, promocion
├── hapkido-schools.js                  # Gestion de escuelas y asociaciones
├── hapkido-torneos.js                  # Torneos: inscripcion, llaves, resultados
├── hapkido-vocab.js                    # Vocabulario coreano del Hapkido
├── hapkido-timer.js                    # Temporizador de tatami (4 modos)
├── hapkido-sync.js                     # Sincronizacion nube y transferencia P2P
├── hapkido-init.js                     # Bootstrap: instanciacion y Service Worker
├── vendor/                             # Dependencias vendored (Chart.js, FA, fuentes)
├── icons/                              # Iconos PWA (64, 192, 512px)
├── docs/                               # Documentacion
│   ├── ARQUITECTURA.md                 # Documentacion tecnica del sistema
│   ├── MANUAL_USUARIO.md               # Guia de uso para instructores/admins
│   ├── DEPLOY.md                       # Guia de despliegue
│   ├── API_SYNC.md                     # Protocolo de sincronizacion
│   ├── vocabulario/                    # Vocabulario coreano
│   ├── tecnicas/                       # Imagenes de tecnicas
│   └── *.pdf, *.doc                    # Reglamento y programa oficial
└── Historico de cambios/               # Registro de cambios (este directorio)
```

---

## 3. ARQUITECTURA LOGICA

### 3.1. Flujo principal

```
index.html (carga todos los <script>)
    └── hapkido-init.js
         ├── Valida que todos los prototype methods existan
         ├── window.app = new HapkidoApp()
         │    ├── constructor(): loadData() from localStorage
         │    ├── init(): SPA routing, event listeners, dashboard
         │    └── initCloudSync()
         └── Registers Service Worker (sw.js)
```

**Flujo de datos:**
1. Usuario interactua con la UI (formularios, botones)
2. Event listener en `app.js` captura la accion
3. Modulo correspondiente procesa la logica (ej: `savePhysicalTest()`)
4. `hapkido-data.js` guarda en localStorage (`saveData()`)
5. `notifyDataChanged()` dispara sync debounced (4s) si hay conexion
6. UI se actualiza dinamicamente (DOM manipulation directa)

### 3.2. Capas / Modulos

| Capa / Modulo | Responsabilidad | Depende de |
|---------------|-----------------|------------|
| `app.js` | Routing SPA, RBAC, sidebar, dashboard, event listeners | Todos los modulos |
| `hapkido-data.js` | CRUD en localStorage, seed data, migraciones | Ninguno (es la capa base) |
| `hapkido-auth.js` | Login, sesiones, SHA-256, CRUD usuarios | `hapkido-data.js` |
| `hapkido-athletes.js` | CRUD atletas, categorias edad/peso, CSV | `hapkido-data.js`, `app.js` |
| `hapkido-physical.js` | Evaluacion fisica, baremos, scoring, reportes, graficos | `hapkido-athletes.js`, `app.js` |
| `hapkido-combate.js` | Marcador digital, penalizaciones, rondas | `hapkido-athletes.js`, `app.js` |
| `hapkido-exams.js` | Examenes de cinta, curriculum, promocion | `hapkido-athletes.js`, `app.js` |
| `hapkido-schools.js` | CRUD escuelas y asociaciones | `hapkido-data.js` |
| `hapkido-torneos.js` | Torneos, inscripcion, llaves, brackets | `hapkido-athletes.js`, `app.js` |
| `hapkido-vocab.js` | Vocabulario coreano (datos estaticos) | Ninguno |
| `hapkido-timer.js` | 4 modos de timer, Web Audio, Web Speech API | Ninguno |
| `hapkido-sync.js` | Sync nube, P2P tokens, conflict resolution | `hapkido-data.js` |
| `hapkido-init.js` | Bootstrap, validacion de prototype, SW registration | Todos |

### 3.3. Modelo de datos (localStorage)

Clave principal: `hapkido_athlete_tracker_data` (JSON blob)

| Coleccion | Proposito | Relaciones clave |
|-----------|-----------|------------------|
| `athletes` | Atletas registrados | `school` -> schools.name |
| `records` | Evaluaciones fisicas | `athleteId` -> athletes.id |
| `schools` | Escuelas/Dojangs | `associationId` -> associations.id |
| `associations` | Asociaciones estadales | `federation` -> string |
| `users` | Cuentas de usuario | `school` -> schools.name, `athleteId` -> athletes.id |
| `torneos` | Torneos y eventos | `school` -> schools.name |

Otras claves de localStorage:
- `hapkido_current_user` (sesion activa, JSON)
- `hapkido_sidebar_collapsed` (estado UI, "0"/"1")
- `hapkido_sync_settings` (config sync, JSON)
- `hapkido_operating_mode` (modo operacion, "dojang"/"federation")

---

## 4. CONTRATOS DE INTERFAZ

### 4.1. Funciones publicas de HapkidoApp

Todas las funciones estan en el prototype de `HapkidoApp`. Las funciones criticas que NO deben romperse:

| Funcion | Modulo | Uso en HTML (onclick) |
|---------|--------|-----------------------|
| `navigateTo(hash)` | app.js | Navegacion SPA |
| `toggleSidebar()` | app.js | Menu hamburguesa |
| `toggleOperatingMode()` | app.js | Cambio Dojang/Federacion |
| `openPrintSheetModal()` | hapkido-physical.js | Abrir modal de impresion |
| `printFieldSheet(mode, fill)` | hapkido-physical.js | Imprimir planilla |
| `addScore(side, pts, desc)` | hapkido-combate.js | Puntuar en combate |
| `addPenalty(side, type)` | hapkido-combate.js | Penalizar en combate |
| `showAlert(msg, type)` | app.js | Modal universal (reemplaza alert) |
| `showConfirm(msg, title)` | app.js | Modal de confirmacion |
| `showToast(msg, type)` | app.js | Notificaciones toast |
| `syncWithCloud(manual)` | hapkido-sync.js | Sync manual |

### 4.2. Contratos de datos (estructuras criticas)

**Estructura de un atleta (`athletes`):**
```json
{
  "id": "uuid",
  "name": "string",
  "birthdate": "YYYY-MM-DD",
  "gender": "MASCULINO|FEMENINO",
  "belt": "Blanco|Amarillo|...|Negro 9no Dan",
  "weight": number,
  "height": number,
  "experience": "PRINCIPIANTE|INTERMEDIO|AVANZADO|MASTER",
  "school": "string (school name)",
  "isAyudante": boolean,
  "modalities": { "tradicional": boolean, "deportivo": boolean },
  "status": "activo|inactivo"
}
```

**Estructura de una evaluacion (`records`):**
```json
{
  "id": "uuid",
  "athleteId": "string (athlete.id)",
  "type": "FISICA",
  "date": "YYYY-MM-DD",
  "physicalDetails": {
    "pulseP1": number, "pulseP2": number, "pulseP3": number,
    "ruffierIndex": number, "ruffierLevel": "string",
    "pushups": number, "situps": number, "plank": number,
    "flexibility": number, "cooper": number,
    "verticalJump": number, "horizontalJump": number,
    "scores": { "hyungs": number, "hosinsul": number, ... },
    "evalResults": { "ruffier": {...}, "flexibility": {...}, ... },
    "globalScore": number, "globalLevel": "string"
  }
}
```

---

## 5. REGLAS ESPECIFICAS DEL LENGUAJE / FRAMEWORK

- **Lenguaje:** JavaScript ES6+ (classes, template literals, async/await, arrow functions, destructuring)
- **Patron:** Prototype-based (`HapkidoApp.prototype.modulo = function() {}`)
- **Sin framework:** Vanilla JS, sin React/Vue/Angular, sin build tools, sin npm
- **CSS:** Custom properties, dark theme, responsive (mobile-first), `@media print` para impresion
- **Routing:** Hash-based SPA (`window.location.hash`)
- **Almacenamiento:** localStorage (offline-first), nunca asumir conexion
- **Convenciones de nombres:**
  - Funciones: `camelCase`
  - IDs HTML: `kebab-case` (ej: `physical-athlete-select`)
  - Clases CSS: `kebab-case` (ej: `panel-card`, `score-btn`)
  - Variables: `camelCase`
- **Testing:** No hay framework de tests. Verificacion manual en navegador.
- **Linting:** No hay configuracion de lint. Mantener estilo consistente con el codigo existente.

---

## 6. FRONTEND

- **Arquitectura:** SPA vanilla, DOM manipulation directa (sin virtual DOM)
- **Manejo de estado:** Propiedades de la instancia `this.data`, `this.currentUser`, `this.activeCombat`
- **Componentes visuales:** Tarjetas (`.panel-card`), tablas (`.data-table`), modales (`.modal`), badges (`.badge`), botones (`.primary-btn`, `.sec-btn`, `.danger-btn`)
- **Sistema de modales:** `showAlert()` y `showConfirm()` reemplazan `alert()` y `confirm()` nativos. Nunca usar alert/confirm del navegador.
- **Iconos:** Font Awesome 6 (vendored). Usar clases `fa-solid fa-*`.
- **Fuentes:** Outfit (cuerpo), Orbitron (digital/scoreboard). Vendored en `vendor/fonts/`.
- **Charts:** Chart.js (vendored). Instancias en `this.charts`. Destruir antes de recrear.
- **Impresion:** Usar `@media print` en `styles.css`. El contenido imprimible va en `#printable-area` (fuera del DOM principal, se muestra solo en print).
- **Prohibido:**
  - No introducir librerias externas sin aprobacion
  - No cambiar la identidad visual (colores, fuentes, layout) sin preguntar
  - No eliminar clases CSS que puedan estar en uso en otros archivos JS

---

## 7. ANTIPATRONES Y BUGS CONOCIDOS

### 7.1. Bugs conocidos pendientes
- **Ninguno activo**. Los bugs de impresion, showToast y meta tag fueron corregidos en v1.0.1.

### 7.2. Archivos monoliticos a vigilar
- `styles.css` (5893 lineas): Si se necesitan muchos estilos nuevos, considerar extraer a modulos CSS separados.
- `hapkido-physical.js` (2631 lineas): El modulo mas grande. Si crece mas, extraer funciones de scoring/baremos a un archivo separado.
- `index.html` (2975 lineas): Los modales y secciones son extensos. Si se agregan muchas secciones, considerar lazy loading.

### 7.3. Prohibiciones explicitas
- **No hardcodear secretos** en codigo.
- **No crear modulos huerfanos** que no se importen/usen.
- **No agravar monolitos** sin justificacion.
- **No eliminar contratos** de funciones publicas sin confirmar con el usuario.
- **No exponer informacion interna** en errores.
- **No usar `alert()` o `confirm()` nativos** - usar `showAlert()` / `showConfirm()`.
- **No modificar `hapkido-data.js` seed data** sin documentar la migracion.
- **No romper la estructura de localStorage** - cualquier cambio de esquema debe tener migracion en `loadData()`.
- **No agregar dependencias npm/node** - todo debe ser vanilla JS vendored.

---

## 8. PROTOCOLO OBLIGATORIO DE CONTRIBUCION

1. **Revisar este archivo (`HARNESS.md`)**.
2. **Inspeccionar los archivos relevantes** (y su documentacion) antes de proponer cambios.
3. **Explicar la propuesta paso a paso** al usuario.
4. **Consultar cualquier duda tecnica o estetica** antes de implementar cambios dramaticos.
5. **Verificar** que el codigo no introduzca errores de sintaxis ni rompa contratos.
6. **Registrar el cambio** en `Historico de cambios/` con la convencion obligatoria.
7. **Verificar en navegador**: Abrir la app, hacer login, navegar por las secciones afectadas, confirmar que nada se rompio.

---

## 9. RECURSOS

- **Documentacion:** `docs/ARQUITECTURA.md`, `docs/MANUAL_USUARIO.md`, `docs/DEPLOY.md`, `docs/API_SYNC.md`
- **Entrada / arranque:** Abrir `index.html` en navegador moderno, o servir con `python -m http.server`
- **Configuracion:** `manifest.json` (PWA), CSP en `index.html` (meta tag)
- **Base de datos:** localStorage del navegador (key: `hapkido_athlete_tracker_data`)
- **Gestor de dependencias:** Ninguno (todo vendored en `vendor/`)
- **Comando de verificacion:** No hay build/lint. Verificar manualmente en navegador: login, navegacion, CRUD de atletas, evaluacion fisica, combate, impresion.

---

*Documento de gobernanza tecnica para **Hapkido Athlete Tracker**. Creado: 2026-09-17 . Revisar y actualizar cuando la arquitectura cambie.*
