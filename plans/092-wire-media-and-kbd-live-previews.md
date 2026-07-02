# 092 - Wire Media And Keyboard Live Previews

## Summary

Convert avatar and keyboard shortcut examples into live docs previews.

This slice is separated from the simple visual surface slice because avatar examples often compose fallback/image/menu behavior, and keyboard examples include compact inline/group layouts that need careful preview sizing.

## Current State

- Planned from commit `88e28f16`.
- Depends on plan 090 for the `base-ui/avatar-hero` and `shadcn/kbd-group` normalization decision.
- Live preview status is generated from `scripts/registry-common.ts`.
- Runtime rendering is registered in `src/live-examples.ts`.

## Target Inventory Groups

| Item            |                        Missing rows |
| --------------- | ----------------------------------: |
| `shadcn/avatar` |                                  10 |
| `shadcn/kbd`    | 5 after plan 090 handles `KbdGroup` |

Total: 15 rows after the null-export blocker is resolved.

## Scope

In scope:

- Register avatar and keyboard exports as live-ready.
- Add preview wrappers for examples that need stable avatar image/fallback sizing or inline keyboard grouping.
- Keep previews framework-native and generated-docs driven.
- Refresh generated docs artifacts and the gap inventory.

Out of scope:

- Menu/dropdown behavior that belongs to plan 097.
- Input/form keyboard interactions that belong to plan 093 or 094.
- Base UI avatar parity beyond the normalization work in plan 090, unless plan 090 leaves a public exported Base UI avatar example ready for registration.

## Implementation Notes

1. Confirm the remaining target rows after 090:

   ```bash
   node -e "const wanted=new Set(['shadcn/avatar','shadcn/kbd']); const rows=require('./plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json').filter((row)=>wanted.has(row.itemId)); console.table(rows.map((row)=>({item:row.itemId,example:row.exampleId,exportName:row.previewExportName}))); console.log(rows.length)"
   ```

2. Inspect avatar examples for image URLs and fallback timing. Live previews should be deterministic and should not rely on flaky remote assets.

3. Inspect keyboard examples for inline wrapping. Preview wrappers may need a compact flex container so labels and keys do not overflow.

4. Register the exact export names in both:

   - `scripts/registry-common.ts`
   - `src/live-examples.ts`

5. Rebuild docs artifacts and refresh the gap report:

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

Manually smoke:

- `/components/shadcn/avatar#examples`
- `/components/shadcn/kbd#examples`

## Done Criteria

- The target avatar and kbd rows are removed from the gap inventory.
- Avatar previews render deterministically with sane fallback/image behavior.
- Keyboard previews fit inside the example card across desktop and mobile widths.

## Stop Conditions

Stop and report if:

- Avatar examples rely on unavailable media assets and no local deterministic fallback exists.
- Keyboard examples require missing registry exports or are intentionally code-only documentation examples.
- The fix drifts into dropdown/menu behavior covered by plan 097.
