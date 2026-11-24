---
title: "TechCamp v2: qué recomendar cuando no se puede regar"
summary: "Una parcela de maíz sin riego ni sensores pone a prueba el recorrido completo: del clima y el balance de agua al consejo que lee el productor en su teléfono."
status: "Demostrador de seminario con pruebas de extremo a extremo"
image: "/projects/techcamp-decision.png"
caption: "DecisionCard de TechCamp con datos de prueba de secano. Es el componente React real, no una ejecución del sistema completo ni una medición en finca."
imageAlt: "Tarjeta de secano con datos de prueba: indica estrés por un déficit de 80 mm, prevé 12 mm de lluvia en siete días y aconseja cubrir el suelo con rastrojo."
stack:
  [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "MQTT",
    "React",
    "TypeScript",
    "Playwright",
  ]
finding: "El secano cambia la decisión, no solo la cifra: ante el déficit, la aplicación aconseja conservar humedad en vez de prescribir minutos de riego."
nodes:
  [
    "Escenario de secano y clima de prueba",
    "Balance diario FAO-56",
    "Recomendación guardada por parcela",
    "Estado de la parcela en la API",
    "Tarjeta de decisión en la PWA",
  ]
sources:
  - label: "Escenario E: maíz de secano sin nodos"
    url: "https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/src/techcamp/simulator/scenarios/dry-spell-rainfed.yaml#L1-L19"
  - label: "Del balance al consejo visible"
    url: "https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/web/e2e/scenarios/dry-spell-rainfed.spec.ts#L66-L116"
  - label: "Bitácora: comprobación tras reconectar"
    url: "https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/web/e2e/scenarios/offline-farmer.spec.ts#L105-L165"
  - label: "Inundación: resultado en datos reservados"
    url: "https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/ml/models/flood_m2/card.md#L72-L100"
  - label: "Cómo se mediría el impacto agrícola"
    url: "https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0024-metricas-de-impacto-y-adopcion-digital.md#L18-L27"
---

## Una parcela sin válvula

En este proyecto académico de seminario, mi responsabilidad se centra en especificar escenarios y comprobar que el diseño responda a la pregunta de investigación. El monolito modular mantiene los cálculos separados de la API y de la UI. El [contrato de importación](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/pyproject.toml#L96-L120) expresa la dependencia adaptadores → aplicación → dominio; el [ADR de autenticación](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0014-autenticacion.md#L3-L15) separa el emisor local de tokens de seminario de la propuesta para producción. No se trata de un producto comercial ni de un despliegue en fincas.

Para un pequeño productor del Caribe colombiano, saber que al cultivo le falta agua resuelve solo la mitad del problema. Si la parcela depende de la lluvia, ¿qué puede hacer hoy? TechCamp v2 convierte esa restricción en una prueba de diseño: simula 21 días de veranillo en dos hectáreas de maíz sin sistema de riego y sin un solo sensor. Una pantalla que indicara cuánto tiempo abrir una válvula fallaría aunque el cálculo del déficit fuera correcto.

## Del clima a una frase comprobable

El simulador aporta una serie meteorológica fija. El balance diario combina la demanda del cultivo en su etapa de desarrollo con la lluvia efectiva y el agua disponible en el suelo. El worker guarda la recomendación; la API compone el estado de la parcela y la PWA lo presenta. En el escenario, el maíz tiene 55 días al empezar: situarlo en floración determina el coeficiente de cultivo del cálculo. La [decisión sobre la siembra](https://github.com/jab16jy/techcamp-v2/issues/340) corrigió ese supuesto en la simulación y dejó pendiente validar en campo la duración de las etapas.

Playwright comprueba dos cosas distintas: que el sistema haya registrado la alerta de estrés hídrico con una recomendación de secano, y que el teléfono muestre «Cubra el suelo con rastrojo para conservar la humedad». La [ejecución nocturna](https://github.com/jab16jy/techcamp-v2/actions/runs/45433677206/job/138585557728) registra el arranque de API, worker e ingestor y el éxito de la suite completa. También consta [una ejecución fallida del mismo commit](https://github.com/jab16jy/techcamp-v2/actions/runs/44545796527).

## Una observación que sobrevive al modo avión

En otro escenario, el simulador sí envía lecturas por MQTT. El productor abre la bitácora con conexión, pierde la red y registra una observación. «Guardado en el teléfono» distingue la copia local de una entrega confirmada. Al volver la conexión, la prueba no se conforma con leer «Sincronizado»: consulta el servidor, comprueba que existe una sola fila con la nota original y repite la sincronización para descartar un duplicado.

## Qué se sabe fuera del simulador

El experimento de inundación usa datos históricos reales, pero responde a otra escala: **municipio y mes**, no parcela y día. En 2.340 casos reservados, con 63 positivos, LightGBM apenas mejoró el área bajo la curva de precisión y sensibilidad respecto a la climatología mensual. El intervalo de confianza incluía cero y el error probabilístico fue mayor. Se conservó la climatología como referencia; el candidato no se promovió.

La evidencia llega hasta una decisión reproducida en software y una comparación retrospectiva de modelos. Para saber si el consejo conserva agua o mejora la cosecha haría falta un piloto: medir la situación inicial de cada parcela, registrar qué acción tomó el productor y comparar el resultado con parcelas de control.
