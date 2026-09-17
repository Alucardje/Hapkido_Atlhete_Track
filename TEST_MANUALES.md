# Test Manuales - Hapkido Athlete Tracker

> Flujos de verificacion estilo Dialogflow para validar los fixes de precaucion.
> Ejecutar en navegador (Chrome/Edge) despues de aplicar los fixes seguros.

---

## Configuracion de la Sesion de Testing

```
ENTIDAD: navegador = Chrome | Edge | Firefox
ENTIDAD: rol = admin | instructor | ayudante | atleta
ENTIDAD: seccion = dashboard | atletas | fisica | combate | examenes | historial | timer | torneos | manual | escuelas | usuarios | ajustes
CONTEXTO: sesion_activa = true/false
CONTEXTO: devtools_abierto = true/false
```

---

## FLUJO 0: Pre-requisitos

```
INTENT: iniciar_sesion_testing
  -> ACCION: Abrir navegador
  -> PROMPT: "Navega a la URL de la app"
  -> RESPUESTA_ESPERADA: Se muestra el login overlay

  -> SIGUIENTE: verificar_devtools

INTENT: verificar_devtools
  -> CONTEXTO: devtools_abierto = true
  -> ACCION: Presionar F12
  -> PROMPT: "Abre la pestaña Console"
  -> RESPUESTA_ESPERADA: Console visible, sin errores rojos

  -> SI (hay errores): 
     -> REGISTRAR: "Errores pre-existentes en Console"
     -> CONTINUAR
  -> SI (no hay errores):
     -> CONTINUAR

  -> SIGUIENTE: hacer_login_admin

INTENT: hacer_login_admin
  -> ENTIDAD: rol = admin
  -> ACCION: Ingresar credenciales
  -> PROMPT: "Escribe 'admin' en Usuario y '123' en Contrasena, haz clic en Entrar"
  -> RESPUESTA_ESPERADA: Login exitoso, se muestra Dashboard

  -> SI (fallo login):
     -> ERROR: "Login fallido - verificar credenciales o estado de localStorage"
     -> DETENER

  -> CONTEXTO: sesion_activa = true
  -> SIGUIENTE: verificar_secciones
```

---

## FLUJO 1: Timer skipToNextTimerPhase (CRITICO)

```
ENTIDAD: timer_modo = combate_oficial | tabata | emom | cronometro
ENTIDAD: fase_actual = round | descanso | pausado
ENTIDAD: accion_timer = iniciar | pausar | resetear | saltar_fase

INTENT: iniciar_test_timer
  -> PRECONDICION: sesion_activa = true, devtools_abierto = true
  -> ACCION: Navegar a #timer
  -> PROMPT: "Selecciona modo Combate Oficial"
  -> RESPUESTA_ESPERADA: Se muestra panel de configuracion

  -> SIGUIENTE: configurar_timer_combate

INTENT: configurar_timer_combate
  -> ENTIDAD: timer_modo = combate_oficial
  -> ACCION: Configurar tiempos
  -> PROMPT: "Establece: Round = 10 segundos, Descanso = 5 segundos, Rounds = 2"
  -> RESPUESTA_ESPERADA: Los campos muestran 00:10 y 00:05

  -> SIGUIENTE: iniciar_cuenta_regresiva

INTENT: iniciar_cuenta_regresiva
  -> ENTIDAD: accion_timer = iniciar
  -> ACCION: Hacer clic en boton Play
  -> PROMPT: "Haz clic en el boton de play (triangulo)"
  -> RESPUESTA_ESPERADA: Timer inicia, cuenta regresiva visible

  -> SIGUIENTE: esperar_round_1

INTENT: esperar_round_1
  -> ACCION: Esperar 10 segundos
  -> PROMPT: "Espera a que el timer llegue a 00:00"
  -> RESPUESTA_ESPERADA: Timer cambia automaticamente a fase "DESCANSO"

  -> RAMA: 
     -> SI (cambia a DESCANSO):
        -> REGISTRAR: "Round 1 finalizo correctamente"
        -> SIGUIENTE: test_skip_desde_descanso
     -> SI (NO cambia a DESCANSO):
        -> ERROR: "El timer no cambio de fase automaticamente"
        -> REGISTRAR: FALLO en transicion automatica
        -> SIGUIENTE: test_skip_desde_descanso

INTENT: test_skip_desde_descanso
  -> ENTIDAD: fase_actual = descanso
  -> ENTIDAD: accion_timer = saltar_fase
  -> ACCION: Hacer clic en "Siguiente Fase" INMEDIATAMENTE
  -> PROMPT: "Sin esperar el descanso, haz clic en 'Siguiente Fase' o skip"
  -> RESPUESTA_ESPERADA: Timer avanza al Round 2

  -> RAMA:
     -> SI (avanza a Round 2):
        -> REGISTRAR: "PASS - Skip funciona desde DESCANSO"
        -> SIGUIENTE: verificar_estado_round_2
     -> SI (se queda en PAUSED o no avanza):
        -> ERROR: "FALLO - Timer no avanza desde DESCANSO"
        -> REGISTRAR: "Bug confirmado en skipToNextTimerPhase"
        -> FOTO: Captura de pantalla del estado
        -> SIGUIENTE: reportar_fallo_timer

INTENT: verificar_estado_round_2
  -> ACCION: Observar el timer
  -> PROMPT: "Verifica que el timer muestra 'ROUND 2' y esta corriendo"
  -> RESPUESTA_ESPERADA: Round 2 activo, countdown corriendo

  -> SI (todo OK):
     -> REGISTRAR: "PASS - Test Timer completo"
  -> SIGUIENTE: cleanup_timer

INTENT: reportar_fallo_timer
  -> ACCION: Documentar
  -> PROMPT: "Tomar captura de pantalla y pegar en el registro"
  -> CAMPO: evidencia_screenshot = [imagen]
  -> SIGUIENTE: cleanup_timer

INTENT: cleanup_timer
  -> ACCION: Resetear timer
  -> PROMPT: "Haz clic en Reset para limpiar el estado"
  -> SIGUIENTE: siguiente_test
```

