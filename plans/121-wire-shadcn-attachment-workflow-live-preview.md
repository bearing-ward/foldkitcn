# Plan 121: Wire shadcn Attachment workflow live preview

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the next
> step. If anything in the "STOP conditions" section occurs, stop and report; do
> not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
>
> ```bash
> git diff --stat a46f944d..HEAD -- src/live-examples.ts src/main.ts src/registry/shadcn/attachment registry-src/shadcn/attachment registry/docs/shadcn/attachment.json public tests/e2e tests/parity plans/README.md
> bun run docs:live-preview-gaps
> ```
>
> If Attachment no longer appears in the live-preview gap report, verify the page
> in the browser and mark this plan `REJECTED (fixed independently)` instead of
> reworking it. If Attachment still appears but the missing example is not
> `AttachmentWorkflowDemo`, update the current-state notes below before changing
> source.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/120-audit-complete-shadcn-ui-ux-parity.md
- **Category**: docs, tests
- **Planned at**: commit `a46f944d`, 2026-07-08

## Why this matters

Plan 120 found one remaining P2 shadcn Attachment docs disparity: the component
page renders one example card without `.live-example-preview`. The page is
usable, but complete origin parity requires example content and interaction to
match the origin docs wherever Foldkit can render the example live.

This is also the unresolved tail of earlier live-preview work. Plan 091 is still
blocked with `AttachmentWorkflowDemo needs runtime-backed FileDrop/Submodel
preview support`; this plan finishes that single known gap without widening into
chart, toast, or global docs-shell work.

## Current State

Plan 120 evidence:

- `plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md:50-61` reports
  `shadcn/attachment` has one static-status docs example.
- `plans/artifacts/120-shadcn-ui-ux-parity-audit/tooling/docs-live-preview-gaps.txt`
  reports `Cards missing .live-example-preview: 1` and `shadcn/attachment: 1`.
- Local screenshots for Attachment are under
  `plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/attachment/`.

Implementation evidence:

- `registry-src/shadcn/attachment/item.json:141-190` declares seven Attachment
  examples, including `AttachmentWorkflowDemo` at
  `src/registry/shadcn/attachment/workflow.ts`.
- `src/live-examples.ts:2966-2978` registers live-example entries for
  `AttachmentDemo`, `AttachmentGroupDemo`, `AttachmentImage`, `AttachmentSizes`,
  `AttachmentStates`, and `AttachmentTriggerDemo`, but not
  `AttachmentWorkflowDemo`.
- `src/registry/shadcn/attachment/workflow.ts:20-40` already defines a schema
  model with a `FileDrop.Model` and accepted files array.
- `src/registry/shadcn/attachment/workflow.ts:123-154` already defines the
  pure Foldkit update function and maps `FileDrop` child messages back to the
  parent workflow.
- `src/registry/shadcn/attachment/workflow.ts:161-210` renders the FileDrop
  label, hidden input, empty helper copy, and attachment rows.
- `src/registry/shadcn/attachment/workflow.ts:210` exports
  `AttachmentWorkflowDemo = (): Html => view(init())`, which gives docs/source
  a static render but does not give the live-example runtime a model/update
  loop.
- `tests/e2e/shadcn-surface-layout-regressions.test.ts:437-467` already covers
  the Attachment group preview containment. It does not assert the workflow
  preview exists or responds to file input.

## Scope

**In scope**:

- Wire `AttachmentWorkflowDemo` into the docs live-example registry.
- Preserve Foldkit architecture: state lives in a `Model`, messages describe
  facts, and file/drop side effects flow through the existing `FileDrop`
  submodel.
- Add a focused docs/e2e assertion that the workflow example renders as a live
  preview and can accept a file through Playwright's file input path.
- Run registry generation only if source registry metadata changes.
- Keep generated registry/public artifacts in sync if a registry build changes
  them.

**Out of scope**:

- Do not change Attachment row styling unless the live preview reveals an
  actual containment or parity defect.
- Do not change `FileDrop` behavior globally.
- Do not implement chart, toast, or docs-shell visual changes.
- Do not hand-edit generated registry files without running the generator that
  owns them.

## Commands You Will Need

