# 094 - Wire Selection And Collection Live Previews

## Summary

Convert higher-interaction selection and collection examples into live docs previews.

This slice covers controls where the preview needs meaningful local state, option collections, or scrollable/selection containers.

## Current State

- Planned from commit `88e28f16`.
- Depends on plan 090 for input-otp fixture normalization.
- Prefer completing plan 093 first so simple form-control preview state exists before adding richer selection state.
- `src/data.test.ts` will fail if a generated live-ready example does not have a renderer.

## Target Inventory Groups

| Item                 |                           Missing rows |
| -------------------- | -------------------------------------: |
| `shadcn/input-otp`   | 10 after plan 090 handles fixture rows |
| `shadcn/select`      |                                      7 |
| `shadcn/combobox`    |                                     11 |
| `shadcn/slider`      |                                      7 |
| `shadcn/scroll-area` |                                      3 |

Total: 38 rows after the null-export blocker is resolved.

## Scope

In scope:

- Register target exports as live-ready.
- Add preview model/message support for selected values, text input, OTP values, slider values, and scrollable collection state when examples are controlled.
- Ensure popup/listbox content remains visually contained in the example card where applicable.
- Refresh generated docs artifacts and the gap inventory.

Out of scope:

- Dropdown/context/menubar/navigation menus; those belong to plan 097.
- Overlay primitives such as popover/sheet/dialog; those belong to plan 096 unless they are already internal to a target component example.
- New component APIs.

## Implementation Notes

1. Confirm target rows:

   ```bash
   node -e "const wanted=new Set(['shadcn/input-otp','shadcn/select','shadcn/combobox','shadcn/slider','shadcn/scroll-area']); const rows=require('./plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json').filter((row)=>wanted.has(row.itemId)); console.table(rows.map((row)=>({item:row.itemId,example:row.exampleId,exportName:row.previewExportName}))); console.log(rows.length)"
   ```

2. Inspect the local/latest Foldkit and registry implementations before adding preview state. Use the existing component API rather than introducing test-only APIs.

3. For controlled examples, add verb-first past-tense preview messages only if they match existing message vocabulary in `src/live-examples.ts`.

4. Register each export in both generator and runtime maps.

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

- Type into input OTP examples.
- Open/select combobox and select examples.
- Drag or keyboard-adjust slider examples.
- Scroll scroll-area examples.

## Done Criteria

- All target rows are removed from the gap inventory.
- Interactive state changes are visible and stay Foldkit-native.
- Popup and scrollable content stays inside the preview card.
- The docs data boundary remains generated artifact based.

## Stop Conditions

Stop and report if:

- A target example requires missing listbox/popover infrastructure.
- Select or combobox popups escape the preview container in a way that needs shared portal work.
- The change requires source component behavior outside docs preview wiring.
