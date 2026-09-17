# Arquitectura Técnica - Medición del Atleta de Hapkido

> Sistema Integral de Gestión y Medición del Atleta de Hapkido — FEVEHAPKIDO 2026

---

## 1. Visión General

Aplicación web SPA (Single Page Application) construida 100% con archivos estáticos: sin frameworks, sin herramientas de compilación, sin npm. Todo el stack es vanilla JavaScript, CSS y HTML. Diseñada para funcionar offline como PWA en tablets y dispositivos móviles en el tatami.

### Características Principales

| Aspecto | Detalle |
|---------|---------|
| Arquitectura | SPA con routing hash (`#seccion`) |
| Persistencia | `localStorage` (key: `hapkido_athlete_tracker_data`) |
| UI | 1 archivo HTML (~2975 líneas), 1 archivo CSS (~5893 líneas) |
| Lógica | 13 módulos JS extendiendo `HapkidoApp.prototype` |
| Seguridad | CSP meta tag, escape XSS, SHA-256, sanitización P2P |
| Offline | PWA con Service Worker + Web App Manifest |
| Sync | Cloud sync (Supabase/FEVEHAPKIDO/REST) + tokens P2P |
| Dependencias | Todas vendored (Chart.js, Font Awesome, Outfit+Orbitron) |

---

## 2. Diagrama de Dependencias de Módulos

```
                    ┌─────────────────────────────────┐
                    │          index.html              │
                    │  (Shell HTML + Todas las vistas) │
                    └───────────────┬─────────────────┘
                                    │
                    ┌───────────────▼─────────────────┐
                    │            app.js                │
                    │  (Clase HapkidoApp - Core)       │
                    │  constructor, init(), routing,   │
                    │  sidebar, dashboard, modals,     │
                    │  escapeHTML(), event listeners   │
                    └───┬───────┬───────┬──────┬──────┘
                        │       │       │      │
       ┌────────────────┤       │       │      ├────────────────┐
       │                │       │       │      │                │
       ▼                ▼       ▼       ▼      ▼                ▼
┌──────────┐  ┌──────────┐ ┌────────┐ ┌─────┐ ┌──────────┐ ┌─────────┐
│hapkido-  │  │hapkido-  │ │hapkido-│ │...  │ │hapkido-  │ │hapkido- │
│data.js   │  │auth.js   │ │athletes│ │     │ │schools.js│ │torneos.js│
│          │  │          │ │.js     │ │     │ │          │ │         │
│loadData  │  │login     │ │CRUD    │ │     │ │CRUD      │ │CRUD     │
│saveData  │  │logout    │ │age/wt  │ │     │ │schools   │ │torneos  │
│export    │  │SHA-256   │ │cats    │ │     │ │assoc.    │ │brackets │
│import    │  │RBAC valid│ │alerts  │ │     │ │tabs      │ │inscrip. │
│reset     │  │Users CRUD│ │history │ │     │ │          │ │         │
└──────────┘  └──────────┘ └────────┘ └─────┘ └──────────┘ └─────────┘

       ┌──────────────────────────────────────────────────────┐
       │                    Módulos Funcionales                │
       │                                                      │
       │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
       │  │ hapkido-     │  │ hapkido-     │  │ hapkido-   │ │
       │  │ physical.js  │  │ combat.js    │  │ exams.js   │ │
       │  │ (~2631 líneas│  │ (584 líneas) │  │ (603 líneas│ │
       │  │  - Mayor     │  │  - Scoring   │  │  - Belt    │ │
       │  │    módulo)   │  │  - Penalties │  │  - Curriculum│
       │  │  - Ruffier   │  │  - Rounds    │  │  - Checklist│
       │  │  - IMC/WHtR  │  │  - Timer     │  │  - Certificate│
       │  │  - RFM/YMCA  │  │  - Rules     │  │            │ │
       │  │  - Charts    │  │              │  │            │ │
       │  └──────────────┘  └──────────────┘  └────────────┘ │
       │                                                      │
       │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
       │  │ hapkido-     │  │ hapkido-     │  │ hapkido-   │ │
       │  │ timer.js     │  │ sync.js      │  │ vocab.js   │ │
       │  │ (436 líneas) │  │ (424 líneas) │  │ (386 líneas│ │
       │  │ - 4 modos    │  │ - Supabase   │  │ - 100+     │ │
       │  │ - Web Audio  │  │ - FEVEHAPKIDO│  │   términos  │ │
       │  │ - Web Speech │  │ - Custom REST│  │ - Coreano  │ │
       │  │ - Fullscreen │  │ - P2P tokens │  │ - Categorías│
       │  └──────────────┘  └──────────────┘  └────────────┘ │
       └──────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────┐
                    │         hapkido-init.js          │
                    │  Bootstrap final:                │
                    │  - Valida prototype methods      │
                    │  - Instancia HapkidoApp          │
                    │  - Registra Service Worker       │
                    └─────────────────────────────────┘
```

### Orden de Carga (en index.html)

El orden de carga en `index.html` es crítico — cada módulo depende de que la clase `HapkidoApp` y los módulos anteriores ya estén cargados:

