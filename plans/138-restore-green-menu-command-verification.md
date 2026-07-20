# Plan 138: Restore green menu and command verification

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report; do not improvise. When done, update
> this plan's row in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 2fb34f0b..HEAD -- src/main.ts src/story.test.ts src/scene.test.ts .github/workflows/pages.yml`
> If these files changed, reproduce the two failures before editing and refresh
> the excerpts below if their cause moved.

## Status

- **Priority**: P0
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug, tests
- **Planned at**: commit `2fb34f0b`, 2026-07-19

## Why this matters

The latest `main` workflow and draft PR 4 both fail in the Vitest step, so all
later browser and code-quality checks are skipped. The failures are stale test
contracts, not product regressions: one Message fixture omits a newly required
field, and one Scene test does not resolve the focus Command produced by the
click it performs. Repairing these exact contracts restores a trustworthy CI
baseline for every open PR.

## Current state

- GitHub Actions run `29137233969` at `2fb34f0b` has a successful build,
  deployment, and public smoke job, but `verify` stops at `bun run test`.
- `src/main.ts:1005-1011` defines `UpdatedLiveExampleMenuOpen` with required
  `ancestorValues: S.Array(S.String)`.
- `src/story.test.ts:424-449` constructs that Message three times without
  `ancestorValues`, producing `Missing key at ["ancestorValues"]`.
- `src/main.ts:1301-1314` defines `FocusLiveExampleMenu`, which returns
  `CompletedFocusLiveExampleMenu()`.
- `src/scene.test.ts:1965-1991` clicks `Open Menu` and asserts the dialog, but
  does not resolve the resulting focus Command. Foldkit Scene correctly rejects
  the unresolved Command.
- The canonical Scene pattern is
  `Scene.Command.resolve(Definition, ResultMessage)`, for example
  `repos/foldkit/examples/kanban/src/scene.test.ts:52-55`.

## Commands you will need

| Purpose              | Command                                                                     | Expected on success                                |
| -------------------- | --------------------------------------------------------------------------- | -------------------------------------------------- |
| Reproduce            | `bun run test -- src/story.test.ts src/scene.test.ts`                       | exactly the two documented failures before the fix |
| Focused verification | `bun run test -- src/story.test.ts src/scene.test.ts`                       | 115 tests pass                                     |
| Full unit suite      | `bun run test`                                                              | all Vitest files pass                              |
| Browser suite        | `bun run test:e2e`                                                          | all Playwright tests pass                          |
| Quality              | `bun run check`                                                             | exit 0                                             |
| Diff                 | `git diff --check -- src/main.ts src/story.test.ts src/scene.test.ts plans` | exit 0                                             |

## Scope

**In scope**:

- `src/story.test.ts`
- `src/scene.test.ts`
- `src/main.ts`, only to export the existing `FocusLiveExampleMenu` definition
- `plans/README.md`

**Out of scope**:

- Changing menu, context-menu, dialog, or focus behavior.
- Swallowing or ignoring Commands in Scene.
- Making `ancestorValues` optional; it is required state-machine evidence.
- TypeScript gate redesign; Plan 139 owns that separate problem.

## Git workflow

- Branch: `codex/138-restore-green-verification`.
- Commit: `test: restore menu and command verification`.
- Do not push or open a PR unless the operator instructs it.

## Steps

### Step 1: Update the Message fixtures

Add `ancestorValues: []` to all three root-menu
`UpdatedLiveExampleMenuOpen(...)` calls in the named Story test. Do not add a
default to the schema and do not use a cast.

**Verify**: the Story failure is gone when running the focused command; the
Scene failure remains until Step 2.

### Step 2: Resolve the focus Command in Scene

Export the existing PascalCase `FocusLiveExampleMenu` definition from
`src/main.ts`. Import it in `src/scene.test.ts`, then place
`Scene.Command.resolve(FocusLiveExampleMenu, CompletedFocusLiveExampleMenu())`
immediately after the click that opens the command menu. Keep the visibility
assertion after the resolver.

**Verify**: the focused command reports 115 passing tests and no unresolved
Commands.

### Step 3: Restore the full verification lane

Run the full unit, browser, and quality commands. If browser output creates
ignored test artifacts, leave only standard ignored output; do not delete any
pre-existing user files.

**Verify**: every command in the table exits 0.

## Test plan

- The existing Story test continues to assert lock/unlock Command names for
  context-menu and dropdown root transitions.
- The existing Scene test continues to prove the dialog becomes visible after
  a real click and now models the focus side effect explicitly.
- No new behavior test is needed because the regressions are in existing tests.

## Done criteria

- [ ] `bun run test -- src/story.test.ts src/scene.test.ts` passes 115 tests.
- [ ] `bun run test`, `bun run test:e2e`, and `bun run check` exit 0.
- [ ] No production behavior changed beyond exporting an existing Command.
- [ ] No Command is ignored or resolved with an unrelated Message.
- [ ] Only in-scope files and the plan index changed.

## STOP conditions

- The focused failures no longer match the evidence above.
- Resolving the focus Command causes another Command or Mount to appear.
- A passing fix requires changing runtime menu/dialog behavior.
- Any full-suite failure is not reproducible on unchanged `main`.

## Maintenance notes

Whenever a Message schema gains a required field, update direct callable-schema
constructors in tests in the same commit. Scene interactions that emit Commands
must keep explicit resolvers; this is intentional proof of side-effect flow.
