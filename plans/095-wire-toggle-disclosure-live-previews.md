# 095 - Wire Toggle Disclosure Live Previews

## Summary

Convert toggle, tabs, accordion, and collapsible examples into live docs previews.

This slice is grouped around examples whose value comes from visibly changing expanded, selected, or pressed state.

## Current State

- Planned from commit `88e28f16`.
- Depends on plan 090 for clean export discovery.
- Preview state must follow Foldkit conventions: model-backed state, fact messages, and no `NoOp`.

## Target Inventory Groups

| Item                  | Missing rows |
| --------------------- | -----------: |
| `shadcn/accordion`    |            5 |
| `shadcn/collapsible`  |            5 |
| `shadcn/tabs`         |            6 |
| `shadcn/toggle`       |            6 |
| `shadcn/toggle-group` |            8 |

Total: 30 rows.

## Scope

In scope:

- Register the target exports as live-ready.
- Add preview-local selected/expanded/pressed state where examples are controlled.
- Ensure collapsed/expanded UI remains inside the example card without layout jumps that break surrounding docs content.
- Refresh generated docs artifacts and the gap inventory.

Out of scope:

- Sidebar-specific expand/collapse cleanup.
- Menu collapsibles and nested menu state; those belong to plan 097.
- Component API redesign.

## Implementation Notes

1. Confirm target rows:

   ```bash
   node -e "const wanted=new Set(['shadcn/accordion','shadcn/collapsible','shadcn/tabs','shadcn/toggle','shadcn/toggle-group']); const rows=require('./plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json').filter((row)=>wanted.has(row.itemId)); console.table(rows.map((row)=>({item:row.itemId,example:row.exampleId,exportName:row.previewExportName}))); console.log(rows.length)"
   ```

2. Inspect whether examples are already self-contained. Prefer registering them directly when they manage their own state.

3. For controlled examples, centralize preview-only state in the existing live-example model rather than mutating DOM state.

4. Update runtime and generator maps together, then rebuild:

   ```bash
   bun run registry:build
   bun run scripts/report-docs-live-preview-gaps.ts --write
   ```

## Verification

Run:

```bash
bun run docs:live-preview-gaps
bun run registry:check
bun run origin:components:check
bun run test -- src/data.test.ts
bun run typecheck
bun run check
bun run build
```

Manual smoke:

- Toggle accordion/collapsible sections.
- Switch tab panels with pointer and keyboard.
- Press toggle and toggle-group examples.

## Done Criteria

- All 30 target rows are removed from the gap inventory.
- Disclosure state changes visibly in the preview.
- Focus and keyboard interaction still work for the converted examples.
- No unrelated sidebar or menu examples are modified.

## Stop Conditions

Stop and report if:

- A controlled example cannot be represented without changing shared component APIs.
- DOM diffing creates stale expanded/selected state that needs a keyed wrapper architecture decision.
- The fix begins overlapping with menu/sidebar examples outside this slice.