```
1.  vendor/chartjs/chart.umd.min.js   (Chart.js global)
2.  app.js                             (Define class HapkidoApp)
3.  hapkido-data.js                    (loadData, saveData, export, import)
4.  hapkido-auth.js                    (login, logout, SHA-256, users CRUD)
5.  hapkido-athletes.js                (athletes CRUD, age/weight, history)
6.  hapkido-physical.js                (physical evaluation engine)
7.  hapkido-combat.js                  (combat scoring, penalties)
8.  hapkido-exams.js                   (belt exams, curriculum)
9.  hapkido-schools.js                 (schools/associations CRUD)
10. hapkido-torneos.js                 (tournaments, brackets, enrollment)
11. hapkido-vocab.js                   (Korean vocabulary)
12. hapkido-timer.js                   (tatami timer, Web Audio/Speech)
13. hapkido-sync.js                    (cloud sync, P2P tokens)
14. hapkido-init.js                    (bootstrap, SW registration)
```

### Patrón de Extensión: Prototype Chaining

Cada módulo JS (excepto `hapkido-init.js`) extiende la clase `HapkidoApp` mediante `HapkidoApp.prototype.nombreMetodo = function() { ... }`. Esto permite que toda la lógica de negocio opere sobre la misma instancia (`window.app`) y tenga acceso directo a:

- `this.data` — Datos completos de la aplicación
- `this.currentUser` — Sesión del usuario activo
- `this.syncSettings` — Configuración de sincronización
- `this.charts` — Instancias de Chart.js
- `this.activeCombat` — Estado del combate en curso
- `this.timerState` — Estado del temporizador

---

## 3. Modelo de Datos

Todos los datos se almacenan en un único objeto JSON serializado en `localStorage` bajo la clave `hapkido_athlete_tracker_data`.

### 3.1 Estructura Principal

```javascript
{
  athletes: [ ... ],      // Colección de atletas
  records:  [ ... ],      // Registros de evaluaciones (físicas, combates)
  schools:  [ ... ],      // Escuelas / Dojangs
  associations: [ ... ],  // Asociaciones estadales
  users:    [ ... ],      // Usuarios del sistema (cuentas de acceso)
  torneos:  [ ... ]       // Torneos y topes
}
```

### 3.2 Colección: `athletes`

```javascript
{
  id:           "ath_carlos_gomez",        // Prefijo "ath_" + nombre_id
  name:         "Carlos Gómez",
  birthdate:    "2008-04-15",              // ISO 8601
  gender:       "MASCULINO" | "FEMENINO",
  belt:         "Azul",                    // Cinturón actual
  weight:       83.0,                      // kg (float)
  height:       171,                       // cm (entero)
  experience:   "3 años",
  school:       "Dojang Tigres",           // Referencia por nombre
  isAyudante:   true | false,              // Instructor en Entrenamiento
  modalities: {
    tradicional: true,                     // Defensa personal
    deportivo:   true                      // Combate deportivo
  },
  status:       "activo" | "inactivo",    // Soft-delete
  updatedAt:    "2026-05-10T..."          // Para sync (ISO timestamp)
}
```

**Cintas del sistema** (constante `BELT_ORDER`):

```
Blanco → Amarillo → Naranja → Verde → Azul → Morado → Rojo → Marrón
→ Negro 1er Dan → Negro 2do Dan → ... → Negro 9no Dan
```

**Categorías por edad** (calculadas):

| Categoría | Edad |
|-----------|------|
| Infantil | < 12 |
| Junior | 12–14 |
| Juvenil | 15–17 |
| Mayores / Adulto | 18–35 |
| Senior | 36–45 |
| Máster | 46+ |

### 3.3 Colección: `records`

```javascript
{
  id:          "rec_1",
  athleteId:   "ath_carlos_gomez",         // Referencia al atleta
  type:        "FISICA" | "COMBATE",
  date:        "2026-05-10",               // ISO 8601

  // Solo si type === "FISICA"
  physicalDetails: {
    // Cardiovascular (Test de Ruffier)
    pulseP1:        70,        // Pulso en reposo (lpm)
    pulseP2:        120,       // Pulso post-ejercicio
    pulseP3:        60,        // Pulso post-descanso
    ruffierIndex:   5.0,       // Calculado: ((P1+P2+P3)-200)/10
    ruffierLevel:   "Bueno",

    // Pruebas físicas generales
    pushups:        45,        // Flexiones en 1 min
    situps:         42,        // Abdominales en 1 min
    flexibility:    12,        // cm (sentadilla flexión)
    cooper:         2000,      // Metros en 12 min

    // Antropometría
    height:         171,       // cm
    weight:         83.0,      // kg
    waist:          92,        // cm (cintura)
    fat:            22.5,      // % grasa corporal (RFM/YMCA)

    // Potencia y velocidad
    jumpVertical:   35,        // cm
    jumpLong:       1.8,       // metros
    agility:        3.4,       // segundos (10m)
    grip:           45,        // kg (dinamómetro)
    split:          28,        // cm (flexibilidad sentadilla)

    // Técnicas deportivas (modalidad deportivo)
    scoreFiguresSin: 7.5,      // Hyungs sin armas (0-10)
    scoreFiguresCon: null,     // Hyungs con armas (0-10)
    scoreDemo:       null,     // Demostración libre (0-10)

    // Técnicas tradicionales
    scoreHyungs:    9.0,       // Formas Hyung
    scoreHosinsul:  9.2,       // Defensa personal
    scoreWeapons:   8.0,       // Armas

    // Resultados pre-calculados (evalResults)
    evalResults: {
      pushups:      { score: 8.6, level: "Bueno", cls: "success" },
      situps:       { score: 8.4, level: "Bueno", cls: "success" },
      flexibility:  { score: 9.2, level: "Bueno", cls: "success" },
      cooper:       { score: 6.0, level: "Medio", cls: "warning" },
      jumpLong:     { score: 7.0, level: "Bueno", cls: "success" },
      ruffier:      { score: 8.0, level: "Bueno", cls: "success" },
      imc:          28.38,                    // Índice de Masa Corporal
      imcLevel:     "Sobrepeso",
      whtr:         0.538,                    // Waist-to-Height Ratio
      whtrLevel:    "Elevado (Alto Riesgo)",
      jumpVertical: { score: 6.0, level: "Medio", cls: "warning" },
      agility:      { score: 7.0, level: "Bueno", cls: "success" },
      grip:         { score: 6.0, level: "Medio", cls: "warning" },
      split:        { score: 6.4, level: "Medio", cls: "warning" },
      hyungs:       { score: 9.0, level: "Excelente", cls: "success" },
      hosinsul:     { score: 9.2, level: "Excelente", cls: "success" },
      weapons:      { score: 8.0, level: "Bueno", cls: "success" },
      globalScore:  7.5,                      // Promedio ponderado
      globalLevel:  "Bueno",
      globalCls:    "success"
    }
  },

  // Solo si type === "COMBATE"
  combatDetails: {
    athleteId:    "...",
    opponentId:   "...",
    stage:        "ELIMINATORIA" | "SEMIFINAL" | "FINAL",
    ageCategory:  "Mayores / Adulto (18-35 años)",
    weightDivision: "-80 Kg",
    roundsData:   { ... },     // Ver módulo de combate
    winner:       "...",
    winReason:    "..."
  }
}
```