---

## FLUJO 2: Timer AudioContext Memory (CRITICO)

```
ENTIDAD: rondas_test = numero (5-10)
ENTIDAD: memoria_antes = numero (MB)
ENTIDAD: memoria_despues = numero (MB)

INTENT: iniciar_test_memory_timer
  -> PRECONDICION: sesion_activa = true, devtools_abierto = true
  -> ACCION: Navegar a #timer
  -> SIGUIENTE: tomar_snapshot_inicial

INTENT: tomar_snapshot_inicial
  -> ACCION: DevTools -> Memory -> Take Heap Snapshot
  -> PROMPT: "En DevTools, pestaña Memory, haz clic en 'Take Heap Snapshot'"
  -> RESPUESTA_ESPERADA: Se crea un snapshot
  -> CAMPO: memoria_antes = [tamaño del snapshot]
  -> SIGUIENTE: configurar_timer_rapido

INTENT: configurar_timer_rapido
  -> ENTIDAD: timer_modo = combate_oficial
  -> ACCION: Configurar rondas cortas
  -> PROMPT: "Configura Round = 5s, Descanso = 3s, Rounds = 10"
  -> SIGUIENTE: ejecutar_rondas_multiples

INTENT: ejecutar_rondas_multiples
  -> ENTIDAD: rondas_test = 10
  -> ACCION: Iniciar timer y dejar correr
  -> PROMPT: "Inicia el timer y deja que pasen al menos 5 rondas completas. NO toques nada."
  -> RESPUESTA_ESPERADA: Timer avanza por rondas automaticamente
  -> TIMEOUT: 60 segundos (5 rounds x 5s + 5 descansos x 3s = 40s + margen)

  -> SIGUIENTE: tomar_snapshot_final

INTENT: tomar_snapshot_final
  -> ACCION: DevTools -> Memory -> Take Heap Snapshot
  -> PROMPT: "Tomar otro snapshot de memoria"
  -> CAMPO: memoria_despues = [tamaño del snapshot]
  -> SIGUIENTE: comparar_memoria

INTENT: comparar_memoria
  -> CALCULO: delta = memoria_despues - memoria_antes
  -> RAMA:
     -> SI (delta < 5MB):
        -> REGISTRAR: "PASS - Memoria estable (delta: ${delta}MB)"
     -> SI (delta >= 5MB && delta < 20MB):
        -> WARNING: "Memoria crece moderadamente (delta: ${delta}MB) - Monitorear"
        -> REGISTRAR: "WARN - Posible memory leak menor"
     -> SI (delta >= 20MB):
        -> ERROR: "FALLO - Memory leak severo (delta: ${delta}MB)"
        -> REGISTRAR: "FALLO - AudioContext no se esta cerrando"
        -> FOTO: Comparativa de snapshots

  -> SIGUIENTE: verificar_console_audio

INTENT: verificar_console_audio
  -> ACCION: Console -> ejecutar comando
  -> PROMPT: "Ejecuta en Console: performance.getEntriesByType('resource').filter(r => r.name.includes('audioContext')).length"
  -> RESPUESTA_ESPERADA: Numero bajo (< 10)
  -> RAMA:
     -> SI (numero < 10): REGISTRAR: "PASS - Pocos AudioContexts"
     -> SI (numero >= 10): REGISTRAR: "FALLO - Muchos AudioContexts creados"

  -> SIGUIENTE: cleanup_memory
```

