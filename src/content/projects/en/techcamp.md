---
title: "TechCamp v2: what to recommend when irrigation is not an option"
summary: "A maize plot with no irrigation or sensors tests the whole path from weather and soil water balance to the advice a grower reads on a phone."
status: "Seminar demonstrator with end-to-end tests"
image: "/projects/techcamp-decision.png"
caption: "TechCamp’s DecisionCard with rainfed test data. This is the actual React component, not a full-stack run or a field measurement."
imageAlt: "Rainfed decision card in Spanish with test data: it shows an 80 mm water deficit, forecasts 12 mm of rain over seven days and recommends covering the soil with crop residue."
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
finding: "A rainfed plot needs a different decision, not a smaller irrigation dose: when water runs short, the app recommends conserving moisture instead of prescribing watering time."
nodes:
  [
    "Rainfed scenario and weather fixture",
    "Daily FAO-56 water balance",
    "Stored recommendation for the plot",
    "Plot status from the API",
    "Decision card in the PWA",
  ]
sources:
  - label: "Scenario E: rainfed maize without sensor nodes"
    url: "https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/src/techcamp/simulator/scenarios/dry-spell-rainfed.yaml#L1-L19"
  - label: "From water balance to on-screen advice"
    url: "https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/web/e2e/scenarios/dry-spell-rainfed.spec.ts#L66-L116"
  - label: "Logbook checks after reconnection"
    url: "https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/web/e2e/scenarios/offline-farmer.spec.ts#L105-L165"
  - label: "Flood risk: held-out results"
    url: "https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/ml/models/flood_m2/card.md#L72-L100"
  - label: "How agricultural impact would be measured"
    url: "https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0024-metricas-de-impacto-y-adopcion-digital.md#L18-L27"
---

## A plot with no valve to open

In this academic seminar project, my responsibility centers on specifying scenarios and checking that the design answers the research question. The modular monolith keeps calculations separate from the API and UI. Its [import contract](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/server/pyproject.toml#L96-L120) expresses the dependency from adapters to application to domain; the [authentication ADR](https://github.com/jab16jy/techcamp-v2/blob/29def038d38cc8728af42fd8785bf958200981a5/docs/adr/0014-autenticacion.md#L3-L15) distinguishes the local seminar token issuer from the proposed production provider. This is not a commercial product or a deployment on working farms.

For a smallholder in Colombia’s Caribbean region, knowing that a crop needs water answers only half the question. If the plot depends on rainfall, what can the grower do today? TechCamp v2 turns that constraint into a design test: it simulates a 21-day dry spell on two hectares of maize with no irrigation system and no sensors. A screen that told the grower how long to open a valve would fail even if its water deficit calculation were right.

## From weather records to a sentence on a phone

The simulator supplies a fixed weather series. The daily water balance accounts for crop demand at its current growth stage, effective rainfall and available soil water. A worker stores the recommendation, the API assembles the plot status, and the web app displays it. The maize is 55 days old at the start of the scenario: placing it at flowering determines the crop coefficient used in the calculation. The [sowing-age decision](https://github.com/jab16jy/techcamp-v2/issues/340) corrected that assumption in the simulation while leaving the stage lengths open to field validation.

Playwright checks two different outcomes: the system must record a water-stress alert and a rainfed recommendation, and the grower must see the Spanish advice to cover the soil with crop residue to conserve moisture. A [nightly run](https://github.com/jab16jy/techcamp-v2/actions/runs/45433677206/job/138585557728) records the API, worker and ingestor starting and the full scenario suite passing. There is also [a failed run on the same commit](https://github.com/jab16jy/techcamp-v2/actions/runs/44545796527).

## A field note that survives airplane mode

In a separate scenario, the simulator does send sensor readings over MQTT. The grower opens the logbook while connected, loses the network and records an observation. The app says it was saved on the phone, distinguishing a local copy from a confirmed delivery. When connectivity returns, the test goes beyond reading the sync badge: it queries the server, finds exactly one row with the original note and syncs again to check that no duplicate appears.

## Where the simulation ends

The flood-risk experiment uses real historical data, but its unit of analysis is a **municipality-month**, not a plot-day. On 2,340 held-out cases with 63 positives, LightGBM showed a small gain in precision–recall area over monthly climatology. The confidence interval included zero and the model’s probability estimates scored worse on Brier loss. Monthly climatology remained the baseline; the candidate was not promoted.

The evidence supports a decision reproduced in software and a retrospective model comparison. Establishing whether the advice saves water or improves yields would take a field pilot: measure each plot at enrollment, record what the grower actually did and compare outcomes with control plots.