### 3.4 Colección: `schools`

```javascript
{
  id:             "sch_1",
  name:           "Dojang Tigres",
  location:       "Caracas, Centro",
  instructorName: "Maestro 1",
  instructorRole: "Maestro / Instructor",   // | "Instructor en Entrenamiento"
  associationId:  "asc_1"                   // Referencia a asociación estatal
}
```

### 3.5 Colección: `associations`

```javascript
{
  id:         "asc_1",
  name:       "Asociación del Distrito Capital",
  state:      "Distrito Capital",           // Estado venezolano
  federation: "Federación Venezolana de Hapkido"
}
```

### 3.6 Colección: `users`

```javascript
{
  id:         "usr_admin",
  username:   "admin",
  password:   "a665a459...",               // SHA-256 hash (Web Crypto API)
  role:       "admin" | "instructor" | "ayudante" | "athlete",
  name:       "Administrador",
  school:     null,                         // null para admin
  athleteId:  null,                         // Vínculo a atleta (para athlete/ayudante)
  rank:       "Administrador Central"       // Rango martial
}
```

### 3.7 Colección: `torneos`

```javascript
{
  id:          "trn_1",
  name:        "Copa Confederaciones FEVEHAPKIDO 2026",
  type:        "Torneo Nacional" | "Tope Inter-escuelas",
  date:        "2026-08-15",
  school:      "Federación Venezolana de Hapkido (Sede Central)",
  state:       "Distrito Capital",
  guests:      "Todas las escuelas a nivel nacional",
  referee:     "Maestro Central (Jefe de Árbitros FEVEHAPKIDO)",
  modalities: {
    combate:    true,
    saltos:     true,
    exhibicion: true
  },
  notes:       "Campeonato nacional clasificatorio...",
  status:      "Solicitado" | "Aprobado" | "Rechazado" | "Finalizado",

  // Inscripciones (sub-colección)
  inscripciones: [
    {
      athleteId:      "ath_carlos_gomez",
      athleteName:    "Carlos Gómez",
      category:       "Juvenil (15-17 años)",
      weightDivision: "-70 Kg",
      registeredAt:   "2026-07-01T..."
    }
  ],

  // Bracket de eliminatorias (generado por bracket generator)
  bracket: {
    category: "Mayores / Adulto (18-35 años) - Masculino - -80 Kg",
    matches: [
      {
        id:         "match_0",
        round:      0,         // 0=Cuartos, 1=Semis, 2=Final
        roundName:  "Cuartos de Final",
        athlete1:   { id, name, seed },
        athlete2:   { id, name, seed },
        winner:     null,
        score:      "",
        status:     "pending" | "completed"
      }
    ]
  }
}
```

---

## 4. Sistema de Enrutamiento (Routing SPA)

### 4.1 Mecanismo

El enrutamiento se basa en el `hashchange` del navegador:

```
window.addEventListener('hashchange', () => this.handleRouting());
```

La URL `https://host/#combate` se traduce a:

1. Extraer el hash: `#combate`
2. Mapear a sección HTML: `section-combate`
3. Mostrar solo esa sección (ocultar todas las demás)

### 4.2 Rutas Disponibles

