# Plan 016: Stabilize aggregate shadcn parity execution

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report. Do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat d53602db..HEAD -- scripts/parity-dry-run.ts tests/parity/fixtures/foldkit/shadcn/runner.ts tests/parity/fixtures/origin/shadcn/runner.ts tests/parity/canonicalize.test.ts tests/parity/shadcn-origin-runner.test.ts tests/parity/slots.ts plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: correctness/tests
- **Planned at**: commit `d53602db`, 2026-06-25

## Why this matters

The registry now relies on parity checks to decide whether Base UI and shadcn
ports are faithful enough to install. Scoped parity checks can pass while the
aggregate guard fails, so the main all-slot command is not trustworthy as an
acceptance gate. This plan makes shadcn parity deterministic and fixes
namespace grep behavior so `bun run parity:check` and `--grep shadcn` can be
used by future component plans.

## Current state

- `scripts/parity-dry-run.ts` selects parity slots, loads fixture modules, and
  compares snapshots.
- `tests/parity/fixtures/foldkit/shadcn/runner.ts` starts the Foldkit shadcn
  browser fixture server and captures rendered snapshots.
- `tests/parity/fixtures/origin/shadcn/runner.ts` starts the pinned shadcn
  origin fixture server and captures rendered snapshots.
- `tests/parity/canonicalize.test.ts` is the light unit-test pattern for parity
  helpers that do not need a browser.
- `tests/parity/shadcn-origin-runner.test.ts` is the browser-runner test pattern
  for shadcn origin snapshot capture.

Important current excerpts:

```ts
// scripts/parity-dry-run.ts:294
const shadcnCaseGrep = (itemId: string): string => {
  const componentName = shadcnComponentName(itemId)

  if (maybeGrep === undefined || maybeGrep.includes('/')) {
    return componentName
  }

  return maybeGrep
}
```

```ts
// scripts/parity-dry-run.ts:315
const [originSnapshots, foldkitSnapshots] = await Promise.all([
  captureShadcnOriginSnapshots({ grep: caseGrep }),
  captureShadcnFoldkitSnapshots({ grep: caseGrep }),
])
```

```ts
// scripts/parity-dry-run.ts:368
const comparedCaseCounts = await Promise.all(
  matchingSlots.map(compareParitySlot),
)
```

```ts
// tests/parity/fixtures/foldkit/shadcn/runner.ts:18
const createFixtureServer = async (): Promise<ViteDevServer> => {
  const server = await createServer({
    root: fixtureRoot,
    configFile: false,
    cacheDir: path.join(repoRoot, 'node_modules/.vite-shadcn-foldkit-fixture'),
```

The audit verification found:

- `bun run parity:check -- --grep base-ui/button` passes.
- `bun run parity:check -- --grep shadcn/button` passes.
- `bun run parity:check -- --grep shadcn` fails with
  `No shadcn origin fixture cases matched: shadcn`.
- `bun run parity:check` fails during aggregate shadcn execution with an empty
  Foldkit fixture body and `pageErrors=Identifier 'hash' has already been declared`.

Repo constraints to preserve:

- ADR 0001 says live docs URLs are discovery inputs, not parity oracles, and
  parity compares local pinned-origin fixtures against local Foldkit
  implementations.
- Keep installable runtime source Foldkit-native. React may remain only inside
  origin fixture infrastructure.
- Use Effect/Foldkit conventions already present in this repo. For plain Node
  scripts, match the existing style in `scripts/parity-dry-run.ts`: small typed
  helpers, `ReadonlyArray`, no `for` loops.

## Commands you will need

| Purpose                    | Command                                                                                       | Expected on success                             |
| -------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Dry-run slot discovery     | `bun run parity:check -- --dry-run`                                                           | exit 0, lists ready slots                       |
| Namespace shadcn parity    | `bun run parity:check -- --grep shadcn`                                                       | exit 0, compares all ready shadcn fixture cases |
| Full parity                | `bun run parity:check`                                                                        | exit 0, compares all ready slots                |
| Focused unit/browser tests | `bun run test -- tests/parity/canonicalize.test.ts tests/parity/shadcn-origin-runner.test.ts` | exit 0                                          |
| Registry validation        | `bun run registry:check`                                                                      | exit 0, source manifests valid                  |
| Typecheck                  | `bun run typecheck`                                                                           | exit 0                                          |
| Lint/format check          | `bun run check`                                                                               | exit 0                                          |

## Scope

**In scope**:

- `scripts/parity-dry-run.ts`
- `tests/parity/canonicalize.test.ts` or a new `tests/parity/parity-dry-run.test.ts`
- `tests/parity/fixtures/foldkit/shadcn/runner.ts`, only if unique fixture
  cache/server isolation is still needed after sequential execution
- `plans/README.md` status row

**Out of scope**:

