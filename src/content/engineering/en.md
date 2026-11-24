---
title: "How an agent-assisted change is reviewed"
summary: "Thirteen steps trace a decision from the original problem to release. Examples from three repositories show what was requested, what changed during review, and who retains the authority to accept the result."
---

## Specify the change

Agents help generate code; my responsibility is to choose the problem, prepare the context and decide whether the result is ready to ship. **Context engineering** gives an agent the relevant domain rule, its rationale and the current contract. **Harness engineering** prepares the environment that checks whether the rule holds: a test, an import boundary or a check that stops integration. In specification-driven development, the acceptance criterion is written before accepting the implementation, not afterwards to justify it.

### 01 · Observe the work the product supports

In Inventory Tally, two cashiers can count the same price category in different areas and lose their connection halfway through. The [product brief](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/docs/PRODUCT.md#L18-L44) places the problem on the warehouse floor: combine the team's contributions, rather than reconstruct stock by SKU.

### 02 · Write down the rule no proposal may break

> <span lang="es">“el cliente nunca escribe un total; sólo declara su aporte”</span>

The [AGENTS.md instruction](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/AGENTS.md#L5-L17) says the client never writes a total, only its contribution. That rules out a design before code is generated. An offline phone knows what its cashier counted; it cannot see the team's latest corrections.

### 03 · Set the assistant's authority

TechCamp's water balance calculates the deficit. The assistant, in the words of [ADR-0028](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0028-proveedor-asistente-deepseek-flash-y-umbral-de-evaluacion.md#L44-L48), <span lang="es">“explica hechos ya calculados y no decide”</span>: it explains facts already calculated and makes no decision. That boundary survives a provider change. The [threshold of 27 correct answers out of 30](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0028-proveedor-asistente-deepseek-flash-y-umbral-de-evaluacion.md#L83-L106) was set before evaluation; it is not an achieved score. One fabricated citation disqualifies a candidate.

### 04 · Define an outcome that would expose failure

In the POS, two operations read 100 units and the first withdraws 10. If the second tries to withdraw 20 against the old balance, the [concurrency test](https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/tests/POS.Application.Tests/Inventory/ProductConcurrencyTests.cs#L14-L64) requires 90 units, version 1 and **exactly one movement**. Checking the balance alone would miss a phantom withdrawal in the history.

## Implement and review

### 05 · Select instructions for the task

The [Pydantic skill](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/.claude/skills/pydantic/SKILL.md#L6-L15) discusses “external untrusted data.” [TechCamp's local rule](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/AGENTS.md#workflow) says where to use it: at the adapter boundary, never in the domain. The versioned file makes the instruction reviewable; it does not establish that the skill ran in any particular session.

### 06 · Propose one small change

To export an inventory count as a PDF, the [task record](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/odd/tasks/analisis-pdf-orden-precio.md#L30-L43) places the generator in the browser. It is downloaded when somebody requests the report, so a cashier who only counts does not pay that cost. The trade-off is specific: without a cached module, the first export needs a connection.

### 07 · Trace the change to the write

In Inventory Tally, [`registrarAporte`](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/packages/data/src/firebase/firestore-conteo-repository.ts#L226-L278) writes the quantity and version for one cashier in one area. The [trigger](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/packages/functions/src/triggers/on-aporte-escrito.ts#L50-L118) applies the difference: if it has already counted seven and now receives ten, it adds three. This checks the implementation against the rule in step 02.

### 08 · Review what the user sees on failure

The [PDF review](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/odd/tasks/analisis-pdf-orden-precio.md#L48-L60) found that a generic message did not explain an offline failure. [Change 78a30c6](https://github.com/jab16jy/inventory-tally/commit/78a30c6) added a contextual message and preserved the error for diagnosis. The record shows what the review changed, beyond the rule requiring it.

### 09 · Resolve the assumption the test called into question

TechCamp's rainfed scenario did not yield the expected advice. [Decision #340](https://github.com/jab16jy/techcamp-v2/issues/340) placed planting 55 days before the start. The [corrected scenario](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/src/techcamp/simulator/scenarios/dry-spell-rainfed.yaml#L1-L19) now represents the intended crop stage. An agent can flag the discrepancy; accepting that age for the simulation is the owner's decision, still subject to field validation.

## Verify and decide on release

### 10 · Tie the result to the exact candidate

> `requirements: 1/1` · `scenarios: 6/6`

The [OpenSpec S2b report](https://github.com/jab16jy/inventory-tally/blob/13ed74eb48144219dfdd64250610312bd4644221/openspec/changes/archive/2026-09-17-rol-admin-sucursal/verify-report-s2b.md#L1-L28) identifies a four-file diff by hash and records the command and result. All six scenarios concern the branch-scope check in `cerrarSesion`; they do not certify access control across the product.

### 11 · Read which steps ran, not just the green indicator

[Inventory Tally v0.2.0](https://github.com/jab16jy/inventory-tally/actions/runs/35640082730) ran web, E2E, contract, function and rules tests, followed by production deployment. The [subsequent documentation change](https://github.com/jab16jy/inventory-tally/actions/runs/35642567455) also finished green, but skipped the suites and production deployment. Each result belongs to its own revision.

### 12 · Decide what to accept and what stays open

The [July POS report](https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/openspec/changes/archive/2026-07-18-audit-integrity-hardening/verification/final-verification.md#L9-L35) records 761/761 tests and a format check that exited with code 2. The [report's conclusion](https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/openspec/changes/archive/2026-07-18-audit-integrity-hardening/verification/final-verification.md#L164-L171) leaves the package open. Generating the candidate and collecting results do not amount to authorizing release.

### 13 · Preserve the lesson and state its limits

After two reviews caught date-handling mistakes, TechCamp added an [executable rule](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/rules/no-naive-today.yml#L4-L32) so the plot's day would not depend on the server's local clock. The rule documents which aliases it misses. These records make decisions and outcomes reviewable; they cannot assign authorship line by line, estimate hours saved or attribute better harvests to software.
