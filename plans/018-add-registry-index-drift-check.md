# Plan 018: Add a read-only registry index drift check

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report. Do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat d53602db..HEAD -- scripts/check-registry.ts scripts/build-registry.ts scripts/registry-common.ts scripts/registry-common.test.ts registry/index.json package.json plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 017
- **Category**: dx/tooling
- **Planned at**: commit `d53602db`, 2026-06-25

## Why this matters

The editable source of truth lives under `registry-src/`, while public generated
registry output lives under `registry/`. Today `bun run registry:check`
validates source manifests but does not fail if `registry/index.json` is stale.
Adding a read-only freshness check makes the standard verification lane protect
the generated registry output without running a mutating build.

## Current state

- `scripts/check-registry.ts` validates source manifests only.
- `scripts/build-registry.ts` writes `registry/index.json`.
- `scripts/registry-common.ts` contains shared helpers for validation, index
  reading, index building, hashing, and writing.
- `scripts/registry-common.test.ts` already tests generated timestamp behavior.
- `registry/index.json` is tracked and currently fresh at the time of planning.

Important current excerpts:

```ts
// scripts/check-registry.ts:1
import { checkRegistry } from './registry-common'

const result = checkRegistry()

console.log(`Validated ${result.manifests.length} source manifest(s).`)
```

```ts
// scripts/build-registry.ts:7
const outputPath = 'registry/index.json'
const index = buildRegistryIndex({
  previousIndex: readRegistryIndex(outputPath),
})

writeJson(outputPath, index)
```

```ts
// scripts/registry-common.ts:87
export const readRegistryIndex = (
  outputPath: string,
): RegistryIndexType | undefined => {
```

```ts
// scripts/registry-common.ts:165
export const buildRegistryIndex = (options: BuildRegistryIndexOptions = {}) => {
  const result = checkRegistry()
```

```ts
// scripts/registry-common.test.ts:8
const emptyIndex = (generatedAt: string): RegistryIndex => ({
  schemaVersion: 1,
  generatedAt,
  sourceRoot: 'registry-src',
  items: [],
})
```

ADR constraint to preserve:

```md
<!-- docs/decisions/0001-foldkit-registry-architecture.md:19 -->

The editable source of truth is `registry-src/<namespace>/<item>/`. Generated
or public registry output lives under `registry/`, `public/r/`, or `dist/` and
is not hand-edited.
```

Audit proof:

- A read-only in-memory comparison confirmed `registry/index.json` is currently
  fresh with 14 items.
- Freshness is not enforced by `bun run registry:check`; it only prints the
  number of validated source manifests.

## Commands you will need

| Purpose                           | Command                                           | Expected on success                                         |
| --------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| Registry helper tests             | `bun run test -- scripts/registry-common.test.ts` | exit 0                                                      |
| Registry validation and freshness | `bun run registry:check`                          | exit 0, reports valid manifests and current generated index |
| Registry build                    | `bun run registry:build`                          | exit 0, rewrites index only when needed                     |
| Typecheck                         | `bun run typecheck`                               | exit 0                                                      |
| Lint/format check                 | `bun run check`                                   | exit 0                                                      |

## Scope

**In scope**:

- `scripts/registry-common.ts`
- `scripts/check-registry.ts`
- `scripts/registry-common.test.ts`
- `registry/index.json`, only if `bun run registry:build` updates formatting or
  preserved metadata as part of verification
- `plans/README.md` status row

**Out of scope**:

- Changing registry schema shape
- Changing source manifests under `registry-src/`
- Changing component source under `src/registry/`
- Adding a separate CI system or GitHub Actions workflow
- Making `registry:check` write files

## Git workflow

- Branch: `codex/018-add-registry-index-drift-check`
- Commit message style: conventional commits, for example
  `feat: verify registry index freshness`
- Do not push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add pure index freshness helpers