- Component source under `src/registry/`
- Source manifests under `registry-src/`
- Generated registry output under `registry/`
- Changing parity acceptance thresholds or canonicalization semantics
- Fetching or updating upstream origin repos

## Git workflow

- Branch: `codex/016-stabilize-aggregate-shadcn-parity`
- Commit message style: conventional commits, for example
  `test: stabilize aggregate shadcn parity`
- Do not push or open a PR unless the operator instructed it.

## Steps

### Step 1: Extract grep semantics into testable helpers

Refactor `scripts/parity-dry-run.ts` so shadcn slot matching and case grep
selection can be tested without launching browsers. The key behavior should be:

- no grep: each shadcn slot uses its component name as the case grep;
- grep exactly `shadcn` or `shadcn/`: match all shadcn slots, and each slot
  uses its own component name as the case grep;
- grep like `shadcn/button`: match the button slot, and use `button` as the
  shadcn case grep;
- grep like `button`: keep existing behavior of matching item IDs that include
  `button`, and for shadcn/button use `button` as the case grep;
- grep like `button-default`: do not silently run against all slots. If this
  does not match a slot, keep the existing "No parity slots matched" behavior
  unless you deliberately add a separately documented case-level flag.

Prefer adding a small exported helper module such as
`scripts/parity-dry-run-helpers.ts` over exporting many internals from the
script with top-level `await`.

**Verify**:
`bun run test -- tests/parity/canonicalize.test.ts tests/parity/parity-dry-run.test.ts`
exits 0. If you add tests to `canonicalize.test.ts` instead of creating a new
file, adjust the command accordingly.

### Step 2: Make aggregate parity execution deterministic

Replace the all-slot `Promise.all(matchingSlots.map(compareParitySlot))` path
with sequential comparison. Use `Array.reduce` with an async accumulator, as the
Foldkit fixture runner already does for per-case navigation. The output should
still report the total compared case count across all matched slots.

Inside `compareShadcnSlot`, avoid launching the origin and Foldkit browser
fixture captures concurrently. Capture origin snapshots, then Foldkit
snapshots, then compare. This keeps only one shadcn fixture server of each type
active for a slot and avoids concurrent Vite cache writes while the aggregate
run is active.

If sequential execution alone still produces `Identifier 'hash' has already
been declared`, isolate the Foldkit shadcn fixture Vite cache directory by slot
or process, for example by allowing an optional cache suffix to flow into
`captureShadcnFoldkitSnapshots`. Do not widen that change unless the failure
reproduces after the sequential fix.

**Verify**:
`bun run parity:check -- --grep shadcn` exits 0 and prints a compared case
count across the ready shadcn slots.

### Step 3: Preserve scoped parity behavior

Run the focused parity lanes that were already passing before this plan. They
must continue to pass after the aggregate fix:

- `bun run parity:check -- --grep base-ui/button`
- `bun run parity:check -- --grep shadcn/button`
- `bun run parity:check -- --dry-run`

If either focused button lane fails, fix the regression inside the in-scope
parity runner code. Do not edit component fixtures to make this plan pass.

**Verify**: all three commands exit 0.

### Step 4: Run the full verification gate

Run the commands below in this order:

```bash
bun run parity:check
bun run registry:check
bun run typecheck
bun run check
bun run test
```

**Verify**: all commands exit 0. `bun run test` may still print the unrelated
devtools `ECONNREFUSED` warning noted in the audit, but it must exit 0 and the
parity commands must not fail.

## Test plan

- Add unit coverage for shadcn grep derivation and namespace-only grep.
- Reuse the style of `tests/parity/canonicalize.test.ts`: small pure helpers,
  direct `expect(...).toStrictEqual(...)` assertions, no browser when not
  needed.
- Keep browser coverage through the real CLI commands rather than mocking the
  Playwright runners.

## Done criteria

- [ ] `bun run parity:check -- --grep shadcn` exits 0.
- [ ] `bun run parity:check` exits 0.
- [ ] Existing scoped commands for `base-ui/button` and `shadcn/button` still
      exit 0.
- [ ] Unit coverage exists for namespace-only shadcn grep behavior.
- [ ] `bun run registry:check`, `bun run typecheck`, `bun run check`, and
      `bun run test` exit 0.
- [ ] No component source, manifests, or generated registry files changed.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- The current `scripts/parity-dry-run.ts` structure no longer matches the
  excerpts above.
- The fix requires changing component parity fixtures or accepted deviations.
- Full parity still fails after sequential slot and shadcn capture execution,
  and the failure points to a specific component implementation rather than the
  runner.
- You need to fetch upstream repos or depend on live docs pages.

## Maintenance notes

The slower sequential runner is intentional. This registry values deterministic
high-fidelity acceptance over parallel speed. If aggregate parity later becomes
too slow, add explicit worker isolation before reintroducing parallelism.
