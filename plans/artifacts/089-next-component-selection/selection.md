# Next Component Selection

Generated from `bun run origin:components:next -- 1` on 2026-06-29.

The live tracker returned 1 eligible row. Blocked rows were excluded, and no
implementation folders were created. The selected row has a fresh dossier
preview under `plans/artifacts/089-next-component-dossiers`.

## Summary

- Requested rows: 1
- Selected rows: 1
- Blocked rows included: 0
- Imported rows included: 0
- Rows with fresh dossier preview evidence: 1
- Maximum origin URLs per row: 1

## Rows

|   # | Row               | Readiness     | Origin URLs                                      | Dossier                                                                    |
| --: | ----------------- | ------------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
|   1 | `shadcn/calendar` | dossier-ready | `https://ui.shadcn.com/docs/components/calendar` | `plans/artifacts/089-next-component-dossiers/shadcn-calendar/dossier.json` |

## Improve Planning Prompt

Use this selection as the input to create implementation plans:

```text
[$improve] plan create an implementation plan for all rows in plans/artifacts/089-next-component-selection/selection.md. Use the referenced dossier.json and plan-preview.md files as the source evidence. Keep each implementation plan to one selected row, preserve batch boundaries, and do not include blocked or already imported rows.
```
