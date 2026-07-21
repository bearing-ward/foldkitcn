# Plan 140: Prepare PR 4 for merge and normalize it after operator approval

> **Executor instructions**: This plan has two boundaries. The `improve execute`
> executor may prepare and verify the local PR branch in its dedicated worktree.
> It must not push, edit the GitHub pull request, merge, or delete the branch or
> worktree. Those external/destructive actions remain an operator handoff. Resolve
> every target with read-only checks before rewriting local history, preserve dirty
> work, and stop on any mismatch. Skip `plans/README.md`; the reviewer owns it.
>
> **Drift check (run first)**:
> `git rev-list --left-right --count codex/139-bounded-typecheck...codex/registry-runtime-dependencies && git rev-parse origin/codex/registry-runtime-dependencies && gh pr view 4 --json state,isDraft,mergeable,headRefName,baseRefName,files,statusCheckRollup`
> Expected after the first safe execution stop on 2026-07-20: `0 0`; the local
> branch is at `cf66ea7c`; the unchanged remote is at `17ba2e36`; and PR 4 is
> open, draft, conflicting, with its original 13-file diff.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: `plans/138-restore-green-menu-command-verification.md`,
  `plans/139-reestablish-bounded-typescript-verification.md`
- **Category**: tech-debt, dx
- **Planned at**: reconciled against `main` commit `1386bb1e`, 2026-07-20
- **Completed at**: PR 4 merge commit `dcda1faa`, 2026-07-20

## Why this matters

Draft PR 4 contains a valid registry dependency-lane fix, but it is based on the
old `2fb34f0b` baseline and also contains an unrelated Jot/Virtual List plan. The
approved verification repairs now live on `codex/139-bounded-typecheck` at
`cf66ea7c`, which includes Plan 138 at `6bf6eb69`. Replaying only the registry
patch on that approved dependency tip prepares a reviewable PR branch without
publishing unreviewed history or deleting recoverable work.

## Current state

- PR 4: `https://github.com/bearing-ward/foldkitcn/pull/4`, open, draft,
  conflicting, head `codex/registry-runtime-dependencies`, base `main`.
- Worktree:
  `/Volumes/Sync/Development/Bearing-Ward/projects/worktrees/foldkitcn-registry-runtime-dependencies`.
- The worktree is clean. Its local branch is at `cf66ea7c`; its unchanged remote
  tracking branch remains at the recoverable original tip `17ba2e36`.
- Commit `f8f355b5` changes the registry schema, validation, dependency
  generation, shadcn Input manifest, tests, ADR, and generated artifacts so
  docs-only example dependencies do not expand install closure.
- Commit `17ba2e36` adds `plans/137-plan-virtual-list-registry-bridge.md` and an
  index row. This is unrelated to PR 4 and must not survive the prepared branch.
- `main` is one commit ahead of the old branch base. Plans 138 and 139 are DONE
  in isolated branches but are not yet reachable from `main`.
- The prepared local branch must be based on `cf66ea7c` and contain one
  semantically equivalent replay of `f8f355b5`. A direct cherry-pick was safely
  aborted because Plan 139 had refreshed two generated aggregate indexes.

## Commands you will need

| Purpose        | Command                                                                                                       | Expected on success                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Ownership      | `git worktree list --porcelain`                                                                               | exact branch/path pair above                            |
| Cleanliness    | `git -C <worktree> status --short --branch`                                                                   | no file entries                                         |
| Dependency tip | `git rev-parse codex/139-bounded-typecheck`                                                                   | `cf66ea7c109b11b3154249f141e4fd1933b2aa78`              |
| Dependencies   | `bun install --frozen-lockfile`                                                                               | install matches Plan 139's lockfile without changing it |
| Focused tests  | `bun run test -- scripts/registry-common.test.ts src/registry/schema.test.ts src/registry/validation.test.ts` | all focused tests pass                                  |
| Registry       | `bun run registry:check`                                                                                      | 103 manifests valid; generated artifacts current        |
| Typecheck      | `bun run typecheck`                                                                                           | exit 0 under Plan 139's bounded gate                    |
| Full tests     | `bun run test`                                                                                                | exit 0                                                  |
| Build          | `bun run build`                                                                                               | exit 0                                                  |
| Browser tests  | `bun run test:e2e`                                                                                            | exit 0                                                  |
| Quality        | `bun run check`                                                                                               | exit 0                                                  |