---

## FLUJO 3: Impresion (3 sub-flujos)

```
ENTIDAD: tipo_impresion = planilla | certificado | reporte
ENTIDAD: formato_esperado = landscape | portrait
ENTIDAD: con_datos = true | false

### Sub-flujo 3a: Planilla de Campo

INTENT: test_impresion_planilla
  -> PRECONDICION: sesion_activa = true
  -> ACCION: Navegar a #fisica
  -> PROMPT: "Haz clic en el boton 'Planilla de Campo'"
  -> RESPUESTA_ESPERADA: Se abre modal de opciones de impresion

  -> SIGUIENTE: seleccionar_planilla_con_datos

INTENT: seleccionar_planilla_con_datos
  -> ENTIDAD: con_datos = true
  -> ACCION: Seleccionar "Planilla Colectiva con Atletas Registrados"
  -> PROMPT: "Haz clic en la primera opcion (con atletas)"
  -> RESPUESTA_ESPERADA: Se abre dialogo de impresion del navegador

  -> RAMA:
     -> SI (se abre dialogo):
        -> SIGUIENTE: verificar_formato_planilla
     -> SI (no se abre):
        -> ERROR: "No se abrio el dialogo de impresion"
        -> SIGUIENTE: test_impresion_planilla_blanco

INTENT: verificar_formato_planilla
  -> ENTIDAD: formato_esperado = landscape
  -> ACCION: Observar preview de impresion
  -> PROMPT: "Verifica: 1) Formato es horizontal (landscape), 2) Tabla visible con headers, 3) Nombres de atletas aparecen"
  -> RESPUESTA_ESPERADA: Todo visible en landscape

  -> RAMA:
     -> SI (landscape + tabla visible + nombres):
        -> REGISTRAR: "PASS - Planilla con datos OK"
     -> SI (portrait):
        -> ERROR: "FALLO - Formato es portrait, deberia ser landscape"
     -> SI (tabla no visible):
        -> ERROR: "FALLO - Tabla no se renderiza"
     -> SI (nombres vacios):
        -> WARNING: "Nombres no aparecen (puede ser sin datos)"

  -> ACCION: Cancelar impresion (Escape o Cancelar)
  -> SIGUIENTE: test_impresion_planilla_blanco

INTENT: test_impresion_planilla_blanco
  -> ENTIDAD: con_datos = false
  -> ACCION: Seleccionar "Planilla Colectiva en Blanco"
  -> PROMPT: "Haz clic en 'Planilla de Campo', luego selecciona la segunda opcion (en blanco)"
  -> RESPUESTA_ESPERADA: Se abre dialogo de impresion

  -> RAMA:
     -> SI (se abre):
        -> VERIFICAR: "Tabla vacia de 18 filas visible"
        -> REGISTRAR: "PASS - Planilla en blanco OK"
     -> SI (no se abre):
        -> ERROR: "FALLO - Planilla en blanco no imprime"

  -> ACCION: Cancelar impresion
  -> SIGUIENTE: siguiente_test

### Sub-flujo 3b: Certificado

INTENT: test_impresion_certificado
  -> PRECONDICION: sesion_activa = true, hay al menos 1 examen aprobado
  -> ACCION: Navegar a #examenes
  -> PROMPT: "Selecciona un atleta y carga su examen"
  -> RESPUESTA_ESPERADA: Se muestran los resultados del examen

  -> RAMA:
     -> SI (hay examen aprobado con promocion):
        -> SIGUIENTE: imprimir_certificado
     -> SI (no hay examen aprobado):
        -> PROMPT: "No hay examenes aprobados. Crea uno rapido:Selecciona un atleta, marca todas las tecnicas como aprobadas, guarda el examen."
        -> SIGUIENTE: imprimir_certificado

INTENT: imprimir_certificado
  -> ACCION: Hacer clic en ver/imprimir certificado
  -> PROMPT: "Haz clic en el boton de imprimir certificado"
  -> RESPUESTA_ESPERADA: Se abre dialogo de impresion

  -> VERIFICAR:
     1. Formato es PORTRAIT (vertical)
     2. Borde dorado visible
     3. Nombre del atleta visible
     4. Grado/cinta visible

  -> RAMA:
     -> SI (portrait + borde + nombre + grado):
        -> REGISTRAR: "PASS - Certificado OK"
     -> SI (landscape):
        -> ERROR: "FALLO - Certificado en landscape, deberia ser portrait"
     -> SI (falta nombre/grado):
        -> ERROR: "FALLO - Datos del atleta no aparecen"

  -> ACCION: Cancelar impresion
  -> SIGUIENTE: siguiente_test

### Sub-flujo 3c: Reporte de Evaluacion

INTENT: test_impresion_reporte
  -> PRECONDICION: sesion_activa = true, hay evaluacion fisica guardada
  -> ACCION: Navegar a #fisica
  -> PROMPT: "Selecciona un atleta que tenga evaluacion guardada"
  -> RESPUESTA_ESPERADA: Se muestran los datos del atleta

  -> SIGUIENTE: abrir_reporte

INTENT: abrir_reporte
  -> ACCION: Hacer clic en "Ver Reporte" o "Imprimir Reporte"
  -> PROMPT: "Haz clic en el boton de ver/imprimir reporte"
  -> RESPUESTA_ESPERADA: Se abre modal con reporte o dialogo de impresion

  -> VERIFICAR:
     1. Score global visible
     2. Metricas detalladas visibles
     3. Graficos o tablas de evaluacion visibles

  -> RAMA:
     -> SI (score + metricas + graficos):
        -> REGISTRAR: "PASS - Reporte OK"
     -> SI (falta score):
        -> ERROR: "FALLO - Score global no visible"
     -> SI (reporte vacio):
        -> ERROR: "FALLO - Reporte no se renderiza"

  -> SIGUIENTE: siguiente_test
```

