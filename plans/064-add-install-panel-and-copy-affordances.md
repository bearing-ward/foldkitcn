<!-- prettier-ignore-start -->
<!-- Generated improve plan: preserve command tables and source excerpts literally. -->

# Plan 064: Add lifecycle-aware install panels and copy buttons

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat f3617d28..HEAD -- src registry/docs registry/index.json registry-src/shadcn/button/item.json repos/foldkit/packages/website/src/view/codeBlock.ts repos/foldkit/packages/website/src/main.ts docs/decisions/0002-foldkit-cn-documentation-site.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/062-replace-starter-app-with-docs-shell.md, plans/063-add-component-docs-sidecar-and-button-page.md
- **Category**: docs
- **Planned at**: commit `f3617d28`, 2026-06-27

## Why this matters

Every component page should teach the user's action: install the component into
their app, then import it from a namespaced local path. The actual installer is
a separate product surface, but the docs site needs the display contract now so
availability states are honest from day one. Copy buttons are table stakes for a
shadcn-like docs workflow.

## Current state

- `registry-src/shadcn/button/item.json` marks Button installable.
- The agreed command display is native first: `bunx foldkitcn add shadcn/button`.
- The agreed default copied path is `src/components/foldkitcn/shadcn/button.ts`.
- Displayed snippets may assume `@/` as the default alias while Registry/CLI docs
  explain the physical path.
- The Foldkit website has a working copy-snippet pattern that uses Messages,
  Commands, and copied-snippet state.

Relevant excerpts:

```json
registry-src/shadcn/button/item.json:247-252
"lifecycle": {
  "implementationStatus": "implemented",
  "parityStatus": "accepted",
  "driftStatus": "current",
  "availability": "installable"
}

repos/foldkit/packages/website/src/view/codeBlock.ts:12-20
const copyButtonWithIndicator = (
  textToCopy: string,
  ariaLabel: string,
  copiedSnippets: CopiedSnippets,
  positionClass = 'top-2 right-2',
) => {
  const h = html<Message>()
  const isCopied = HashSet.has(copiedSnippets, textToCopy)

repos/foldkit/packages/website/src/main.ts:1208-1219
const CopySnippet = Command.define(
  'CopySnippet',
  { text: S.String },
  SucceededCopySnippet,
  FailedCopySnippet,
)(...)
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Targeted tests | `bun run test -- src/story.test.ts src/scene.test.ts` | all pass |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Build | `bun run build` | exit 0 |
| Browser smoke | `bunx playwright test` if Playwright tests exist after this plan | exit 0; otherwise document not applicable |
| Whitespace | `git diff --check -- src registry/docs plans` | exit 0 |

## Scope

**In scope**:

- docs site Model/Message/update/view files under `src/**`
- component detail page view helpers under `src/**`
- `src/story.test.ts`
- `src/scene.test.ts`
- optional Playwright e2e test file if the repo already has e2e structure after
  plan 062
- `plans/README.md` status row update

**Out of scope**:

- Do not implement `foldkitcn add`.
- Do not mutate user projects or write installer files.
- Do not add package-manager tabs. One canonical Bun command is enough.
- Do not add live examples.
- Do not change registry item availability.

## Git workflow

- Branch: `codex/064-install-panel-copy`
- Commit after install panel behavior and tests pass.
- Do not push or open a PR unless the operator explicitly instructs it.

## Steps

### Step 1: Add install metadata rendering

Render an install panel on component pages from generated docs artifact fields:

- `installable`: show enabled command `bunx foldkitcn add <itemId>`.
- `preview`: show the same command only if the docs artifact explicitly marks
  preview install allowed; otherwise show preview status and no command.
- `private`: do not show in public nav; if directly routed, explain private
  availability.
- `planned` or blocked rows without registry items: roadmap/progress only.

For `shadcn/button`, show:

```bash
bunx foldkitcn add shadcn/button
```

**Verify**: `bun run test -- src/scene.test.ts` -> tests assert Button shows the install command and a non-installable fixture/page does not show an enabled command.

### Step 2: Add import snippet rendering

Render a usage/import snippet using the copied-registry import contract:

```ts
import { Button } from '@/components/foldkitcn/shadcn/button'
```

The Registry/CLI page should state the default physical path:

```text
src/components/foldkitcn/shadcn/button.ts
```

Do not show source-relative repo paths such as
`src/registry/shadcn/button/index.ts` in user-facing usage snippets.

**Verify**: `bun run test -- src/scene.test.ts` -> tests assert the Button page includes the alias import and does not include `src/registry/shadcn/button/index.ts` in the user usage section.

### Step 3: Add copy button state and commands

Add Foldkit Messages and Commands for copying snippets, following the Foldkit
website's `ClickedCopySnippet`, `SucceededCopySnippet`, `FailedCopySnippet`,
and `HidCopiedIndicator` pattern. Use Effect commands that catch failures and
return a failure message; do not call `navigator.clipboard.writeText` directly
from view code.

Use HashSet or a similar Schema-backed model field to track copied snippets if
that fits local conventions. If HashSet is awkward in the app Model schema, use
a Schema-backed `ReadonlyArray<string>` and `Array` helpers.

**Verify**: `bun run test -- src/story.test.ts` -> Story tests cover click copy,
success, failure, and hide indicator transitions.

### Step 4: Add accessible copy controls

Copy buttons must have meaningful `aria-label` values and a polite live region
for "Copied to clipboard". Render the button as an icon button or compact
symbolic control, not a large text button.

**Verify**: `bun run test -- src/scene.test.ts` -> Scene tests find copy buttons
by accessible name and assert copied status is announced after the success
message path.

### Step 5: Update the plan index

Mark plan 064 as DONE in `plans/README.md` when complete, unless a reviewer owns
the index.

**Verify**: `rg -n "\\| 064 \\| Add lifecycle-aware install panels and copy buttons \\| P1 \\| M \\| 062, 063 \\| DONE \\|" plans/README.md` -> exit 0.

## Test plan

- Story tests for copy command messages and copied indicator timeout.
- Scene tests for installable, preview/private/unavailable display states.
- Scene tests for Button install command and import snippet.
- Browser smoke for clipboard click if Playwright exists; if not, Scene plus
  Story coverage is acceptable for this plan.

## Done criteria

- [ ] Button page shows `bunx foldkitcn add shadcn/button`.
- [ ] User snippets use `@/components/foldkitcn/...`, not repo source paths.
- [ ] Non-installable availability disables or removes install commands.
- [ ] Copy controls have accessible names and copied-state feedback.
- [ ] Clipboard work is modeled with Messages and Commands.
- [ ] `bun run test`, `bun run typecheck`, `bun run check`, `bun run build`, and
  `git diff --check -- src registry/docs plans` exit 0.

## STOP conditions

Stop and report back if:

- The docs artifact from plan 061 does not include enough install/import data.
- Copy behavior appears to require imperative event handlers outside Foldkit
  update/Command flow.
- Implementing this starts to require the real installer.
- Clipboard browser APIs are unavailable in the current test environment and no
  local Foldkit website pattern can be adapted.

## Maintenance notes

This plan defines the public install/import display contract. Reviewers should
make sure it remains explicitly separate from the actual installer
implementation and that availability states are generated from registry data.

<!-- prettier-ignore-end -->
