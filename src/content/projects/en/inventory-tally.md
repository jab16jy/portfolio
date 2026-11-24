---
title: "Inventory Tally"
summary: "A PWA for cashiers to count stock together by price category and for branch managers to close the count with a record of units and value."
status: "In production · v0.2.0"
stack:
  [
    "TypeScript",
    "React",
    "Vite PWA",
    "Firebase Auth",
    "Cloud Firestore",
    "Cloud Functions",
  ]
finding: "Each phone records what one person counted in one area. The server works out how much of that contribution still belongs in the team total."
nodes:
  [
    "ConteoScreen",
    "FirestoreConteoRepository.registrarAporte",
    "aportes/{uid}__{areaId}",
    "procesarAporteEscrito",
    "linea.cantidadTotal",
  ]
sources:
  - label: "Product brief: counting by value"
    url: "https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/docs/PRODUCT.md#L18-L44"
  - label: "Contribution writes and pending changes"
    url: "https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/packages/data/src/firebase/firestore-conteo-repository.ts#L226-L278"
  - label: "Transaction that updates the category total"
    url: "https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/packages/functions/src/triggers/on-aporte-escrito.ts#L50-L118"
  - label: "Closing a count and saving the branch record"
    url: "https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/packages/functions/src/callables/cerrar-sesion.ts#L47-L135"
  - label: "PDF export: tests and review findings"
    url: "https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/odd/tasks/analisis-pdf-orden-precio.md#L30-L60"
image: "/projects/inventory-tally-login.png"
caption: "Public Inventory Tally sign-in screen. No session was opened and no inventory records were accessed."
imageAlt: "Public Inventory Tally sign-in screen in Spanish, with empty email and password fields and an Entrar button."
demo: "https://proyectoconteoinv-d017a.web.app"
---

## One branch, several people counting

Two cashiers in different parts of a stockroom may be counting goods that sell at the same price. Each needs to know what they just recorded; the branch manager needs the team total. If both phones edited that total directly, an offline correction could be based on a figure that had already changed.

Inventory Tally groups stock by selling price. A cashier selects a branch, prepares the session while online, then adds or removes batches in their area. The screen keeps their own contribution distinct from the team's units. The trade-off is deliberate: nobody needs to identify each SKU, but the closing record cannot tell a manager how many units of a particular SKU remain.

## Adding a late correction

The counting screen passes each entry to a repository. It updates a document for that cashier and area under the price category, increments its version and tracks the write as pending. The cashier can carry on: a change in the local cache is visible before the branch total reflects it.

Suppose the server has credited seven units and a newer version arrives with ten. The trigger adds **three**, not ten. It subtracts the quantity last applied for that contribution, then records the version, category total, area breakdown and audit event in one transaction. An older version arriving later is ignored. The monetary summary is recalculated separately, so every tap need not rebuild the full report.

## What it means to close a count

Firestore rules prevent clients from overwriting category totals. The closing function checks the manager's branch permissions and which participants have confirmed synchronization. Outstanding confirmations normally block closure. An override preserves the list of unconfirmed participants. Closing freezes units and value by category and area in the branch history, which provides the basis for later comparisons.

Managers can also export the analysis as a PDF. The browser loads the generator on demand, keeping it out of the install-time download for cashiers' phones. That choice has a consequence: the first export needs a connection if the module is not cached. A review found that a generic error hid the reason; the team [added a specific offline message and error logging](https://github.com/jab16jy/inventory-tally/commit/78a30c6).

## What was verified

I developed this commissioned product with AI assistance. I specified the behavior, reviewed the data decisions and validated the delivery; I do not describe agent-generated code as manually written. The [PDF testing and mutation record](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/odd/tasks/analisis-pdf-orden-precio.md#L30-L58) distinguishes the complete file from its calculation helpers. The final 100% Stryker result applies only to those helpers, not the visual layout or the whole product.

The [v0.2.0 release run](https://github.com/jab16jy/inventory-tally/actions/runs/35640082730) completed the web, end-to-end, contract, function and rules checks and the production deployment. In a [published two-client emulator measurement](https://github.com/jab16jy/inventory-tally/issues/62#issuecomment-5472257585), the second client received the contribution update in 70.4 ms at the 95th percentile. That measures notification delivery, not time to close a count over a mobile network. The screenshot marks the limit of direct verification on the live demo: the public sign-in form, viewed without signing in.