| Purpose                      | Command                                                                                                             | Expected on success                                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| Check local drift            | `git status --short`                                                                                                | Existing unrelated drift may be present; this plan should touch only Attachment live-preview/source, generated registry artifacts if needed, tests, and the Plan 121 row |
| Confirm gap before changes   | `bun run docs:live-preview-gaps`                                                                                    | Reports one shadcn Attachment gap before the fix, unless fixed independently                                                                                             |
| Registry validation          | `bun run registry:check`                                                                                            | Exits 0                                                                                                                                                                  |
| Focused e2e                  | `bunx playwright test tests/e2e/docs.test.ts tests/e2e/shadcn-surface-layout-regressions.test.ts --grep "Attachment | live preview"`                                                                                                                                                           | Exits 0 after the new assertion lands |
| Full tests                   | `bun run test`                                                                                                      | Exits 0                                                                                                                                                                  |
| Typecheck                    | `bun run typecheck`                                                                                                 | Exits 0                                                                                                                                                                  |
| Lint/check                   | `bun run check`                                                                                                     | Exits 0                                                                                                                                                                  |
| Final live-preview inventory | `bun run docs:live-preview-gaps`                                                                                    | No longer reports `shadcn/attachment`; total missing count decreases by 1 unless other unrelated drift exists                                                            |

Use `bun run dev -- --host 127.0.0.1 --port 5173` only if browser verification
needs a local server and one is not already running.

## Steps

1. Reproduce the gap.
   - Run the drift commands above.
   - Open or inspect the current Attachment docs artifact to confirm the missing
     example is `AttachmentWorkflowDemo`.
   - If the current report points at a different example, update this plan's
     assumption in your execution notes before editing.

2. Add a live runtime entry for the workflow.
   - Import the workflow `Model`, `Message`, `init`, `update`, and `view`
     exports where the docs live-example registry expects stateful examples.
   - Register
     `liveExampleKey('shadcn/attachment', 'AttachmentWorkflowDemo')` in
     `src/live-examples.ts`.
   - Follow existing stateful live-example patterns in `src/live-examples.ts`;
     do not special-case raw DOM events or bypass the Foldkit update loop.
   - The accepted file flow should reach `GotFileDropMessage`, update
     `files`, and render an `AttachmentGroup` row.

3. Fix source metadata only if the status path requires it.
   - If the live-preview gap is caused by `previewStatus` metadata rather than
     only the missing renderer, add the missing preview metadata in
     `registry-src/shadcn/attachment/item.json` or the owning source docs file.
   - Run `bun run registry:build` only when source metadata changes.
   - Keep generated artifacts from `registry/` and `public/r/` in the same
     change if the generator updates them.

4. Add focused browser coverage.
   - Prefer extending `tests/e2e/docs.test.ts` if there is already a generic
     live-preview assertion helper.
   - Otherwise extend
     `tests/e2e/shadcn-surface-layout-regressions.test.ts` beside the existing
     Attachment containment assertions.
   - Assert the page exposes `AttachmentWorkflowDemo live preview`.
   - Use Playwright `setInputFiles` on the workflow file input to attach a small
     generated fixture file.
   - Assert the preview changes from the empty helper copy to an attachment row
     containing the uploaded file name and a readable size or type label.

5. Verify the gap is closed.
   - Run the focused e2e command.
   - Run `bun run docs:live-preview-gaps` and confirm Attachment is absent from
     the missing-card list.
   - Run `bun run registry:check`, `bun run test`, `bun run typecheck`, and
     `bun run check`.

6. Update plan status.
   - Mark Plan 121 `DONE` in `plans/README.md` only after all required checks
     pass.
   - If a pre-existing unrelated failure blocks the full suite, record the exact
     failing command and smallest focused passing checks in the status note.

## STOP Conditions

- Stop if the implementation requires changing the public `FileDrop` API or
  introducing imperative DOM/file handlers outside Foldkit messages and
  commands.
- Stop if the docs live-example runtime cannot host submodels without a broader
  architectural change; report the smallest missing runtime capability instead
  of patching around it.
- Stop if `AttachmentWorkflowDemo` already renders live and the remaining gap
  belongs to a different component or generated metadata drift.
- Stop if chart/toast or docs-shell visual work appears necessary to complete
  this plan; those are separate follow-ups.

## Acceptance Criteria

- `AttachmentWorkflowDemo` renders inside a `.live-example-preview` frame on
  `/components/shadcn/attachment`.
- A browser test proves the workflow preview accepts a file and renders an
  attachment row from live state.
- `bun run docs:live-preview-gaps` no longer reports `shadcn/attachment`.
- Registry validation, tests, typecheck, and check pass or any unrelated
  pre-existing failure is precisely documented.
