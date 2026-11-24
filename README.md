# Portafolio de Johan Borrero

Sitio estático bilingüe para consultar el perfil profesional, descargar el CV y examinar tres casos de ingeniería: Inventory Tally, Sistema POS y TechCamp v2. El español se sirve en `/` y el inglés en `/en/`. Cada caso enlaza la revisión del código que respalda sus decisiones técnicas.

## Trabajar en local

Desde la raíz del proyecto, usar **Node.js 24.18.0**, la versión fijada en CI (`package.json` admite `>=24.18.0`). Instalar desde `package-lock.json` y descargar el Chromium correspondiente a Playwright:

```sh
npm ci
npm exec --no -- playwright install chromium
npm run dev
```

En un entorno Linux limpio, usar `npm exec --no -- playwright install --with-deps chromium` para instalar también las dependencias del sistema. Chromium se usa en las pruebas de navegador; el sitio compilado no lo necesita. Abrir la URL que imprime Astro para el servidor de desarrollo.

### Comprobar el sitio que se publicaría

```sh
npm run format:check
npm run lint
npm run check
npm run build
npm run verify:links
npm run test:e2e
npm run preview
```

Los tres primeros comandos comprueban el formato (sin escribir), ESLint y los diagnósticos de Astro/TypeScript. `build` genera `dist/`; repetirlo tras modificar las fuentes. `verify:links` inspecciona ese directorio y `test:e2e` arranca su propio servidor en `127.0.0.1:4322`: dejar libre ese puerto. El último comando sirve la misma salida para revisión manual. El [workflow de calidad](.github/workflows/quality.yml) ejecuta las comprobaciones en GitHub Actions; **no despliega**.

## Despliegue estático manual

**Publicar el contenido de `dist/` en la raíz de un dominio.** Antes de compilar, fijar `SITE_ORIGIN` al origen HTTPS definitivo, sin subruta. Por ejemplo, en PowerShell (sustituir el dominio de ejemplo):

```powershell
$env:SITE_ORIGIN = 'https://portfolio.example.org'
npm run build
npm run verify:links
npm run test:e2e
```

El origen se incorpora al HTML al compilar: cambiarlo en el alojamiento después de subir los archivos no actualiza las URL. Sin `SITE_ORIGIN` ni origen del proveedor, es normal que una compilación local no tenga sitemap, canonical, alternativos SEO ni línea `Sitemap:` en `robots.txt`. El selector de idioma sí funciona. La [arquitectura](docs/architecture.md) detalla la precedencia de variables.

- **Cloudflare Pages:** crear un proyecto de [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) y subir manualmente la carpeta de salida, de modo que `index.html` y `404.html` queden en el nivel superior del sitio. Conservar `404.html`: en su ausencia, Pages puede interpretar el sitio como SPA.
- **Vercel:** desplegar manualmente el directorio estático ya compilado con la CLI de Vercel (`vercel --prod` desde `dist/`). Configurar ese proyecto como **Other**, sin comando de compilación y con `.` como directorio de salida. Así se publican los archivos que se acaban de verificar. No hace falta integrar un repositorio ni ejecutar Astro en el servidor.
- **GitHub Pages:** esta salida solo es adecuada para un sitio en la raíz (sitio de usuario/organización o dominio personalizado que sirva el proyecto en `/`). No subirla tal cual a `/<repositorio>/`: los enlaces de navegación y recursos parten de `/`, y `SITE_ORIGIN` no configura un `base`.

No configurar una reescritura global a `/index.html`. Al comprobar un alojamiento, abrir directamente `/en/projects/sistema-pos/`, descargar un PDF desde `/cv/` y solicitar una URL inexistente: esta última debe devolver **HTTP 404**, no la portada con estado 200. Revisar también que `robots.txt`, `/sitemap-index.xml` y el canonical de una ficha apunten al dominio elegido.

## Documentación

- [Especificación](docs/specification.md): destinos y criterios de aceptación.
- [Arquitectura](docs/architecture.md): rutas, contenido, recursos y pruebas. [AGENTS.md](AGENTS.md): pautas para modificar el proyecto.
- [Auditoría de repositorios](docs/repository-audit.md): fuentes por proyecto y límites de las afirmaciones. Véanse también la [estrategia editorial](docs/content-strategy.md) y el [sistema de diseño](docs/design-system.md).
- [Registro de verificaciones](docs/verification.md): entorno, resultados locales y límites de la entrega.