| Hash | Sección HTML | Título | Módulo Principal |
|------|-------------|--------|-----------------|
| `#dashboard` | `section-dashboard` | Dashboard de Rendimiento | `app.js` |
| `#atletas` | `section-atletas` | Gestión de Atletas | `hapkido-athletes.js` |
| `#combate` | `section-combate` | Planilla de Puntuación de Combate | `hapkido-combat.js` |
| `#fisica` | `section-fisica` | Ficha Cardiovascular y Pruebas Técnicas | `hapkido-physical.js` |
| `#examenes` | `section-examenes` | Exámenes de Cinta y Currículum Técnico | `hapkido-exams.js` |
| `#historial` | `section-historial` | Historial de Rendimiento y Gráficos | `hapkido-athletes.js` |
| `#manual` | `section-manual` | Manual de Estudio y Reglamento Oficial 2026 | `hapkido-vocab.js` / `hapkido-exams.js` |
| `#timer` | `section-timer` | Temporizador Marcial de Tatami & Entrenamiento | `hapkido-timer.js` |
| `#torneos` | `section-torneos` | Calendario de Torneos y Topes | `hapkido-torneos.js` |
| `#ajustes` | `section-ajustes` | Respaldos y Configuración | `hapkido-sync.js` |
| `#escuelas` | `section-escuelas` | Gestión de Escuelas y Dojangs | `hapkido-schools.js` |
| `#usuarios` | `section-usuarios` | Gestión de Cuentas de Usuario | `hapkido-auth.js` |

### 4.3 Flujo del Routing

```
hashchange event
       │
       ▼
¿Usuario logueado? ─── No ──→ Mostrar login overlay, return
       │ Sí
       ▼
¿Es role 'athlete'? ── Sí ──→ ¿Hash en [#dashboard, #historial, #manual]?
       │                           │ No → Redirigir a #dashboard
       │                           │ Sí → Continuar
       ▼
¿Es role 'ayudante'? ─ Sí ──→ ¿Hash en [#dashboard, #combate, #torneos, #timer, #manual]?
       │                           │ No → Redirigir a #dashboard
       │                           │ Sí → Continuar
       ▼
¿Es role 'instructor'? Sí ──→ ¿Hash en [#ajustes, #escuelas, #usuarios]?
       │                           │ Sí → Redirigir a #dashboard
       │                           │ No → Continuar
       ▼
Ocultar todas las secciones (.app-section)
       │
       ▼
Mostrar sección activa (#section-{hash})
       │
       ▼
Actualizar sidebar highlight + auto-expandir grupo padre
       │
       ▼
Actualizar bottom nav (móvil)
       │
       ▼
Actualizar page title
       │
       ▼
Ejecutar lógica específica de ruta (render lists, init timer, etc.)
```

---

## 5. Sistema RBAC (Control de Acceso Basado en Roles)

El RBAC se implementa en **3 capas** concurrentes:

### Capa 1: Routing (Navegación)

Ubicada en `app.js:handleRouting()` (líneas 97–115).

| Rol | Rutas Permitidas | Rutas Prohibidas |
|-----|------------------|------------------|
| `admin` | Todas | Ninguna |
| `instructor` | Todas excepto ajustes, escuelas, usuarios | `#ajustes`, `#escuelas`, `#usuarios` |
| `ayudante` | `#dashboard`, `#combate`, `#torneos`, `#timer`, `#manual` | Todas las demás |
| `athlete` | `#dashboard`, `#historial`, `#manual` | Todas las demás |

Si un usuario intenta acceder a una ruta no autorizada, es redirigido a `#dashboard`.

### Capa 2: UI (Interfaz de Usuario)

- **Sidebar**: Los elementos de navegación se ocultan/muestran con CSS mediante clases en `<body>`:
  ```css
  body.role-athlete .nav-group#group-atletas { display: none; }
  body.role-athlete .nav-item#nav-fisica { display: none; }
  ```
- **Botones de acción**: Los botones CRUD se deshabilitan o ocultan condicionalmente en el HTML renderizado:
  ```javascript
  // En renderUsersList():
  usr.username === 'admin' ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''
  ```
- **Campos de formulario**: Los selects se deshabilitan para roles no-admin:
  ```javascript
  // En populateAthleteSchoolsDropdown():
  if (this.currentUser.role !== 'admin') {
      select.value = this.currentUser.school || '';
      select.disabled = true;
  }
  ```

### Capa 3: Datos (Filtrado de Datos)

- **Dashboard**: Los instructors solo ven atletas de su escuela:
  ```javascript
  // app.js:updateDashboardStats()
  if (this.currentUser.role !== 'admin') {
      athletes = this.data.athletes.filter(a => a.school === this.currentUser.school);
  }
  ```
- **Combate**: Los oponentes se filtran por modalidad deportivo y por escuela:
  ```javascript
  // hapkido-combat.js:updateOpponentDropdown()
  if (this.currentUser.role !== 'admin') {
      athletes = this.data.athletes.filter(a => a.school === this.currentUser.school);
  }
  ```
- **Exámenes**: Los ayudantes solo pueden evaluar grados inferiores a su propio cinturón:
  ```javascript
  // hapkido-exams.js:loadBeltExam()
  if (this.currentUser.role === 'ayudante') {
      const indexCurrentUser = BELTS.indexOf(this.currentUser.belt);
      if (indexTarget >= indexCurrentUser) {
          alert("No tienes permisos para evaluar este examen...");
      }
  }
  ```
- **Validación de privilegios al crear usuarios** (`hapkido-auth.js:validateUserPrivilege()`):
  - `admin`: Requiere rango de Federación/Maestro 4to Dan+
  - `instructor`: Requiere Cinturón Negro 1er Dan+
  - `ayudante`: Requiere mínimo Cinturón Verde

### Roles del Sistema

