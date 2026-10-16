# Registro de Cambios

## Cabecera
- **Modelo / Autor**: `opencode / mimo-v2.6-flash-free`
- **Fecha**: `2026-10-16`
- **Dia**: `Jueves`
- **Herramienta**: `opencode`

## Descripcion del Cambio
**Analizador determinista de combate (Fase 1) + Perfil de combate subjetivo del entrenador.**

Contexto: descartada la idea de analisis de video con LLM (requiere backend/GPU y dataset etiquetado), se implementa el enfoque de bajo costo y 100% offline acordado con el usuario: un motor de reglas transparentes sobre los datos que **ya captura el marcador** (puntos, tech1/2/3, kyongos, gamchoms por round) cruzados con la ficha fisica.

### Motor de reglas (`hapkido-analysis.js`, nuevo)
- `analyzeCombatRecord()`: por combate calcula margen, rounds ganados/perdidos, shares de tecnica (3pts/2pts/1pt), faltas efectivas (gamchom directo + floor(kyongo/2), consistente con el marcador), **curva de fatiga** (produccion R2 vs R1 con umbrales -35%/-15%/+15%), **disciplina** (umbrales 2/4 faltas efectivas), **estilo de pelea** (`classifyFightStyle()`, primera regla que matchea con evidencia numerica: Dominante explosivo, Superioridad controlada, Explosivo tecnico/indisciplinado, Presion por volumen, Contraataque defensivo, Tecnico tactico, Perfil mixto), fortalezas/debilidades/recomendaciones con reglas explicitas.
- `analyzeAthleteCombatForm()`: agrega N combates (respeta timeframe 3m/6m/1y/1a), record V-D, margen/promedio, tendencia de forma (ultimos 3 margenes), estilo dominante (moda), items recurrentes (>=40% de combates), y **cruce fisico** con la ultima FISICA (Ruffier, cadencia FSKT, rapaga 30s).
- `getCombatPrediction()`: indice orientativo = perfil subjetivo (50%) + clamp(5+promedio de margen oficial, 1-10) (50%); etiquetas Favorito claro/leve, Paridad, Desventaja con **descargo explicito** (no garantiza resultados). El usuario planteo que el perfil podria predecir marcador: se corrigio implementandolo como heuristica declarada, nunca como garantia, y siempre mezclando datos oficiales cuando existen.
- Filtros de rounds no disputados: el marcador guarda rounds 1-3 pre-inicializados en ceros; `isRoundFought()` descarta rounds sin acciones para no contabilizar empates falsos.

### Perfil de combate subjetivo (instructor/admin)
- Nuevo modal `#combat-profile-modal` desde el listado de atletas (icono `fa-people-martial-arts`, visible solo instructor/admin; mini-check verde si ya existe perfil).
- 8 metricas 1-10 con slider + rubrica (Explosividad, Derribos/Proyecciones, Patadas con tramos 1-3 basicas/4-6 avanzadas/7-10 combinaciones efectivas, Golpes sin cara, Disciplina/Temperamento, Resistencia/Recuperacion, Lectura Tactica/Adaptacion, Guardia/Defensa) + observaciones. Catalogo en `COMBAT_PROFILE_CATALOG` (agregar metricas nuevas = agregar una entrada).
- Se guarda en `athlete.combatProfile = { scores, notes, updatedAt, updatedBy }` y se muestra con barras en el panel de analisis.

### UI
- Nuevo panel "Analisis de Combate y Estilo de Pelea" (`#athlete-combat-analysis-card`) en Historial > progreso, renderizado por `renderCombatAnalysisPanel()` desde `loadAthleteAnalysis()`; chips de resumen, tarjetas (estilo, fatiga, disciplina, fortalezas, debilidades, cruce fisico, recomendaciones) y card de prediccion orientativa.

### Fix importante
- `saveAthlete()` en modo edicion **reemplazaba el objeto atleta completo**, perdiendo `combatProfile` (y potencialmente `status` de inactivos). Corregido con `Object.assign({}, atletaExistente, camposEditados)`.

### Version
- Bump `20261016-01`: `index.html` (14 referencias `?v=` incluyendo stylesheet), `sw.js` `CACHE_NAME`. Hard refresh requerido.

## Archivos Modificados
- `hapkido-analysis.js` (nuevo)
- `index.html` (modal perfil, panel analisis, script tag, version bump)
- `styles.css` (.cp-*, .ca-*; 955/955 llaves)
- `hapkido-athletes.js` (saveAthlete preserva extras, boton en lista, hook loadAthleteAnalysis + `_lastHistTimeframe`)
- `hapkido-init.js` (11 metodos registrados en requiredMethods)
- `sw.js` (CACHE_NAME)
- `CHANGELOG.md`, `TEST_MANUALES.md` (FLUJO 14)

## Verificacion
- `node --check` limpio: hapkido-analysis.js, hapkido-athletes.js, hapkido-init.js
- CSS llaves balanceadas 955/955
- Pendiente: prueba manual en navegador (FLUJO 14) por el usuario

## Siguientes Pasos (Fase 2, no implementada)
- Captura exprés en descanso de round (chips: fatiga 1-5, le funciono/le fallo, tendencias del rival, "no pudo cerrar distancia (alcance)")
- "Ficha de Esquina" imprimible para compartir con coach asesor
- Incluir comparacion de perfiles subjetivos en el H2H
- Flag "Al borde de KO técnico" (gap >= 10 pts): SOLO en el historial/panel del entrenador, NUNCA visible en el marcador en vivo (decision del usuario 2026-10-16 — evitar presion psicologica en pleno combate). Contexto: en San Cristobal una atleta gano por faltas rivales pero estuvo a 1 punto del KO tecnico (12 de 13); el margen debe alertar retroactivamente.
