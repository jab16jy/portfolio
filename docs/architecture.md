# Arquitectura del portafolio

Astro genera un documento HTML por destino durante la compilación. Navegar, cambiar de idioma o descargar el CV consiste en pedir otro archivo al alojamiento estático. No hay router de cliente, API de aplicación ni base de datos que desplegar.

```text
src/i18n/site.ts + src/content/{projects,engineering}/
    → getStaticPaths y colecciones → componentes Astro → Shell → HTML en dist/
CSS + tipografías locales → Vite/Tailwind → recursos en dist/_astro/
public/ → copia estática de CV, capturas e icono en dist/
dist/ → inventario de rutas → verificación de enlaces y pruebas en Chromium
```

## De un archivo Markdown a dos URL equivalentes

`src/content.config.ts` carga las colecciones con `glob` y valida su frontmatter con Zod. `projects` agrupa por idioma; cada entrada aporta título, resumen, estado, tecnologías, hallazgo, al menos tres nodos y al menos una fuente. Imagen, texto alternativo y demo son campos opcionales. `engineering` usa un Markdown por idioma; `Engineering.astro` toma los encabezados de nivel dos para construir el índice del método descrito en la [especificación](specification.md).

`src/pages/[...route].astro` enumera con `getStaticPaths()` cinco secciones (inicio, `projects`, `engineering`, `about`, `contact`) y los tres proyectos de cada idioma. Una entrada como `src/content/projects/es/sistema-pos.md` se sirve en `/projects/sistema-pos/`; su par inglés, en `/en/projects/sistema-pos/`. El segmento común identifica el caso. El prefijo de la URL determina el idioma, sin detección del navegador. `src/i18n/site.ts` reúne textos compartidos, orden y función `pathFor`; `Shell.astro` usa esa función para enlazar el mismo destino en el otro idioma.

## Evidencia, diagramas y recursos

- **Casos:** `CaseStudy.astro` renderiza el cuerpo Markdown, el índice de secciones y la lista `sources`. Extrae de las fuentes una revisión fijada y falla si no encuentra una. El [índice de auditoría](repository-audit.md) enlaza los informes por producto en `docs/audit/`; la [estrategia editorial](content-strategy.md) distingue pruebas técnicas de declaraciones del titular.
- **Diagramas:** en portada, `Plate.astro` calcula una proyección oblicua y emite un SVG con etiqueta localizada para explicar «especificar, implementar, verificar». En cada caso, `finding` da título al recorrido y `nodes` se convierte en una lista ordenada con conectores CSS. El recorrido sigue siendo legible sin imagen ni JavaScript. Las capturas disponibles se sirven desde `public/projects/` y no sustituyen las fuentes.
- **Tipografía y estilo:** `Shell.astro` importa Geist y Geist Mono variables desde los paquetes locales de Fontsource, junto con `src/styles/global.css`. Tailwind se integra mediante el plugin de Vite. El navegador obtiene los archivos del sitio, sin consultar una CDN de fuentes. El [sistema de diseño](design-system.md) describe el uso de cada familia y de los temas.
- **CV:** `public/cv/johan-borrero-es.pdf` y `public/cv/johan-borrero-en.pdf` son descargas estáticas. El build las copia; no las regenera. Para actualizarlas, editar `scripts/cv/resume.html` y ejecutar desde la raíz `node scripts/cv/generate.cjs` con Playwright resoluble y Chrome instalado (o Edge con `CV_CHANNEL=msedge`). Este proceso, distinto del Chromium de E2E, imprime sin conexión, revisa márgenes y exige una página por idioma antes de escribir ambos archivos.

## Qué JavaScript llega al navegador

El layout inicializa el tema con un script en la cabecera: lee la preferencia `jb-theme` si está disponible y, en su defecto, usa el tema del sistema. Otro script atiende los botones de tema y menú móvil, actualiza `aria-expanded` y devuelve el foco al botón al cerrar con Escape. El JSON-LD de las portadas describe a la persona y no ejecuta código. Los componentes Astro y su lógica de generación de rutas y diagramas se resuelven al compilar; no hay islas hidratadas.

## Origen, indexación y errores

[`astro.config.mjs`](../astro.config.mjs) fija salida estática y `trailingSlash: "always"`. Para `site` toma primero `SITE_ORIGIN`; en su ausencia usa `CF_PAGES_URL` o, si esta no está definida, `https://` seguido de `VERCEL_PROJECT_PRODUCTION_URL`. Fijar explícitamente `SITE_ORIGIN` antes del build evita usar por accidente el dominio de una vista previa.

- **Sin origen**, incluso en un build local completo, no se activa `@astrojs/sitemap`. `robots.txt` permite el rastreo sin anunciar sitemap; el layout omite canonical, alternativos SEO y `og:url`.
- **Con origen**, también en local, se genera el sitemap y `robots.txt` anuncia `sitemap-index.xml`. Cada página editorial emite su canonical, `og:url` y alternativos `es`, `en` y `x-default` (español). El enlace visible de idioma no depende del origen.
- `src/pages/404.astro` produce una página común con acceso a ambas portadas, `noindex` y sin canonical ni alternativos SEO. El alojamiento debe conservar `404.html` y devolver estado 404 para rutas ausentes. Las rutas absolutas requieren publicación en `/`; el [procedimiento manual](../README.md#despliegue-estático-manual) no usa fallback SPA.

## Cómo se verifica la salida

1. **Inventario:** `tests/e2e/routes.mjs` recorre `dist/` y traduce cada `index.html` a su URL con barra final. Separa el 404 y exige ocho destinos editoriales por idioma, incluida su portada.
2. **Inspección estática:** `scripts/verify.mjs` analiza el HTML con Cheerio. Resuelve archivos internos y fragmentos, comprueba `lang`, `main#main` y el enlace recíproco de idioma. Para cada ficha contrasta las fuentes del frontmatter con los enlaces renderizados y su formato de permalink a SHA y líneas. No comprueba disponibilidad externa; usar el mismo `SITE_ORIGIN` del build para reconocer URL absolutas internas.
3. **Harness de navegador:** `playwright.config.ts` arranca `astro preview` sobre el build en `127.0.0.1:4322` sin reutilizar otro servidor. `tests/e2e/portfolio.spec.mjs` usa Chromium en escritorio y Pixel 7 emulado, bloquea tráfico externo y WebSockets, y recorre las páginas con axe y una comprobación de desborde. Prueba teclado, cambio de idioma de ida y vuelta, navegación, tema persistente, enlaces de contacto, descarga con firma PDF y estado HTTP 404. Las capturas de revisión se escriben en `test-results/` para inspección; no son por sí mismas una comparación visual aprobada.
4. **CI:** [Quality](../.github/workflows/quality.yml) se activa en push, pull request o ejecución manual, con acceso de lectura en Ubuntu 24.04 y Node 24.18.0. Instala con `npm ci`, comprueba formato, lint y tipos, compila, verifica enlaces, instala Chromium con sus dependencias y ejecuta E2E. No contiene pasos de publicación.

Estos controles describen lo que se prueba. Los resultados de una ejecución concreta, su entorno y sus límites corresponden a `docs/verification.md`, registro que elaborará el titular.
