# Hold Rows

These remaining shadcn rows are intentionally not generated in plan 007.

| Item | Why Held | Ready When |
| --- | --- | --- |
| `shadcn/data-table` | Docs and examples exist, but there is no `styles/base-nova/ui/data-table.tsx` source file for the current resolver to capture. | The resolver supports docs/example-only composition rows and the implementation plan can depend on local table, command, dropdown-menu, pagination, and sorting/filtering decisions. |
| `shadcn/date-picker` | Docs and examples exist, but there is no `styles/base-nova/ui/date-picker.tsx` source file for the current resolver to capture. | Calendar, popover, input, and local date behavior decisions exist, and docs/example-only composition rows are resolvable. |
| `shadcn/toast` | Docs and examples exist, but there is no `styles/base-nova/ui/toast.tsx` source file for the current resolver to capture. | The local notification/toast direction is settled across `base-ui/toast`, `shadcn/sonner`, and docs/example-only shadcn toast handling. |
| `shadcn/typography` | Docs and examples exist, but there is no `styles/base-nova/ui/typography.tsx` source file for the current resolver to capture. | Typography is classified as docs/examples or local style primitives, and docs/example-only rows are resolvable without implying an installable component source. |
| `shadcn/chart` | ADR 0001 gates charts on an explicit native chart foundation before chart items become installable. | A native chart foundation exists and the chart row can be planned against that local foundation without importing upstream React chart code. |
