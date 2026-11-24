---
title: "Inventory Tally"
summary: "PWA para que varios cajeros cuenten por categoría de valor en una sucursal y el administrador cierre con un histórico de unidades e importe."
status: "En producción · v0.2.0"
stack:
  [
    "TypeScript",
    "React",
    "Vite PWA",
    "Firebase Auth",
    "Cloud Firestore",
    "Cloud Functions",
  ]
finding: "El teléfono escribe cuánto contó una persona en un área. El servidor decide cuánto de ese aporte falta por sumar al equipo."
nodes:
  [
    "ConteoScreen",
    "FirestoreConteoRepository.registrarAporte",
    "aportes/{uid}__{areaId}",
    "procesarAporteEscrito",
    "linea.cantidadTotal",
  ]
sources:
  - label: "Producto: contar por valor"
    url: "https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/docs/PRODUCT.md#L18-L44"
  - label: "Escritura del aporte y pendientes locales"
    url: "https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/packages/data/src/firebase/firestore-conteo-repository.ts#L226-L278"
  - label: "Transacción que actualiza la línea"
    url: "https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/packages/functions/src/triggers/on-aporte-escrito.ts#L50-L118"
  - label: "Cierre e histórico por sucursal"
    url: "https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/packages/functions/src/callables/cerrar-sesion.ts#L47-L135"
  - label: "Exportación PDF: pruebas y revisión"
    url: "https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/odd/tasks/analisis-pdf-orden-precio.md#L30-L60"
image: "/projects/inventory-tally-login.png"
caption: "Acceso público de Inventory Tally. Captura tomada sin iniciar sesión ni consultar registros de inventario."
imageAlt: "Acceso público de Conteo de Inventario: campos de correo y contraseña vacíos y botón Entrar."
demo: "https://proyectoconteoinv-d017a.web.app"
---

## Una sucursal, varias personas contando

En una bodega, dos cajeros pueden contar artículos del mismo precio en áreas distintas. A uno le interesa saber cuántas unidades acaba de registrar; al responsable de la sucursal le interesa cuánto lleva el equipo. Si ambos teléfonos editaran el mismo total, una corrección hecha sin señal partiría de una cifra que quizá ya cambió.

Inventory Tally usa la categoría de valor como unidad de trabajo. El cajero elige la sucursal, prepara la sesión mientras tiene conexión y registra o retira partidas de su área. La pantalla distingue el aporte propio de las unidades del equipo. No hace falta identificar cada SKU; a cambio, el cierre tampoco permite reconstruir existencias por referencia individual.

## Cómo sumar una corrección tardía

La pantalla entrega la partida a un repositorio. Este actualiza un documento por cajero y área dentro de la línea de categoría, incrementa su versión y deja la escritura pendiente de confirmación. La persona puede seguir contando: ver el cambio en la caché local no significa que ya figure en el total de la sucursal.

Supongamos que el servidor ya incorporó siete unidades y recibe una versión más reciente con diez. El trigger suma **tres**, no diez: compara la cantidad recibida con la última aplicada para esa clave. Registra la versión, el total de la línea, el desglose por área y el evento de auditoría en una transacción. Si después llega una versión anterior, la descarta. El resumen monetario se recalcula aparte; cada toque no obliga a rehacer el informe completo.

## Qué significa cerrar el conteo

Las reglas de Firestore impiden al cliente sobrescribir el total de una línea. La función de cierre comprueba el alcance del administrador y consulta qué participantes faltan por confirmar. Por defecto bloquea el cierre si hay pendientes; si se fuerza, deja constancia de quién faltaba. Al cerrar, congela las unidades y el valor por categoría y área en el histórico de la sucursal. Ese registro sirve de base a los comparativos posteriores.

El administrador también puede exportar el análisis a PDF. El navegador descarga el generador al primer uso, para que los teléfonos dedicados al conteo no tengan que cargarlo al instalar la PWA. Esa decisión tiene un costo visible: la primera exportación necesita conexión si el módulo no está en caché. Una revisión detectó que el error genérico ocultaba esa condición; el equipo [corrigió el mensaje y añadió diagnóstico](https://github.com/jab16jy/inventory-tally/commit/78a30c6).

## Qué se verificó

Desarrollé este producto por encargo con asistencia de IA. Mi responsabilidad fue especificar el comportamiento, revisar las decisiones de datos y validar la entrega; no atribuyo a escritura manual el código producido por agentes. Para el PDF, el [registro de pruebas y mutación](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/odd/tasks/analisis-pdf-orden-precio.md#L30-L58) distingue dos alcances: el archivo completo y los helpers de cálculo. El 100 % reportado al final con Stryker corresponde solo a esos helpers; no mide la disposición visual ni el producto entero.

La [ejecución de la versión v0.2.0](https://github.com/jab16jy/inventory-tally/actions/runs/35640082730) completó las pruebas de web, extremo a extremo, contratos, funciones y reglas, además del despliegue de producción. En una [medición publicada con dos clientes del emulador](https://github.com/jab16jy/inventory-tally/issues/62#issuecomment-5472257585), el segundo recibió el cambio del aporte con un p95 de 70,4 ms. La prueba mide esa notificación, no cuánto tarda el cierre en una sucursal con datos móviles. La captura muestra hasta dónde llegó la comprobación directa de la demo: el formulario público, sin iniciar sesión.
