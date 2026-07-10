# Public parity audit backlog

The generated contract audit found two public routes without ready parity
slots. Each has pinned origin documentation/example evidence and a live docs
renderer, but none may be treated as fully fixture-backed until its owner plan
lands. The exceptions expire on 2026-10-09.

| Surface             | Classification                       | Owner                                                |
| ------------------- | ------------------------------------ | ---------------------------------------------------- |
| `shadcn/data-table` | missing fixture contract             | `plans/132-add-data-table-parity-contract.md`        |
| `shadcn/typography` | intentional docs-only origin surface | `plans/134-formalize-typography-docs-only-parity.md` |

No missing live renderers, unprofiled routes, or origin-unmapped routes remain.

The former 33-route 390px overflow backlog is resolved. Long source paths now
wrap inside the shared Source section, and every route is held to the strict
desktop and mobile docs-host overflow contract.

The high-risk workbench now includes Date Picker and the other promoted
interaction families. Data Table remains downstream of its fixture-contract
plan.
