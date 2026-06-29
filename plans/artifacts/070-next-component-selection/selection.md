# Next Component Selection

Generated from `bun run origin:components:next -- 20` on 2026-06-28.

The live tracker returned 19 eligible rows. Blocked rows were excluded, and no
implementation folders were created. Each selected row has a fresh dossier
preview under `plans/artifacts/070-next-component-dossiers`.

## Summary

- Requested rows: 20
- Selected rows: 19
- Blocked rows included: 0
- Imported rows included: 0
- Rows with fresh dossier preview evidence: 19
- Maximum origin URLs per row: 1

## Rows

|   # | Row                       | Readiness         | Origin URLs                                              | Dossier                                                                            |
| --: | ------------------------- | ----------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
|   1 | `shadcn/button-group`     | dossier-ready     | `https://ui.shadcn.com/docs/components/button-group`     | `plans/artifacts/070-next-component-dossiers/shadcn-button-group/dossier.json`     |
|   2 | `shadcn/calendar`         | dossier-ready     | `https://ui.shadcn.com/docs/components/calendar`         | `plans/artifacts/070-next-component-dossiers/shadcn-calendar/dossier.json`         |
|   3 | `shadcn/carousel`         | dossier-ready     | `https://ui.shadcn.com/docs/components/carousel`         | `plans/artifacts/070-next-component-dossiers/shadcn-carousel/dossier.json`         |
|   4 | `shadcn/command`          | dossier-ready     | `https://ui.shadcn.com/docs/components/command`          | `plans/artifacts/070-next-component-dossiers/shadcn-command/dossier.json`          |
|   5 | `shadcn/empty`            | dossier-ready     | `https://ui.shadcn.com/docs/components/empty`            | `plans/artifacts/070-next-component-dossiers/shadcn-empty/dossier.json`            |
|   6 | `shadcn/input-group`      | dossier-ready     | `https://ui.shadcn.com/docs/components/input-group`      | `plans/artifacts/070-next-component-dossiers/shadcn-input-group/dossier.json`      |
|   7 | `shadcn/item`             | dossier-ready     | `https://ui.shadcn.com/docs/components/item`             | `plans/artifacts/070-next-component-dossiers/shadcn-item/dossier.json`             |
|   8 | `shadcn/pagination`       | dossier-ready     | `https://ui.shadcn.com/docs/components/pagination`       | `plans/artifacts/070-next-component-dossiers/shadcn-pagination/dossier.json`       |
|   9 | `shadcn/resizable`        | dossier-ready     | `https://ui.shadcn.com/docs/components/resizable`        | `plans/artifacts/070-next-component-dossiers/shadcn-resizable/dossier.json`        |
|  10 | `shadcn/sidebar`          | dossier-ready     | `https://ui.shadcn.com/docs/components/sidebar`          | `plans/artifacts/070-next-component-dossiers/shadcn-sidebar/dossier.json`          |
|  11 | `shadcn/sonner`           | dossier-ready     | `https://ui.shadcn.com/docs/components/sonner`           | `plans/artifacts/070-next-component-dossiers/shadcn-sonner/dossier.json`           |
|  12 | `shadcn/spinner`          | dossier-ready     | `https://ui.shadcn.com/docs/components/spinner`          | `plans/artifacts/070-next-component-dossiers/shadcn-spinner/dossier.json`          |
|  13 | `shadcn/table`            | dossier-ready     | `https://ui.shadcn.com/docs/components/table`            | `plans/artifacts/070-next-component-dossiers/shadcn-table/dossier.json`            |
|  14 | `base-ui/toast`           | dossier-ready     | `https://base-ui.com/react/components/toast`             | `plans/artifacts/070-next-component-dossiers/base-ui-toast/dossier.json`           |
|  15 | `shadcn/attachment`       | ready-for-dossier | `https://ui.shadcn.com/docs/components/attachment`       | `plans/artifacts/070-next-component-dossiers/shadcn-attachment/dossier.json`       |
|  16 | `shadcn/bubble`           | ready-for-dossier | `https://ui.shadcn.com/docs/components/bubble`           | `plans/artifacts/070-next-component-dossiers/shadcn-bubble/dossier.json`           |
|  17 | `shadcn/marker`           | ready-for-dossier | `https://ui.shadcn.com/docs/components/marker`           | `plans/artifacts/070-next-component-dossiers/shadcn-marker/dossier.json`           |
|  18 | `shadcn/message`          | ready-for-dossier | `https://ui.shadcn.com/docs/components/message`          | `plans/artifacts/070-next-component-dossiers/shadcn-message/dossier.json`          |
|  19 | `shadcn/message-scroller` | ready-for-dossier | `https://ui.shadcn.com/docs/components/message-scroller` | `plans/artifacts/070-next-component-dossiers/shadcn-message-scroller/dossier.json` |

## Improve Planning Prompt

Use this selection as the input to create implementation plans:

```text
[$improve] plan create implementation plans for all rows in plans/artifacts/070-next-component-selection/selection.md. Use the referenced dossier.json and plan-preview.md files as the source evidence. Keep each implementation plan to one selected row, preserve batch boundaries, and do not include blocked or already imported rows.
```
