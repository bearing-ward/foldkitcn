# Documentation Example Backlog

Generated: 2026-06-28

## Source Scan

This backlog comes from the live generated docs index and registry index:

- `registry/docs/index.json`
- `registry/index.json`

Selection rule:

- include implemented docs pages where `examples` is empty
- prioritize installable components with pinned origin `examplePaths`
- keep generated `registry/docs/**` files as build outputs, not hand-edited source

Current count: 30 implemented docs pages need examples.

## Priority Summary

| Priority               | Count | Meaning                                                                             |
| ---------------------- | ----: | ----------------------------------------------------------------------------------- |
| P0 shadcn parity docs  |     0 | shadcn wrapper page is implemented, installable, and has origin example evidence    |
| P0 base primitive docs |    26 | Base UI primitive page is implemented, installable, and has origin example evidence |
| P1 implemented docs    |     4 | implemented installable support/foundation page has no origin examples recorded     |

## First Slice

Start with the pages users are most likely to inspect while comparing us to
`ui.shadcn.com`:

1. Done: `base-ui/button`
2. Done: `shadcn/radio-group`
3. Done: `base-ui/input`
4. `base-ui/checkbox`
5. `base-ui/radio`
6. `base-ui/separator`

`base-ui/button` was completed first because `/components/base-ui/button` had no
live or static examples, even though the pinned Base UI origin had four demo
paths.

## Work Pattern

For each item:

1. Add Foldkit-native examples in the registry source tree, normally under
   `src/registry/<namespace>/<slug>/examples.ts`.
2. Add example metadata to `registry-src/<namespace>/<slug>/item.json`.
3. Add or update `registry-src/<namespace>/<slug>/docs.md` if the page needs
   explanatory copy around the examples.
4. Run `bun run registry:build`.
5. Verify the generated `registry/docs/<namespace>/<slug>.json` contains
   examples with snippets, `previewStatus`, and `previewExportName`.

## Backlog

