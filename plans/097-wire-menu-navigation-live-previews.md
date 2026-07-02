# 097 - Wire Menu Navigation Live Previews

## Summary

Convert menu, context menu, menubar, navigation menu, and breadcrumb examples into live docs previews.

This is a high-risk interaction slice because menu previews need open state, keyboard behavior, submenus, positioning, and preview containment.

## Current State

- Planned from commit `88e28f16`.
- Depends on plan 090 for clean export discovery.
- Prefer completing plan 096 first if overlay containment work produces reusable preview-root or portal handling.
- `src/data.test.ts` protects against generator/runtime registration drift.

## Target Inventory Groups

| Item                     | Missing rows |
| ------------------------ | -----------: |
| `shadcn/dropdown-menu`   |           13 |
| `shadcn/context-menu`    |           11 |
| `shadcn/menubar`         |            6 |
| `shadcn/navigation-menu` |            2 |
| `shadcn/breadcrumb`      |            7 |

Total: 39 rows.

## Scope

In scope:

- Register target menu/navigation exports as live-ready.
- Add preview-local state or wrappers for open menus, submenus, context menu triggers, and navigation affordances.
- Keep menu content visually contained in `.live-example-preview`.
- Refresh generated docs artifacts and the gap inventory.

Out of scope:

- Sidebar-specific example fixes already documented separately.
- Generic overlay primitives covered by plan 096, except for reusing its preview containment work.
- Rewriting menu component APIs.

## Implementation Notes

1. Confirm target rows:

   ```bash
   node -e "const wanted=new Set(['shadcn/dropdown-menu','shadcn/context-menu','shadcn/menubar','shadcn/navigation-menu','shadcn/breadcrumb']); const rows=require('./plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json').filter((row)=>wanted.has(row.itemId)); console.table(rows.map((row)=>({item:row.itemId,example:row.exampleId,exportName:row.previewExportName}))); console.log(rows.length)"
   ```

2. Inspect existing menu examples and any local Foldkit menu/popover references before editing:

   ```bash
   rg -n "dropdown-menu|context-menu|menubar|navigation-menu|breadcrumb" registry-src src repos/foldkit
   ```

3. Convert breadcrumb first if it is display-only, then proceed through dropdown/menu examples from least to most interactive.

4. For context-menu examples, make sure right-click or keyboard alternatives are discoverable through the actual example UI, not through explanatory text added to the docs page.

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

Manual smoke:

- Open dropdown menu, context menu, menubar, and navigation menu examples.
- Exercise nested/submenu examples.
- Confirm keyboard navigation still works where supported.
- Confirm menu content stays inside the example card and does not cover the docs shell.

## Done Criteria

- All 39 target rows are removed from the gap inventory.
- Menu previews demonstrate the component behavior, not just static markup.
- Menus and submenus are contained in the preview area.
- Breadcrumb examples render live without unnecessary interactive state.

## Stop Conditions

Stop and report if:

- Menu positioning needs shared portal work not already solved by plan 096.
- Context menu behavior cannot be tested or triggered in the docs preview without component changes.
- The work overlaps with sidebar examples that are intentionally deferred.
