# Public parity audit backlog

The generated contract audit found three public routes without ready parity
slots. Each has pinned origin documentation/example evidence and a live docs
renderer, but none may be treated as fully fixture-backed until its owner plan
lands. The exceptions expire on 2026-10-09.

| Surface              | Classification                       | Owner                                                |
| -------------------- | ------------------------------------ | ---------------------------------------------------- |
| `shadcn/data-table`  | missing fixture contract             | `plans/132-add-data-table-parity-contract.md`        |
| `shadcn/date-picker` | missing fixture contract             | `plans/133-add-date-picker-parity-contract.md`       |
| `shadcn/typography`  | intentional docs-only origin surface | `plans/134-formalize-typography-docs-only-parity.md` |

No missing live renderers, unprofiled routes, or origin-unmapped routes remain.

The 390px docs-host run also found measured horizontal overflow on 33 shadcn
routes. They are owned by `plans/135-resolve-public-mobile-overflow.md`; the
generated matrix lists the exact affected routes and gives each exception the
same 2026-10-09 review date. New overflow on any other route still fails CI.

The workbench currently has executable cases only for Tabs and Empty. The
required high-risk family expansion is owned by
`plans/136-expand-high-risk-parity-workbench.md`; Date Picker and Data Table
remain downstream of their fixture-contract plans.
