# Hapkido Athlete Tracker

Aplicación web progresiva (PWA) para la medición, evaluación y gestión integral del atleta de Hapkido, diseñada conforme al reglamento oficial de FEVEHAPKIDO 2026.

> **Beom Shin Kwan Hapkido** — Asociación de Hapkido Carabobo

**Licencia:** MIT

## Objetivos

1. **Estandarizar la evaluación física** del atleta de Hapkido utilizando baremos objetivos por edad, género y grado (cinta), con más de 20 métricas biométricas y de rendimiento.
2. **Digitalizar el proceso de combate** con un marcador electrónico que sigue el reglamento de FEVEHAPKIDO 2026 (sistema de puntos, penalizaciones, riesgo de descualificación).
3. **Gestionar el progreso del atleta** a través de exámenes de cinta, historial de rendimiento y gráficos de evolución temporal.
4. **Facilitar el trabajo de campo** con planillas imprimibles para toma de datos manual en el tatami, sincronización con la nube y transferencia P2P entre dispositivos.
5. **Servir como manual de estudio** integrado con vocabulario coreano, reglamento, programa técnico por cinta e historia del Hapkido.
6. **Operar 100% offline** como PWA instalable, funcionando sin conexión a internet en tablets, teléfonos o computadoras durante el entrenamiento.

## Funcionalidades

### Gestión de Atletas
- Registro completo: nombre, fecha de nacimiento, género, cinturón (17 grados), peso, estatura, escuela, modalidad (tradicional/deportiva/ambas)
- Cálculo automático de categoría por edad y división por peso
- Exportación a CSV/Excel

### Medición Física
- Evaluación con 20+ campos: composición corporal, test de Ruffier, fuerza, potencia, flexibilidad, agilidad, velocidad
- Cálculo automático de grasa corporal, IMC, Ruffier Index y nivel de condición
- Puntuación contra baremos específicos por edad/género/cinta
- Generación de plan de entrenamiento personalizado según resultados
- Reporte imprimible con nivel por dimensión física

### Marcador de Combate
- Tablero digital con puntaje en tiempo real (+1/+2/+3 puntos)
- Gestión de penalizaciones: Kyongo (leve, 2 = 1 Gamchom) y Gamchom (grave, +1 punto al rival)
- Indicador de riesgo de descualificación (4 Gamchoms = DQ)
- Temporizador de rounds y registro de acción por round

### Exámenes de Cinta
- Currículum técnico por grado (17 niveles: Blanco a Negro 9no Dan)
- Checklist de técnicas: golpes, patadas, llaves, proyecciones, caídas, hyungs, hosinsul, armas
- Verificación de autorización (ayudantes no pueden examinar por encima de su propio grado)

### Torneos y Competencias
- Registro de torneos con estados (Solicitado / Aprobado / Rechazado)
- Inscripción de atletas con cálculo automático de división
- Generación de llave/cuadro de combate (aleatoria o por ranking)
- Visualización de árbol de llave con registro de resultados

### Historial y Análisis
- Gráficos de evolución: perfil físico (radar), Ruffier, fuerza, flexibilidad, resistencia, combate
- Comparador Head-to-Head entre dos atletas con análisis táctico
- Filtros por timeframe (3 meses, 6 meses, 1 año, todo)

### Temporizador de Tatami
- 4 modos: Combate Oficial, Tabata/HIIT, EMOM, Cronómetro
- Sonidos sintetizados (gong/campana) vía Web Audio API
- Comandos de voz en coreano (Sichak, Kalyo, Junbi, etc.) vía Web Speech API
- Pantalla completa para proyección en tatami

### Manual de Estudio
- Historia del Hapkido y sus 3 principios (Yu / Won / Hwa)
- Protocolos de dojang y jerarquía
- Glosario de vocabulario coreano con 100+ términos buscables
- Reglamento oficial de combate FEVEHAPKIDO 2026
- Programa técnico por cinta

### Sincronización y Respaldos
- Sincronización con la nube (Supabase, FEVEHAPKIDO API, o REST personalizado)
- Transferencia P2P vía tokens Base64 con fusión inteligente de datos
- Exportación/Importación de respaldos JSON completos
- Indicador de estado de sincronización en el encabezado

## Roles y Permisos

| Rol | Acceso |
|-----|--------|
| **Admin** | Acceso total. Gestiona usuarios, escuelas, asociaciones, aprueba torneos. |
| **Instructor** | Gestiona atletas de su escuela. Mediciones, exámenes, combate, torneos, historial. Sin acceso a ajustes, escuelas ni usuarios. |
| **Ayudante** | Dashboard, combate, torneos, timer, manual. No puede examinar atletas por encima de su grado. |
| **Atleta** | Ve su propio perfil, historial y manual. |

