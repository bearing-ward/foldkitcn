# Component Conversion Checklist

Generated at: 2026-07-01T16:14:09.172Z

## Summary

| Surface      | Imported | Total | Remaining |
| ------------ | -------: | ----: | --------: |
| Base UI docs |       38 |    38 |         0 |
| shadcn docs  |       59 |    64 |         5 |

- shadcn source-backed files: 60
- shadcn docs/example-only rows: 4
- Blocked rows: 5
- Ready-for-dossier rows: 0
- Dossier-ready rows: 0
- Base UI pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- shadcn pinned ref: `40c7064532185f5556f6cbff7dca3544987c0fe1`

## Next Candidates

None.

## Imported Items

- `shadcn/badge`
- `shadcn/skeleton`
- `shadcn/kbd`
- `shadcn/aspect-ratio`
- `base-ui/separator`
- `shadcn/separator`
- `base-ui/progress`
- `shadcn/progress`
- `base-ui/avatar`
- `shadcn/avatar`
- `base-ui/input`
- `shadcn/input`
- `shadcn/textarea`
- `base-ui/switch`
- `shadcn/switch`
- `base-ui/checkbox`
- `shadcn/checkbox`
- `base-ui/radio-group`
- `shadcn/radio-group`
- `base-ui/tabs`
- `shadcn/tabs`
- `base-ui/collapsible`
- `shadcn/collapsible`
- `base-ui/button`
- `base-ui/toggle`
- `shadcn/toggle`
- `base-ui/toggle-group`
- `shadcn/toggle-group`
- `base-ui/slider`
- `shadcn/slider`
- `base-ui/accordion`
- `shadcn/accordion`
- `base-ui/dialog`
- `shadcn/dialog`
- `base-ui/popover`
- `shadcn/popover`
- `base-ui/meter`
- `base-ui/fieldset`
- `base-ui/number-field`
- `shadcn/native-select`
- `shadcn/alert`
- `base-ui/field`
- `shadcn/field`
- `shadcn/label`
- `base-ui/form`
- `base-ui/tooltip`
- `shadcn/tooltip`
- `base-ui/checkbox-group`
- `base-ui/select`
- `shadcn/select`
- `base-ui/menu`
- `base-ui/radio`
- `shadcn/dropdown-menu`
- `base-ui/alert-dialog`
- `shadcn/alert-dialog`
- `base-ui/context-menu`
- `shadcn/context-menu`
- `base-ui/otp-field`
- `base-ui/scroll-area`
- `shadcn/input-otp`
- `shadcn/scroll-area`
- `base-ui/toolbar`
- `base-ui/preview-card`
- `shadcn/hover-card`
- `base-ui/menubar`
- `shadcn/menubar`
- `base-ui/navigation-menu`
- `shadcn/navigation-menu`
- `base-ui/combobox`
- `shadcn/combobox`
- `base-ui/autocomplete`
- `base-ui/drawer`
- `shadcn/drawer`
- `shadcn/sheet`
- `shadcn/direction`
- `shadcn/card`
- `shadcn/breadcrumb`
- `shadcn/button-group`
- `shadcn/calendar`
- `shadcn/carousel`
- `shadcn/command`
- `shadcn/empty`
- `shadcn/input-group`
- `shadcn/item`
- `shadcn/pagination`
- `shadcn/resizable`
- `shadcn/sidebar`
- `shadcn/sonner`
- `shadcn/spinner`
- `shadcn/table`
- `base-ui/toast`
- `shadcn/attachment`
- `shadcn/bubble`
- `shadcn/button`
- `shadcn/marker`
- `shadcn/message`
- `shadcn/message-scroller`

## Ready For Dossier

None.

## Dossier Ready

None.

## Blocked

| Item                 | Readiness | Parity      | URLs                                                        | Blockers                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | --------- | ----------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shadcn/data-table`  | blocked   | not-started | [origin](https://ui.shadcn.com/docs/components/data-table)  | No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.<br>A local table/query/sorting/filtering/pagination foundation must replace TanStack React Table semantics.<br>Dashboard examples require local chart, drawer, tabs, toast, and drag-and-drop dependency decisions before parity can be accepted.                                   |
| `shadcn/date-picker` | blocked   | not-started | [origin](https://ui.shadcn.com/docs/components/date-picker) | No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.<br>Local calendar/date behavior, popover, field, and input foundations must exist before installable source.<br>Range, time, locale, and natural-language parsing decisions must be modeled without React DayPicker runtime source.                                                 |
| `shadcn/toast`       | blocked   | not-started | [origin](https://ui.shadcn.com/docs/components/toast)       | No primary base-nova shadcn component source exists; use docs/example-only and public registry JSON evidence for planning.<br>Notification architecture must be settled across base-ui/toast, shadcn/sonner, shadcn/toast, Foldkit messages, commands, and subscriptions.<br>The React hook-style origin API must be mapped to Foldkit messages, commands, and managed subscriptions. |
| `shadcn/typography`  | blocked   | not-started | [origin](https://ui.shadcn.com/docs/components/typography)  | No primary base-nova shadcn component source exists; use docs/example-only evidence for planning.<br>Typography is docs/examples plus local style primitive evidence, not a single installable behavior component yet.<br>@/components/language-selector and react are origin fixture evidence only, not installable runtime dependencies.                                            |
| `shadcn/chart`       | blocked   | not-started | [origin](https://ui.shadcn.com/docs/components/chart)       | ADR 0001 gates charts on an explicit native chart foundation.<br>Recharts and React are origin evidence only unless a later architecture decision accepts a runtime chart dependency.<br>The chart namespace and chart example parity harness must exist before chart items become implementation-ready.                                                                              |
