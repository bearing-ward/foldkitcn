# Plan 140: Finish PR 4 and normalize its branch and worktree

> **Executor instructions**: This plan changes GitHub and git state. Resolve
> every target with read-only checks before rewriting, merging, or deleting it.
> Preserve any dirty work and stop on a mismatch. Update `plans/README.md` only
> after the pull request is merged and cleanup is verified.
>
> **Drift check (run first)**:
> `git rev-list --left-right --count main...codex/registry-runtime-dependencies && git cherry -v main codex/registry-runtime-dependencies && gh pr view 4 --json state,isDraft,headRefName,baseRefName,files,statusCheckRollup`
> Expected at planning time: `main` is 0 commits ahead of the branch base, the
> branch has commits `f8f355b5` and `17ba2e36`, and PR 4 is open/draft.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: `plans/138-restore-green-menu-command-verification.md`, `plans/139-reestablish-bounded-typescript-verification.md`
- **Category**: tech-debt, dx
- **Planned at**: commit `2fb34f0b`, 2026-07-19

## Why this matters

Draft PR 4 contains a valid registry fix and a clean dedicated worktree, but it
is blocked by the red mainline verification baseline and includes an unrelated
Jot/Virtual List plan. The branch is not stale work to delete: its focused 50
registry tests and registry freshness check pass. Finish the bounded registry
change, merge it through the PR, then remove exactly its branch and worktree.

## Current state

- PR 4: `https://github.com/bearing-ward/foldkitcn/pull/4`, draft, mergeable,
  head `codex/registry-runtime-dependencies`.
- Worktree:
  `/Volumes/Sync/Development/Bearing-Ward/projects/worktrees/foldkitcn-registry-runtime-dependencies`.
- The worktree is clean and tracks
  `origin/codex/registry-runtime-dependencies`.
- Commit `f8f355b5` changes the registry schema, validation, dependency
  generation, shadcn Input manifest, tests, ADR, and generated artifacts so
  docs-only example dependencies do not expand install closure.
- Commit `17ba2e36` adds `plans/137-plan-virtual-list-registry-bridge.md` and an
  index row. This downstream Jot question is unrelated to PR 4 and is rejected
  in the canonical plan index.
- `git diff main...codex/registry-runtime-dependencies` currently contains 13
  files; removing Plan 137 should leave the 11 files from `f8f355b5`.

## Commands you will need

| Purpose       | Command                                                                                                       | Expected on success                              |
| ------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Ownership     | `git worktree list --porcelain`                                                                               | exact branch/path pair above                     |
| Cleanliness   | `git -C <worktree> status --short --branch`                                                                   | no file entries                                  |
| Patch proof   | `git cherry -v main codex/registry-runtime-dependencies`                                                      | only intended unmerged commits                   |
| Focused tests | `bun run test -- scripts/registry-common.test.ts src/registry/schema.test.ts src/registry/validation.test.ts` | 50 tests pass                                    |
| Registry      | `bun run registry:check`                                                                                      | 103 manifests valid; generated artifacts current |
| Typecheck     | `bun run typecheck`                                                                                           | exit 0 under Plan 139's bounded gate             |
| Full tests    | `bun run test`                                                                                                | exit 0                                           |
| Quality       | `bun run check`                                                                                               | exit 0                                           |
| PR checks     | `gh pr checks 4 --watch`                                                                                      | every required check passes                      |

## Scope

**In scope**:

- The existing PR 4 branch and worktree.
- Removing branch-only Plan 137 from the PR diff.
- The 11 registry/ADR/generated files already in commit `f8f355b5`.
- PR 4 title/body/draft state and final merge.
- Post-merge deletion of the exact worktree and local/remote PR branch.

**Out of scope**:

- Implementing or relocating Virtual List work.
- Editing registry behavior beyond the reviewed dependency-lane diff.
- Force-pushing without `--force-with-lease`.
- Deleting any other worktree, branch, stash, or untracked file.
- Merging while required checks are red.

## Git workflow

- Keep branch name `codex/registry-runtime-dependencies`.
- Rewrite only the clean branch to remove `17ba2e36`; preserve `f8f355b5`.
- Push rewritten history only with `--force-with-lease`.
- Use the repository's PR merge policy; do not bypass branch protection.

## Steps

### Step 1: Revalidate the worktree and patch

Run ownership, cleanliness, ancestry, `git cherry`, and `git diff --stat`
checks. Open every diff hunk. Confirm generated artifacts match their generator
and no secret or unrelated file is present.

**Verify**: the worktree is clean and the only commits are the two named above.

### Step 2: Remove the unrelated planning commit

From the dedicated worktree, move the branch tip back to `f8f355b5` using a
history-editing method that preserves a clean worktree. Before the operation,
create a recoverable tag or record the old SHA in the execution notes. Confirm
`plans/137-*` and its README row disappear from the PR diff, then push with
`--force-with-lease`.

**Verify**: `git diff --name-status main...HEAD` lists exactly the 11 files from
the registry commit and `gh pr view 4 --json files` agrees after GitHub updates.

### Step 3: Re-run all acceptance gates

Run focused tests, registry check, canonical typecheck, full unit tests, and
Ultracite in the PR worktree. Update the PR body so validation claims exactly
match the commands run. Mark the PR ready for review.

**Verify**: local commands exit 0 and `gh pr checks 4 --watch` is green.

### Step 4: Merge through GitHub

Merge PR 4 only after required checks pass. Record the merge commit SHA and
confirm `git merge-base --is-ancestor f8f355b5 origin/main` after refreshing
remote refs.

**Verify**: `gh pr view 4 --json state,mergedAt,mergeCommit` reports `MERGED`.

### Step 5: Remove only the merged worktree and branch

Confirm the worktree is still clean and its commit is reachable from updated
`main`. Remove the exact worktree path, delete the local branch with `git branch
-d`, prune worktree metadata, and delete the remote branch if GitHub did not.

**Verify**:

- `git worktree list --porcelain` lists only the canonical `main` worktree.
- `git branch --format='%(refname:short)'` lists only `main`.
- `gh pr list --state open --head codex/registry-runtime-dependencies` is empty.
- `git status --short --branch` on main preserves any unrelated user changes.

## Done criteria

- [ ] PR 4 contains only the registry dependency-lane change.
- [ ] All local and GitHub gates pass.
- [ ] PR 4 is merged, not closed with unmerged valuable work.
- [ ] The exact PR worktree and local/remote branch are gone.
- [ ] No other git state or user file changed.

## STOP conditions

- The worktree is dirty or branch ancestry differs from the drift check.
- Any registry hunk cannot be traced to `f8f355b5` and the PR purpose.
- Plan 138 or 139 is not DONE.
- A required check fails twice after a normal rerun.
- The PR cannot merge without bypassing protection or discarding review state.
- The branch is not proven reachable from `main` before cleanup.

## Maintenance notes

Reviewers should verify that `dependencies.examples` remains visible to docs
while only `dependencies.registry` expands installation closure. Future cleanup
passes must continue pairing ancestry checks with worktree ownership.