| Rol | Carga Funcional | Permisos |
|-----|-----------------|----------|
| `admin` | Administrador / Maestro Director | Acceso total. CRUD de todos los usuarios, escuelas, asociaciones, atletas. Gestión de torneos y aprobación de solicitudes. Configuración de sync. |
| `instructor` | Instructor / Entrenador de Dojang | CRUD de atletas de su escuela. Evaluaciones físicas, combates, exámenes. Crear topes (solicitado). No accede a ajustes ni gestión de usuarios. |
| `ayudante` | Mesa Técnica / Juez / Cronometrador | Combate (scoring), torneos (solo lectura/inscripción), timer, manual. Solo evalúa grados inferiores a su cinturón. |
| `athlete` | Atleta / Alumno | Dashboard personal, historial de rendimiento y gráficos, manual de estudio. Solo ve sus propios datos. |

---

## 6. Medidas de Seguridad

### 6.1 Content Security Policy (CSP)

Definida en `index.html` línea 14:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://api.fevehapkido.org;
  frame-src 'self';
">
```

- **script-src**: Solo permite scripts del mismo dominio + inline (necesario para `onclick` handlers)
- **connect-src**: Solo permite conexiones a Supabase y la API federativa
- **img-src**: Permite imágenes data: y blob: (para exportación)

### 6.2 Protección XSS

Función `escapeHTML()` en `app.js:248–256`:

```javascript
escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
```

Se aplica universalmente al renderizar datos del usuario en el DOM:
```javascript
const safeUsername = this.escapeHTML(usr.username);
const safeName = this.escapeHTML(usr.name);
```

### 6.3 Contraseñas SHA-256

`hapkido-auth.js:10–26` usa la **Web Crypto API** para hashing SHA-256:

```javascript
const msgBuffer = new TextEncoder().encode(str);
const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
```

- Detección automática de hashes ya hasheados (64 caracteres hex)
- Migración transparente de plaintext a hash en localStorage al hacer login
- Hash de admin hardcodeado: `a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3` (SHA-256 de "123")

### 6.4 Sanitización de Importación P2P

`hapkido-sync.js:289–408` implementa validación robusta al importar tokens:

1. **Límite de tamaño**: Máximo 5MB
2. **Validación de esquema**: Verifica que el token contenga `athletes[]` y `records[]`
3. **Whitelist de campos**: Solo se aceptan campos conocidos y validados
4. **Sanitización de strings**: IDs limpiados con regex, nombres truncados a 100 chars
5. **Tipado estricto**: Campos numéricos verificados, strings forzados
6. **Eliminación de prototype pollution**: `delete cleanRec.physicalDetails.__proto__`
7. **Merge inteligente**: Fusión por ID sin sobrescribir datos locales no conflictivos

### 6.5 Otras Medidas

- **Sesión**: Se almacena en `localStorage` (`hapkido_current_user`) — se limpia al hacer logout
- **Global alert override**: `window.alert` se redirige a un modal personalizado (`app.js:902`)
- **Protección del admin**: El usuario `admin` no se puede eliminar desde la UI
- **Cierre de sesión**: Limpia `localStorage`, cierra sidebar, cierra modales, resetea formulario

---

## 7. Arquitectura PWA (Progressive Web App)

### 7.1 Web App Manifest

`manifest.json` configura:

```json
{
  "name": "Hapkido Athlete Tracker",
  "short_name": "HapkidoTracker",
  "display": "standalone",
  "background_color": "#0f131a",
  "theme_color": "#00b4d8",
  "orientation": "portrait-primary",
  "categories": ["sports", "fitness", "productivity"]
}
```

- **Modo standalone**: Se ejecuta como app nativa (sin barra de navegador)
- **Orientación portrait**: Optimizado para tablets竖屏 en el tatami
- **Iconos**: 4 tamaños (64px, 192px, 512px, 512px maskable)

### 7.2 Service Worker (`sw.js`)

**Nombre de caché**: `hapkido-tracker-v20260901-23`

**Estrategias de Cacheo:**

```
┌─────────────────────────────────────────────────┐
│              Evento Fetch del SW                │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
              ¿Método GET? ── No ──→ Ignorar
                        │ Sí
                        ▼
         ¿Es código de app? (.js, .html, .css, /)
                        │
              ┌─────────┴─────────┐
              Sí                  No
              │                   │
              ▼                   ▼
     ┌────────────────┐  ┌────────────────┐
     │ Network-First  │  │  Cache-First   │
     │                │  │                │
     │ 1. fetch()     │  │ 1. cache.match│
     │ 2. Actualizar  │  │ 2. Si no:     │
     │    caché       │  │    fetch() +  │
     │ 3. Si offline: │  │    cachear     │
     │    caché       │  │               │
     └────────────────┘  └────────────────┘
```

- **Network-First** (JS/HTML/CSS): Siempre intenta obtener la versión más reciente del servidor. Si falla (offline), usa caché. Garantiza actualizaciones instantáneas.
- **Cache-First** (fonts, icons, Chart.js): Busca en caché primero. Si no está, descarga y cachea. Ideal para assets estáticos que no cambian.

**Ciclo de Vida:**
1. **Install**: Pre-cachea todos los `CORE_ASSETS` (HTML, CSS, 13 JS files, manifest, icons, Chart.js, Font Awesome, fonts)
2. **Activate**: Elimina cachés de versiones anteriores inmediatamente
3. **Fetch**: Aplica estrategia según tipo de recurso
4. **skipWaiting() + clients.claim()**: Nueva versión activa inmediatamente sin esperar a que se cierren pestañas

### 7.3 Assets Vendored

```
vendor/
├── chartjs/
│   └── chart.umd.min.js          (~200KB)
├── fontawesome/
│   ├── css/all.min.css
│   └── webfonts/                  (6 archivos .woff2/.ttf)
└── fonts/
    ├── fonts.css                  (Outfit + Orbitron)
    └── font_0.woff2 ... font_14.woff2  (15 archivos)
