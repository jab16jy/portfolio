# TechCamp v2 · cuaderno de auditoría

## Corte y método

El 24 de noviembre de 2026, `git rev-parse HEAD` en `techcamp-v2` y `git ls-remote --symref https://github.com/jab16jy/techcamp-v2.git HEAD` devolvieron el mismo [commit de main: 29def038d38cc8728af42fd8785bf958200981a5](https://github.com/jab16jy/techcamp-v2/commit/29def038d38cc8728af42fd8785bf958200981a5). `git ls-files` enumeró 912 rutas. `git --no-optional-locks status --porcelain=v1 --untracked-files=no` no señaló diferencias en archivos seguidos. La comparación se refiere a ese árbol; excluye archivos privados, ignorados y sin seguimiento. No había `.codegraph/` en el proyecto. Se leyeron fuentes seleccionadas del inventario sin inicializar índices, abrir `.env` o material de credenciales, instalar dependencias ni levantar servicios. Para resultados de ejecución se consultaron metadatos públicos de GitHub Actions; no logs ni trazas.

## Qué sostiene cada afirmación

| Área | Fuente en el corte | Lectura y límite |
| --- | --- | --- |
| Producto e infraestructura | [Mapa de módulos y stack](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/AGENTS.md#L36-L52) | Apoyo a decisiones de pequeños productores del Caribe colombiano. Monolito modular FastAPI con dominio, aplicación y adaptadores; API, worker e ingestor; un PostgreSQL con PostGIS, TimescaleDB y pgvector; Mosquitto y PWA React/TypeScript. Existe un perfil de seminario con emuladores. Configurar otro perfil no acredita un despliegue comercial. |
| IoT, clima y decisión | [Entrada E y resultado esperado](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/src/techcamp/simulator/scenarios/dry-spell-rainfed.yaml#L1-L19) · [balance](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/src/techcamp/irrigation/application/run_daily_balance.py#L88-L137) | En D se publica telemetría simulada por MQTT; en E, maíz en secano, **cero nodos**, clima de fixture y 21 días. El balance distingue pronóstico incompleto o envejecido. E espera `water_stress`, `rainfed`, `conserve_moisture`; no exige un volumen de riego. No hay lectura de sensor físico en E. |
| Ruta hasta la pantalla | [Composición del estado](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/src/techcamp/home/application/plot_status.py#L456-L475) · [tarjeta](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/web/src/features/plot-status/components/DecisionCard.tsx#L8-L27) · [aserciones E](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/web/e2e/scenarios/dry-spell-rainfed.spec.ts#L66-L116) | El worker calcula y persiste; Inicio lee la recomendación guardada; la PWA muestra déficit y consejo. Playwright contrasta primero el estado con `expected` y luego exige que se vea el consejo. No se infiere su efectividad agronómica. |
| Conectividad y bitácora | [Escenario D](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/web/e2e/scenarios/offline-farmer.spec.ts#L103-L165) | Tras preparar la parcela en línea, se desconecta el navegador, se guarda una observación, se reconecta y se consulta al servidor. Se exige una fila con `created_offline` y la misma nota, también después de repetir la sincronización. No mide cobertura móvil rural. |
| ML con datos históricos reales | [Ficha M2: validación, prueba y registro](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/ml/models/flood_m2/card.md#L54-L100) | Unidad municipio-mes, no parcela. En el test reservado: 63 positivos de 2.340; ventaja PR-AUC de LightGBM +0,004990, IC95 [−0,012013; +0,040028]; Brier 0,027650 frente a 0,026581. **Resultado publicado:** no se promueve; la versión registrada es la climatología mensual sin cortes de severidad calibrados. No se reentrenó ni se comprobó un servicio productivo. |
| Asistente | [ADR-0028: ensayo y criterio](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0028-proveedor-asistente-deepseek-flash-y-umbral-de-evaluacion.md#L28-L102) | Explica hechos ya calculados. El sustituto de embeddings del seminario recuperó cero fragmentos en 30 preguntas según el ADR. `deepseek-flash` es la elección de proveedor; 27/30 y ausencia de fallos descalificadores son requisitos, no una calificación alcanzada. |
| Aislamiento y calidad | [Reglas y estrategia de pruebas](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/AGENTS.md#L79-L106) · [CI](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/.github/workflows/ci.yml) | Alcance por organización, contratos de importación, pytest, Vitest y detección de secretos como controles declarados. La existencia del workflow o de `server/tests/identity/test_org_isolation.py` no certifica seguridad ni que todos los jobs corrieran en este SHA. |
| Métricas e impacto | [ADR-0024](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0024-metricas-de-impacto-y-adopcion-digital.md#L18-L27) | Registrar una acción tras una alerta mide adopción digital; rendimiento relativo municipal da contexto. Para atribuir impacto, el ADR propone línea de partida por parcela y controles en un piloto. El error del balance de seminario se mide contra el simulador. No se acreditan ahorros, cosechas, usuarios activos ni calidad de calibración en finca. |

## Ejecución observada frente a configuración

El [workflow E2E](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/.github/workflows/e2e-scenarios.yml#L150-L160) selecciona A y E para PR y la suite completa para la ejecución nocturna. El inventario incluye seis specs: normal, El Niño, lluvias, avería de nodo, productor sin conexión y veranillo de secano. En el [job 138585557728](https://github.com/jab16jy/techcamp-v2/actions/runs/45433677206/job/138585557728) del SHA auditado, GitHub registra `success` para la migración, el arranque de API/worker/ingestor y `run every scenario (nightly)`; el paso de PR se omitió. También hay una [ejecución nocturna fallida del mismo SHA](https://github.com/jab16jy/techcamp-v2/actions/runs/44545796527). No se atribuye causa ni se presenta el éxito seleccionado como tasa de fiabilidad.

## Evidencia pública de ingeniería agéntica

- **Una regla de revisión se vuelve ejecutable.** «When a review catches the same mistake a second time, encode it as an ast-grep rule» ([AGENTS.md, 79–81](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/AGENTS.md#L79-L81)). El caso concreto es [rules/no-naive-today.yml](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/rules/no-naive-today.yml#L4-L32): tras E7 y E8 se prohíbe que el día de la parcela dependa del reloj local del servidor. La regla documenta su límite con alias; `rule-tests/no-naive-today-test.yml` conserva los ejemplos.
- **Un agente puede descubrir el desacuerdo; el responsable decide el supuesto.** El [registro de E16](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/odd/tasks/techcamp-v2-e16-simulator.md#L532-L605) y la [decisión #340, cerrada](https://github.com/jab16jy/techcamp-v2/issues/340) enlazan un `expected` que no se cumplía con la edad de siembra. Se corrigió el escenario a 55 días, sin presentar la duración de las etapas del catálogo como validada en campo. El YAML y la prueba E enlazados arriba permiten seguir la decisión hasta el texto visible.
- **Límite de autoridad sobre ML.** «agents leave the harness, the test set and the promotion gate untouched» ([AGENTS.md, 95–96](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/AGENTS.md#L95-L96)). El resultado contrastable es `promote = false` en `ml/models/flood_m2/card.md`, no una afirmación sobre qué agente escribió cada línea.

## Versiones, identidad y disciplina de pruebas

- **Backend.** El [manifiesto del servidor](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/pyproject.toml#L1-L35) declara paquete `0.1.0`, Python `>=3.12`, FastAPI `>=0.141.1` y SQLAlchemy async `>=2.0`. Fija `procrastinate==3.10.0` porque una migración consume el esquema de esa biblioteca. Son dependencias declaradas; `v2` nombra el proyecto y no se halló un tag de entrega en el checkout. El [contrato de importaciones](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/pyproject.toml#L96-L120) configura el orden adaptadores → aplicación → dominio para 12 módulos.
- **Identidad y modelo.** [ADR-0014](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0014-autenticacion.md#L3-L15) separa dos decisiones: el perfil de seminario emite JWT localmente; para producción futura propone OTP por SMS o correo con Supabase Auth. La API valida el token con JWKS y asocia `sub` al usuario; roles y membresías pertenecen a la base del proyecto. El proveedor gestionado no se verificó en producción.
- **Pruebas.** En el árbol del SHA hay 171 archivos `test_*.py` bajo [server/tests](https://github.com/jab16jy/techcamp-v2/tree/29def038d38cc8728af42fd8785bf958200981a5/server/tests) y 75 `*.test.ts`/`*.test.tsx` bajo [web](https://github.com/jab16jy/techcamp-v2/tree/29def038d38cc8728af42fd8785bf958200981a5/web). No son casos aprobados. Como resultado acotado, el [registro E16](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/odd/tasks/techcamp-v2-e16-simulator.md#L564-L571) reporta 256 aprobados y 27 omitidos en la suite de simulador de ese paso. Hay [una mutación manual documentada](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/odd/tasks/techcamp-v2-e3-farms.md#L1471-L1484): al retirar la señal de timeout falló el test del cliente HTTP; restaurada la rama, pasaron los 13 del archivo. No se halló configuración de Stryker ni puntuación de mutación en manifiestos, workflows y tareas revisados.
- **Decisiones e informes.** Se contaron 28 [ADR numerados](https://github.com/jab16jy/techcamp-v2/tree/29def038d38cc8728af42fd8785bf958200981a5/docs/adr), sin contar el índice, y 25 Markdown bajo [odd/tasks](https://github.com/jab16jy/techcamp-v2/tree/29def038d38cc8728af42fd8785bf958200981a5/odd/tasks). No se halló un árbol `openspec/`; las decisiones de escenario y sus verificaciones se pueden seguir en E16. Hay dos [skills versionadas](https://github.com/jab16jy/techcamp-v2/tree/29def038d38cc8728af42fd8785bf958200981a5/.claude/skills), FastAPI y Pydantic; no se contaron instrucciones para skills externas como instalaciones o ejecuciones. Para resultados de ML, la fuente es la ficha M2 citada arriba, no el número de tareas cerradas.

## Captura editorial

[PNG publicado](../../public/projects/techcamp-decision.png). Es un render en navegador de `DecisionCard` con datos de prueba. Los 80 mm de déficit y los 12 mm de lluvia prevista proceden de la [prueba unitaria de secano](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/web/src/features/plot-status/api/decisionCopy.test.ts), no de una ejecución del escenario E ni de una parcela real. `decisionFor` genera la prop `decision`; el componente original dibuja la banda, el pictograma y ambas líneas de texto. La captura no acredita el cálculo del balance, el transporte por API ni la eficacia del consejo. No se inició sesión ni se arrancaron la PWA, el simulador o el backend.

### Reproducción (Windows, PowerShell)

**Archivo verificado:** 824 × 392 px; SHA-256 `4f40e7cda5d0a0d33dc01fc2a2c08695e6ca228c057b22c283afa85e80d6080b`. Se comprobaron los tres mensajes visibles y el color de la banda antes del recorte, y se revisó visualmente el PNG. No contiene nombres, identificadores ni datos de sesión.

Desde un clon local de `techcamp-v2`, exportar únicamente las fuentes necesarias a un directorio temporal nuevo. La lista explícita excluye `.env`, `.npmrc`, archivos locales y perfiles de navegador. Se usaron Node 24.18.0, npm 12.0.2, las dependencias del lockfile y el Chromium headless de Playwright.

```powershell
$sha = '29def038d38cc8728af42fd8785bf958200981a5'
$tmp = New-Item -Type Directory (Join-Path $env:TEMP ([guid]::NewGuid()))
git archive --format=tar -o "$tmp/web.tar" $sha web/package.json web/package-lock.json web/src/index.css web/src/design-system web/src/features/plot-status/api/decisionCopy.ts web/src/features/plot-status/components/DecisionCard.tsx
tar -xf "$tmp/web.tar" -C $tmp
Set-Location "$tmp/web"
npm.cmd ci --legacy-peer-deps --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org --userconfig=NUL --globalconfig=empty-global-npmrc --cache=../cache
$env:PLAYWRIGHT_BROWSERS_PATH = "$tmp/browsers"
node ./node_modules/playwright/cli.js install --only-shell chromium
```

En ese `web` temporal, guardar estos tres bloques como archivos UTF-8. El contenedor solo aporta el fondo del proyecto y un margen para el recorte; no contiene una maqueta de la tarjeta.

`index.html`:

```html
<!doctype html><html lang="es"><meta charset="utf-8"><title>DecisionCard</title>
<main id="root" class="flow-root bg-surface pb-4"></main><script type="module" src="/capture.tsx"></script></html>
```

`capture.tsx`:

```tsx
import { createRoot } from 'react-dom/client'
import './src/index.css'
import { decisionFor } from './src/features/plot-status/api/decisionCopy'
import { DecisionCard } from './src/features/plot-status/components/DecisionCard'

const decision = decisionFor({
  plot: { irrigation_system: 'none' }, active_cycle: null,
  recommendation: {
    kind: 'rainfed', depth_mm: null, duration_min: null, advice: ['conserve_moisture'],
    rationale: { depletion_mm: 80, raw_mm: 60, forecast_rain_7d_mm: 12, forecast_et0_7d_mm: 20 },
  },
})
createRoot(document.getElementById('root')!).render(<DecisionCard decision={decision} />)
```

`capture.mjs`:

```js
import { build, preview } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { chromium } from 'playwright'
import { expect } from '@playwright/test'

await build({ configFile: false, envFile: false, plugins: [react(), tailwind()] })
const server = await preview({ configFile: false, envFile: false,
  preview: { host: '127.0.0.1', port: 4193, strictPort: true } })
const browser = await chromium.launch()
try {
  const origin = 'http://127.0.0.1:4193'
  const page = await browser.newPage({ viewport: { width: 412, height: 640 },
    deviceScaleFactor: 2, locale: 'es-CO', serviceWorkers: 'block' })
  await page.route('**/*', route => {
    const url = new URL(route.request().url())
    return url.origin === origin && (url.pathname === '/' || url.pathname.startsWith('/assets/'))
      ? route.continue() : route.abort()
  })
  await page.goto(origin)
  const card = page.locator('#root')
  await expect(card.getByRole('button')).toContainText('Al cultivo le faltan 80 mm: está en estrés')
  await expect(card.getByText('Se espera 12 mm de lluvia en los próximos 7 días.')).toBeVisible()
  await expect(card.getByText('Cubra el suelo con rastrojo para conservar la humedad.')).toBeVisible()
  await expect(card.locator('button > div')).toHaveCSS('background-color', 'rgb(107, 42, 29)')
  await card.screenshot({ path: 'techcamp-decision.png' })
} finally {
  await browser.close()
  await server.close()
}
```

Ejecutar `node capture.mjs` en la copia. El PNG es el recorte de `#root` con la banda cerrada, sin navegador ni controles editoriales. Se usan las fuentes de sistema: el ajuste de las líneas puede variar en otro sistema operativo.