---

## FLUJO 4: Admin Backdoor (CRITICO)

```
ENTIDAD: usuario_login = admin | maestro1 | atleta1
ENTIDAD: contrasena = 123 | incorrecta | vacia
ENTIDAD: resultado_login = exitoso | fallido

INTENT: test_login_admin_correcto
  -> PRECONDICION: NO hay sesion activa (logout previo)
  -> ACCION: Credenciales validas
  -> PROMPT: "Ingresa 'admin' y '123', haz clic en Entrar"
  -> RESPUESTA_ESPERADA: resultado_login = exitoso

  -> SI (exitoso):
     -> REGISTRAR: "PASS - Admin login con credenciales correctas"
     -> SIGUIENTE: test_login_admin_incorrecto
  -> SI (fallo):
     -> ERROR: "FALLO - Admin no puede login con credenciales correctas"
     -> DETENER

INTENT: test_login_admin_incorrecto
  -> ACCION: Hacer logout primero
  -> PROMPT: "Cierra sesion"
  -> ACCION: Credenciales incorrectas
  -> PROMPT: "Ingresa 'admin' y 'contrasena_incorrecta', haz clic en Entrar"
  -> RESPUESTA_ESPERADA: resultado_login = fallido

  -> SI (fallo):
     -> REGISTRAR: "PASS - Admin rechazado con contrasena incorrecta"
     -> SIGUIENTE: test_login_vacio
  -> SI (exitoso):
     -> ERROR: "FALLO CRITICO - Admin acepto contrasena incorrecta"
     -> REGISTRAR: "SEGURIDAD COMPROMETIDA"

INTENT: test_login_vacio
  -> ACCION: Hacer logout
  -> PROMPT: "Cierra sesion"
  -> ACCION: Campos vacios
  -> PROMPT: "No escribas nada, haz clic en Entrar"
  -> RESPUESTA_ESPERADA: resultado_login = fallido

  -> SI (fallo):
     -> REGISTRAR: "PASS - Login vacio rechazado"
  -> SI (exitoso):
     -> ERROR: "FALLO - Login vacio aceptado"

  -> SIGUIENTE: siguiente_test
```

---

## FLUJO 5: Navegacion Completa - Null Checks (ALTO)

