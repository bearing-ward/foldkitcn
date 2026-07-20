# Plan 139: Re-establish bounded TypeScript verification

> **Executor instructions**: Follow the investigation and implementation gates
> in order. Do not silence diagnostics with casts, `any`, `@ts-ignore`, or a
> larger heap. Stop when a STOP condition occurs and report the measured
> boundary. Update this plan's row in `plans/README.md` only after the release
> workflow runs a truthful green typecheck.
>
> **Drift check (run first)**:
> `git diff --stat 2fb34f0b..HEAD -- tsconfig.json package.json .github/workflows/pages.yml scripts src`
> If the typecheck command or CI lane changed, rerun the baseline before using
> this plan.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: `plans/138-restore-green-menu-command-verification.md`
- **Category**: dx, tests, tech-debt
- **Planned at**: commit `2fb34f0b`, 2026-07-19

## Why this matters

`bun run typecheck` is advertised as a canonical command but is absent from the
current CI workflow. The all-source TypeScript program is too large to be a
credible release gate: with an 8 GB heap it completes after roughly 155 seconds,
uses about 4.7 GB, performs 22.6 million instantiations, and emits a huge mix of
real drift plus `TS2859` complexity cascades. The goal is a bounded production
typecheck that is honest and green, followed by explicitly sharded test typing;
simply hiding every test file forever is not an acceptable end state.

## Current state

- `package.json:18` defines `typecheck` as `tsc --noEmit`.
- `tsconfig.json` includes all `src/**/*`, so one program combines application
  code, 100+ component test modules, Vitest globals, Foldkit Story/Scene generic
  programs, and every generated docs/example import.
- Commit `f0d1eb86` removed the typecheck step from
  `.github/workflows/pages.yml`; the current `verify` job runs tests, browser
  tests, and Ultracite only.
- A local `NODE_OPTIONS=--max-old-space-size=8192 bun run typecheck --
--extendedDiagnostics` at the planned commit reported 1,406 files, 115,089
  TypeScript lines, 3,005,437 types, 22,656,369 instantiations, and 4,717,156 KB
  memory.
- Real non-complexity diagnostics include stale `onPositionedSurface`
  controllers in `scripts/report-docs-live-preview-gaps.ts` and
  `src/data.test.ts`, a missing `reason` in `src/live-examples.ts`, an implicit
  `any` in `src/main.ts`, and positioning-union drift in menu/select wrappers.
- `docs/decisions/0003-effect-native-tooling.md` requires any new repository
  CLI/orchestrator to use Effect, `effect/unstable/cli`, and Schema-backed
  boundary data.

## Commands you will need

| Purpose         | Command                                                                             | Expected on success                                                                              |
| --------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Baseline        | `NODE_OPTIONS=--max-old-space-size=8192 bun run typecheck -- --extendedDiagnostics` | exit nonzero; capture summary and diagnostic categories, never the multi-megabyte raw log in git |
| Production lane | `NODE_OPTIONS=--max-old-space-size=4096 bun run typecheck:source`                   | exit 0 within 4 GB                                                                               |
| Test shards     | `bun run typecheck:tests`                                                           | every declared shard exits 0 without `TS2859`                                                    |
| Unit suite      | `bun run test`                                                                      | exit 0                                                                                           |
| Browser suite   | `bun run test:e2e`                                                                  | exit 0                                                                                           |
| Quality         | `bun run check`                                                                     | exit 0                                                                                           |

## Scope

**In scope**:

- `tsconfig.json` and new narrowly named `tsconfig.*.json` files.
- `package.json` and `bun.lock` only if scripts or an already-present package
  version must change.
- `scripts/typecheck.ts` only if static project configs cannot express stable
  shards; it must follow ADR 0003.
- Production/test files named by non-complexity diagnostics after sharding.
- `.github/workflows/pages.yml`.
- A compact evidence summary under `plans/artifacts/139-typecheck/`.

**Out of scope**:

