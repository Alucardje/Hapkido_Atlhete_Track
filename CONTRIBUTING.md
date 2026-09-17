# Contribuir al proyecto

Gracias por tu interés en contribuir a **Hapkido Athlete Tracker**.

## Cómo empezar

1. Haz fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nombre-del-cambio`
3. Haz tus modificaciones
4. Asegúrate de que la app funcione correctamente en un navegador
5. Haz commit con un mensaje descriptivo: `git commit -m "feat: descripción del cambio"`
6. Push a tu rama: `git push origin feature/nombre-del-cambio`
7. Abre un Pull Request

## Convenciones

### Commits
Usar [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` formato (no afecta el funcionamiento)
- `refactor:` reestructuración de código
- `chore:` tareas de mantenimiento

### Código
- Seguir el estilo existente del proyecto (sin frameworks, prototype-based)
- Mantener la estructura de módulos: cada archivo JS extiende `HapkidoApp.prototype`
- Usar `this.escapeHTML()` para todo contenido que se inserte en el DOM
- No agregar dependencias externas sin justificación
- Mantener la compatibilidad con navegadores modernos (Chrome, Edge, Safari, Firefox)

### Seguridad
- Nunca exponer claves API en el código fuente
- Mantener el CSP actualizado
- Validar y sanitizar toda entrada de usuario
- Usar SHA-256 (Web Crypto API) para contraseñas, nunca almacenar en texto plano

## Issues

Al abrir un issue, por favor incluye:
- Descripción clara del problema o sugerencia
- Pasos para reproducir (en caso de bug)
- Navegador y dispositivo utilizado
- Capturas de pantalla si es posible