## Scope

**In scope**:

- The existing local PR 4 branch and dedicated worktree.
- Recording the original tip `17ba2e36` in the execution report.
- Rewriting the clean local branch onto `cf66ea7c` and replaying only the patch
  from `f8f355b5`.
- The 11 registry, ADR, test, and generated files from `f8f355b5`.
- Local verification and a proposed replacement PR validation summary in NOTES.

**Out of scope for this execution**:

- Pushing or force-pushing any branch.
- Editing PR 4 title, body, or draft state.
- Merging or closing PR 4.
- Deleting any worktree, branch, tag, stash, or untracked file.
- Implementing or relocating Virtual List work.
- Editing registry behavior beyond the patch-equivalent `f8f355b5` change.

## Git workflow

- Keep branch name `codex/registry-runtime-dependencies`.
- Continue only after confirming the worktree is clean, the local tip is exactly
  `cf66ea7c`, and the remote tip is still exactly `17ba2e36`.
- Record `17ba2e36dc939c937d6861924c99da47f8a08345` as the recoverable old tip; the
  unchanged remote ref remains the recovery point during local preparation.
- Replay the reviewed patch for only the six human-authored files listed in Step
  2, then regenerate the five derived artifacts from the current generator. Do
  not hand-resolve or reuse stale generated JSON from `f8f355b5`.
- Do not push. The reviewer will hand the prepared branch and exact follow-up
  commands to the operator after independent verification.

## Steps

### Step 1: Revalidate ownership, cleanliness, ancestry, and patch scope

Run the drift check, worktree inventory, status, branch/remote tip checks, and
full `git show f8f355b5`. Confirm there are no secrets, unrelated hunks, local
modifications, or unexpected commits. Confirm the six-file human-authored patch
passes `git apply --check` against `cf66ea7c`.

**Verify**: the dedicated worktree is clean, the local/dependency tips equal
`cf66ea7c`, the remote equals `17ba2e36`, and the scoped patch applies cleanly.

### Step 2: Prepare the local branch on the approved dependency tip

Record the old tip in NOTES. Apply the exact `f8f355b5^..f8f355b5` patch for
these six human-authored files only:

- `docs/decisions/0001-foldkit-registry-architecture.md`
- `registry-src/shadcn/input/item.json`
- `scripts/registry-common.test.ts`
- `scripts/registry-common.ts`
- `src/registry/schema.ts`
- `src/registry/validation.ts`

Run `bun run registry:build` so the current generator produces the five derived
JSON artifacts. Compare stable patch IDs for the six-file original and replayed
human-authored diffs, inspect every resulting hunk, and confirm the total diff
contains exactly the original 11 paths. Commit with subject
`fix(registry): separate example-only dependencies`.

**Verify**: `git rev-list --left-right --count codex/139-bounded-typecheck...HEAD`
prints `0 1`; the six-file stable patch IDs match; generated artifacts pass
freshness validation; and the worktree is clean.

### Step 3: Run all local acceptance gates

The reused PR worktree predates Plan 139's `@effect/platform-node` dependency.
Run `bun install --frozen-lockfile` first and confirm neither `package.json` nor
`bun.lock` changes. Then run focused tests, registry freshness, canonical bounded
typecheck, full unit tests, production build, the complete Playwright suite,
Ultracite, and `git diff --check`. Rerun a failing command once only when the
failure is clearly transient; otherwise STOP after recording exact evidence.

