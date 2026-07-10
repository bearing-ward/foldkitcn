# Plan 126: Enforce registry freshness and browser parity in continuous integration

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
>
> ```bash
> git diff --stat 9bce8e51..HEAD -- package.json .github/workflows/pages.yml registry public/r docs/component-conversion-checklist.md plans/README.md
> ```
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts below against the live files. Stop and report if
> the gate shape is materially different.

## Status

- **Priority**: P0
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: tests, dx
- **Planned at**: commit `9bce8e51`, 2026-07-09

## Why this matters

Foldkit CN promises origin-faithful UI and UX, but its two strongest release
contracts are currently disconnected from the deploy workflow. The checked-in
registry is stale in a clean worktree, causing `bun run registry:check` to
fail, and the Pages workflow installs Playwright Chromium without ever running
the browser suite. This means a source/generated artifact mismatch blocks
release, while a browser-visible overlay, focus, responsiveness, or live-demo
regression can still merge and deploy.

After this plan, the committed registry artifacts must be current and the same
CI job that deploys Pages must execute the maintained Playwright suite through
a first-class package script. The plan does not loosen registry validation or
replace browser tests with snapshots.

## Current state

- `package.json` defines `test` as `vitest run` and has no `test:e2e` script.
- `bunfig.toml:3-9` excludes `tests/e2e/**` from Bun's test discovery, so
  `bun run test` cannot execute Playwright tests.
- `.github/workflows/pages.yml:39-54` installs Chromium, then runs
  `registry:check`, typecheck, Vitest, and Ultracite, but omits
  `playwright test`.
- `scripts/check-registry.ts:4-11` invokes
  `checkRegistryIndexCurrent('registry/index.json')`; the current command
  fails with `registry/index.json is stale; run bun run registry:build`.
- `scripts/registry-common.ts:1486-1508` correctly computes the expected
  index and checks the generated docs/public artifacts. Keep that strict
  contract; do not weaken it to make CI green.
- `playwright.config.ts:14-20` is already the canonical browser entrypoint.
  It builds, prerenders, creates Pagefind output, and serves the result before
  executing every file under `tests/e2e`.
- A local run of `bunx playwright test --reporter=line` passes 33 tests on the
  current checkout. The browser gate is viable; its omission is workflow
  wiring, not a missing test suite.

Relevant architecture constraints:

- ADR 0001 requires generated/public output to remain derived from
  `registry-src`; do not hand-edit `registry/` or `public/r/`.
- The docs product surface is browser-visible behavior. Preserve the existing
  Playwright build/prerender path rather than testing a dev-only server.
- Existing plans use `bun`, Effect-native scripts, and Ultracite; do not add a
  second package manager, test runner, or CI service.

## Commands you will need

| Purpose                   | Command                  | Expected on success                                  |
| ------------------------- | ------------------------ | ---------------------------------------------------- |
| Check generated artifacts | `bun run registry:check` | exits 0; reports the index and checklist are current |
| Regenerate registry       | `bun run registry:build` | exits 0; only generator-owned artifacts change       |
| Unit suite                | `bun run test`           | exits 0                                              |
| Browser suite             | `bun run test:e2e`       | exits 0; Playwright runs all E2E tests               |
| Typecheck                 | `bun run typecheck`      | exits 0                                              |
| Code quality              | `bun run check`          | exits 0                                              |

## Scope

**In scope**:

- `package.json`
- `.github/workflows/pages.yml`
- Generator-owned artifacts updated by `bun run registry:build` under
  `registry/`, `public/r/`, and `docs/component-conversion-checklist.*`
- A focused CI/workflow regression test only if the repository already has a
  suitable test location for workflow/package-script assertions.
- `plans/README.md` status row

**Out of scope**:

- Component implementation, CSS, previews, or parity fixture behavior.
- Changing `scripts/check-registry.ts` or loosening any current-artifact
  comparison.
- Rewriting the Playwright suite, changing its browser/project matrix, or
  adding screenshot upload infrastructure not already supported by the
  workflow.
- Chart implementation and the deprecated shadcn Toast surface.

## Git workflow

