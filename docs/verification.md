# Informe de entrega · 24 de noviembre de 2026

**Resultado:** sitio estático bilingüe verificado en Windows con Node 24.18.0 y npm 12.0.2. No se publicó en un proveedor, no se creó un repositorio remoto y no se ejecutó GitHub Actions para este portafolio. Las verificaciones siguientes son locales sobre la salida de Astro con `SITE_ORIGIN=http://127.0.0.1:4322`.

## Controles ejecutados

- `npm ci`: instalación reproducible desde el lockfile. npm informó cero vulnerabilidades conocidas y avisos de deprecación de ESLint 9 y de `whatwg-encoding`. Revisar el stack de lint en su próxima actualización.
- `npm run format:check`, `npm run lint` y `npm run check`: correctos. Astro/TypeScript: 0 errores, 0 advertencias y 0 sugerencias en los 24 archivos analizados.
- `npm run build`: 17 páginas HTML (ocho destinos por idioma y un 404 compartido), robots y sitemap.
- `npm run verify:links`: sin enlaces internos rotos detectados; ocho pares de idioma recíprocos y las fuentes de las seis fichas validadas contra la salida. No es un monitor de disponibilidad de GitHub ni de la demo.
- Playwright: **52 de 52 pruebas aprobadas** en escritorio y emulación Pixel 7, Chromium, dos workers, 40 s. Se verificó acceso desde el índice a cada caso, descarga real de los PDF, cambio de idioma y regreso al mismo destino, teclado, navegación móvil, contacto, persistencia de tema y respuesta HTTP 404.
- axe: ninguna infracción detectada en las revisiones de páginas y 404 en tema claro, ni en las portadas comprobadas en oscuro. Se corrigieron nombres accesibles, estructura de listas y orden de encabezados a raíz de la primera ejecución. No sustituye una evaluación manual con lector de pantalla.
- Se inspeccionaron capturas de la portada y el índice. Playwright guarda las revisiones reproducibles en `test-results/**/review.png`; comprueba además que el contenido no supere el ancho del viewport. No se hicieron pruebas en dispositivos físicos ni en Safari.

## Rendimiento de la portada española

Lighthouse CLI 13.6.0, Chrome for Testing y servidor local de preview del build final. Una navegación por perfil, no la mediana de varias repeticiones. No se extrapolan estos valores a todas las páginas ni a usuarios reales.

| Perfil                   | Rendimiento | Accesibilidad | Buenas prácticas | SEO |   LCP | CLS |
| ------------------------ | ----------: | ------------: | ---------------: | --: | ----: | --: |
| Móvil, 23:01:38 UTC      |         100 |           100 |              100 | 100 | 0,9 s |   0 |
| Escritorio, 23:01:54 UTC |         100 |           100 |              100 | 100 | 0,2 s |   0 |

Informes de esta ejecución: `test-results/lighthouse-mobile.json` y `test-results/lighthouse-desktop.json`. Son artefactos locales: Playwright limpia su directorio de resultados en la siguiente ejecución. Para repetir, servir `npm run preview -- --host 127.0.0.1 --port 4322` y en otra consola ejecutar `npx --yes lighthouse@13.6.0 http://127.0.0.1:4322/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags=--headless`. Para escritorio añadir `--preset=desktop`.

## Recursos, límites y publicación

Las tres imágenes son auténticas: **Inventory Tally**, acceso público sin sesión; **Sistema POS**, vista de inventario WPF compilada en Release con cuatro productos ficticios y sin acceso a la base operativa; **TechCamp**, tarjeta React original con un fixture de secano. Una captura de componente no acredita una sesión completa. Las fuentes, revisiones y condiciones de reproducción están en la [auditoría](repository-audit.md).

El sitio no requiere credenciales, no usa la cuenta de desarrollo compartida y no recoge formularios. Se omitió LinkedIn por falta de una URL confirmada. Antes de compartirlo con reclutadores: elegir el dominio, reconstruir con el `SITE_ORIGIN` definitivo, publicar `dist/` en raíz siguiendo el [README](../README.md), probar enlaces directos, 404 y CV en el alojamiento y repetir Lighthouse sobre HTTPS público.