```
ENTIDAD: seccion_actual = [cualquiera]
ENTIDAD: errores_consola = [lista]
ENTIDAD: elementos_null = [lista]

INTENT: test_navegacion_completa
  -> PRECONDICION: sesion_activa = true (admin), devtools_abierto = true
  -> ACCION: Limpiar Console
  -> PROMPT: "Escribe 'clear()' en Console para limpiar"

  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = dashboard
  -> ACCION: Navegar a #dashboard
  -> PROMPT: "Haz clic en Dashboard en el menu"
  -> VERIFICAR: Console sin errores "Cannot read property" o "null"
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = atletas
  -> ACCION: Navegar a #atletas
  -> PROMPT: "Haz clic en Atletas > Gestion Atletas"
  -> VERIFICAR: Tabla de atletas visible, sin errores
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = fisica
  -> ACCION: Navegar a #fisica
  -> PROMPT: "Haz clic en Mediciones > Medicion Fisica"
  -> VERIFICAR: Formulario visible, selects poblados
  -> ACCION: Seleccionar un atleta del dropdown
  -> VERIFICAR: Campos se autofillan (peso, estatura), sin errores
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = combate
  -> ACCION: Navegar a #combate
  -> PROMPT: "Haz clic en Mediciones > Medicion Combate"
  -> VERIFICAR: Selects de atleta/oponente poblados, sin errores
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = examenes
  -> ACCION: Navegar a #examenes
  -> PROMPT: "Haz clic en Mediciones > Examenes de Cinta"
  -> VERIFICAR: Select de atletas visible, sin errores
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = historial
  -> ACCION: Navegar a #historial
  -> PROMPT: "Haz clic en Atletas > Historial / Graficos"
  -> VERIFICAR: Select de atletas visible, sin errores
  -> ACCION: Seleccionar un atleta
  -> VERIFICAR: Graficos se renderizan (canvas visible), sin errores
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = timer
  -> ACCION: Navegar a #timer
  -> PROMPT: "Haz clic en Timer de Tatami"
  -> VERIFICAR: Panel de timer visible, sin errores
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = torneos
  -> ACCION: Navegar a #torneos
  -> PROMPT: "Haz clic en Organizacion > Torneos y Topes"
  -> VERIFICAR: Lista de torneos visible, sin errores
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = manual
  -> ACCION: Navegar a #manual
  -> PROMPT: "Haz clic en Manual de Estudio"
  -> VERIFICAR: Contenido del manual visible, sin errores
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = escuelas
  -> ACCION: Navegar a #escuelas
  -> PROMPT: "Haz clic en Organizacion > Escuelas / Dojangs"
  -> VERIFICAR: Lista de escuelas visible, sin errores
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = usuarios
  -> ACCION: Navegar a #usuarios
  -> PROMPT: "Haz clic en Configuracion > Gestion Usuarios"
  -> VERIFICAR: Lista de usuarios visible, sin errores
  -> SIGUIENTE: navegar_seccion

INTENT: navegar_seccion
  -> ENTIDAD: seccion = ajustes
  -> ACCION: Navegar a #ajustes
  -> PROMPT: "Haz clic en Configuracion > Respaldos / Ajustes"
  -> VERIFICAR: Panel de ajustes visible, sin errores
  -> SIGUIENTE: evaluar_resultados_navegacion

INTENT: evaluar_resultados_navegacion
  -> ACCION: Revisar Console
  -> PROMPT: "Revisa toda la consola. Cuenta los errores."
  -> RAMA:
     -> SI (0 errores):
        -> REGISTRAR: "PASS - Navegacion completa sin errores"
     -> SI (1-3 errores menores):
        -> WARNING: "Algunos errores menores detectados"
        -> REGISTRAR: Lista de errores encontrados
     -> SI (4+ errores o errores Criticos):
        -> ERROR: "FALLO - Multiples errores de null check"
        -> REGISTRAR: Lista completa de errores

  -> SIGUIENTE: siguiente_test
```

---

## FLUJO 6: localStorage Quota (ALTO)

```
ENTIDAD: storage_antes = numero (KB)
ENTIDAD: storage_despues = numero (KB)
ENTIDAD: operacion_storage = guardar_atleta | guardar_evaluacion | importar_datos

INTENT: test_storage_quota
  -> PRECONDICION: sesion_activa = true, devtools_abierto = true
  -> ACCION: Medir storage actual
  -> PROMPT: "Ejecuta en Console: (JSON.stringify(localStorage).length / 1024).toFixed(2) + ' KB'"
  -> CAMPO: storage_antes = [resultado]

  -> SIGUIENTE: llenar_storage_artificial

INTENT: llenar_storage_artificial
  -> ACCION: Crear datos de prueba
  -> PROMPT: "Ejecuta este codigo en Console:"
  -> CODIGO: |
     try {
         for (let i = 0; i < 100; i++) {
             localStorage.setItem('test_fill_' + i, 'x'.repeat(50000));
         }
         console.log('Storage lleno artificialmente');
     } catch(e) {
         console.log('Storage lleno:', e.message);
     }
  -> RESPUESTA_ESPERADA: Mensaje "Storage lleno" o "QuotaExceededError"

  -> SIGUIENTE: intentar_guardar_datos

INTENT: intentar_guardar_datos
  -> ENTIDAD: operacion_storage = guardar_atleta
  -> ACCION: Intentar guardar un atleta
  -> PROMPT: "Intenta crear un nuevo atleta desde la interfaz normal"
  -> RESPUESTA_ESPERADA: 
     -> SI (muestra error amigable): PASS
     -> SI (crashea): FALLO
     -> SI (guarda exitosamente): WARNING (no deberia poder con storage lleno)

  -> SIGUIENTE: limpiar_storage

INTENT: limpiar_storage
  -> ACCION: Eliminar datos de prueba
  -> PROMPT: "Ejecuta en Console:"
  -> CODIGO: |
     for (let i = 0; i < 100; i++) {
         localStorage.removeItem('test_fill_' + i);
     }
     console.log('Storage limpiado');
  -> RESPUESTA_ESPERADA: Mensaje "Storage limpiado"

  -> SIGUIENTE: siguiente_test
```