```

---

## 8. Protocolo de Sincronización en la Nube

### 8.1 Proveedores Soportados

El módulo `hapkido-sync.js` soporta 4 modos de sincronización:

| Proveedor | Endpoint | Método |
|-----------|----------|--------|
| `fevehapkido_api` | `https://api.fevehapkido.org/v1/sync` | REST POST |
| `supabase` | `https://*.supabase.co/...` | Supabase REST API |
| `custom_rest` | URL configurable | POST genérico |
| `p2p_token` | N/A (offline) | Token base64 copiado/pegado |

### 8.2 Configuración de Sync

Almacenada en `localStorage` key: `hapkido_sync_settings`:

```javascript
{
  enabled:              true,
  provider:             'fevehapkido_api',
  endpointUrl:          'https://api.fevehapkido.org/v1/sync',
  apiKey:               '',
  autoSync:             true,
  conflictStrategy:     'latest_timestamp',  // | 'keep_local' | 'overwrite_remote'
  lastSyncTimestamp:    "2026-09-15T10:30:00Z",
  pendingChangesCount:  0
}
```

### 8.3 Protocolo de Sincronización

```
┌──────────────────────────────────────────────────┐
│            Flujo de Sincronización               │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
              ¿Hay conexión? ─── No ──→ Cola de cambios pendientes
                       │ Sí                    │
                       ▼                       │ (auto-sync al reconectar)
              ¿Ya sincronizando?               │
              ─── Sí ──→ Return                │
                       │ No                    │
                       ▼                       │
         Taggear timestamps en todos            │
         los items sin updatedAt                │
                       │                       │
                       ▼                       │
           ┌───── fetch(endpoint) ─────┐       │
           │  Headers:                 │       │
           │  Authorization: Bearer    │       │
           │  X-Client-Version:        │       │
           │    FEVEHAPKIDO-2026       │       │
           │  Body: { clientData,      │       │
           │    syncTimestamp }         │       │
           └───────────┬───────────────┘       │
                       │                       │
              ┌────────┴────────┐              │
              OK               Error           │
              │                │               │
              ▼                ▼               │
     Servidor responde   Fallback local        │
     con mergedData      (cifrado en cola)     │
              │                               │
              ▼                               │
     Aplicar mergedData a this.data           │
              │                               │
              ▼                               │
     saveData(true)                           │
     (sin notificar sync)                     │
              │                               │
              ▼                               │
     Reset pendingChangesCount = 0            │
     Guardar lastSyncTimestamp                │
     Actualizar widget de sync                │
```

### 8.4 Resolución de Conflictos

| Estrategia | Comportamiento |
|------------|---------------|
| `latest_timestamp` | Gana el item con `updatedAt` más reciente |
| `keep_local` | Siempre preservar la versión local |
| `overwrite_remote` | Siempre usar la versión del servidor |

### 8.5 Widget de Sincronización (Header)

El widget en la cabecera muestra el estado en tiempo real:

| Estado | Icono | Texto | Color |
|--------|-------|-------|-------|
| Offline | `fa-cloud-slash` | Sin Conexión | Rojo |
| Syncing | `fa-rotate fa-spin` | Sincronizando... | Azul |
| Pendientes | `fa-cloud-arrow-up` | N Pendientes | Amarillo |
| Sincronizado | `fa-cloud-check` | Sincronizado HH:MM | Verde |
| Idle | `fa-cloud` | Nube Activa | Gris |

### 8.6 Tokens P2P (Peer-to-Peer)

Para compartir datos entre dispositivos/dojangs sin servidor:

**Generación:**
```javascript
payload = {
    version: '2026.1',
    exportedAt: ISO timestamp,
    athletes: [...],
    records: [...],
    schools: [...],
    torneos: [...]
}
token = btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
```

**Importación con sanitización completa:**
1. Decodificar base64 de forma segura (TextDecoder UTF-8)
2. Validar estructura del objeto
3. Sanitizar cada campo (IDs, nombres, fechas, numéricos)
4. Eliminar potencial prototype pollution
5. Fusionar con datos locales (merge por ID)

---

## 9. Módulo de Temporizador Tatami (`hapkido-timer.js`)

### 9.1 Modos de Operación

| Modo | Configuración | Uso |
|------|--------------|-----|
| **Combate** | Trabajo: 120s, Descanso: 30s, Rondas: 2 | Combate oficial FEVEHAPKIDO |
| **Tabata** | Trabajo: 20s, Descanso: 10s, Ciclos: 8 | Entrenamiento HIIT |
| **EMOM** | 60s trabajo, N minutos | Every Minute On the Minute |
| **Cronómetro** | Progresivo ascendente | Cronómetro libre |

### 9.2 Tecnologías de Audio

- **Web Audio API**: Sintetiza tonos de inicio/fin de ronda, alertas de tiempo (sin archivos de audio externos)
- **Web Speech API**: Comandos vocales en coreano (`¡Si-jak!`, `¡Keu-man!`, `¡Gye-sok!`)

---

## 10. Motor de Evaluación Física (`hapkido-physical.js`)

### 10.1 Métricas Calculadas

