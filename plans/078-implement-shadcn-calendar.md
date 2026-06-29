# 078 - Implement shadcn Calendar

> **Executor instructions**: Follow this plan step by step. Run every
> verification command before moving on. If a STOP condition occurs, stop and
> report instead of improvising.
>
> **Drift check (run first)**:
> `git diff --stat e5534d56..HEAD -- plans/artifacts/070-next-component-selection/selection.md plans/artifacts/070-next-component-dossiers/shadcn-calendar registry-src src/registry tests/parity`
> If any in-scope file changed, compare this plan with the live dossier before
> proceeding.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/038-implement-base-ui-and-shadcn-field.md, plans/058-implement-shadcn-card.md, plans/072-implement-shadcn-input-group.md
- **Category**: direction
- **Planned at**: commit `e5534d56`, 2026-06-28

## Summary

Implement `shadcn/calendar` with a local date-grid model, base-nova styling,
examples, docs artifacts, and parity without importing React DayPicker or
date-fns into installable source.

## Source Evidence

- Selection row: `plans/artifacts/070-next-component-selection/selection.md`
- Dossier: `plans/artifacts/070-next-component-dossiers/shadcn-calendar/dossier.json`
- Preview: `plans/artifacts/070-next-component-dossiers/shadcn-calendar/plan-preview.md`
- Origin docs: `https://ui.shadcn.com/docs/components/calendar`
- shadcn source: `repos/ui/apps/v4/styles/base-nova/ui/calendar.tsx`
- Origin examples: `repos/ui/apps/v4/examples/base/calendar-*.tsx`

## Scope

- Add `registry-src/shadcn/calendar/item.json`.
- Add `src/registry/shadcn/calendar/index.ts`, `examples.ts`, and tests.
- Add `shadcn/calendar` parity fixture coverage.
- Update generated registry/docs/progress artifacts.

## Implementation Notes

- Replace `react-day-picker`, `date-fns`, and locale packages with an
  Effect-Schema-backed local calendar model for visible month, selected dates,
  disabled dates, focus target, week starts, and navigation.
- Start with the origin single-month and single-date behavior needed by the
  base examples. Range, Persian calendar, advanced locale, time, and natural
  language examples may be fixture-only or deferred only if the dossier shows
  they exceed a local first implementation.
- Compose local `shadcn/button`, `shadcn/card`, `shadcn/field`,
  `shadcn/input-group`, and `utils/cn`.
- Preserve origin `CalendarDayButton` structure, data attributes, disabled/
  selected/today/outside-month states, and keyboard/focus semantics.
- Replace `lucide-react`, `next/font`, and language-selector runtime locally.

## Testing

- Add Story tests for month navigation, selecting a date, disabled dates,
  outside-month behavior, focus movement, and controlled value updates.
- Add Scene tests for grid roles, weekday labels, day button states,
  accessible names, keyboard navigation, and RTL examples.
- Replicate all origin calendar examples that can be supported by local
  dependencies; document any intentionally deferred example in the registry
  item and plan result.
- Add origin and Foldkit parity for each replicated example.
- Run:
  - `bun run registry:build`
  - `bun run origin:components:write`
  - `bun run registry:check`
  - `bun run origin:components:check`
  - `bun run parity:check -- --grep calendar --dry-run`
  - `bun run parity:check -- --grep calendar`
  - `bun run test`
  - `bun run typecheck`
  - `bun run check`
  - `bun run build`

## STOP Conditions

- Stop if the implementation would require `react-day-picker`, `date-fns`, a
  calendar runtime package, or React hooks in installable source.
- Stop if advanced date behavior requires a reusable date foundation larger
  than this row; write the split plan instead of landing partial hidden logic.
