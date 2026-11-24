---
name: audit-case-study
description: "Trigger: refrescar auditoría, revisar un caso, paridad ES/EN. Contrasta afirmaciones con fuentes fijas y devuelve propuestas en modo solo lectura."
license: Apache-2.0
metadata:
  author: "jab16jy"
  version: "1.0"
---

## Activation Contract

Activa al revisar un caso existente. Pide el proyecto o la revisión si el alcance es ambiguo.

## Hard Rules

Trabaja en solo lectura tanto en el producto como en el portfolio. No hagas fetch, checkout, escrituras, instalaciones, ejecuciones de código del producto ni despliegues. Excluye archivos privados, `.env`, perfiles, bases, logs y artefactos de clientes. No atribuyas autoría por historial de commits.

## Decision Gates

- Si el SHA local difiere de la referencia pública, identifica ambos; no mezcles árboles. Usa enlaces al SHA que realmente examinaste.
- Si solo encuentras un test o workflow, describe su aserción o configuración. Para afirmar ejecución, cita job, SHA, paso y resultado, incluidos los pasos omitidos.
- Si falta evidencia, marca «no verificado» y propone acotar o retirar la frase en ambos idiomas.

## Execution Steps

1. Lee la ficha previa y ambos casos. Anota fecha, SHA anterior y objetivo. Usa `git rev-parse HEAD`, `git ls-remote` y `git show SHA:ruta` para contrastar el corte sin actualizarlo.
2. Sigue una decisión desde el problema hasta el código y la prueba. Cita archivo, líneas y permalink al SHA. Para uso comercial o formación identifica la declaración del titular por separado.
3. Compara ES y EN por afirmación: estado, cifras, unidades, fechas, enlaces, imagen/alt, atribución y límites. No exijas traducción literal.

## Output Contract

Devuelve en la conversación: corte anterior → nuevo, tabla `afirmación | fuente | límite | propuesta ES | propuesta EN`, discrepancias y pendientes. Si no hubo cambio, indica qué fuentes sostienen esa conclusión. No edites archivos.

## References

- [Índice y cortes de auditoría](../../docs/repository-audit.md)
- [Criterio editorial](../../docs/content-strategy.md)