**Verify**: every command exits 0. Draft a replacement PR validation section in
NOTES that names only commands actually run and outcomes actually observed.

### Step 4: Stop at the operator handoff boundary

Do not push or mutate GitHub. Report the new local tip, the unchanged recovery
tip, the exact 11-file diff, all gate results, and the proposed PR validation
summary.

**Verify**: `origin/codex/registry-runtime-dependencies` still points to
`17ba2e36`, PR 4 is still draft/open, and no branch or worktree was deleted.

## Local preparation done criteria

- [x] The local PR branch is based on `cf66ea7c` with exactly one semantically
      equivalent replay of `f8f355b5`: the human-authored patch ID matches and the
      generated outputs are current.
- [x] Plan 137 and its README row are absent from the dependency-relative diff.
- [x] Exactly the 11 intended registry/ADR/test/generated files changed.
- [x] Every local acceptance gate passes.
- [x] The remote branch and PR are unchanged.

## Local execution outcome

**APPROVED on 2026-07-20** at
`c1530bc341e1f990e89d20f7c75593618a61b1fd` in the dedicated PR worktree.
Independent review confirmed matching authored-file patch IDs, exactly 11
dependency-relative paths, 50 focused tests, 103 current manifests, canonical
bounded typechecking, 1,035 unit tests, a 542-module production build, 344
Playwright tests, Ultracite across 1,295 files, and clean diff checks. The
unchanged remote recovery tip remains `17ba2e36`; PR 4 remains open, draft, and
conflicting until its dependency branches are merged and the prepared history
is explicitly published.

## Operator execution outcome

DONE on 2026-07-20. Plans 138 and 139 were merged into `main` by `22502d93`
and `f0ecbf83`. The registry patch was rebased onto the published dependency
chain as `f3ed5732`, force-pushed with an exact lease, reviewed as an 11-file
diff, marked ready, and merged through PR 4 by `dcda1faa` after the configured
required `build` check passed.

The operator also corrected base-branch CI defects exposed by the fresh runs:
parity contract decoding in `ca4f9338`, the bounded shard-coverage test budget
in `7d3ab26`, and cross-platform browser geometry guards in `013b2fac`. The
exact registry commit is an ancestor of refreshed `origin/main`; the remote PR
branch is gone; and the clean PR, Plan 138, and Plan 139 worktrees and local
branches were removed. The independent, unmerged Plan 142 worktree and branch
remain at `135a3fc2`.

## Operator completion criteria

Completed with operator approval on 2026-07-20:

- [x] Merge Plans 138 and 139 so `cf66ea7c` is reachable from `origin/main`.
- [x] Force-push the prepared PR branch with `--force-with-lease`.
- [x] Update PR 4 validation text, mark it ready, and wait for required checks.
- [x] Merge PR 4 through GitHub without bypassing protection.
- [x] Prove the registry commit is reachable from refreshed `origin/main`.
- [x] Remove only the clean merged PR worktree and local/remote branch.

## STOP conditions

- The worktree is dirty, its local tip differs from `cf66ea7c`, its remote tip
  differs from `17ba2e36`, or branch/path ownership differs from the recorded
  pair.
- `codex/139-bounded-typecheck` does not resolve to `cf66ea7c`.
- The scoped human-authored patch fails `git apply --check` or its stable patch
  ID changes after application.
- Registry regeneration changes a path outside the original 11-file scope.
- Any file outside the 11-file registry change appears in the
  dependency-relative diff.
- A local acceptance gate fails twice or reveals a non-transient regression.
- Frozen dependency installation changes `package.json` or `bun.lock`.
- Any step would require a push, GitHub mutation, merge, or deletion.

## Maintenance notes

Reviewers should verify that `dependencies.examples` remains visible to docs
while only `dependencies.registry` expands installation closure. The cleanup
proof for this completed plan is the registry commit's ancestry from
`origin/main`, the absent remote PR branch, and the preserved Plan 142 worktree.
