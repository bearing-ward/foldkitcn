# Plan 141: Publish a root GitHub-source registry

> **Executor instructions**: Follow each gate in order. Preserve the existing
> Pages registry contract while adding the GitHub-source contract. Do not close
> issue 5 until the exact public shorthand command succeeds against merged
> `main`. Update `plans/README.md` after that smoke test.
>
> **Drift check (run first)**:
> `git diff --stat 0b10f9ec..HEAD -- README.md scripts/build-registry.ts scripts/check-registry.ts scripts/registry-common.ts scripts/registry-common.test.ts .github/workflows/pages.yml registry.json public/r`
> Baseline `0b10f9ec` includes Plan 140's generated Pages registry and runtime
> dependency fixes. Refresh all excerpts and tests if that baseline moves.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/140-finish-pr4-and-normalize-worktree.md`
- **Category**: bug, dx
- **Planned at**: commit `0b10f9ec`, 2026-07-20 (reconciled after Plan 140)
- **Execution**: merged locally into `main` at `cc0ea9e6`; blocked on push,
  merged-main smoke, and issue 5 closure

## Why this matters

README documents `bunx shadcn@latest add <owner>/<repo>/<item>`, but the public
default branch has no root `registry.json`. The exact command fails before it
can inspect an item, and GitHub issue 5 records the reproducible user-facing
defect. Foldkit CN intentionally supports both Pages namespace installation and
public GitHub-source discovery, so the generator must own two catalogs with the
correct dependency address syntax for each transport.

## Current state

- Issue: `https://github.com/bearing-ward/foldkitcn/issues/5`.
- `README.md:56-72` documents GitHub shorthand, list, search, view, validate,
  and dry-run commands that require a root registry.
- `scripts/build-registry.ts:15-19` builds one `PublicRegistryBuildResult` and
  writes it only through `writePublicRegistryArtifacts(...)`.
- `scripts/registry-common.ts:235-242` fixes the output root at `public/r`.
- `scripts/registry-common.ts:248-268` encodes local registry dependencies as
  `@foldkitcn/<name>`, which is correct for Pages namespace consumers.
- `public/r/registry.json` is already a complete shadcn registry catalog with
  embedded installable files. Copying it byte-for-byte to the root is not
  sufficient: a GitHub-source consumer without `@foldkitcn` configured would
  fail on namespaced dependencies.
- The vendored canonical shadcn documentation
  `repos/ui/apps/v4/content/docs/registry/github.mdx:370-404` requires
  same-repository dependencies to use explicit addresses such as
  `acme/ui/button`; bare names target a different registry.
- `.github/workflows/pages.yml:57-62` checks only `dist/r/*`; the post-deploy
  smoke checks only Pages URLs.
- `package.json:5-8` supplies the deterministic canonical repository URL
  `https://github.com/bearing-ward/foldkitcn.git`.

## Commands you will need

| Purpose               | Command                                                                       | Expected on success                                              |
| --------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Focused tests         | `bun run test -- scripts/registry-common.test.ts src/registry/schema.test.ts` | dual-catalog tests pass                                          |
| Generate              | `bun run registry:build`                                                      | writes current `registry.json`, `registry/**`, and `public/r/**` |
| Freshness             | `bun run registry:check`                                                      | root and Pages catalogs are current                              |
| Local validate        | `bunx shadcn@latest registry validate ./registry.json`                        | registry and item files validate                                 |
| Public GitHub install | `bunx shadcn@latest add bearing-ward/foldkitcn/shadcn-button --dry-run`       | succeeds against merged default branch                           |
| Full gates            | `bun run typecheck && bun run test && bun run check && bun run build`         | all exit 0                                                       |

## Scope

**In scope**:

- `scripts/build-registry.ts`
- `scripts/check-registry.ts`
- `scripts/registry-common.ts`
- `scripts/registry-common.test.ts`
- `src/registry/schema.test.ts` only if a catalog fixture must cover both forms
- Generated root `registry.json`
- Generated `registry/**` and `public/r/**` only when changed by the generator
- `README.md`
- `.github/workflows/pages.yml`
- `plans/README.md` only after the reviewer verdict or merged-main verification
- Preparing the merged-main verification and issue 5 close; performing those
  operator actions remains a post-merge handoff

**Out of scope**:

- Replacing the Pages namespace registry.
- Hand-editing generated JSON.
- Changing public item names or install targets.
- Treating bare dependency names as local; shadcn resolves them elsewhere.
- Changing component source or the local `foldkitcn` installer.

## Git workflow

- Branch: `codex/141-root-github-registry`.
- Commit: `fix(registry): publish GitHub source catalog`.
- Push/open a PR only when directed; closing issue 5 requires the merged public
  smoke and is therefore a post-merge action.