In `scripts/registry-common.ts`, add a read-only helper that compares an
existing `RegistryIndex` with the generated in-memory index. Keep timestamp
preservation semantics: if the semantic registry content is unchanged, the
generated comparison should preserve the previous `generatedAt` so a fresh
index does not fail only because of the clock.

One acceptable shape:

```ts
export const registryIndexIsCurrent = (
  previousIndex: RegistryIndexType,
  nextIndex: RegistryIndexType,
): boolean => hashJson(previousIndex) === hashJson(nextIndex)
```

Then add a higher-level helper such as `checkRegistryIndexCurrent(outputPath)`
that:

- reads `registry/index.json` with `readRegistryIndex`;
- throws a clear error if the file is missing or invalid;
- calls `buildRegistryIndex({ previousIndex })`;
- compares the existing and generated indexes;
- throws `registry/index.json is stale; run bun run registry:build` when they
  differ;
- never calls `writeJson`.

Choose names that fit the existing module. Keep the helper small enough to unit
test.

**Verify**:
`bun run test -- scripts/registry-common.test.ts` exits 0 after adding tests in
Step 2.

### Step 2: Add helper tests

In `scripts/registry-common.test.ts`, add tests that cover the pure comparison
behavior:

- unchanged registry content with preserved `generatedAt` is current;
- changed registry content is stale;
- changed `generatedAt` alone should not be stale when semantic content is the
  same and `buildRegistryIndex` would preserve the old timestamp.

Do not rely on modifying the real `registry/index.json` in these tests.

**Verify**:
`bun run test -- scripts/registry-common.test.ts` exits 0.

### Step 3: Wire freshness into registry:check

Update `scripts/check-registry.ts` so `bun run registry:check` still validates
source manifests and also verifies `registry/index.json` freshness without
writing it.

Keep output concise. For example:

```txt
Validated 14 source manifest(s).
Verified registry/index.json is current.
```

If the index is stale or missing, the command should exit non-zero and tell the
operator to run `bun run registry:build`.

**Verify**:
`bun run registry:check` exits 0 in the current checkout.

### Step 4: Confirm build remains the only writer

Run `bun run registry:build`, then inspect `git diff -- registry/index.json`.

- If there is no diff, continue.
- If there is a diff only because this plan exposed previously stale generated
  output, keep the generated index change and note it in the commit.
- If `registry:check` wrote or changed any file, STOP and fix that before
  continuing.

**Verify**:
`bun run registry:check` exits 0 after the build check.

### Step 5: Run the full verification gate

Run:

```bash
bun run test -- scripts/registry-common.test.ts
bun run registry:check
bun run registry:build
bun run typecheck
bun run check
bun run test
```

**Verify**: all commands exit 0.

## Test plan

- Extend `scripts/registry-common.test.ts`.
- Keep tests pure where possible, using in-memory `RegistryIndex` fixtures like
  the existing `emptyIndex` helper.
- Do not mutate the real registry index from tests.

## Done criteria

- [ ] `bun run registry:check` fails when `registry/index.json` is missing,
      invalid, or stale.
- [ ] `bun run registry:check` does not write files.
- [ ] `bun run registry:build` remains the command that writes
      `registry/index.json`.
- [ ] Tests cover current, stale, and timestamp-preservation cases.
- [ ] `bun run test -- scripts/registry-common.test.ts`, `bun run registry:check`,
      `bun run registry:build`, `bun run typecheck`, `bun run check`, and
      `bun run test` exit 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- `registry/index.json` is missing from git or intentionally no longer tracked.
- The generated index format has changed enough that current `readRegistryIndex`
  cannot decode it.
- The freshness check requires writing files from `registry:check`.
- Existing tests or scripts depend on `registry:check` validating source
  manifests only and cannot tolerate the stronger check.

## Maintenance notes

After this lands, component implementation plans can use `bun run registry:check`
as a stronger non-mutating gate. Executors should still run `bun run
registry:build` when they intentionally change manifests or installable source
artifacts, because freshness checks report drift but do not repair it.