---

## FLUJO 7: hashPassword Fallback (ALTO)

```
ENTIDAD: contexto_seguro = true | false (HTTPS vs HTTP)
ENTIDAD: crypto_disponible = true | false

INTENT: test_crypto_disponible
  -> PRECONDICION: sesion_activa = true, devtools_abierto = true
  -> ACCION: Verificar Web Crypto API
  -> PROMPT: "Ejecuta en Console: typeof window.crypto.subtle"
  -> RESPUESTA_ESPERADA: "object" (disponible) o "undefined" (no disponible)

  -> RAMA:
     -> SI ("object"):
        -> REGISTRAR: "Web Crypto API disponible"
        -> SIGUIENTE: test_login_normal
     -> SI ("undefined"):
        -> WARNING: "Web Crypto NO disponible - hashPassword usara fallback plaintext"
        -> REGISTRAR: "Riesgo: contrasenas sin hashear"
        -> SIGUIENTE: test_login_fallback

INTENT: test_login_normal
  -> ACCION: Login con credenciales
  -> PROMPT: "Logout y vuelve a login con 'admin' / '123'"
  -> VERIFICAR: Login exitoso, sin errores en Console
  -> REGISTRAR: "PASS - Login con hash SHA-256"
  -> SIGUIENTE: siguiente_test

INTENT: test_login_fallback
  -> ACCION: Login en contexto HTTP
  -> PROMPT: "Asegurate de estar en HTTP (no HTTPS). Login con 'admin' / '123'"
  -> VERIFICAR: Login funciona (usa fallback plaintext)
  -> VERIFICAR: No hay errores "Cannot read property 'digest'"
  -> REGISTRAR: "PASS - Login funciona con fallback (riesgo conocido)"
  -> SIGUIENTE: siguiente_test
```

---

## FLUJO 8: requiredMethods Validation (MEDIO)

```
ENTIDAD: metodos_faltantes = [lista]
ENTIDAD: modulos_cargados = [lista]

INTENT: test_required_methods
  -> PRECONDICION: sesion_activa = true, devtools_abierto = true
  -> ACCION: Revisar Console al cargar
  -> PROMPT: "Recarga la pagina (Ctrl+Shift+R) y revisa la Console"
  -> VERIFICAR: No hay mensajes "MISSING PROTOTYPE METHOD:"

  -> RAMA:
     -> SI (no hay mensajes):
        -> REGISTRAR: "PASS - Todos los metodos validados estan presentes"
        -> SIGUIENTE: siguiente_test
     -> SI (hay mensajes):
        -> ERROR: "FALLO - Metodos faltantes detectados"
        -> CAMPO: metodos_faltantes = [lista de metodos]
        -> REGISTRAR: "Metodos faltantes: ${metodos_faltantes}"
        -> SIGUIENTE: siguiente_test

INTENT: verificar_metodos_criticos
  -> ACCION: Verificar metodos especificos
  -> PROMPT: "Ejecuta en Console:"
  -> CODIGO: |
     const critical = ['showAlert','showConfirm','showToast','escapeHTML',
       'navigateTo','initTatamiTimer','toggleTimer','resetTimer',
       'addScore','addPenalty','printFieldSheet'];
     critical.forEach(m => {
         if (typeof app[m] !== 'function') console.error('MISSING:', m);
     });
  -> RESPUESTA_ESPERADA: Sin errores
  -> RAMA:
     -> SI (sin errores): REGISTRAR: "PASS - Metodos criticos presentes"
     -> SI (hay errores): REGISTRAR: "FALLO - Metodos criticos faltantes"

  -> SIGUIENTE: siguiente_test
```

---

## FLUJO 9: XSS escapeHTML (CRITICO)

