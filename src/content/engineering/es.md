---
title: "Cómo se revisa un cambio hecho con agentes"
summary: "Trece pasos para seguir una decisión desde el problema hasta la entrega. Los ejemplos proceden de tres repositorios: muestran qué se pidió, qué cambió al revisar y quién conserva la decisión de aceptar."
---

## Especificar el cambio

Los agentes participan en la generación del código; mi responsabilidad es decidir qué problema resolver, preparar el contexto y evaluar si el resultado merece entregarse. **Context Engineering** es darle al agente la información correcta: una regla del dominio, la decisión que la explica y el contrato vigente. **Harness Engineering** es preparar el entorno que permite comprobar si la respetó: una prueba, una restricción de importaciones o un control que detiene la integración. En desarrollo dirigido por especificaciones, el criterio se escribe antes de aceptar la implementación, no después para justificarla.

### 01 · Observar el trabajo de quien usa el producto

En Inventory Tally dos cajeros pueden contar la misma categoría en áreas distintas y perder la señal a mitad del recorrido. El [documento de producto](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/docs/PRODUCT.md#L18-L44) sitúa el problema en la bodega: hace falta reunir los aportes del equipo, no reconstruir un inventario por SKU.

### 02 · Escribir la regla que ninguna propuesta puede romper

> «el cliente nunca escribe un total; sólo declara su aporte»

La [instrucción de AGENTS.md](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/AGENTS.md#L5-L17) permite descartar un diseño antes de generar código. Un teléfono desconectado sabe cuánto contó su cajero; desconoce las correcciones recientes de sus compañeros.

### 03 · Delimitar la autoridad del asistente

En TechCamp, el balance calcula el déficit y el asistente «explica hechos ya calculados y no decide». El [ADR-0028](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0028-proveedor-asistente-deepseek-flash-y-umbral-de-evaluacion.md#L44-L48) conserva esa frontera aunque cambie el proveedor. El [umbral de 27 preguntas correctas de 30](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0028-proveedor-asistente-deepseek-flash-y-umbral-de-evaluacion.md#L83-L106) se fija antes del ensayo; no es una nota obtenida. Una sola cita inventada descalifica al candidato.

### 04 · Definir el resultado que distinguiría un fallo

En el POS, dos operaciones leen 100 unidades y la primera retira 10. Si la segunda intenta retirar 20 usando el saldo antiguo, la [prueba de concurrencia](https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/tests/POS.Application.Tests/Inventory/ProductConcurrencyTests.cs#L14-L64) exige 90 unidades, versión 1 y **un solo movimiento**. Verificar únicamente el saldo dejaría pasar una retirada fantasma en el historial.

## Implementar y revisar

### 05 · Elegir las instrucciones de la tarea

La [skill de Pydantic](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/.claude/skills/pydantic/SKILL.md#L6-L15) habla de «external untrusted data». La [regla local de TechCamp](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/AGENTS.md#workflow) precisa dónde usarla: en el adaptador, nunca en el dominio. El archivo versionado permite revisar la instrucción; no demuestra que se invocara en una sesión concreta.

### 06 · Proponer una unidad pequeña

Para exportar un conteo a PDF, el [registro de la tarea](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/odd/tasks/analisis-pdf-orden-precio.md#L30-L43) sitúa el generador en el navegador. Se descarga cuando alguien pide el informe: quien solo cuenta no paga esa descarga. El precio de esa decisión es concreto: sin caché, la primera exportación necesita red.

### 07 · Seguir el cambio hasta la escritura

En Inventory Tally, [`registrarAporte`](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/packages/data/src/firebase/firestore-conteo-repository.ts#L226-L278) escribe la cantidad y la versión de un cajero en un área. El [trigger](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/packages/functions/src/triggers/on-aporte-escrito.ts#L50-L118) aplica la diferencia: si ya incorporó siete y ahora recibe diez, suma tres. Esta lectura contrasta la implementación con la regla del paso 02.

### 08 · Revisar lo que verá la persona si falla

La [revisión del PDF](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/odd/tasks/analisis-pdf-orden-precio.md#L48-L60) encontró que el mensaje genérico no explicaba el fallo sin conexión. El [cambio 78a30c6](https://github.com/jab16jy/inventory-tally/commit/78a30c6) añadió el aviso contextual y conservó el error para diagnóstico. Aquí se puede señalar el efecto de la revisión, además de la norma que la pide.

### 09 · Resolver el supuesto que la prueba puso en duda

En TechCamp el escenario de secano no producía el consejo esperado. La [decisión #340](https://github.com/jab16jy/techcamp-v2/issues/340) situó la siembra 55 días antes del inicio. El [escenario corregido](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/src/techcamp/simulator/scenarios/dry-spell-rainfed.yaml#L1-L19) ya representa la etapa de cultivo prevista. Un agente puede señalar la discrepancia; aceptar esa edad para la simulación sigue siendo una decisión del responsable, pendiente de validación en finca.

## Verificar y decidir la entrega

### 10 · Vincular el resultado al candidato exacto

> `requirements: 1/1` · `scenarios: 6/6`

El [informe OpenSpec S2b](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/openspec/changes/archive/2026-09-17-rol-admin-sucursal/verify-report-s2b.md#L1-L28) identifica por hash cuatro archivos y registra comando y resultado. Los seis escenarios corresponden al control de alcance de `cerrarSesion`; no certifican los permisos de todo el producto.

### 11 · Leer los pasos ejecutados, no solo el indicador verde

En [v0.2.0 de Inventory Tally](https://github.com/jab16jy/inventory-tally/actions/runs/35640082730) se ejecutaron web, E2E, contratos, funciones, reglas y despliegue de producción. La [ejecución del cambio documental posterior](https://github.com/jab16jy/inventory-tally/actions/runs/35642567455) también terminó en verde, pero omitió las suites y el despliegue de producción. El resultado pertenece a una revisión concreta.

### 12 · Decidir qué se acepta y qué queda abierto

El [informe de julio del POS](https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/openspec/changes/archive/2026-07-18-audit-integrity-hardening/verification/final-verification.md#L9-L35) registra 761/761 pruebas y un verificador de formato con código de salida 2. El [cierre del informe](https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/openspec/changes/archive/2026-07-18-audit-integrity-hardening/verification/final-verification.md#L164-L171) deja el paquete abierto. Generar el candidato y reunir resultados no equivale a autorizar su entrega.

### 13 · Conservar lo aprendido y declarar el límite

Después de dos revisiones sobre fechas, TechCamp dejó una [regla ejecutable](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/rules/no-naive-today.yml#L4-L32) para que el día de la parcela no dependa del reloj local del servidor. La regla también documenta qué alias se le escapan. Estos registros permiten revisar decisiones y resultados; no permiten repartir la autoría línea por línea, estimar horas ahorradas ni atribuir mejoras de cosecha al software.
