# 083 - Implement shadcn Sidebar

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-sidebar registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/056-implement-shadcn-sheet.md, plans/057-implement-shadcn-direction.md, plans/082-implement-shadcn-sonner.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/sidebar` as a Foldkit-native navigation shell composition
with local open/collapse/mobile state, examples, docs artifacts, and parity.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-sidebar/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-sidebar/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/sidebar`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/sidebar.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/sidebar-*.tsx`
- Origin parts include provider, sidebar, trigger, rail, inset, input, header,
  footer, separator, content, group, group label, group action, group content,
  menu, menu item, menu button, menu action, menu badge, menu skeleton, submenu,
  submenu item, and submenu button.

## Scope

- Add `registry-src/shadcn/sidebar/item.json`.
- Add `src/registry/shadcn/sidebar/index.ts`, `examples.ts`, and tests.
- Add `shadcn/sidebar` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Replace React context, `useIsMobile`, cookies, and imperative shortcut hooks
  with a Foldkit model for desktop open/collapsed state, mobile sheet open
  state, active item, keyboard shortcut facts, and direction.
- Compose local `shadcn/avatar`, `shadcn/button`, `shadcn/collapsible`,
  `shadcn/direction`, `shadcn/dropdown-menu`, `shadcn/input`,
  `shadcn/separator`, `shadcn/sheet`, `shadcn/skeleton`, `shadcn/sonner`,
  `shadcn/tooltip`, and `utils/cn`.
- Keep persistence out of installable source unless represented as explicit
  commands with completion messages; no raw cookie/localStorage writes.
- Preserve origin CSS variables, data attributes, width constants, icon-only
  collapsed states, mobile sheet behavior, menu actions, badges, skeletons, and
  nested submenu examples.

## Testing

- Add Story tests for open/collapse, mobile sheet state, keyboard shortcut,
  active item, submenu states, direction, and persistence command boundaries if
  implemented.
- Add Scene tests for navigation semantics, buttons/links, aria labels,
  tooltip behavior, sheet behavior, keyboard support, and responsive examples.
- Replicate all origin sidebar examples that can be supported by local
  dependencies and add origin/Foldkit parity cases.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep sidebar --dry-run`
  - `bun run parity:check -- --grep sidebar`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## Known Follow-Up: Incomplete Live Examples

The sidebar registry entry is present, but the following live examples need
focused follow-up before they should be treated as complete. They either have
static controls, missing Foldkit-owned interaction state, weak placement/overlay
behavior, or insufficient browser assertions for the behavior the origin example
is meant to demonstrate.

- `SidebarFooter`: `/components/shadcn/sidebar#shadcn-sidebar-footer`
- `SidebarGroupAction`: `/components/shadcn/sidebar#shadcn-sidebar-group-action`
- `SidebarGroupCollapsible`: `/components/shadcn/sidebar#shadcn-sidebar-group-collapsible`
- `SidebarHeader`: `/components/shadcn/sidebar#shadcn-sidebar-header`
- `SidebarMenuAction`: `/components/shadcn/sidebar#shadcn-sidebar-menu-action`
- `SidebarMenuBadge`: `/components/shadcn/sidebar#shadcn-sidebar-menu-badge`
- `SidebarMenuCollapsible`: `/components/shadcn/sidebar#shadcn-sidebar-menu-collapsible`
- `SidebarMenuSub`: `/components/shadcn/sidebar#shadcn-sidebar-menu-sub`
- `SidebarMenu`: `/components/shadcn/sidebar#shadcn-sidebar-menu`
- `SidebarRsc`: `/components/shadcn/sidebar#shadcn-sidebar-rsc`
- `SidebarRtl`: `/components/shadcn/sidebar#shadcn-sidebar-rtl`

When circling back, verify each listed example with the same standard now used
for `SidebarDemo`: the preview should show the benefit of the component through
working controls, and the browser test should assert actual rendered behavior,
not only static DOM presence or `data-*` attributes.

## STOP Conditions

- Stop if the implementation would require React context, cookies,
  localStorage, media-query hooks, or global key listeners hidden in view code.
- Stop if sidebar examples reveal a missing local dependency not listed here
  and that dependency is required for source parity.