- The executor commits the locally reviewable implementation only. The advisor
  records approval separately from the final `DONE` state until the merged-main
  smoke succeeds and issue 5 is closed.

## Steps

### Step 1: Parameterize dependency addressing

Refactor public catalog construction around an explicit dependency-address
strategy, not an environment guess inside each item. Preserve the Pages
strategy `@foldkitcn/<public-name>`. Add a GitHub strategy that emits
`bearing-ward/foldkitcn/<public-name>` using the canonical repository slug
already derivable from package metadata/GitHub context. Both strategies must
reuse the same installable entry filtering, file rewriting, schema decode, and
catalog metadata.

**Verify**: focused tests prove the same item set and files in both catalogs,
with only local `registryDependencies` addresses differing.

### Step 2: Make generation and freshness own the root file

Extend the build command to write `registry.json` at repository root from the
GitHub strategy. Extend `registry:check` to fail when it is missing, stale, has
the wrong item set, or contains an `@foldkitcn/` dependency. Keep
`public/r/registry.json` and item files generated exactly as before.

**Verify**: after `registry:build`, `registry:check` exits 0; changing a root
dependency in a disposable copy makes the focused freshness test fail.

### Step 3: Validate both transports locally

Run the local validator against root `registry.json`. Add regression assertions
for `shadcn-button` and a dependency-bearing item: root dependencies are
GitHub-qualified, Pages dependencies are namespaced, and both include the same
source files/targets.

**Verify**: focused tests and local registry validation exit 0.

### Step 4: Add CI contract checks

In the build job, assert `registry.json` exists and validate it with the pinned
lockfile's shadcn CLI resolution. Keep existing `dist/r` assertions. Add or
document an operator-ready post-merge smoke that runs the documented GitHub
shorthand with `--dry-run` against the default branch; it must be
non-interactive and leave no tracked changes. If shadcn needs a configured
consumer project, add the smallest disposable fixture or report the exact STOP
condition.

**Verify**: PR checks validate the local root catalog; after merge, the smoke
job proves the remote shorthand.

### Step 5: Correct docs and close the issue

Replace placeholder GitHub commands in README with the real
`bearing-ward/foldkitcn` form where appropriate, while keeping generic syntax
explanations clear. Record the exact post-merge verification command in the
executor handoff. After the merged-main smoke passes, an operator comments on
issue 5 with the verifying run URL and closes it.

**Verify**: `gh issue view 5 --json state` reports `CLOSED`, and the close
comment links to a successful run rather than only a local check.

## Test plan

- Catalog unit tests compare root and Pages item identities, files, runtime
  packages, and transport-specific registry dependency addresses.
- Freshness tests cover missing/stale root output.
- CI validates the local root file on PRs and the real shorthand after merge.
- Full release gates protect existing Pages installation.

## Done criteria

- [x] Root `registry.json` is generator-owned and freshness-checked.
- [x] Root local dependencies use same-repository GitHub addresses.
- [x] Pages artifacts retain `@foldkitcn/*` dependencies.
- [ ] Local root validation, the existing Pages smoke, and the public GitHub
      shorthand smoke pass. Local validation passes; the merged-main shorthand
      smoke remains pending.
- [x] Full release gates pass.
- [ ] Issue 5 is closed with a successful merged-main run (post-merge operator
      action; keep this plan non-DONE until complete).

## Review outcome

The isolated implementation on `codex/141-root-github-registry` is approved at
`cc0ea9e6`. Independent review passed 1,040 unit tests, 33 focused registry and
schema tests, registry freshness, shadcn 4.13.1 validation of all 100 root
items, Ultracite, the production build, YAML parsing, transport parity, and
diff checks. A first review round corrected the post-deploy smoke to create a
disposable configured consumer outside the checkout; pre-merge proof reaches
the expected missing remote `registry.json` error without prompting.

Do not mark this plan `DONE` yet. The implementation is merged locally but has
not been published. After the commit reaches the remote default branch, require
the workflow's exact
`bunx shadcn@latest add bearing-ward/foldkitcn/shadcn-button --dry-run` smoke to
succeed, comment on issue 5 with the successful run URL, close it, then update
the plan index to `DONE`.

## STOP conditions

- Current shadcn CLI behavior differs from the vendored canonical tests.
- Same-repository dependency addresses cannot be derived deterministically.
- Supporting GitHub shorthand would require duplicating component source or
  changing install targets.
- The Pages namespace command regresses.
- The public shorthand cannot be made non-interactive in CI; report the exact
  missing project fixture instead of weakening the smoke.

## Maintenance notes

Every future registry generation change must update and compare both transports.
The root file and `public/r/registry.json` are siblings with different address
semantics, not independent hand-maintained catalogs.