| Fórmula | Campo | Descripción |
|---------|-------|-------------|
| `((P1+P2+P3)-200)/10` | `ruffierIndex` | Índice de Ruffier (cardiovascular) |
| `64 - 20*(altura/cintura)` | RFM masculino | Relative Fat Mass |
| `76 - 20*(altura/cintura)` | RFM femenino | Relative Fat Mass |
| YMCA formula | `% grasa YMCA` | Fórmula YMCA (cintura + peso) |
| `(peso/altura²)*10000` | IMC | Índice de Masa Corporal |
| `cintura/altura` | WHtR | Waist-to-Height Ratio |

### 10.2 Clasificaciones por Edad

- **Infantil (<12)**: Formularios adaptados (flexiones adaptadas, Navette en vez de Cooper)
- **Junior+**: Formularios estándar con pruebas deportivas adicionales

### 10.3 Scoring Automático

Cada métrica se evalúa según tablas de referencia por edad/género y se clasifica:

| Nivel | Clase CSS | Rango Score |
|-------|-----------|-------------|
| Excelente | `success` | 9.0–10.0 |
| Bueno | `success` | 7.0–8.9 |
| Medio | `warning` | 5.0–6.9 |
| Insuficiente | `danger` | 3.0–4.9 |
| Malo | `danger` | 0–2.9 |

**Score global** = Promedio ponderado de todas las métricas evaluadas.

---

## 11. Cómo Extender la Aplicación

### 11.1 Agregar un Nuevo Módulo

Para crear un nuevo módulo funcional (por ejemplo, `hapkido-reportes.js`):

**Paso 1: Crear el archivo JS**

```javascript
console.log('Module: hapkido-reportes.js loaded');

HapkidoApp.prototype.generateReport = function() {
    const athletes = this.data.athletes;
    // Lógica del reporte...
};

HapkidoApp.prototype.renderReportTable = function() {
    const tbody = document.querySelector('#reportes-table tbody');
    // Renderizar tabla...
};
```

**Paso 2: Agregar al HTML (`index.html`)**

Agrega la sección de contenido dentro de `<main class="app-main">`:

```html
<section id="section-reportes" class="app-section">
    <div class="section-content">
        <div class="section-header">
            <h2><i class="fa-solid fa-file-lines"></i> Reportes</h2>
        </div>
        <div class="section-body">
            <!-- Contenido del reporte -->
        </div>
    </div>
</section>
```

**Paso 3: Agregar navegación al sidebar**

Dentro de `<nav class="sidebar-nav">`:

```html
<a href="#reportes" class="nav-subitem" id="nav-reportes">
    <i class="fa-solid fa-file-lines"></i>
    <span>Reportes</span>
</a>
```

**Paso 4: Agregar el `<script>` en `index.html`**

```html
<script src="hapkido-reportes.js"></script>
```

**Paso 5: Agregar al Service Worker (`sw.js`)**

Agrega el archivo a `CORE_ASSETS`:

```javascript
const CORE_ASSETS = [
  // ... archivos existentes
  './hapkido-reportes.js',
];
```

**Paso 6: Registrar en `hapkido-init.js`**

Agrega los métodos requeridos al array `requiredMethods`:

```javascript
const requiredMethods = [
    // ... métodos existentes
    'generateReport',
    'renderReportTable'
];
```

**Paso 7: Agregar al routing (`app.js`)**

En `handleRouting()`, agrega la inicialización:

```javascript
if (hash === '#reportes') {
    this.renderReportTable();
}
```

En `titles`, agrega el título:

```javascript
const titles = {
    // ... títulos existentes
    '#reportes': 'Reportes del Sistema'
};
```

**Paso 8: Agregar RBAC si es necesario**

En `handleRouting()`, ajusta los roles permitidos:

```javascript
// Para instructor - agregar 'reportes' a rutas permitidas
const allowedHashes = ['#dashboard', '#combate', '#torneos', '#timer', '#manual', '#reportes'];
```

### 11.2 Agregar una Nueva Colección de Datos

1. Agregar el array en `loadData()` dentro de `hapkido-data.js` (en `defaultData`)
2. Agregar migración automática en el bloque `if (json)` de `loadData()`:
   ```javascript
   if (!parsed.nueva_coleccion) {
       parsed.nueva_coleccion = defaultData.nueva_coleccion;
       changed = true;
   }
   ```
3. Agregar el campo a la exportación P2P en `generateP2PShareToken()`
4. Agregar sanitización en `importP2PShareToken()`
5. Agregar a la sincronización cloud (colección en el `forEach` de `syncWithCloud()`)

### 11.3 Agregar una Nueva Métrica Física

1. Agregar campo en el seed data de `records` dentro de `hapkido-data.js`
2. Agregar input en el HTML de `section-fisica`
3. Agregar cálculo de score en `hapkido-physical.js` (función `evaluatePhysicalMetrics`)
4. Agregar al `evalResults` del record
5. Agregar al gráfico de radar en `renderPhysicalProfileChart`

### 11.4 Patrones de Código a Seguir

- **Nomenclatura**: Funciones `camelCase`, IDs de elementos `kebab-case`, prefijos de colección (`ath_`, `rec_`, `sch_`, `asc_`, `usr_`, `trn_`)
- **Rendering**: Todas las funciones de renderizado borran `innerHTML` del contenedor y reconstruyen desde cero
- **Modales**: Se abren/cierran con `.classList.add('active')` / `.classList.remove('active')`
- **Eventos**: Se asignan en `setupEventListeners()` dentro del constructor, no inline en el HTML (excepto `onclick` en botones dinámicos)
- **Persistencia**: Siempre llamar `this.saveData()` después de modificar `this.data`
- **Seguridad**: Siempre usar `this.escapeHTML()` al renderizar datos de usuario en el DOM

