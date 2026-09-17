# Historico de Cambios - Hapkido Athlete Tracker

> Carpeta de **registro obligatorio** de todas las modificaciones realizadas al proyecto por agentes de IA o desarrolladores.
> Consulta el `HARNESS.md` (seccion 1.5) para la norma completa.

---

## Convencion

Cada cambio genera **UN archivo** con el siguiente nombre:

```
YYYY-MM-DD_<nombre_modelo>_<descripcion_corta>.md
```

Ejemplos:
- `2026-09-17_opencode_fix-impresion-toast-meta.md`
- `2026-09-17_opencode_creacion-documentacion.md`

---

## Plantilla de registro

Copia y pega esta plantilla en un archivo nuevo por cada sesion de cambios:

```markdown
# Registro de Cambios

## Cabecera
- **Modelo / Autor**: `<nombre del modelo o desarrollador>`
- **Fecha**: `YYYY-MM-DD`
- **Dia**: `<Lunes|Martes|...>`
- **Herramienta**: `<opencode | Gemini | Copilot | manual ...>`

## Descripcion del Cambio
<Explicacion detallada de que se implemento, corrigio o refactorizo y por que.
Incluir contexto: que problema resolvia, decisiones tomadas, alternativas descartadas.>

## Archivos Modificados
- `<ruta>` — <que se cambio>
- `<ruta>` — <que se cambio>
- ...

## Estado y Verificacion
- [ ] Sintaxis verificada (abrir en navegador, sin errores en consola)
- [ ] Navegacion OK (login, secciones, CRUD)
- [ ] Contratos respetados (estructura localStorage, funciones publicas)
- [ ] Pruebas manuales realizadas: <describir>
- [ ] Sin secretos expuestos (credentials, token, API keys)

## Notas
<Opcional: pendientes, riesgos, decisiones a recordar.>
```

---

## Reglas

- **Nunca** incluir credenciales, tokens ni API keys en los registros.
- Mantener un archivo por **sesion/cambio** (si ya existe el archivo de hoy, actualizarlo antes de crear uno nuevo).
- Registrar tambien la **limpieza/correccion de bugs**, no solo funcionalidades nuevas.
