---
title: "Sistema POS: the history behind a stock adjustment"
summary: "A Windows point of sale where correcting a stock count means answering three questions: how much changed, who authorized it, and what happens if another update got there first."
status: "Sold and in production · v1.29.0 released"
image: "/projects/sistema-pos-inventario.png"
caption: "EPOS inventory with fictional data. The compiled WPF view previews a stock adjustment from 18 to 20 units without applying it."
imageAlt: "EPOS inventory with four fictional products; a two-unit adjustment for DEMO · Gasas previews a stock change from 18 to 20."
stack:
  ["C#", ".NET 9", "WPF / MVVM", "Entity Framework Core", "SQLite", "xUnit"]
finding: "When two operations start from the same balance, the second cannot overwrite the first or leave a history entry for a change that never took effect."
nodes:
  [
    "InventoryView.xaml",
    "InventoryViewModel.AdjustStockAsync",
    "AdjustStockUseCase.ExecuteAsync",
    "Product.RegisterStockMovement",
    "AppDbContext.SaveChangesAsync",
  ]
sources:
  - label: "From the form to the adjustment request"
    url: "https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/src/POS.Presentation.Shared/ViewModels/InventoryViewModel.cs#L388-L420"
  - label: "Permission, reason and persistence of the movement"
    url: "https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/src/POS.Application/UseCases/Inventory/AdjustStockUseCase.cs#L31-L57"
  - label: "How the application identifies the operator"
    url: "https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/src/POS.Application/Services/CriticalCommandAuthorizer.cs#L21-L39"
  - label: "Two writes against one balance: the SQLite test"
    url: "https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/tests/POS.Application.Tests/Inventory/ProductConcurrencyTests.cs#L14-L64"
  - label: "Review of eight critical operations"
    url: "https://github.com/jab16jy/Sistema_Pos/blob/22de6e5f42ef510a544f2eb73790ca2166b74ee2/openspec/changes/archive/2026-07-18-audit-integrity-hardening/verification/adversarial-review.md#L3-L26"
---

## When the shelf count and the screen disagree

The person counting a shelf may have a good reason to correct the balance. At closing time, the person reviewing that correction needs more than the new number: they need to tell an adjustment from a sale. EPOS brings checkout, purchasing, quotations, returns and cash closing into one desktop application. A manual adjustment shows how these operations can share a stock balance without erasing its history.

## From a button to a stock movement

In the WPF view, the operator picks a product, enters how many units came in or went out, and selects a reason. The ViewModel translates that choice into a signed quantity. The use case checks that the product tracks inventory and asks `Product` to apply the change. The domain rejects a withdrawal larger than the available stock. Otherwise, the product returns a movement record; the use case adds it and saves the balance and its supporting record together.

One small ordering decision matters at the counter. The screen reloads the balance and movement history **before** clearing the selection. Clearing it first would lose the product reference needed to show the very row that confirms the adjustment.

## Security: who owns the correction?

The form does not send an employee ID. The application takes the operator ID from the session, looks up the user and role again, and requires both to be active. Unless the role is the system administrator, it also checks the adjustment permission. The movement carries the verified ID and the reason. Hiding a button would not provide the same control. This establishes attribution inside the application; it does not, on its own, protect the workstation’s SQLite file.

## The test that explains the design

One test opens two EF Core contexts against the same in-memory SQLite database. Both read **100 units**. The first subtracts 10 and saves; the second tries to subtract 20 using the version it read earlier. The test expects a conflict. A third context must then find **90 units, version 1 and exactly one movement**. Checking only the balance would miss a history entry for a withdrawal that never happened.

The [Windows CI job for the audited commit](https://github.com/jab16jy/Sistema_Pos/actions/runs/36924238785/job/110577650757) records a successful Release build and four successful test steps: domain, application, shared presentation and WPF startup. The audit checked those results without running the POS against business records. It did not measure contention between physical checkout terminals.

## Lessons and contribution

Following a button to its actual effect also exposed unfinished work: the inventory button labeled “Exportar CSV” is bound to the stock reload command. The next decision is whether the operator needs an export or a refresh; a useful test would check the label and the outcome together.

This review traced the adjustment, checked it against the persistence test and documented that mismatch. The project retains agent instructions, specifications and an archived review of eight critical commands. Those records make decisions reviewable without assigning individual lines to a person or an assistant.

The screenshot shows `InventoryView` from the locally verified Release build. With four fictional products in memory, the view previews a change from 18 to 20 units of gauze. No adjustment was applied, no one signed in, and no database was opened.
