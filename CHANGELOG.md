# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto adherce al [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Fixed
- **Impresión de planilla en blanco:** El CSS de impresión (`@media print`) ocultaba todos los elementos hijos de `#printable-area` porque la regla `body * { visibility: hidden !important }` no era sobrescrita para la planilla de campo. Se agregó `#printable-area, #printable-area * { visibility: visible !important }` en el bloque de impresión de `styles.css`.
- **`showToast()` no definido:** El método `showToast()` era invocado en `toggleOperatingMode()` y en la exportación CSV de atletas/evaluaciones, pero nunca fue definido en la clase `HapkidoApp`. Se implementó el método con notificaciones toast visuales que se auto-eliminan a los 4 segundos.
- **Meta tag deprecada:** Se agregó `<meta name="mobile-web-app-capable" content="yes">` en `index.html` para reemplazar la versión deprecada `apple-mobile-web-app-capable`.

### Added
- **Documentación README.md:** Documentación completa del proyecto con objetivos de la aplicación, funcionalidades detalladas (12 módulos), roles y permisos, stack tecnológico, estructura de archivos, guía de instalación y uso como PWA.
- **Licencia MIT:** Archivo `LICENSE` con titularidad de Javier Contreras.

---

## [1.0.0] - 2026-09-01

### Added
- **Dashboard** con tarjetas de acción rápida, estadísticas y lista de atletas recientes.
- **Gestión de Atletas:** CRUD completo con cálculo automático de categoría por edad y división por peso. Exportación a CSV.
- **Medición Física:** 20+ campos de evaluación (composición corporal, Ruffier, fuerza, potencia, flexibilidad, agilidad). Baremos por edad/género/cinta. Generación de plan de entrenamiento personalizado. Reporte imprimible.
- **Marcador de Combate:** Tablero digital con sistema de puntos (+1/+2/+3), penalizaciones (Kyongo/Gamchom), indicador de riesgo de descualificación, temporizador de rounds.
- **Exámenes de Cinta:** Currículum técnico por grado (17 niveles), checklist de técnicas, verificación de autorización, generación de certificado.
- **Torneos:** Registro con estados, inscripción de atletas, generación de llave/cuadro de combate, visualización de árbol.
- **Historial y Análisis:** Gráficos de evolución (Chart.js), comparador Head-to-Head, filtros por timeframe.
- **Temporizador de Tatami:** 4 modos (Combate, Tabata, EMOM, Cronómetro). Sonidos sintetizados y comandos de voz en coreano.
- **Manual de Estudio:** Historia del Hapkido, protocolos, glosario coreano (100+ términos), reglamento FEVEHAPKIDO 2026, programa técnico por cinta.
- **Sincronización Nube:** Multi-proveedor (Supabase, FEVEHAPKIDO API, REST personalizado). Widget de estado en encabezado.
- **Transferencia P2P:** Tokens Base64 con fusión inteligente de datos y validación de esquema.
- **Sistema de Autenticación:** Login con SHA-256 (Web Crypto API), 4 roles (admin, instructor, ayudante, atleta), RBAC en routing y UI.
- **PWA:** Service Worker con caché offline, Web App Manifest, instalable en dispositivos móviles.
- **Modos de Operación:** Modo Dojang (club) vs Modo Federación (nacional).
- **Respaldos:** Exportación/importación JSON completa, reset de datos.