```
ENTIDAD: nombre_xss = string (con HTML/JS)
ENTIDAD: resultado_render = texto_plano | html_ejecutado

INTENT: test_xss_atleta
  -> PRECONDICION: sesion_activa = true (admin)
  -> ACCION: Crear atleta con nombre malicioso
  -> PROMPT: "Navega a Atletas, haz clic en 'Nuevo Atleta'"
  -> SIGUIENTE: crear_atleta_xss

INTENT: crear_atleta_xss
  -> ENTIDAD: nombre_xss = "Test <img src=x onerror=alert('XSS')>"
  -> ACCION: Completar formulario
  -> PROMPT: "En Nombre Completo escribe exactamente: Test <img src=x onerror=alert('XSS')>. Completa los demas campos requeridos y guarda."
  -> RESPUESTA_ESPERADA: Se guarda sin ejecutar alert

  -> SI (aparece alert):
     -> ERROR: "FALLO CRITICO - XSS ejecutado en formulario"
     -> CANCELAR: No guardar
     -> SIGUIENTE: reportar_xss
  -> SI (se guarda sin alert):
     -> SIGUIENTE: verificar_xss_dashboard

INTENT: verificar_xss_dashboard
  -> ACCION: Navegar a Dashboard
  -> PROMPT: "Navega al Dashboard"
  -> VERIFICAR: 
     1. En "Atletas Recientes", el nombre se ve como texto literal
     2. NO aparece ningun alert
     3. El HTML no se renderiza como elemento

  -> RAMA:
     -> SI (texto plano, sin alert):
        -> REGISTRAR: "PASS - XSS prevenido en Dashboard"
     -> SI (aparece alert o HTML renderizado):
        -> ERROR: "FALLO - XSS en Dashboard"
        -> FOTO: Captura de pantalla

  -> SIGUIENTE: verificar_xss_atletas

INTENT: verificar_xss_atletas
  -> ACCION: Navegar a Atletas
  -> PROMPT: "Navega a la tabla de Atletas"
  -> VERIFICAR: El nombre aparece como texto plano en la tabla

  -> RAMA:
     -> SI (texto plano):
        -> REGISTRAR: "PASS - XSS prevenido en tabla Atletas"
     -> SI (HTML renderizado):
        -> ERROR: "FALLO - XSS en tabla Atletas"

  -> SIGUIENTE: eliminar_atleta_xss

INTENT: eliminar_atleta_xss
  -> ACCION: Limpiar
  -> PROMPT: "Elimina el atleta de prueba"
  -> SIGUIENTE: siguiente_test

INTENT: reportar_xss
  -> ACCION: Documentar
  -> PROMPT: "Tomar captura de pantalla del alert ejecutado"
  -> CAMPO: evidencia_screenshot = [imagen]
  -> REGISTRAR: "XSS confirmado - requiere fix inmediato"
  -> SIGUIENTE: siguiente_test
```

---

## FLUJO 10: Chart.js Defer (BAJO)

```
ENTIDAD: chart_carga = defer | sync | async

INTENT: test_chart_defer
  -> PRECONDICION: sesion_activa = true
  -> ACCION: Verificar carga de Chart.js
  -> PROMPT: "Abre DevTools -> Network, recarga la pagina (Ctrl+Shift+R)"
  -> VERIFICAR: En Network, chart.umd.min.js tiene tipo "script" y no bloquea

  -> SIGUIENTE: verificar_chart_funcional

INTENT: verificar_chart_funcional
  -> ACCION: Navegar a historial con graficos
  -> PROMPT: "Navega a Historial, selecciona un atleta con evaluaciones"
  -> VERIFICAR: Los graficos (radar, lineas) se renderizan correctamente

  -> RAMA:
     -> SI (graficos visibles):
        -> REGISTRAR: "PASS - Chart.js carga y funciona con defer"
     -> SI (graficos no visibles):
        -> ERROR: "FALLO - Chart.js no carga correctamente"
        -> VERIFICAR: Console errores de Chart is not defined

  -> SIGUIENTE: siguiente_test
```

---

## FLUJO 11: Aria Labels y Roles (BAJO)

```
ENTIDAD: elemento_verificar = boton | modal | badge
ENTIDAD: atributo_esperado = role | aria-label | aria-modal | tabindex

INTENT: test_accesibilidad_botones
  -> PRECONDICION: sesion_activa = true
  -> ACCION: Inspeccionar botones
  -> PROMPT: "Click derecho en el boton de logout (icono de bracket), Inspect Element"
  -> VERIFICAR: Tiene aria-label="Cerrar sesión"

  -> RAMA:
     -> SI (tiene aria-label): REGISTRAR: "PASS - Logout tiene aria-label"
     -> SI (no tiene): REGISTRAR: "WARN - Logout sin aria-label"

  -> SIGUIENTE: test_accesibilidad_modales

INTENT: test_accesibilidad_modales
  -> ACCION: Abrir modal y verificar
  -> PROMPT: "Abre el modal de Nuevo Atleta. Click derecho en el modal, Inspect."
  -> VERIFICAR: El div.modal tiene role="dialog" y aria-modal="true"

  -> RAMA:
     -> SI (tiene role y aria-modal): REGISTRAR: "PASS - Modal accesible"
     -> SI (no tiene): REGISTRAR: "WARN - Modal sin role/dialog"

  -> SIGUIENTE: test_accesibilidad_login

INTENT: test_accesibilidad_login
  -> ACCION: Verificar login overlay
  -> PROMPT: "Logout. Click derecho en el overlay de login, Inspect."
  -> VERIFICAR: Tiene role="dialog" y aria-modal="true"

  -> RAMA:
     -> SI (tiene): REGISTRAR: "PASS - Login accesible"
     -> SI (no tiene): REGISTRAR: "WARN - Login sin role/dialog"

  -> SIGUIENTE: siguiente_test
```

