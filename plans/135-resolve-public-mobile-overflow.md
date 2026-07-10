# Plan 135: Resolve public mobile overflow

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: Plan 128
- **State**: IN PROGRESS

## Goal

Burn down the 33 shadcn routes with measured 390px horizontal overflow in the
Plan 128 matrix. Work in component-owner batches, preserve origin behavior,
and remove each route's exception only after its actual docs-host browser case
passes. Do not replace the strict contract with clipping at the page root.

## Execution order

The measured set is partitioned by the likely owning layout seam so fixes can
be verified without coupling unrelated primitives:

1. **Inline controls**: Button, Checkbox, Progress, Slider, Spinner, Switch,
   Toggle, and Textarea.
2. **Anchored and modal surfaces**: Calendar, Combobox, Command, Dialog,
   Drawer, Popover, Select, and Tooltip.
3. **Navigation and dense content**: Accordion, Breadcrumb, Collapsible,
   Direction, Menubar, Pagination, Sidebar, and Skeleton.
4. **Rich/content surfaces**: Attachment, Avatar, Bubble, Carousel, Marker,
   Message, Resizable, and Sonner.

The first batch is the lowest-risk starting point because its overflow is
likely owned by intrinsic control sizing rather than portal geometry. Each
route must be re-measured at 390px in the real docs host before its exception
is removed; no page-level `overflow-x: hidden` workaround is allowed.
