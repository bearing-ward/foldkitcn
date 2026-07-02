# 093 - Wire Form Control Live Previews

## Summary

Convert basic form-control examples into live docs previews.

This slice covers controls that can be demonstrated with simple local preview state or stable default values.

## Current State

- Planned from commit `88e28f16`.
- Depends on plan 090 for `shadcn/field` fixture normalization.
- The docs generator only marks examples live-ready through `liveReadyExampleExportsByItemId`.
- `src/live-examples.ts` owns the Foldkit-native preview renderers and any preview-only controller context.

## Target Inventory Groups

| Item                   |                          Missing rows |
| ---------------------- | ------------------------------------: |
| `shadcn/input`         |                                     6 |
| `shadcn/textarea`      |                                     6 |
| `shadcn/checkbox`      |                                     8 |
| `shadcn/switch`        |                                     7 |
| `shadcn/native-select` |                                     5 |
| `shadcn/field`         | 5 after plan 090 handles fixture rows |

Total: 37 rows after the null-export blocker is resolved.

## Scope

In scope:

- Register form-control exports as live-ready.
- Add preview-local state/controller support when examples need checked/value/selected updates.
- Preserve Foldkit architecture: messages describe facts, preview model remains the source of truth, and side effects stay in commands.
- Refresh generated docs artifacts and the gap inventory.

Out of scope:

- Complex selection widgets such as combobox, select, input-otp, and slider; those belong to plan 094.
- Full form submission flows beyond what the examples already expose.
- Component API redesign.

## Implementation Notes

1. Confirm target rows:

   ```bash
   node -e "const wanted=new Set(['shadcn/input','shadcn/textarea','shadcn/checkbox','shadcn/switch','shadcn/native-select','shadcn/field']); const rows=require('./plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json').filter((row)=>wanted.has(row.itemId)); console.table(rows.map((row)=>({item:row.itemId,example:row.exampleId,exportName:row.previewExportName}))); console.log(rows.length)"
   ```

2. Inspect existing `LiveExampleContext` and preview message/model patterns before adding state.

3. Use static wrappers for examples that are display-only. Add controlled wrappers only when user interaction is part of the value of the example.

4. Update:

   - `scripts/registry-common.ts`
   - `src/live-examples.ts`
   - any targeted example source only when an existing export is not Foldkit-native or not preview-safe.

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

Manual smoke should include keyboard and pointer interaction for:

- `/components/shadcn/checkbox#examples`
- `/components/shadcn/switch#examples`
- `/components/shadcn/native-select#examples`
- `/components/shadcn/field#examples`

## Done Criteria

- All target form-control rows are removed from the gap inventory.
- Converted examples render inside `.live-example-preview`.
- Interactive controls visibly respond where the origin example is interactive.
- No `NoOp`, casts, or imperative DOM mutation are introduced.

## Stop Conditions

Stop and report if:

- A target example requires a shared form model or validation architecture beyond preview-local state.
- Native select or field examples depend on missing component behavior.
- The work starts overlapping with selection/collection examples assigned to plan 094.
