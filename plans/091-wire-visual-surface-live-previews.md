# 091 - Wire Visual Surface Live Previews

## Summary

Convert low-interaction visual surface examples from static code cards into rendered `.live-example-preview` cards.

This slice covers examples that should mostly render with `staticExample`-style wrappers and little or no additional live state.

## Current State

- Planned from commit `88e28f16`.
- Depends on plan 090 so every target row has a usable `previewExportName`.
- The docs route consumes generated docs data; runtime preview rendering must be registered in `src/live-examples.ts`.
- `scripts/registry-common.ts` controls which exported examples are marked `live-ready`.

## Target Inventory Groups

| Item                  | Missing rows |
| --------------------- | -----------: |
| `shadcn/alert`        |            6 |
| `shadcn/badge`        |            7 |
| `shadcn/card`         |            6 |
| `shadcn/skeleton`     |            7 |
| `shadcn/aspect-ratio` |            4 |
| `shadcn/separator`    |            5 |
| `shadcn/progress`     |            4 |
| `shadcn/direction`    |            2 |
| `shadcn/label`        |            2 |
| `shadcn/attachment`   |            1 |

Total: 44 rows.

## Scope

In scope:

- Add the target exports to `liveReadyExampleExportsByItemId` in `scripts/registry-common.ts`.
- Import/register the same exports in `src/live-examples.ts`.
- Add small preview wrappers only when the raw exported example needs constrained dimensions or native docs preview context.
- Use the local/latest Foldkit implementation as the framework reference.
- For `shadcn/attachment`, use `https://foldkit.dev/ui/file-drop` or the local Foldkit file-drop copy as the workflow reference; do not invent a non-native attachment workflow.
- Refresh generated docs artifacts and the gap inventory.

Out of scope:

- Overlay, menu, controlled form, and composite interaction examples.
- New component APIs.
- Broad visual redesign of docs pages.

## Implementation Notes

1. Confirm the target rows and exports:

   ```bash
   node -e "const wanted=new Set(['shadcn/alert','shadcn/badge','shadcn/card','shadcn/skeleton','shadcn/aspect-ratio','shadcn/separator','shadcn/progress','shadcn/direction','shadcn/label','shadcn/attachment']); const rows=require('./plans/artifacts/089-docs-live-preview-gaps/missing-live-preview-cards.json').filter((row)=>wanted.has(row.itemId)); console.table(rows.map((row)=>({item:row.itemId,example:row.exampleId,exportName:row.previewExportName}))); console.log(rows.length)"
   ```

2. Inspect existing patterns in `src/live-examples.ts` before adding wrappers.

3. Prefer direct registration of the exported example. Add a wrapper only when the example needs a fixed preview stage, an attachment command context, or a containment guard.

4. Rebuild and refresh:

   ```bash
   bun run registry:build
   bun run scripts/report-docs-live-preview-gaps.ts --write
   ```

5. Verify the target item ids no longer appear in the gap inventory.

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

Manually smoke the docs pages for at least these representative anchors:

- `/components/shadcn/alert#examples`
- `/components/shadcn/card#examples`
- `/components/shadcn/attachment#examples`

## Done Criteria

- All 44 target rows are gone from `missing-live-preview-cards.json`.
- Each converted example card shows both the generated code snippet and a rendered `.live-example-preview`.
- Attachment examples demonstrate the framework-native file drop/attachment workflow.
- No preview spills outside its example card.

## Execution Note

- `shadcn/attachment-workflow-demo` remains static after review. The existing `AttachmentWorkflowDemo` is the correct Foldkit-native `FileDrop` workflow, but it renders through `h.submodel`, which the current live-preview gap report calls outside an active Foldkit runtime frame. Do not replace it with a plain file input fallback; wire it only after the live-preview/report path has a runtime-backed Submodel preview pattern.

## Stop Conditions

Stop and report if:

- Attachment needs missing Foldkit file-drop APIs or a dependency that is not present locally.
- A target example depends on interactive behavior better handled by a later form, overlay, or collection slice.
- Converting an example requires component source changes outside docs/example wiring.
