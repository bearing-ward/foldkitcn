# Next Component Selection

Generated from `bun run origin:components:next -- 20` on 2026-06-25.

This selection does not create new dossier evidence. All selected rows are
already `dossier-ready`, so the existing dossier and plan-preview artifacts
below are the authoritative inputs for the next `improve plan` pass.

## Summary

- Selected rows: 20
- Blocked rows included: 0
- Imported rows included: 0
- Rows with existing dossier evidence: 20
- Maximum origin URLs per row: 2

## Rows

|   # | Row                                           | Origin URLs                                                                                               | Existing dossier                                                                     |
| --: | --------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
|   1 | `shadcn/aspect-ratio`                         | `https://ui.shadcn.com/docs/components/aspect-ratio`                                                      | `plans/artifacts/004-foundational-component-dossiers/aspect-ratio/dossier.json`      |
|   2 | `base-ui/avatar`, `shadcn/avatar`             | `https://base-ui.com/react/components/avatar`, `https://ui.shadcn.com/docs/components/avatar`             | `plans/artifacts/004-foundational-component-dossiers/avatar/dossier.json`            |
|   3 | `base-ui/input`, `shadcn/input`               | `https://base-ui.com/react/components/input`, `https://ui.shadcn.com/docs/components/input`               | `plans/artifacts/004-foundational-component-dossiers/input/dossier.json`             |
|   4 | `shadcn/textarea`                             | `https://ui.shadcn.com/docs/components/textarea`                                                          | `plans/artifacts/004-foundational-component-dossiers/textarea/dossier.json`          |
|   5 | `base-ui/switch`, `shadcn/switch`             | `https://base-ui.com/react/components/switch`, `https://ui.shadcn.com/docs/components/switch`             | `plans/artifacts/004-foundational-component-dossiers/switch/dossier.json`            |
|   6 | `base-ui/checkbox`, `shadcn/checkbox`         | `https://base-ui.com/react/components/checkbox`, `https://ui.shadcn.com/docs/components/checkbox`         | `plans/artifacts/004-foundational-component-dossiers/checkbox/dossier.json`          |
|   7 | `base-ui/radio-group`, `shadcn/radio-group`   | `https://base-ui.com/react/components/radio-group`, `https://ui.shadcn.com/docs/components/radio-group`   | `plans/artifacts/004-foundational-component-dossiers/radio-group/dossier.json`       |
|   8 | `base-ui/tabs`, `shadcn/tabs`                 | `https://base-ui.com/react/components/tabs`, `https://ui.shadcn.com/docs/components/tabs`                 | `plans/artifacts/004-foundational-component-dossiers/tabs/dossier.json`              |
|   9 | `base-ui/collapsible`, `shadcn/collapsible`   | `https://base-ui.com/react/components/collapsible`, `https://ui.shadcn.com/docs/components/collapsible`   | `plans/artifacts/004-foundational-component-dossiers/collapsible/dossier.json`       |
|  10 | `base-ui/toggle`, `shadcn/toggle`             | `https://base-ui.com/react/components/toggle`, `https://ui.shadcn.com/docs/components/toggle`             | `plans/artifacts/004-foundational-component-dossiers/toggle/dossier.json`            |
|  11 | `base-ui/toggle-group`, `shadcn/toggle-group` | `https://base-ui.com/react/components/toggle-group`, `https://ui.shadcn.com/docs/components/toggle-group` | `plans/artifacts/004-foundational-component-dossiers/toggle-group/dossier.json`      |
|  12 | `base-ui/slider`, `shadcn/slider`             | `https://base-ui.com/react/components/slider`, `https://ui.shadcn.com/docs/components/slider`             | `plans/artifacts/004-foundational-component-dossiers/slider/dossier.json`            |
|  13 | `base-ui/accordion`, `shadcn/accordion`       | `https://base-ui.com/react/components/accordion`, `https://ui.shadcn.com/docs/components/accordion`       | `plans/artifacts/004-foundational-component-dossiers/accordion/dossier.json`         |
|  14 | `base-ui/dialog`, `shadcn/dialog`             | `https://base-ui.com/react/components/dialog`, `https://ui.shadcn.com/docs/components/dialog`             | `plans/artifacts/004-foundational-component-dossiers/dialog/dossier.json`            |
|  15 | `base-ui/popover`, `shadcn/popover`           | `https://base-ui.com/react/components/popover`, `https://ui.shadcn.com/docs/components/popover`           | `plans/artifacts/004-foundational-component-dossiers/popover/dossier.json`           |
|  16 | `base-ui/fieldset`                            | `https://base-ui.com/react/components/fieldset`                                                           | `plans/artifacts/007-remaining-component-dossiers/base-ui-fieldset/dossier.json`     |
|  17 | `base-ui/number-field`                        | `https://base-ui.com/react/components/number-field`                                                       | `plans/artifacts/007-remaining-component-dossiers/base-ui-number-field/dossier.json` |
|  18 | `base-ui/field`, `shadcn/field`               | `https://base-ui.com/react/components/field`, `https://ui.shadcn.com/docs/components/field`               | `plans/artifacts/007-remaining-component-dossiers/field/dossier.json`                |
|  19 | `shadcn/label`                                | `https://ui.shadcn.com/docs/components/label`                                                             | `plans/artifacts/007-remaining-component-dossiers/shadcn-label/dossier.json`         |
|  20 | `base-ui/form`                                | `https://base-ui.com/react/components/form`                                                               | `plans/artifacts/007-remaining-component-dossiers/base-ui-form/dossier.json`         |

## Improve Planning Prompt

Use this selection as the input to create implementation plans:

```text
[$improve] plan create implementation plans for all rows in plans/artifacts/020-next-component-selection/selection.md. Use the referenced existing dossier.json and plan-preview.md files as the source evidence. Keep each implementation plan to one selected row, preserve one-or-two-component batch boundaries, and do not include blocked or already imported rows.
```