## Credenciales por Defecto (Beta)

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `123` | Administrador |
| `maestro1` | `123` | Instructor |
| `maestro2` | `123` | Instructor |
| `atleta1` | `123` | Ayudante |
| `atleta2` | `123` | Atleta |

## Tecnología

- **Arquitectura:** Vanilla JavaScript SPA (sin frameworks), prototype-based
- **Almacenamiento:** localStorage (offline-first)
- **Gráficos:** Chart.js (vendored)
- **Iconos:** Font Awesome 6 (vendored)
- **Fuentes:** Outfit + Orbitron (vendored)
- **PWA:** Service Worker + Web App Manifest (funciona 100% offline)
- **Seguridad:** CSP, SHA-256 (Web Crypto API), escape XSS, sanitización en importación P2P
- **Audio:** Web Audio API (sonidos sintetizados)
- **Voz:** Web Speech API (comandos en coreano)

## Estructura del Proyecto

```
.
├── index.html              # SPA principal (2975 líneas)
├── app.js                  # Clase core: routing, RBAC, sidebar, dashboard
├── hapkido-data.js         # Capa de datos: carga, guardado, migración, seed
├── hapkido-auth.js         # Autenticación: login, CRUD usuarios, SHA-256
├── hapkido-athletes.js     # Gestión de atletas: CRUD, categorías, exportación
├── hapkido-physical.js     # Evaluación física: métricas, baremos, reportes
├── hapkido-combate.js      # Sistema de combate: marcador, rondas, penalizaciones
├── hapkido-exams.js        # Exámenes de cinta: checklist, puntuación, promoción
├── hapkido-schools.js      # Gestión de escuelas y asociaciones
├── hapkido-torneos.js      # Torneos: inscripción, llaves, resultados
├── hapkido-vocab.js        # Vocabulario coreano del Hapkido
├── hapkido-timer.js        # Temporizador de tatami (4 modos)
├── hapkido-sync.js         # Sincronización nube y transferencia P2P
├── hapkido-init.js         # Bootstrap: instanciación y Service Worker
├── styles.css              # Sistema de diseño completo (5893 líneas)
├── manifest.json           # Web App Manifest (PWA)
├── sw.js                   # Service Worker (caché offline)
├── vendor/                 # Dependencias vendored (Chart.js, FA, fuentes)
├── icons/                  # Iconos PWA (64, 192, 512px)
├── docs/                   # Documentación
│   ├── ARQUITECTURA.md     # Documentación técnica y arquitectura del sistema
│   ├── MANUAL_USUARIO.md   # Guía de uso para instructores y administradores
│   ├── DEPLOY.md           # Guía de despliegue en hosting
│   ├── API_SYNC.md         # Protocolo de sincronización nube y P2P
│   ├── vocabulario/        # Vocabulario coreano del Hapkido
│   ├── tecnicas/           # Imágenes de técnicas
│   └── *.pdf, *.doc        # Reglamento y programa oficial
├── LICENSE                 # Licencia MIT
├── CHANGELOG.md            # Historial de versiones
└── CONTRIBUTING.md         # Guía para contribuidores
```

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Alucardje/Hapkido_Atlhete_Track.git
   ```
2. Abrir `index.html` en un navegador moderno.
3. (Opcional) Desplegar en GitHub Pages o cualquier servidor estático.

## Uso como PWA

1. Abrir la aplicación en Chrome/Edge/Safari.
2. Hacer clic en "Instalar" en la barra de direcciones, o
3. En móvil: Menú > "Agregar a pantalla de inicio".

La aplicación funcionará 100% offline después de la primera carga.

## Documentación

| Archivo | Descripción |
|---------|-------------|
| [MANUAL_USUARIO.md](docs/MANUAL_USUARIO.md) | Guía de uso paso a paso para instructores y administradores |
| [ARQUITECTURA.md](docs/ARQUITECTURA.md) | Documentación técnica: módulos, modelo de datos, RBAC, seguridad |
| [DEPLOY.md](docs/DEPLOY.md) | Guía de despliegue en GitHub Pages y hosting estático |
| [API_SYNC.md](docs/API_SYNC.md) | Protocolo de sincronización nube y transferencia P2P |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guía para contribuidores |
| [CHANGELOG.md](CHANGELOG.md) | Historial de versiones |