---

## 12. Variables CSS (Design System)

`styles.css` define un design system completo mediante CSS Custom Properties:

```css
:root {
    /* Paleta de colores */
    --bg-dark:            #0f131a;
    --bg-surface:         rgba(23, 29, 41, 0.75);
    --text-primary:       #f1f5f9;
    --text-secondary:     #94a3b8;
    --primary:            #38bdf8;   /* Sky Blue / Sport */
    --accent:             #f59e0b;   /* Gold / Traditional */
    --blue-competitor:    #2563eb;
    --red-competitor:     #dc2626;
    --success:            #10b981;
    --warning:            #f59e0b;
    --danger:             #ef4444;

    /* Tipografía */
    --font-main:          'Outfit', sans-serif;
    --font-digital:       'Orbitron', sans-serif;

    /* Transiciones */
    --transition-fast:    0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-normal:  0.3s cubic-bezier(0.4, 0, 0.2, 1);

    /* Sombras */
    --shadow-sm:          0 2px 8px rgba(0, 0, 0, 0.25);
    --shadow-md:          0 8px 24px rgba(0, 0, 0, 0.35);
    --shadow-glow-blue:   0 0 20px rgba(56, 189, 248, 0.35);

    /* Border radius */
    --radius-sm:          8px;
    --radius-md:          14px;
    --radius-lg:          20px;
    --radius-full:        9999px;
}
```

---

## 13. Almacenamiento en localStorage

### Claves Utilizadas

| Clave | Tipo | Propósito |
|-------|------|-----------|
| `hapkido_athlete_tracker_data` | JSON string | Datos completos de la aplicación |
| `hapkido_current_user` | JSON string | Sesión del usuario logueado |
| `hapkido_sidebar_collapsed` | `"0"` o `"1"` | Estado del sidebar (colapsado/no) |
| `hapkido_operating_mode` | `"dojang"` o `"federation"` | Modo de operación |
| `hapkido_sync_settings` | JSON string | Configuración de sincronización cloud |

### Self-Healing en `loadData()`

Al cargar datos, `hapkido-data.js` ejecuta automáticamente:

1. **Limpieza de encoding**: Detecta y corrige caracteres `Ã` (doble encoding UTF-8)
2. **Migración de esquema**: Agrega colecciones faltantes (`schools`, `associations`, `users`, `torneos`)
3. **Corrección del admin**: Asegura que el usuario admin exista con credenciales correctas
4. **Asociación de escuelas**: Asocia escuelas huérfanas a la primera asociación disponible
5. **Inyección de la federación**: Asegura que `sch_fed` exista en schools

---

## 14. Dependencias Vendored

| Dependencia | Versión | Tamaño aprox. | Uso |
|------------|---------|---------------|-----|
| Chart.js | UMD build | ~200KB | Gráficos de radar, línea, barra (historial) |
| Font Awesome | 6.x | ~150KB | Iconografía (solid, regular, brands) |
| Outfit | Custom woff2 | ~80KB | Fuente principal (UI) |
| Orbitron | Custom woff2 | ~30KB | Fuente digital (scores, timer) |

Todas las dependencias están vendored localmente en `vendor/`. No se realizan peticiones CDN externas.

---

## 15. Flujo de Inicialización Completo

```
Navegador carga index.html
         │
         ▼
Carga CSS (styles.css) + Fonts (Outfit/Orbitron)
         │
         ▼
Carga Chart.js (vendor)
         │
         ▼
Carga app.js → Define class HapkidoApp
         │
         ▼
Carga hapkido-* modules (12 archivos)
→ Cada uno agrega métodos a HapkidoApp.prototype
         │
         ▼
Carga hapkido-init.js
         │
         ├─ Valida que todos los prototype methods existan
         │  (requiredMethods array)
         │
         ├─ window.app = new HapkidoApp()
         │    │
         │    ├─ constructor(): currentUser=null, loadData(),
         │    │  initVocabulary(), init()
         │    │
         │    ├─ init():
         │    │  ├─ Fecha actual en header
         │    │  ├─ initOperatingMode() (dojang/federation)
         │    │  ├─ Restaurar sesión de localStorage
         │    │  ├─ handleRouting() → RBAC check → render sección
         │    │  ├─ setupEventListeners() → binds de todos los formularios
         │    │  ├─ restoreSidebarState()
         │    │  ├─ updateDashboardStats()
         │    │  ├─ renderAthletesList()
         │    │  ├─ populateAthleteDropdowns()
         │    │  └─ renderSchoolsList(), renderTorneosList()
         │    │
         │    └─ initCloudSync() (si está disponible)
         │         ├─ Cargar sync settings
         │         ├─ Listeners online/offline
         │         └─ Auto-sync si hay API key
         │
         └─ Registra Service Worker (sw.js)
              ├─ Pre-caché de CORE_ASSETS
              └─ Listeners fetch (Network-First / Cache-First)
```

---

*Documento generado para la aplicación Medición del Atleta de Hapkido — FEVEHAPKIDO 2026*
*Última actualización: Septiembre 2026*
