# Estrategia de contenido

## Dos lectores, dos recorridos

En treinta segundos, quien contrata debe poder identificar a Johan, el tipo de trabajo que busca, sus dos productos comerciales y cómo contactarlo. Inicio, perfil y CV comparten nombre, ubicación, disponibilidad y cronología. En cada idioma, la descarga conduce directamente a su PDF de una página. El correo autorizado y GitHub son los canales de contacto.

Para quien evalúa el trabajo técnico, cada caso parte de una pregunta operativa, sigue una decisión hasta el código o una prueba y termina donde termina la evidencia. La página de ingeniería conecta esos ejemplos con la labor humana: especificar lo que se acepta, revisar cambios y decidir la entrega. Mencionar herramientas junto a su uso concreto; evitar listas de supuestos dominios expertos.

| Orden                                          | Pregunta del caso                                      | Límite que se conserva al resumir                                                   |
| ---------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| 1. [Inventory Tally](audit/inventory-tally.md) | ¿Cómo sincronizar una corrección sin contar dos veces? | El teléfono registra un aporte; no confirma el total de la sucursal.                |
| 2. [Sistema POS](audit/sistema-pos.md)         | ¿Qué queda en el historial si dos ajustes compiten?    | La prueba comprueba saldo y movimiento en SQLite; no mide terminales en una tienda. |
| 3. [TechCamp v2](audit/techcamp.md)            | ¿Qué recomendar a una parcela sin riego?               | El escenario es académico y simulado; no demuestra ahorro de agua en campo.         |

## Qué se puede afirmar

- **Declaración del titular:** estudios, inglés B1, trabajos, fechas y estado comercial. Mantener «octavo semestre finalizado; noveno en 2027» hasta que el titular confirme un cambio. Una release no acredita una relación laboral ni una instalación activa.
- **Evidencia del producto:** el [índice de auditoría](repository-audit.md) conduce a la revisión, los archivos y los resultados. Para una cifra, conservar unidad, escenario y fecha o revisión. Leer los pasos ejecutados: la existencia de una prueba no es un resultado.
- **Atribución y privacidad:** describir decisiones y responsabilidades sin repartir líneas entre persona y agente. Usar solo contacto profesional autorizado; no añadir teléfono, domicilio, identificadores, datos de clientes ni capturas de sesiones privadas, tampoco en el PDF.

## Refresco ES/EN y CV

Ante una nueva release, un cambio profesional o una discrepancia, aplicar la [skill de auditoría en solo lectura](../skills/audit-case-study/SKILL.md). Con la evidencia revisada, editar ambas versiones en el mismo cambio. Comparar fechas, estado, tecnologías, cifras, orden, enlaces y límites; traducir el sentido, conservando nombres oficiales e identificadores. Comprobar que el selector de idioma mantenga el destino.

La [fuente editable del CV](../scripts/cv/resume.html) contiene un `main` por idioma y un estilo de impresión A4 compartido. Desde la raíz del portfolio, con Node, Chrome y una copia existente de Playwright:

```sh
node scripts/cv/generate.cjs "/ruta/al/paquete/playwright"
```

Si Node ya resuelve `playwright`, omitir el argumento. El [generador](../scripts/cv/generate.cjs) comprueba los márgenes y una sola página antes de escribir ambos archivos en `public/cv/`. Usar la misma versión de Chrome, Playwright y las mismas fuentes para reproducir la maquetación. Después de regenerar, extraer el texto para revisar acentos, fechas y la última línea; descargar `/cv/johan-borrero-es.pdf` y `/cv/johan-borrero-en.pdf` desde el sitio servido y verificar que son PDF y no una página HTML de respaldo.
