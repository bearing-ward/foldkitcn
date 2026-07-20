# Plan 142: Exclude vendored references from Dependabot updates

> **Executor instructions**: Do not merge the two open Dependabot PRs. This
> repository treats `repos/foldkit/` as read-only canonical evidence; dependency
> updates there belong upstream and arrive through an intentional subtree
> refresh. Add the narrow configuration first, then close only the exact PRs
> named below.
>
> **Drift check (run first)**:
> `gh pr list --state open --author app/dependabot --json number,title,files,url && test ! -f .github/dependabot.yml`
> If the PR numbers, paths, or config presence changed, stop and refresh the
> plan before any GitHub mutation.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx, dependencies
- **Planned at**: commit `2fb34f0b`, 2026-07-19

## Why this matters

Dependabot currently opens repository PRs against package manifests inside the
read-only Foldkit evidence subtree. Merging those changes makes the local
reference diverge from its upstream subtree commit and creates large lockfile
noise unrelated to Foldkit CN's runtime. The root Bun project should keep
security-update coverage, while `repos/**` must be excluded from automated
updates owned by this repository.

## Current state

- There is no `.github/dependabot.yml`.
- PR 2 updates nodemailer in
  `repos/foldkit/repos/effect-smol/ai-docs/package.json` and its pnpm lockfile.
- PR 3 updates undici only in
  `repos/foldkit/repos/effect-smol/pnpm-lock.yaml`.
- Root `package.json` and `bun.lock` do not declare nodemailer or undici.
- `AGENTS.md` says `repos/foldkit/` is the canonical live framework reference,
  should be read directly, and must never be imported from project source.
- Git history shows earlier automated vendored updates, including `d0f1ac7e`;
  do not revert them in this plan because a subtree refresh is the correct
  normalization boundary.
- GitHub's current Dependabot configuration supports `directory`/`directories`,
  `exclude-paths`, and `open-pull-requests-limit: 0`; the latter disables
  version-update PRs while allowing security-update customization for the
  configured ecosystem.

## Commands you will need

| Purpose            | Command                                                                         | Expected on success                   |
| ------------------ | ------------------------------------------------------------------------------- | ------------------------------------- |
| Inventory          | `gh pr list --state open --author app/dependabot --json number,title,files,url` | only PRs 2 and 3 at the planned paths |
| Config diff        | `git diff --check -- .github/dependabot.yml plans`                              | exit 0                                |
| Repo quality       | `bun run check`                                                                 | exit 0                                |
| Close PRs          | `gh pr close 2 --comment <reason>` and `gh pr close 3 --comment <reason>`       | both report closed                    |
| Final GitHub state | `gh pr list --state open --author app/dependabot`                               | no vendored-reference PRs             |

## Scope

**In scope**:

- New `.github/dependabot.yml`.
- Root npm/Bun dependency-update policy.
- Explicit exclusion of `repos/**`.
- Closing PRs 2 and 3 with a concise ownership explanation.
- `plans/README.md`.

**Out of scope**:

- Any edit under `repos/**`.
- Disabling Dependabot alerts or all root security updates.
- Reverting historical subtree commits.
- Updating any root dependency.
- Closing human-authored PRs or issues.

## Git workflow

- Branch: `codex/142-dependabot-vendored-exclusion`.
- Commit: `chore(deps): exclude vendored references from Dependabot`.
- Land the configuration before closing PRs so the reason is durable.

## Steps

### Step 1: Add a root-only npm configuration

Create `.github/dependabot.yml` with version 2 and one npm ecosystem entry for
the repository root. Use a low-noise schedule, set
`open-pull-requests-limit: 0` if only security PRs are desired, and add
`exclude-paths: ["repos/**"]`. Do not configure a target branch because GitHub
does not apply those settings to security updates on non-default branches.

Before committing, compare syntax with the current official GitHub Dependabot
options reference. Do not copy a config from the vendored repos.

**Verify**: the YAML names `/` as the maintained directory and contains the
explicit vendored exclusion.

### Step 2: Land and observe the configuration

Run `bun run check` and `git diff --check`. Open a small PR if repository policy
requires it, let GitHub parse the file, and confirm the Dependabot settings page
shows no configuration error.

**Verify**: the configuration is present on `main` and GitHub reports it valid.

### Step 3: Close only PRs 2 and 3

Re-read each PR's file list. Comment that the changed manifests are inside the
read-only Foldkit evidence subtree, upstream owns those updates, and a future
subtree refresh will carry accepted upstream fixes. Close without merging.

**Verify**: both PRs report `CLOSED`, not `MERGED`.

### Step 4: Confirm repository hygiene

List open PRs/issues, local branches, and worktrees. This plan should not create
or delete a worktree. Confirm no new Dependabot PR targets `repos/**` after the
next scheduled/security evaluation.

**Verify**: any remaining open Dependabot PR, if one appears later, touches only
the maintained root manifest/lockfile; otherwise reopen this plan with evidence.

## Test plan

- Configuration is validated by GitHub after landing.
- `bun run check` and diff checks guard repository formatting.
- GitHub PR file inventories prove only the intended bot PRs were closed.

## Done criteria

- [ ] Dependabot config maintains root npm dependencies and excludes `repos/**`.
- [ ] Root security updates remain enabled.
- [ ] PRs 2 and 3 are closed without merge.
- [ ] No file under `repos/**` changed.
- [ ] No unrelated PR, branch, worktree, issue, or stash changed.

## STOP conditions

- Either PR touches a root or non-vendored file.
- GitHub rejects `exclude-paths` for the configured ecosystem/security mode.
- The only available configuration disables all root security alerts.
- A maintainer has taken ownership of either PR since the drift check.

## Maintenance notes

When `repos/foldkit` is intentionally refreshed, review upstream dependency
updates as part of the subtree diff. Do not let bot PRs incrementally rewrite
the evidence subtree between refreshes.