| Priority               | Item                      | Route                                 | Origin demos | Registry dependencies                                     | Docs artifact                                |
| ---------------------- | ------------------------- | ------------------------------------- | -----------: | --------------------------------------------------------- | -------------------------------------------- |
| P0 base primitive docs | `base-ui/accordion`       | `/components/base-ui/accordion`       |            7 | none                                                      | `registry/docs/base-ui/accordion.json`       |
| P0 base primitive docs | `base-ui/autocomplete`    | `/components/base-ui/autocomplete`    |            4 | `base-ui/combobox`                                        | `registry/docs/base-ui/autocomplete.json`    |
| P0 base primitive docs | `base-ui/checkbox`        | `/components/base-ui/checkbox`        |            4 | none                                                      | `registry/docs/base-ui/checkbox.json`        |
| P0 base primitive docs | `base-ui/collapsible`     | `/components/base-ui/collapsible`     |            4 | none                                                      | `registry/docs/base-ui/collapsible.json`     |
| P0 base primitive docs | `base-ui/context-menu`    | `/components/base-ui/context-menu`    |            4 | `base-ui/menu`                                            | `registry/docs/base-ui/context-menu.json`    |
| P0 base primitive docs | `base-ui/menu`            | `/components/base-ui/menu`            |            4 | `base-ui/popover`                                         | `registry/docs/base-ui/menu.json`            |
| P0 base primitive docs | `base-ui/meter`           | `/components/base-ui/meter`           |            4 | none                                                      | `registry/docs/base-ui/meter.json`           |
| P0 base primitive docs | `base-ui/preview-card`    | `/components/base-ui/preview-card`    |            4 | none                                                      | `registry/docs/base-ui/preview-card.json`    |
| P0 base primitive docs | `base-ui/progress`        | `/components/base-ui/progress`        |            4 | none                                                      | `registry/docs/base-ui/progress.json`        |
| P0 base primitive docs | `base-ui/radio`           | `/components/base-ui/radio`           |            4 | none                                                      | `registry/docs/base-ui/radio.json`           |
| P0 base primitive docs | `base-ui/select`          | `/components/base-ui/select`          |            4 | `base-ui/popover`                                         | `registry/docs/base-ui/select.json`          |
| P0 base primitive docs | `base-ui/separator`       | `/components/base-ui/separator`       |            4 | none                                                      | `registry/docs/base-ui/separator.json`       |
| P0 base primitive docs | `base-ui/toggle`          | `/components/base-ui/toggle`          |            4 | `base-ui/button`                                          | `registry/docs/base-ui/toggle.json`          |
| P0 base primitive docs | `base-ui/toggle-group`    | `/components/base-ui/toggle-group`    |            4 | `base-ui/toggle`                                          | `registry/docs/base-ui/toggle-group.json`    |
| P0 base primitive docs | `base-ui/toolbar`         | `/components/base-ui/toolbar`         |            4 | `base-ui/button`, `base-ui/input`, `base-ui/toggle-group` | `registry/docs/base-ui/toolbar.json`         |
| P0 base primitive docs | `base-ui/tooltip`         | `/components/base-ui/tooltip`         |            4 | none                                                      | `registry/docs/base-ui/tooltip.json`         |
| P0 base primitive docs | `base-ui/alert-dialog`    | `/components/base-ui/alert-dialog`    |            3 | `base-ui/dialog`                                          | `registry/docs/base-ui/alert-dialog.json`    |
| P0 base primitive docs | `base-ui/checkbox-group`  | `/components/base-ui/checkbox-group`  |            3 | `base-ui/checkbox`                                        | `registry/docs/base-ui/checkbox-group.json`  |
| P0 base primitive docs | `base-ui/combobox`        | `/components/base-ui/combobox`        |            3 | `base-ui/popover`                                         | `registry/docs/base-ui/combobox.json`        |
| P0 base primitive docs | `base-ui/drawer`          | `/components/base-ui/drawer`          |            3 | `base-ui/dialog`                                          | `registry/docs/base-ui/drawer.json`          |
| P0 base primitive docs | `base-ui/navigation-menu` | `/components/base-ui/navigation-menu` |            3 | `base-ui/preview-card`                                    | `registry/docs/base-ui/navigation-menu.json` |
| P0 base primitive docs | `base-ui/scroll-area`     | `/components/base-ui/scroll-area`     |            3 | none                                                      | `registry/docs/base-ui/scroll-area.json`     |
| P0 base primitive docs | `base-ui/slider`          | `/components/base-ui/slider`          |            3 | none                                                      | `registry/docs/base-ui/slider.json`          |
| P0 base primitive docs | `base-ui/menubar`         | `/components/base-ui/menubar`         |            2 | `base-ui/menu`                                            | `registry/docs/base-ui/menubar.json`         |
| P0 base primitive docs | `base-ui/switch`          | `/components/base-ui/switch`          |            2 | none                                                      | `registry/docs/base-ui/switch.json`          |
| P0 base primitive docs | `base-ui/tabs`            | `/components/base-ui/tabs`            |            2 | none                                                      | `registry/docs/base-ui/tabs.json`            |
| P1 implemented docs    | `base-ui/dialog`          | `/components/base-ui/dialog`          |            0 | none                                                      | `registry/docs/base-ui/dialog.json`          |
| P1 implemented docs    | `base-ui/popover`         | `/components/base-ui/popover`         |            0 | none                                                      | `registry/docs/base-ui/popover.json`         |
| P1 implemented docs    | `base-ui/radio-group`     | `/components/base-ui/radio-group`     |            0 | none                                                      | `registry/docs/base-ui/radio-group.json`     |
| P1 implemented docs    | `utils/cn`                | `/components/utils/cn`                |            0 | none                                                      | `registry/docs/utils/cn.json`                |

## Completed

| Item                 | Completed  | Examples                                                                                                                                            |
| -------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base-ui/button`     | 2026-06-28 | `ButtonDemo`, `ButtonDisabled`, `ButtonNonNative`, `ButtonTypes`, `ButtonLoading`                                                                   |
| `base-ui/input`      | 2026-06-29 | `InputDemo`, `InputDisabled`                                                                                                                        |
| `shadcn/radio-group` | 2026-06-28 | `RadioGroupDemo`, `RadioGroupDescription`, `RadioGroupChoiceCard`, `RadioGroupDisabled`, `RadioGroupFieldset`, `RadioGroupInvalid`, `RadioGroupRtl` |

## Verification Commands

Use these after each slice:

```sh
bun run registry:build
bun run check
bun run build
git diff --check -- registry-src src/registry registry/docs plans
```
