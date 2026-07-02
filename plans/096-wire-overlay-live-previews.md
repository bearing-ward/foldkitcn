# 096 - Wire Overlay Live Previews

## Summary

Convert overlay, portal, popover, tooltip, and toast examples into live docs previews.

This is a high-risk slice because previews must stay contained within their example cards while still demonstrating open/close behavior.

## Current State

- Planned from commit `88e28f16`.
- Depends on plan 090 for clean export discovery.
- Earlier sidebar work showed that live previews can visually escape the example container if portal/positioning behavior is not handled deliberately.
- Sonner examples have been called out as needing framework-specific implementation from the local/latest Foldkit repo, not an upstream React package.

## Target Inventory Groups

| Item                  | Missing rows |
| --------------------- | -----------: |
| `shadcn/alert-dialog` |            7 |
| `shadcn/dialog`       |            6 |
| `shadcn/sheet`        |            4 |
| `shadcn/drawer`       |            4 |
| `shadcn/popover`      |            5 |
| `shadcn/hover-card`   |            3 |
| `shadcn/tooltip`      |            5 |
| `shadcn/sonner`       |            4 |

Total: 38 rows.

## Scope

In scope:

- Register overlay examples as live-ready only after their runtime preview is demonstrably contained.
- Add preview wrappers, preview root containers, or preview-local state needed for open/close behavior.
- Use local/latest Foldkit and local component implementations as the source of truth for sonner/toast behavior.
- Refresh generated docs artifacts and the gap inventory.

Out of scope:

- Dropdown/context/menu/navigation menu previews; those belong to plan 097.
- Replacing overlay positioning architecture globally unless containment cannot be solved locally.
- Adding external sonner or React dependencies.

## Implementation Notes

1. Confirm target rows:

   ```bash
   node -e "const wanted=new Set(['shadcn/alert-dialog','shadcn/dialog','shadcn/sheet','shadcn/drawer','shadcn/popover','shadcn/hover-card','shadcn/tooltip','shadcn/sonner']); const rows=require('./plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json').filter((row)=>wanted.has(row.itemId)); console.table(rows.map((row)=>({item:row.itemId,example:row.exampleId,exportName:row.previewExportName}))); console.log(rows.length)"
   ```

2. Inspect local Foldkit overlay, portal, and toast/sonner references before editing:

   ```bash
   rg -n "sonner|toast|popover|portal|dialog|tooltip" repos/foldkit packages src registry-src
   ```

3. Convert the least risky overlay examples first and use the resulting containment wrapper consistently.

4. Register a target export as `live-ready` only after `src/live-examples.ts` has a renderer for it.

5. Rebuild and refresh:

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

Manual smoke each target page:

- Open and close modal/dialog/sheet/drawer examples.
- Trigger popover, hover-card, and tooltip examples.
- Trigger sonner/toast examples and verify the toast appears in the intended preview context.
- Confirm no overlay covers the docs nav, neighboring cards, or the page shell.

## Done Criteria

- All 38 target rows are removed from the gap inventory.
- Every converted overlay is usable from inside the example card.
- Sonner examples use the local Foldkit-native implementation path.
- No overlay content escapes the preview context in normal desktop/mobile smoke checks.

## Stop Conditions

Stop and report if:

- Overlay containment needs shared portal infrastructure beyond this docs slice.
- Sonner requires missing local dependency work.
- Browser smoke shows focus traps, scroll locks, or overlays breaking the docs shell.