---

## FLUJO 12: Manifest PWA (BAJO)

```
ENTIDAD: manifest_estado = valido | invalido | ausente
ENTIDAD: campos_presentes = [lista]

INTENT: test_manifest_carga
  -> PRECONDICION: sesion_activa = true, devtools_abierto = true
  -> ACCION: Verificar manifest en DevTools
  -> PROMPT: "DevTools -> Application -> Manifest"
  -> VERIFICAR: El manifest carga sin errores

  -> RAMA:
     -> SI (carga): SIGUIENTE: test_manifest_campos
     -> SI (no carga): ERROR: "FALLO - Manifest no carga"

INTENT: test_manifest_campos
  -> VERIFICAR: Campos presentes:
     - name: "Hapkido Athlete Tracker"
     - id: "./"
     - display: "standalone"
     - theme_color: "#00b4d8"
     - prefer_related_applications: false
     - icons: 4 iconos referenciados

  -> RAMA:
     -> SI (todos los campos): REGISTRAR: "PASS - Manifest completo"
     -> SI (faltan campos): REGISTRAR: "WARN - Manifest incompleto: ${campos_faltantes}"

  -> SIGUIENTE: test_pwa_install

INTENT: test_pwa_install
  -> ACCION: Verificar instalabilidad
  -> PROMPT: "Busca el icono de instalar PWA en la barra de direcciones"
  -> VERIFICAR: El icono de instalar aparece

  -> RAMA:
     -> SI (aparece): REGISTRAR: "PASS - PWA instalable"
     -> SI (no aparece): REGISTRAR: "WARN - PWA no muestra icono de instalacion"

  -> SIGUIENTE: siguiente_test
```

---

## Registro de Resultados

### Resumen de la Sesion

| Campo | Valor |
|-------|-------|
| Fecha | |
| Navegador | |
| Version | |
| Tester | |

### Resultados por Test

| # | Test | Fix | Severidad | Estado | Notas |
|---|------|-----|-----------|--------|-------|
| 1 | Timer skipToNextTimerPhase | Fix #2 | Critico | | |
| 2 | Timer AudioContext Memory | Fix #3 | Critico | | |
| 3a | Impresion Planilla | Fix #4 | Critico | | |
| 3b | Impresion Certificado | Fix #4 | Critico | | |
| 3c | Impresion Reporte | Fix #4 | Critico | | |
| 4 | Admin Backdoor | Fix #5 | Critico | | |
| 5 | Navegacion Completa | Fix #6 | Alto | | |
| 6 | localStorage Quota | Fix #7 | Alto | | |
| 7 | hashPassword Fallback | Fix #8 | Alto | | |
| 8 | requiredMethods | Fix #9 | Medio | | |
| 9 | XSS escapeHTML | Fix #10 | Critico | | |
| 10 | Chart.js Defer | Fix #11 | Bajo | | |
| 11 | Aria Labels y Roles | Fix #12 | Bajo | | |
| 12 | Manifest PWA | Fix #13 | Bajo | | |

**Leyenda:** PASS = pasa | FAIL = falla | WARN = advertencia | SKIP = no aplica

### Fixes de Precaucion Habilitados

Despues de ejecutar los tests, marcar cuales se pueden implementar:

- [ ] Fix #2: Timer skipToNextTimerPhase (si Test 1 FALLA)
- [ ] Fix #3: Singleton AudioContext (si Test 2 FALLA)
- [ ] Fix #4: Consolidar @media print (si Test 3 FALLA)
- [ ] Fix #5: Eliminar admin backdoor (si Test 4 PASS)
- [ ] Fix #6: Null checks defensivos (si Test 5 FALLA)
- [ ] Fix #7: localStorage try/catch (si Test 6 FALLA)
- [ ] Fix #8: hashPassword sin fallback (si Test 7 PASS)
- [ ] Fix #9: requiredMethods completo (si Test 8 FALLA)
- [ ] Fix #10: XSS full (si Test 9 FALLA)
- [ ] Fix #11: Chart.js defer (si Test 10 PASS)
- [ ] Fix #12: Aria labels (si Test 11 FAIL)
- [ ] Fix #13: Manifest completo (si Test 12 FAIL)
