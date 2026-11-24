# Guía de trabajo en el portafolio

Usar la [especificación](docs/specification.md) para decidir qué debe aceptar un cambio, la [arquitectura](docs/architecture.md) para localizar su implementación y el [README](README.md) para reproducir los comandos. Ante una discrepancia, contrastar el comportamiento con las fuentes y señalar la diferencia antes de cambiar el contrato.

## Cambios de contenido

- Para revisar un caso o su paridad ES/EN, seguir [`skills/audit-case-study/SKILL.md`](skills/audit-case-study/SKILL.md). La auditoría es de **solo lectura**: partir del [índice](docs/repository-audit.md) y de la ficha en `docs/audit/`; devolver propuestas con revisión, archivo, líneas y límites. No ejecutar el producto ni modificar el material auditado. Para delegación, `.atl/skill-registry.md` es el índice; el contrato está en el `SKILL.md` correspondiente.
- Al implementar una corrección editorial, cambiar los Markdown de ambos idiomas con el mismo slug. Conservar sentido, cifras, unidades, estado y enlaces fijados a SHA completo y líneas. Distinguir declaraciones profesionales del titular, comportamiento observado en código y resultados medidos. Un test existente no demuestra que haya pasado.
- Usar solo material público autorizado. No incorporar credenciales, cuentas de prueba, datos de clientes ni capturas de sesiones privadas. Si falta una imagen, conservar el esquema y la indicación de captura pendiente.
- Si cambia el perfil profesional, comprobar portada, perfil y ambos CV. Editar `scripts/cv/resume.html` y regenerar ambos PDF solo cuando el cambio lo requiera; no editar los binarios a mano.

## Cambios de interfaz o rutas

- Generar enlaces editoriales con `pathFor` en `src/i18n/site.ts`. Mantener el destino al cambiar de idioma, las barras finales, el enlace de salto a `main#main`, el foco visible y un 404 real. Si cambia el número de destinos previsto, revisar juntos la especificación, el inventario de pruebas y el verificador.
- Conservar el contenido y los diagramas en HTML/SVG estáticos. No añadir hidratación para resolver navegación, traducción o presentación. Revisar cambios visuales en escritorio y móvil y respetar los tokens de `src/styles/global.css`.
- Editar fuentes, no `dist/`, `.astro/` ni `test-results/`. Limitar el formato a los archivos del cambio; `npm run format` reescribe todo el proyecto.

## Verificación y entrega

Con Node 24.18.0, `npm ci` y Chromium de Playwright instalados, seguir la secuencia del README. Para cambios de rutas, contenido o recursos, compilar **antes** de `verify:links` y `test:e2e`; de otro modo se evalúa una salida anterior. Si cambia el origen de publicación, volver a compilar con `SITE_ORIGIN` y verificar esa salida.

Indicar qué se ejecutó, sobre qué versión y qué quedó sin comprobar. Reservar `docs/verification.md` para el registro del titular. No inferir métricas de accesibilidad o rendimiento a partir de la configuración de pruebas. La CI verifica; la publicación en raíz de dominio es una operación manual separada.
