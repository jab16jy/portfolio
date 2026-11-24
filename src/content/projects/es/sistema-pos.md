---
title: "Sistema POS: la historia detrás de un ajuste de inventario"
summary: "Un punto de venta para Windows donde corregir las existencias de un producto implica responder tres preguntas: cuánto cambió, quién lo autorizó y qué ocurre si otro ajuste llegó primero."
status: "Comercializado y en producción · v1.29.0 publicada"
image: "/projects/sistema-pos-inventario.png"
caption: "Inventario de EPOS con datos ficticios. La vista WPF compilada muestra un ajuste de 18 a 20 unidades sin aplicarlo."
imageAlt: "Inventario de EPOS con cuatro productos ficticios; el ajuste de dos unidades de DEMO · Gasas muestra una vista previa de 18 a 20."
stack:
  ["C#", ".NET 9", "WPF / MVVM", "Entity Framework Core", "SQLite", "xUnit"]
finding: "Si dos operaciones parten del mismo saldo, la segunda no puede sobrescribir la primera ni dejar en el historial un movimiento que nunca se aplicó."
nodes:
  [
    "InventoryView.xaml",
    "InventoryViewModel.AdjustStockAsync",
    "AdjustStockUseCase.ExecuteAsync",
    "Product.RegisterStockMovement",
    "AppDbContext.SaveChangesAsync",
  ]
sources:
  - label: "Del formulario a la petición de ajuste"
    url: "https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/src/POS.Presentation.Shared/ViewModels/InventoryViewModel.cs#L388-L420"
  - label: "Permiso, motivo y guardado del movimiento"
    url: "https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/src/POS.Application/UseCases/Inventory/AdjustStockUseCase.cs#L31-L57"
  - label: "Cómo se identifica al operador"
    url: "https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/src/POS.Application/Services/CriticalCommandAuthorizer.cs#L21-L39"
  - label: "Dos escrituras sobre el mismo saldo: prueba en SQLite"
    url: "https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/tests/POS.Application.Tests/Inventory/ProductConcurrencyTests.cs#L14-L64"
  - label: "Revisión de ocho operaciones críticas"
    url: "https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/openspec/changes/archive/2026-07-18-audit-integrity-hardening/verification/adversarial-review.md#L3-L26"
---

## Cuando el conteo físico no coincide con la pantalla

Quien cuenta las unidades de una estantería puede tener un buen motivo para corregir el inventario. Al cierre de caja, la persona que revisa esa corrección necesita algo más que la cifra nueva: debe poder distinguir un ajuste de una venta. EPOS reúne caja, compras, cotizaciones, devoluciones y cierre en una aplicación de escritorio. El ajuste manual es un buen lugar para ver cómo esas operaciones comparten existencias sin borrar su historia.

## Del botón al movimiento

En la vista WPF, el operador selecciona un producto, indica cuántas unidades entran o salen y elige un motivo. El ViewModel traduce esa elección a una cantidad con signo. El caso de uso comprueba que el producto controle existencias y pide a `Product` que aplique el cambio. Si la salida supera el saldo, el dominio la rechaza. Si procede, el producto devuelve un movimiento; el caso de uso lo añade y guarda el cambio de saldo y su justificante en la misma operación.

Hay un detalle perceptible desde el mostrador: la pantalla vuelve a consultar el saldo y los movimientos **antes** de limpiar la selección. Si perdiera antes la referencia al producto, podría anunciar que la corrección se guardó sin mostrar la fila que permite comprobarlo.

## Seguridad: quién responde por la corrección

El formulario no envía un identificador de empleado. La aplicación lo obtiene de la sesión, vuelve a consultar el usuario y su rol, y exige que ambos sigan activos. Salvo para el administrador del sistema, comprueba el permiso de ajuste. El movimiento recibe el identificador verificado y el motivo; esconder un botón en la interfaz no sustituye esa decisión. Este control atribuye el ajuste dentro de la aplicación, pero no protege por sí solo el archivo SQLite del equipo.

## La prueba que explica el diseño

Una prueba abre dos contextos de EF Core sobre la misma base SQLite en memoria. Ambos leen **100 unidades**. El primero descuenta 10 y guarda; el segundo intenta descontar 20 con la versión que leyó antes. La prueba exige un conflicto y vuelve a abrir el producto desde un tercer contexto: deben quedar **90 unidades, versión 1 y un solo movimiento**. Comprobar únicamente el saldo dejaría pasar un historial con una salida ficticia.

En el [job de Windows del commit revisado](https://github.com/jab16jy/Sistema_Pos/actions/runs/36924238785/job/110577650757), GitHub registra éxito para la compilación Release y los cuatro pasos de pruebas: dominio, aplicación, presentación compartida y arranque WPF. La auditoría consultó esos resultados sin ejecutar el POS sobre datos comerciales. No se midió el comportamiento de terminales físicas simultáneas.

## Aprendizaje y contribución

Seguir un botón hasta su efecto real también revela trabajo pendiente: en esta versión, la ayuda «Exportar CSV» del inventario está enlazada al comando que recarga las existencias. Para resolver la discrepancia, primero hay que decidir qué necesita el operador y luego probar juntos la etiqueta y el resultado.

La contribución de esta revisión fue reconstruir el recorrido, contrastarlo con la prueba y documentar esa discrepancia. El proyecto conserva instrucciones para agentes, especificaciones y una revisión archivada de ocho comandos críticos. Permiten evaluar decisiones concretas sin deducir qué persona o asistente escribió cada línea.

La captura muestra `InventoryView` de la compilación Release verificada localmente. Con cuatro productos ficticios en memoria, la vista muestra cómo quedaría el saldo de gasas al pasar de 18 a 20. El ajuste no se aplicó. La captura se generó sin iniciar sesión ni abrir una base de datos.