- Changing public component APIs to make the compiler faster.
- Casting through Foldkit Schema, Message, Story, Scene, or View types.
- Excluding all tests with no replacement test-type lane.
- Increasing CI heap beyond 4 GB as the solution.
- Updating Foldkit, Effect, TypeScript, or Vitest versions in the same change.

## Git workflow

- Branch: `codex/139-bounded-typecheck`.
- Commits: `chore: split TypeScript verification` followed by focused
  `fix:` or `test:` commits for genuine diagnostics.
- Do not push or open a PR unless the operator instructs it.

## Steps

### Step 1: Classify the current failure without committing raw output

Run the baseline once. Write a short Markdown summary containing counts by
diagnostic code and file family, the extended-diagnostics totals, and the exact
command. Do not commit the raw multi-megabyte log.

**Verify**: the summary distinguishes real contract errors from `TS2859`
complexity cascades and contains no secrets or absolute home-directory data.

### Step 2: Create a bounded production-source project

Create a production config that extends the strict root options, includes
runtime source, scripts used by CI/build, and registry generators, and excludes
`*.test.ts`, `*.story.test.ts`, `*.scene.test.ts`, `tests/**`, and vendored
`repos/**`. Keep `exactOptionalPropertyTypes`, `strict`, and
`noUncheckedIndexedAccess`. Add `typecheck:source` and make `typecheck` invoke
the complete bounded workflow only after Step 4 exists.

Fix genuine production diagnostics in small groups, preserving discriminated
positioning unions and Schema constructors. Never make required callbacks
optional merely to satisfy a spread expression.

**Verify**: `typecheck:source` exits 0 under a 4 GB heap.

### Step 3: Prove a stable test-shard strategy

Start with three representative shards: root Story/Scene tests, one simple
registry component, and one generic-heavy menu/overlay component. Prefer static
tsconfig references grouped by domain. If an orchestrator is necessary, use an
Effect CLI that writes temporary configs outside the repo, runs bounded child
processes, reports each shard, and exits nonzero on any failure.

Expand the shard map only after the representative set stays below 2 GB per
process and does not emit `TS2859`. Fix genuine test drift using current Foldkit
Story/Scene patterns from `repos/foldkit/examples/`; do not weaken types.

**Verify**: `bun run typecheck:tests` covers every test file exactly once and
exits 0. Add a unit test for shard discovery so a new test cannot silently fall
outside the map.

### Step 4: Restore the canonical command and CI gate

Make `bun run typecheck` run source and test lanes. Re-add one `Typecheck` step
to the `verify` job before Vitest, with a 4 GB maximum heap. Keep browser and
Ultracite gates unchanged.

**Verify**: the full command table passes locally and a GitHub Actions run shows
Typecheck, Test, Browser parity tests, and Lint and checks all green.

## Test plan

- Add tests for file-to-shard coverage and duplicate/missing shard detection if
  an orchestrator is introduced.
- Preserve existing behavior tests; typecheck fixes must not replace them.
- Use the full unit and browser suites as regression gates after type repairs.

## Done criteria

- [ ] `bun run typecheck` exits 0 with no process above 4 GB.
- [ ] Every production and test TypeScript file is covered by a named lane.
- [ ] CI runs the canonical command before tests.
- [ ] No casts, ignores, relaxed strictness, or blanket permanent exclusions
      were added.
- [ ] Baseline evidence is compact and reproducible.
- [ ] Unit, browser, and quality suites pass.

## STOP conditions

- The production-only program still produces more than 50 diagnostics across
  more than five modules; split a new remediation plan instead of widening.
- Representative single-domain test shards still emit `TS2859` or exceed 2 GB;
  report the smallest reproducer for an upstream Foldkit/TypeScript decision.
- A fix requires changing a public component contract or upgrading core
  dependencies.
- The only green result requires omitting files without a tracked follow-up.

## Maintenance notes

Reviewers should scrutinize the shard coverage test and compiler-option parity.
The command must fail closed when new TypeScript files appear, or the restored
green gate will gradually become cosmetic.
