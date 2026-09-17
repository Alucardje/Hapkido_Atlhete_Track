# Sincronización en la Nube y Transferencia P2P

> Documentación del protocolo de sincronización multi-dispositivo y transferencia peer-to-peer del Medidor del Atleta de Hapkido.

---

## Tabla de Contenidos

- [Arquitectura General](#arquitectura-general)
- [Sincronización con la Nube](#sincronización-con-la-nube)
  - [Proveedores Soportados](#proveedores-soportados)
  - [Mecanismo de Sincronización](#mecanismo-de-sincronización)
  - [Autenticación](#autenticación)
  - [Resolución de Conflictos](#resolución-de-conflictos)
  - [Sincronización Automática](#sincronización-automática)
  - [Modo Offline](#modo-offline)
- [Transferencia P2P (Token)](#transferencia-p2p-token)
  - [Exportar Token](#exportar-token)
  - [Importar Token](#importar-token)
  - [Validación y Seguridad](#validación-y-seguridad)
  - [Formato del Token](#formato-del-token)
- [Widget de Estado de Sincronización](#widget-de-estado-de-sincronización)
- [Configuración](#configuración)

---

## Arquitectura General

La aplicación sigue un modelo **offline-first**: todos los datos se almacenan localmente en `localStorage` y se sincronizan con la nube de forma opcional y asíncrona.

```
Dispositivo A ──POST──▶ API Cloud ──POST──▶ Dispositivo B
    │                     │                     │
    └── localStorage ◀────┼──── localStorage ◀───┘
```

Las colecciones de datos sincronizadas son:

| Colección       | Descripción                          |
|-----------------|--------------------------------------|
| `athletes`      | Registro de atletas                  |
| `records`       | Evaluaciones físicas y de combate    |
| `schools`       | Escuelas / Dojangs                   |
| `associations`  | Asociaciones deportivas              |
| `torneos`       | Torneos y competencias               |

---

## Sincronización con la Nube

### Proveedores Soportados

El sistema soporta múltiples proveedores de sincronización configurables desde la interfaz:

| Proveedor           | ID                  | Descripción                            |
|---------------------|---------------------|----------------------------------------|
| FEVEHAPKIDO API     | `fevehapkido_api`   | API oficial federativa (por defecto)   |
| Supabase            | `supabase`          | Base de datos Supabase vía REST API    |
| REST Personalizado  | `custom_rest`       | Cualquier endpoint REST compatible     |
| Token P2P           | `p2p_token`         | Transferencia directa entre dispositivos |

### Mecanismo de Sincronización

El protocolo de sincronización es un intercambio simple de tipo **push-pull**:

**1. El cliente envía todos sus datos locales:**

```
POST /v1/sync
Content-Type: application/json
Authorization: Bearer <api-key>
X-Client-Version: FEVEHAPKIDO-2026

{
    "clientData": {
        "athletes": [...],
        "records": [...],
        "schools": [...],
        "associations": [...],
        "torneos": [...]
    },
    "syncTimestamp": "2026-09-17T14:30:00.000Z"
}
```

**2. El servidor fusiona los datos y devuelve el resultado:**

```json
{
    "mergedData": {
        "athletes": [...],
        "records": [...],
        "schools": [...],
        "associations": [...],
        "torneos": [...]
    }
}
```

**3. El cliente reemplaza su `this.data` con `mergedData` y guarda localmente.**

### Autenticación

Cada petición de sincronización incluye dos headers obligatorios:

| Header              | Valor                        | Descripción                        |
|---------------------|------------------------------|------------------------------------|
| `Authorization`     | `Bearer <api-key>`           | Token de autenticación del usuario |
| `X-Client-Version`  | `FEVEHAPKIDO-2026`           | Versión del cliente para el servidor|

La API key se almacena en el `localStorage` del navegador bajo la clave `hapkido_sync_settings`.

### Resolución de Conflictos

Cuando dos dispositivos modifican el mismo registro, se aplica la estrategia configurada:

| Estrategia            | ID                   | Comportamiento                                          |
|-----------------------|----------------------|----------------------------------------------------------|
| Timestamp más reciente| `latest_timestamp`   | Gana el registro con `updatedAt` más reciente (default) |
| Mantener local        | `keep_local`         | Los datos locales siempre tienen prioridad              |
| Sobrescribir remoto   | `overwrite_remote`   | Los datos del servidor siempre reemplazan los locales   |

La estrategia se configura desde **Configuración > Ajustes > Sincronización**.

### Sincronización Automática

La sincronización automática está habilitada por defecto y funciona con las siguientes reglas:

1. **Debounce de 4 segundos**: Al detectar un cambio local, se espera 4 segundos antes de sincronizar para agrupar múltiples cambios.
2. **Solo en línea**: La sincronización automática solo se ejecuta cuando `navigator.onLine` es `true`.
3. **API key requerida**: No se sincroniza automáticamente si no hay API key configurada.
4. **Al iniciar**: Si hay conexión y API key configurada, se sincroniza automáticamente 2 segundos después de cargar la app.
5. **Al reconectar**: Al volver a tener conexión (`evento online`), se dispara una sincronización automática.

### Modo Offline

Cuando no hay conexión a internet:

- Los cambios se guardan localmente en `localStorage`.
- El widget de sincronización muestra "Sin Conexión".
- Los cambios pendientes se acumulan en `pendingChangesCount`.
- Al recuperar conexión, se sincronizan automáticamente.
- **No se pierden datos nunca.** Todo queda guardado localmente.

---

## Transferencia P2P (Token)

La transferencia P2P permite compartir datos entre dispositivos o dojangs sin necesidad de un servidor central. Funciona mediante tokens codificados en Base64.

### Exportar Token

**Proceso:**
1. Se extraen las colecciones: `athletes`, `records`, `schools`, `torneos`.
2. Se empaquetan en un JSON con metadatos de versión y fecha de exportación.
3. Se codifica en Base64.
4. El token se muestra en un modal para copiar al portapapeles.

**Estructura del payload exportado:**
```json
{
    "version": "2026.1",
    "exportedAt": "2026-09-17T14:30:00.000Z",
    "athletes": [...],
    "records": [...],
    "schools": [...],
    "torneos": [...]
}
```

### Importar Token

**Proceso:**
1. El usuario pega el token recibido en el campo de importación.
2. Se decodifica de Base64 a JSON.
3. Se valida el esquema (tipo de dato, campos requeridos).
4. Se sanitizan los campos (protección contra prototype pollution).
5. Se muestra un resumen con el conteo de atletas y registros validados.
6. El usuario confirma la fusión.
7. Los datos se fusionan con los existentes: si un registro tiene el mismo ID, se reemplaza; si no, se agrega.

### Validación y Seguridad

El sistema de importación implementa múltiples capas de seguridad:

**Validación de tamaño:**
- Máximo permitido: **5 MB** (5,000,000 caracteres en Base64).
- Si el token excede este límite, se rechaza con error.

**Validación de esquema:**
- El token debe ser un objeto JSON.
- Debe contener los arrays `athletes` y `records`.
- Cada atleta debe tener `id` y `name`.

**Sanitización de campos (protección contra prototype pollution):**

| Campo         | Tipo   | Regla de sanitización                                    |
|---------------|--------|----------------------------------------------------------|
| `id`          | String | Solo alfanuméricos, guiones y guiones bajos              |
| `name`        | String | Trim + máximo 100 caracteres                             |
| `birthdate`   | String | Máximo 10 caracteres (formato YYYY-MM-DD)                |
| `gender`      | String | Solo `FEMENINO` o `MASCULINO`                            |
| `belt`        | String | Máximo 50 caracteres                                     |
| `weight`      | Number | Debe ser numérico, `null` si no es válido                |
| `height`      | Number | Debe ser numérico, `null` si no es válido                |
| `experience`  | String | Máximo 50 caracteres                                     |
| `school`      | String | Máximo 100 caracteres                                    |
| `status`      | String | Solo `activo` o `inactivo`                               |
| `physicalDetails` | Object | Copia plana (`Object.assign`), sin `__proto__`       |
| `combatDetails`   | Object | Copia plana (`Object.assign`), sin `__proto__`       |

**Protección explícita:**
- Se eliminan propiedades `__proto__` de objetos anidados.
- Los campos de tipo String se truncan a longitudes máximas.
- Los IDs se filtran para contener solo caracteres seguros.

### Formato del Token

```
eyJ2ZXJzaW9uIjoiMjAyNi4xIiwiZXhwb3J0ZWRBdCI6IjIwMjYtMDktMTdUMTQ6MzA6MDAuMDAwWiIsImF0aGxldGVzIjpbLi4uXSwicmVjb3JkcyI6Wy4uLl0sInNjaG9vbXMiOlsiLi4uIl19
```

- **Codificación**: `btoa(unescape(encodeURIComponent(jsonStr)))` al exportar.
- **Decodificación**: `atob()` + `TextDecoder('utf-8')` al importar (seguro, sin `escape()` deprecado).
- **Contenido**: JSON con `version`, `exportedAt`, `athletes`, `records`, `schools`, `torneos`.

### Flujo de Uso Típico

**Exportar (Dispositivo A):**
1. Ir a Configuración > Sincronización.
2. Hacer clic en "Generar Token P2P".
3. Copiar el token generado.

**Importar (Dispositivo B):**
1. Ir a Configuración > Sincronización.
2. Pegar el token en el campo de importación.
3. Revisar el resumen de datos validados.
4. Confirmar la fusión.
5. La app se recarga automáticamente con los datos fusionados.

---

## Widget de Estado de Sincronización

El widget en la cabecera muestra el estado actual de la sincronización:

| Estado          | Icono              | Color   | Descripción                                   |
|-----------------|--------------------|---------|-----------------------------------------------|
| Sin Conexión    | `cloud-slash`      | Rojo    | Sin internet, datos guardados localmente      |
| Sincronizando   | `rotate` (spin)    | Azul    | En proceso de sincronización con la nube       |
| Pendientes      | `cloud-arrow-up`   | Amarillo| Cambios locales pendientes de sincronizar     |
| Sincronizado    | `cloud-check`      | Verde   | Última sincronización exitosa                 |
| Idle            | `cloud`            | Gris    | Nube activa, sin cambios pendientes           |

Al hacer clic en el widget se dispara una sincronización manual.

---

## Configuración

Todos los ajustes de sincronización se almacenan en `localStorage` bajo la clave `hapkido_sync_settings`:

```json
{
    "enabled": true,
    "provider": "fevehapkido_api",
    "endpointUrl": "https://api.fevehapkido.org/v1/sync",
    "apiKey": "",
    "autoSync": true,
    "conflictStrategy": "latest_timestamp",
    "lastSyncTimestamp": "2026-09-17T14:30:00.000Z",
    "pendingChangesCount": 0
}
```

| Campo                  | Tipo    | Descripción                                    |
|------------------------|---------|------------------------------------------------|
| `enabled`              | Boolean | Sincronización habilitada                      |
| `provider`             | String  | Proveedor activo (ver tabla de proveedores)    |
| `endpointUrl`          | String  | URL del endpoint de sincronización             |
| `apiKey`               | String  | Token de autenticación Bearer                  |
| `autoSync`             | Boolean | Sincronización automática al detectar cambios  |
| `conflictStrategy`     | String  | Estrategia de resolución de conflictos         |
| `lastSyncTimestamp`    | String  | ISO 8601 de la última sincronización exitosa   |
| `pendingChangesCount`  | Number  | Cambios locales pendientes de sincronizar      |