- Branch: `codex/126-enforce-registry-and-browser-parity-gates`.
- Commit style: match recent history, e.g. `fix: ...` or `test: ...`.
- Do not push or open a pull request unless the operator asks.

## Steps

### Step 1: Reproduce and classify registry drift

Run `git status --short`, then run `bun run registry:check`. Confirm the
failure is the stale generated index/artifact contract, not invalid source
manifest data. Run `bun run registry:build` once and inspect `git diff --stat`
plus the changed paths.

Accept only generator-owned changes under `registry/`, `public/r/`, and
`docs/component-conversion-checklist.*`. Do not hand-edit any generated file.

**Verify**: `bun run registry:check` exits 0 after the generator run and
`git diff --name-only` contains no non-generator source paths from this step.

### Step 2: Add a first-class browser test command

In `package.json`, add `test:e2e` pointing to the existing Playwright runner:

```json
"test:e2e": "playwright test"
```

Keep `test` as the fast Vitest suite. Do not fold E2E into `test`: local
contributors need a clear fast/unit gate and an explicit browser gate.

**Verify**: `bun run test:e2e` starts the configured build/prerender/preview
server and exits 0 after every `tests/e2e` test passes.

### Step 3: Require the browser suite in the Pages workflow

In `.github/workflows/pages.yml`, add a named `Browser parity tests` step that
runs `bun run test:e2e` after the existing unit test step and before the
production Pages build/deploy steps. Reuse the existing Chromium installation;
do not install it twice.

Keep registry validation before browser testing so stale generated docs fail
with the faster, clearer error. Keep typecheck and Ultracite checks intact.

**Verify**: inspect the workflow to confirm the ordered sequence is
`registry:check` → `typecheck` → `test` → `test:e2e` → `check` → Pages build,
with exactly one Chromium install step.

### Step 4: Run the release-equivalent local gates

Run the registry check, unit suite, browser suite, typecheck, and Ultracite
check. The browser command may create `test-results/`; remove only that
test-runner output if it is untracked and was created by this verification.

**Verify**: every command in the table exits 0 and `git status --short`
contains only the planned source/workflow/generated-artifact changes.

### Step 5: Update plan status

Mark Plan 126 `DONE` only after all gates pass. If a failure is unrelated,
record the exact command and output summary in the status cell instead of
marking the plan complete.

## Test plan

- `bun run registry:check` proves checked-in generated artifacts match source.
- `bun run test:e2e` proves the package command reaches the canonical
  Playwright configuration and exercises real built/prerendered docs.
- The Pages workflow review proves CI invokes the same browser command after
  installing Chromium.
- Run `bun run test`, `bun run typecheck`, and `bun run check` to protect
  existing source/test/format contracts.

## Done criteria

- [ ] `bun run registry:check` exits 0 in a clean checkout after committed
      generator-owned artifact updates.
- [ ] `package.json` has `test:e2e` and `bun run test:e2e` exits 0.
- [ ] Pages CI invokes `bun run test:e2e` after the existing Chromium install.
- [ ] CI still runs registry validation, typecheck, Vitest, and Ultracite.
- [ ] `bun run test`, `bun run typecheck`, and `bun run check` all exit 0.
- [ ] No component/runtime changes are included.
- [ ] Plan 126 is marked `DONE` in `plans/README.md` only after verification.

## STOP conditions

- Stop if `bun run registry:build` changes source manifests, component code,
  or files outside the declared generator-owned outputs.
- Stop if the registry check fails after generation for a validation reason
  other than stale output.
- Stop if Playwright needs an additional browser, external service, or a
  non-local credential to run in CI.
- Stop if the workflow already runs an equivalent browser suite through an
  included reusable workflow that was not visible in the current file.
- Stop if the browser suite is flaky across two consecutive local runs; record
  the failing test and trace rather than adding retries or skipping it.

## Maintenance notes

- Any new browser regression test is only release-protecting if it remains in
  `tests/e2e` and `test:e2e` stays required by Pages CI.
- Any registry-source or example metadata edit must be followed by
  `bun run registry:build` and `bun run registry:check` before commit.
- This plan deliberately does not solve overlay geometry. It establishes the
  trustworthy gate required before changing shared overlay primitives.
