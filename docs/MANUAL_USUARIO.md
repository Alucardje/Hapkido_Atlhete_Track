# Manual de Usuario — Hapkido Athlete Tracker

**Sistema Integral de Gestión y Medición del Atleta de Hapkido**
Conforme al Reglamento Oficial FEVEHAPKIDO 2026

---

## Tabla de Contenidos

1. [Primeros Pasos](#1-primeros-pasos)
2. [Iniciar Sesión](#2-iniciar-sesión)
3. [El Dashboard](#3-el-dashboard)
4. [Gestión de Atletas](#4-gestión-de-atletas)
5. [Medición Física](#5-medición-física)
6. [Marcador de Combate](#6-marcador-de-combate)
7. [Exámenes de Cinta](#7-exámenes-de-cinta)
8. [Torneos y Competencias](#8-torneos-y-competencias)
9. [Historial y Análisis](#9-historial-y-análisis)
10. [Temporizador de Tatami](#10-temporizador-de-tatami)
11. [Manual de Estudio](#11-manual-de-estudio)
12. [Escuelas y Asociaciones](#12-escuelas-y-asociaciones)
13. [Gestión de Usuarios](#13-gestión-de-usuarios)
14. [Respaldos y Sincronización](#14-respaldos-y-sincronización)
15. [Modo Dojang vs Modo Federación](#15-modo-dojang-vs-modo-federación)
16. [Consejos y Buenas Prácticas](#16-consejos-y-buenas-prácticas)
17. [Glosario de Roles](#17-glosario-de-roles)

---

## 1. Primeros Pasos

### 1.1 Instalación como PWA

La aplicación funciona como una **PWA (Progressive Web App)**, lo que significa que puede instalarse en tu dispositivo y funcionar 100% sin conexión a internet.

**Desde el navegador en computadora (Chrome/Edge):**

1. Abre `index.html` en tu navegador o accede a la URL donde está desplegada.
2. Haz clic en el ícono de **instalación** en la barra de direcciones (un ícono de monitor con una flecha).
3. Acepta instalar la aplicación.
4. Se creará un acceso directo en tu escritorio o menú de inicio.

**Desde un teléfono o tablet (Android):**

1. Abre la aplicación en Chrome.
2. Toca el menú (tres puntos) en la esquina superior derecha.
3. Selecciona **"Agregar a pantalla de inicio"**.
4. Confirma el nombre y toca **"Agregar"**.

**Desde iPhone/iPad (Safari):**

1. Abre la aplicación en Safari.
2. Toca el ícono de **compartir** (cuadro con flecha).
3. Selecciona **"Agregar a pantalla de inicio"**.
4. Confirma tocando **"Agregar"**.

> **Nota:** Después de la primera carga, la aplicación funciona completamente offline. No necesitas conexión a internet para usarla en el tatami.

### 1.2 Requisitos del Navegador

La aplicación es compatible con:
- Google Chrome 90+
- Microsoft Edge 90+
- Safari 15+ (iOS/macOS)
- Firefox 90+ (parcial — funciones de voz pueden no estar disponibles)

---

## 2. Iniciar Sesión

Al abrir la aplicación por primera vez, verás la pantalla de login.

1. Ingresa tu **usuario** y **contraseña**.
2. Presiona **"Iniciar Sesión"** o tecla **Enter**.

### Credenciales por Defecto (Beta)

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `123` | Administrador |
| `maestro1` | `123` | Instructor |
| `maestro2` | `123` | Instructor |
| `atleta1` | `123` | Ayudante |
| `atleta2` | `123` | Atleta |

> **Importante:** Estas credenciales son solo para pruebas. El administrador debe crear cuentas reales y cambiar las contraseles después de la primera vez.

### Cerrar Sesión

Haz clic en el botón **"Cerrar Sesión"** en la parte inferior de la barra lateral, o en el ícono de salida en la esquina superior derecha.

---

## 3. El Dashboard

El Dashboard es la pantalla principal que se muestra al iniciar sesión. Ofrece una visión general rápida.

### 3.1 Tarjetas de Acción Rápida

En la parte superior encontrarás 4 accesos directos:

- **Nueva Evaluación Física** — Accede directamente al formulario de medición.
- **Planilla de Campo** — Imprime una tabla para toma manual de datos en el tatami.
- **Timer de Tatami** — Abre el temporizador de entrenamiento.
- **Marcador de Combate** — Abre el tablero de puntuación digital.

### 3.2 Estadísticas Generales

Las tarjetas muestran:
- **Total de Atletas** registrados.
- **Atletas Deportivos** (modalidad competitiva).
- **Atletas de Defensa Personal** (modalidad tradicional).
- **Mediciones Registradas** (evaluaciones físicas).

### 3.3 Acciones Rápidas

Botones para crear un nuevo atleta, evaluar combate, generar ficha de evaluación o ver gráficos.

### 3.4 Atletas Recientes

Lista de los últimos 5 atletas registrados con su categoría y grado.

### 3.5 Atletas que Requieren Atención

Se muestra automáticamente si hay atletas sin mediciones recientes o con evaluaciones vencidas.

### 3.6 Vista del Atleta (Rol Atleta)

Si iniciaste sesión con el rol de **Atleta**, el Dashboard muestra tu perfil personal, tu última evaluación física y un plan de entrenamiento personalizado según tus resultados.

---

## 4. Gestión de Atletas

Accede desde el menú lateral: **Atletas > Gestión Atletas**.

### 4.1 Registrar un Nuevo Atleta

1. Haz clic en **"Nuevo Atleta"**.
2. Completa los campos del formulario:
   - **Nombre Completo** — Nombre y apellido del atleta.
   - **Fecha de Nacimiento** — Se usa para calcular la categoría por edad automáticamente.
   - **Género** — Masculino o Femenino.
   - **Cinturón (Grado)** — Selecciona entre los 17 grados disponibles (Blanco a Negro 9no Dan).
   - **Peso actual (kg)** — Peso en kilogramos.
   - **Estatura actual (cm)** — Estatura en centímetros.
   - **Nivel de Experticia** — Se actualiza automáticamente al cambiar el cinturón:
     - Principiante (Blanco a Verde)
     - Intermedio (Azul a Rojo)
     - Avanzado (Negro 1er-3er Dan)
     - Master (Negro 4to Dan en adelante)
   - **Escuela / Dojang** — Selecciona la escuela a la que pertenece.
   - **Modalidad de Enseñanza** — Puede ser Tradicional (Defensa Personal), Deportivo (Competitivo), o Ambas.
3. Haz clic en **"Guardar Atleta"**.

> **Nota:** Si el atleta tiene cinturón Verde o superior, aparecerá la opción **"Instructor en Entrenamiento"** (marcador de ayudante).

### 4.2 Ver y Editar Atletas

La tabla de listado muestra: nombre, edad, género, cinturón, peso/estatura, modalidad, categoría y división.

Para editar:
1. Haz clic en el ícono de **editar** (lápiz) en la columna de acciones.
2. Modifica los campos necesarios.
3. Guarda los cambios.

### 4.3 Categoría por Edad y División por Peso

La aplicación calcula automáticamente:
- **Categoría por edad** según la fecha de nacimiento (Infantil, Juvenil, Adulto, Veterano, etc.).
- **División por peso** conforme al reglamento FEVEHAPKIDO 2026.

### 4.4 Desactivar un Atleta

Si un atleta se retira, puedes desactivarlo en lugar de eliminarlo. Su historial se conserva y se muestra en la sección **"Atletas Inactivos"**.

### 4.5 Exportar a CSV/Excel

Haz clic en **"Exportar Excel / CSV"** para descargar la lista de atletas en formato de hoja de cálculo.

---

## 5. Medición Física

Accede desde el menú lateral: **Mediciones > Medición Física**.

Esta sección permite evaluar el rendimiento físico del atleta con más de 20 métricas y baremos específicos por edad, género y cinturón.

### 5.1 Realizar una Evaluación

1. Selecciona el **atleta** del desplegable.
2. La estatura y peso se autocompletan del perfil del atleta.
3. Ingresa la **fecha de la prueba**.
4. Completa las siguientes secciones:

#### Composición Corporal y Antropometría Marcial
- **Estatura (cm)** — Altura del atleta.
- **Peso (kg)** — Peso corporal.
- **Cintura (cm)** — Perímetro de cintura.
- **Grasa Corporal (%)** — Se calcula automáticamente con fórmulas RFM, YMCA y pliegues cutáneos.
- **Envergadura (cm)** — Distancia punta a punta con brazos extendidos (alcance de combate).
- **Perímetro Cuello (cm)** — Protección cervical ante impactos.
- **Perímetro Muslo (cm)** — Medido a 15 cm sobre la rótula (potencia de pateo).
- **Pliegue Tríceps (mm)** y **Pliegue Abdominal (mm)** — Para cálculo de grasa.

#### Evaluación Cardiovascular
- **Pulso Basal (FC1)** — Pulsaciones tras 5 minutos de calma.
- **Pulso Post-Esfuerzo Inmediato (FC2)** — Inmediatamente después de las sentadillas.
- **Pulso Recuperación 1 min (FC3)** — Un minuto después del esfuerzo.
- **Índice de Ruffier** — Se calcula automáticamente: `(FC1 + FC2 + FC3 - 200) / 10`.
  - Excelente: ≤ 0
  - Bueno: 0-5
  - Medio: 5-10
  - Insuficiente: 10-15
  - Malo: > 15

#### Fuerza
- **Flexiones de pecho (1 min)** — Adaptadas para menores de 12 años.
- **Abdominales (1 min)** — Adaptadas para menores de 12 años.
- **Fuerza de Agarre (kg)** — Dynamómetro.

#### Potencia
- **Salto Vertical / Sargent (cm)** — Potencia de piernas.
- **Salto en Largo (cm)** — Solo para atletas deportivos.

#### Resistencia
- **Test de Cooper (m)** — Distancia en 12 minutos. Para menores: Test de Navette.
- **Velocidad 10m (seg)** — Tiempo en 10 metros planos.

#### Flexibilidad
- **Flexión Adelante Sentado (cm)** — Toque de puntas.
- **Apertura Lateral (cm)** — Apertura de piernas.

#### Para Atletas Deportivos (modalidad competitiva)
- **Puntuación Figuras Sin Arma** — Calificación de hyungs.
- **Puntuación Figuras Con Arma** — Calificación con armas.
- **Puntuación Demostración** — Calificación de demostración.

### 5.2 Baremos y Puntuación

Cada métrica se puntúa automáticamente contra **baremos específicos** según:
- **Edad** del atleta
- **Género** (Masculino/Femenino)
- **Cinturón/Grado**

Los baremos clasifican el rendimiento en niveles: Excelente, Bueno, Regular, Deficiente.

### 5.3 Plan de Entrenamiento Personalizado

Después de guardar una evaluación, la aplicación genera automáticamente un **plan de entrenamiento** basado en las áreas más débiles del atleta, con ejercicios específicos para mejorar.

### 5.4 Reporte Imprimible

Haz clic en **"Planilla de Campo"** para generar un reporte imprimible con todos los resultados, niveles por dimensión física y recomendaciones.

### 5.5 Exportar Evaluaciones

Haz clic en **"Exportar Evaluaciones"** para descargar todas las evaluaciones físicas en formato CSV.

---

## 6. Marcador de Combate

Accede desde el menú lateral: **Mediciones > Medición Combate**.

El marcador digital sigue el reglamento oficial de **FEVEHAPKIDO 2026**.

### 6.1 Configurar un Combate

1. Selecciona el **atleta deportivo** (color Azul) que será evaluado.
2. Selecciona el **oponente** (color Rojo).
3. Elige el **tipo de combate**: Eliminatoria o Final.
4. Haz clic en **"Iniciar Puntuación"**.

### 6.2 El Tablero Digital

El tablero muestra:

**Lado Azul (Atleta Evaluado):**
- Nombre del atleta.
- **Puntaje Total** en grande.
- **Kyongos** (amonestaciones leves): Cada 2 Kyongos = 1 punto al rival.
- **Gamchoms** (faltas graves): +1 punto al rival directamente.
- **Pts en Contra** — Total de puntos concedidos por faltas.
- **Indicador de Riesgo de DQ** — 4 Gamchoms = Descualificación.

**Centro:**
- **Temporizador del Round** con controles de play/pausa y reinicio.
- **Título del Round** (Round 1, Round 2, etc.).

**Lado Rojo (Oponente):**
- Mismos controles que el lado Azul.

### 6.3 Registrar Puntos

Para cada competidor, usa los botones:
- **+1 Punto** — Golpe o patada simple al cuerpo.
- **+2 Puntos** — Golpe con giro, patada a la cabeza, o barrido con 1 pie.
- **+3 Puntos** — Patada con giro a la cabeza, barrido con 2 pies, proyección, o sumisión de 10 segundos.

### 6.4 Registrar Penalizaciones

- **+1 Kyongo (Leve)** — Amonestación por faltas leves. Cada 2 Kyongos otorgan 1 punto al rival.
- **+1 Gamchom (Grave)** — Deducción directa. Otorga 1 punto al rival inmediatamente.

### 6.5 Corregir Errores

Si se registra un punto o penalización por error, usa los botones de corrección:
- **-1 Kyongo** — Deshacer 1 amonestación leve.
- **-1 Gamchom** — Deshacer 1 falta grave.
- **-1 Pto** — Restar 1 punto marcado por error.

### 6.6 Navegación de Rounds

- **Round Anterior** — Volver al round anterior (si hay más de uno).
- **Siguiente Round** — Avanzar al siguiente round.
- **Finalizar Combate** — Terminar el combate y registrar el resultado.

El **Historial de Puntos del Round** muestra cada acción registrada con timestamp.

### 6.7 Reglamento FEVEHAPKIDO 2026 Resumido

| Acción | Puntos |
|--------|--------|
| Golpe/patada simple al cuerpo | +1 |
| Golpe con giro, patada a cabeza, barrido 1 pie | +2 |
| Patada con giro a cabeza, barrido 2 pies, proyección, sumisión 10s | +3 |
| 2 Kyongos acumulados | +1 al rival |
| 1 Gamchom | +1 al rival |
| 4 Gamchoms acumulados | Descualificación |

---

## 7. Exámenes de Cinta

Accede desde el menú lateral: **Mediciones > Exámenes de Cinta**.

### 7.1 Seleccionar Atleta

1. Elige el atleta a examinar del desplegable.
2. Haz clic en **"Cargar Examen"**.

La aplicación determina automáticamente:
- **Cinta Actual** del atleta.
- **Siguiente Cinta** (objetivo del examen).

### 7.2 Currículum Técnico

Se muestra el currículum técnico para la cinta objetivo, organizado por categorías:
- **Golpes** (Jireugi / Chigi)
- **Patadas** (Chagi)
- **Llaves** (Kkeokgi)
- **Proyecciones** (Deonjigi)
- **Caídas** (Nakbeop)
- **Hyungs** (Formas)
- **Hosin Sul** (Defensa personal)
- **Armas** (si aplica)
- **Teoría/Filosofía** (si aplica)

### 7.3 Evaluar Técnicas

1. Marca con **checkbox** cada técnica que el atleta demuestre satisfactoriamente.
2. Las técnicas se evalúan de forma independiente.
3. Puedes registrar **notas adicionales** sobre el desempeño.

### 7.4 Puntuación y Resultado

La aplicación calcula un **porcentaje de aprobación** basado en las técnicas verificadas vs. las requeridas.

### 7.5 Restricciones de Autorización

- Los **ayudantes** no pueden examinar atletas por encima de su propio grado.
- Si el grado objetivo iguala o supera el grado del examinador, se bloquea el examen.

### 7.6 Historial de Exámenes

En la parte inferior se muestra el historial de exámenes realizados con fecha, resultado y grado obtenido.

---

## 8. Torneos y Competencias

Accede desde el menú lateral: **Organización > Torneos y Topes**.

### 8.1 Solicitar un Torneo

1. Haz clic en **"Nuevo Torneo"**.
2. Completa los datos:
   - **Nombre** del torneo.
   - **Tipo** (Tope, Torneo, Campeonato, etc.).
   - **Fecha** del evento.
   - **Escuela** organizadora.
   - **Estado/Asociación** (para modo Federación).
   - **Invitados** especiales.
   - **Árbitro** principal.
   - **Modalidades**: Combate, Saltos, Exhibición.
   - **Notas** adicionales.
3. Haz clic en **"Guardar"**.

> **Nota:** Solo los administradores pueden cambiar el estado de un torneo. Los instructores envían solicitudes que quedan como "Solicitado".

### 8.2 Estados de un Torneo

| Estado | Significado |
|--------|-------------|
| Solicitado | Solicitud enviada, pendiente de revisión |
| Aprobado | Aprobado por la federación/administrador |
| Rechazado | No aprobado (con motivo) |
| En Curso | El torneo está activo |
| Finalizado | El torneo ha terminado |

### 8.3 Inscribir Atletas

1. Selecciona un torneo aprobado o en curso.
2. Haz clic en **"Inscribir Atletas"**.
3. Selecciona los atletas de tu escuela.
4. La aplicación calcula automáticamente la **división** según peso y categoría.

### 8.4 Generar Llave/Cuadro de Combate

1. Una vez inscritos los atletas, haz clic en **"Generar Llave"**.
2. Elige el método:
   - **Aleatorio** — Emparejamiento al azar.
   - **Por Ranking** — Basado en el historial de rendimiento.
3. Se genera el **árbol de llave** con los emparejamientos.

### 8.5 Visualizar y Registrar Resultados

El árbol de llave muestra los combates de cada ronda. Puedes registrar el ganador de cada enfrentamiento y la llave se actualiza progresivamente hasta la final.

---

## 9. Historial y Análisis

Accede desde el menú lateral: **Atletas > Historial / Gráficos**.

### 9.1 Seleccionar Atleta

Elige el atleta del desplegable para cargar su análisis completo.

### 9.2 Perfil Físico (Gráfico Radar)

Un gráfico radar (araña) muestra las dimensiones físicas del atleta:
- Composición Corporal
- Cardiovascular
- Fuerza
- Potencia
- Resistencia
- Velocidad/Agilidad
- Flexibilidad

### 9.3 Evolución Temporal (Gráficos de Línea)

Gráficos que muestran la progresión del atleta en el tiempo:
- **Índice de Ruffier** — Evolución cardiovascular.
- **Fuerza** — Flexiones y abdominales.
- **Flexibilidad** — Toque de puntas.
- **Resistencia** — Test de Cooper.
- **Combate** — Puntaje en combates.

### 9.4 Comparador Head-to-Head

Permite comparar el rendimiento de **dos atletas** lado a lado:
1. Selecciona el primer atleta.
2. Selecciona el segundo atleta.
3. Se muestra un análisis comparativo con gráficos superpuestos.

### 9.5 Filtros de Tiempo

Puedes filtrar los datos por:
- **3 meses**
- **6 meses**
- **1 año**
- **Todo** (todo el historial disponible)

---

## 10. Temporizador de Tatami

Accede desde el menú lateral: **Timer de Tatami**.

El temporizador incluye 4 modos diseñados para diferentes tipos de entrenamiento.

### 10.1 Modo Combate Oficial

Simula los tiempos oficiales de combate FEVEHAPKIDO.

**Configuración:**
- **Tiempo de Trabajo** — Duración del round (por defecto: 2 minutos).
- **Tiempo de Descanso** — Pausa entre rounds (por defecto: 30 segundos).
- **Número de Rounds** — Total de rounds (por defecto: 2).

**Uso:**
1. Ajusta los tiempos si es necesario.
2. Presiona **"Aplicar"** para cargar la configuración.
3. Presiona **Play** para iniciar.
4. El timer cambia automáticamente entre trabajo y descanso.
5. Se reproduce un **sonido de gong** al final de cada fase.
6. Se emiten **comandos de voz en coreano**:
   - **"Sichak"** (시작) — Iniciar
   - **"Kalyo"** (갈료) — Separar / Pausar
   - **"Junbi"** (준비) — Preparar
   - **"Geuman"** (그만) — Detener

### 10.2 Modo Tabata / HIIT

Intervalos de alta intensidad para acondicionamiento.

**Configuración por Defecto:**
- 20 segundos de trabajo
- 10 segundos de descanso
- 8 ciclos

Puedes personalizar los tiempos y el número de ciclos.

### 10.3 Modo EMOM (Every Minute On the Minute)

Ejercicio cada minuto durante el número de minutos configurado.

**Configuración:**
- **Minutos Totales** — Duración del EMOM (por defecto: 10 minutos).

### 10.4 Modo Cronómetro

Cronómetro progresivo sin límite. Útil para medir tiempos de técnicas o rondas de libre duración.

### 10.5 Controles Generales

- **Play/Pausa** — Iniciar o pausar el temporizador.
- **Reiniciar** — Volver al estado inicial.
- **Pantalla Completa** — Para proyección en tatami o pantalla grande.
- **Sonido Activado/Desactivado** — Control de audio.
- **Voz Activada/Desactivada** — Control de comandos de voz en coreano.

### 10.6 Pantalla de Proyección

Haz clic en el ícono de pantalla completa para proyectar el temporizador en una pantalla grande o proyector durante el entrenamiento. La interfaz se adapta a pantalla completa con números grandes y visibles.

---

## 11. Manual de Estudio

Accede desde el menú lateral: **Manual de Estudio**.

### 11.1 Historia del Hapkido

Información sobre:
- Orígenes del Hapkido.
- Los 3 principios fundamentales: **Yu** (Suave), **Won** (Círculo), **Hwa** (Armonía).
- Línea de transmisión y maestros.

### 11.2 Protocolos del Dojang

- Protocolo de saludo (Charyeot / Gyeongnye).
- Jerarquía de grados y roles.
- Etiqueta en el entrenamiento.

### 11.3 Glosario de Vocabulario Coreano

Más de **100 términos** buscables, organizados por categorías:
- **Cuerpo** — Nombres de partes del cuerpo.
- **Direcciones** — Izquierda, derecha, arriba, abajo, etc.
- **Técnicas** — Conceptos raíz (Chagi, Jireugi, Makgi, etc.).
- **Posiciones** — Ap-gubi, Ap-seogi, Juchum-seogi, etc.
- **Órdenes** — Comandos del instructor.

Cada término incluye:
- Hangul (coreano)
- Romanización
- Significado en español

### 11.4 Reglamento Oficial FEVEHAPKIDO 2026

El reglamento completo de combate, incluyendo:
- Sistema de puntos.
- Penalizaciones.
- Categorías y divisiones.
- Procedimientos de combate.

### 11.5 Programa Técnico por Cinta

El currículum técnico completo para cada grado, desde Blanco hasta Negro 9no Dan. Puedes filtrar por cinturón específico.

---

## 12. Escuelas y Asociaciones

Accede desde el menú lateral: **Organización > Escuelas / Dojangs**.

> **Solo disponible para el rol Administrador.**

### 12.1 Registrar una Escuela

1. Haz clic en **"Nueva Escuela"**.
2. Ingresa:
   - **Nombre** de la escuela/dojang.
   - **Instructor** principal.
   - **Dirección** física.
   - **Teléfono** de contacto.
   - **Correo electrónico**.
   - **Estado/Región**.
3. Guarda los cambios.

### 12.2 Gestionar Asociaciones

Las Asociaciones representan las organizaciones estatales o regionales que agrupan escuelas. Se usan para organizar torneos y eventos en modo Federación.

---

## 13. Gestión de Usuarios

Accede desde el menú lateral: **Configuración > Gestión Usuarios**.

> **Solo disponible para el rol Administrador.**

### 13.1 Crear un Nuevo Usuario

1. Haz clic en **"Nuevo Usuario"**.
2. Completa:
   - **Nombre de usuario** — Identificador único.
   - **Contraseña** — Se almacena con hash SHA-256 (encriptada).
   - **Nombre completo** — Nombre real del usuario.
   - **Rol** — Admin, Instructor, Ayudante o Atleta.
   - **Escuela** — Si aplica.
   - **Rango** — Cinturón o categoría.

### 13.2 Roles y Permisos

| Rol | Acceso |
|-----|--------|
| **Admin** | Acceso total. Gestiona usuarios, escuelas, asociaciones, aprueba torneos. |
| **Instructor** | Gestiona atletas de su escuela. Mediciones, exámenes, combate, torneos, historial. Sin acceso a ajustes, escuelas ni usuarios. |
| **Ayudante** | Dashboard, combate, torneos, timer, manual. No puede examinar atletas por encima de su grado. |
| **Atleta** | Ve su propio perfil, historial y manual. |

### 13.3 Editar o Desactivar Usuarios

- Haz clic en el ícono de **editar** para modificar datos.
- Un usuario desactivado no puede iniciar sesión pero su registro se conserva.

---

## 14. Respaldos y Sincronización

Accede desde el menú lateral: **Configuración > Respaldos / Ajustes**.

### 14.1 Exportar Respaldo

1. Haz clic en **"Exportar Respaldo"**.
2. Se descargará un archivo `.json` con **todos** los datos de la aplicación: atletas, evaluaciones, combates, exámenes, torneos, escuelas y usuarios.

> **Consejo:** Realiza un respaldo completo antes de cada actualización importante o al final de cada temporada.

### 14.2 Importar Respaldo

1. Haz clic en **"Importar Respaldo"**.
2. Selecciona un archivo `.json` válido.
3. Los datos se fusionarán con los existentes (se evitan duplicados por ID).

### 14.3 Sincronización con la Nube

La aplicación puede sincronizarse con servicios en la nube:

**Proveedores soportados:**
- **FEVEHAPKIDO Cloud Hub** (recomendado)
- **Supabase**
- **REST API personalizado**

**Configuración:**
1. Selecciona el proveedor.
2. Ingresa la **URL del endpoint** y la **API Key**.
3. Activa **sincronización automática** si lo deseas.
4. Haz clic en **"Probar Conexión"** para verificar.

**Indicador de Sincronización:**
En la esquina superior derecha hay un widget que muestra:
- **Sincronizado** (verde) — Todo actualizado.
- **Pendientes** (amarillo) — Hay cambios locales sin subir.
- **Sincronizando** (azul animado) — En proceso.
- **Sin Conexión** (rojo) — Sin acceso a internet.

### 14.4 Transferencia P2P

Permite transferir datos directamente entre dispositivos sin servidor:

1. En el dispositivo origen: genera un **token** de transferencia.
2. En el destino: ingresa el token para importar los datos.
3. Los datos se fusionan automáticamente con **resolución de conflictos** por timestamp.

### 14.5 Estrategia de Resolución de Conflictos

- **Timestamp más reciente** (recomendado) — Gana el dato más nuevo.
- **Mantener local** — Los datos locales prevalecen.
- **Sobrescribir remoto** — Los datos del servidor prevalecen.

---

## 15. Modo Dojang vs Modo Federación

La aplicación tiene dos modos de operación visibles en el encabezado:

### Modo Dojang (Club)
- Vista simplificada para el manejo diario de tu escuela.
- Solo ves los atletas de tu escuela.
- Gestión local de evaluaciones y exámenes.

### Modo Federación (Nacional)
- Vista ampliada para manejo de asociaciones y eventos a nivel nacional.
- Acceso a todas las escuelas registradas.
- Gestión de torneos inter-escuelas y asociaciones.

**Cambiar de modo:** Haz clic en el badge **"Modo Dojang"** o **"Modo Federación"** en la esquina superior derecha.

---

## 16. Consejos y Buenas Prácticas

### Para Instructores

1. **Registra a todos tus atletas** antes de comenzar evaluaciones. Los datos completos permiten mejores análisis.
2. **Realiza evaluaciones físicas cada 3 meses** para monitorear el progreso.
3. **Usa la planilla de campo** para tomar datos en el tatami y luego transcribirlos a la aplicación.
4. **Revisa los gráficos de evolución** antes de cada examen de cinta para identificar áreas de mejora.
5. **Crea respaldos regulares** — al menos una vez al mes y antes de cada torneo importante.

### Para el Uso del Marcador de Combate

1. **Configura el tiempo del round** antes de iniciar cada combate.
2. **Usa los botones de corrección** inmediatamente si registras un punto por error.
3. **Monitorea el indicador de DQ** — Si un competidor acumula 3 Gamchoms, prepárate para la descualificación.
4. **Guarda el resultado** al finalizar cada combate para mantener el historial.

### Para el Temporizador

1. **Usa pantalla completa** en el tatami para que todos puedan ver el tiempo.
2. **Activa los comandos de voz** para dar instrucciones en coreano durante el entrenamiento.
3. **Personaliza los tiempos** según el nivel de tus atletas (principiantes necesitan más descanso).

### Para la Sincronización

1. **Sincroniza después de cada sesión** de entrenamiento para no perder datos.
2. **Usa transferencia P2P** para compartir datos con otros instructores sin servidor.
3. **Nunca borres datos locales** sin haber creado un respaldo previamente.

### Seguridad

1. **Cambia las contraseñas por defecto** inmediatamente después de la primera instalación.
2. **No compartas credenciales** de administrador.
3. **Cierra sesión** al terminar cada uso, especialmente en dispositivos compartidos.

---

## 17. Glosario de Roles

| Término | Definición |
|---------|-----------|
| **Admin** | Administrador con acceso total al sistema. |
| **Instructor** | Maestro que gestiona atletas, evaluaciones y exámenes. |
| **Ayudante** | Asistente con acceso limitado (combate, timer, manual). |
| **Atleta** | Usuario que solo ve su propio perfil e historial. |
| **Dojang** | Escuela o lugar de entrenamiento de Hapkido. |
| **Kyongo** | Amonestación leve en combate. |
| **Gamchom** | Falta grave con penalización directa. |
| **DQ** | Descualificación (4 Gamchoms). |
| **Ruffier** | Índice cardiovascular basado en pulsaciones. |
| **Baremo** | Tabla de referencia para evaluar el rendimiento. |
| **PWA** | Progressive Web App — aplicación web instalable. |
| **P2P** | Peer-to-peer — transferencia directa entre dispositivos. |
| **Hyung** | Forma o secuencia preestablecida de movimientos. |
| **Hosin Sul** | Técnicas de defensa personal. |

---

*Manual de Usuario — Hapkido Athlete Tracker v1.0.0*
*Conforme al Reglamento Oficial FEVEHAPKIDO 2026*
*Beom Shin Kwan Hapkido / Asociación de Hapkido Carabobo*
