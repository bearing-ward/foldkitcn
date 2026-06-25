# Plan 017: Reject fixture-only runtime dependencies for installable manifests

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report. Do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat d53602db..HEAD -- src/registry/validation.ts src/registry/validation.test.ts docs/decisions/0001-foldkit-registry-architecture.md registry-src plans/README.md`
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: correctness
- **Planned at**: commit `d53602db`, 2026-06-25

## Why this matters

Installable registry items must not carry React, React DOM, Radix React, or
upstream Base UI React runtime dependencies. The validator already classifies
React as fixture-only, but installable manifests can still list fixture-only
dependencies under `dependencies.runtime` without an error. This plan closes
that lifecycle gate before more components are promoted to installable.

## Current state

- `src/registry/validation.ts` defines dependency classification and manifest
  validation.
- `src/registry/validation.test.ts` already has a `makeManifest` helper and
  tests for import and dependency validation.
- `docs/decisions/0001-foldkit-registry-architecture.md` is the accepted
  architectural decision for registry runtime boundaries.

Important current excerpts:

```ts
// src/registry/validation.ts:84
export const classifyDependency = (
  specifier: string,
): DependencyRecord['classification'] => {
```

```ts
// src/registry/validation.ts:190
const runtimeDependencyErrors =
  manifest.lifecycle.availability === 'installable'
    ? manifest.dependencies.runtime.flatMap(dependency => {
        if (
          dependency.classification === 'replace-with-foldkit' ||
          dependency.classification === 'reject-or-defer'
        ) {
```

```ts
// src/registry/validation.test.ts:155
test('prevents installable items with unresolved runtime dependencies', () => {
```

ADR constraint to preserve:

```md
<!-- docs/decisions/0001-foldkit-registry-architecture.md:41 -->

React is allowed only in origin fixture infrastructure. React, React DOM,
Radix React packages, upstream Base UI React packages, and local origin repo
paths are not allowed in installable Foldkit runtime source.
```

Audit proof:

- Injecting a `react` runtime dependency with classification
  `dev-or-fixture-only` into the installable `shadcn/separator` manifest
  produced zero validation errors.
- Existing installable manifests keep React evidence under
  `dependencies.development`; that should remain valid.

Repo constraints to preserve:

- Boundary data and validation types derive from Effect Schema.
- Keep fixture-only origin dependencies available in `dependencies.development`
  and origin fixture code. Do not ban React from test or fixture infrastructure.
- Keep registry-local dependencies in `dependencies.registry`, not
  `dependencies.runtime`.

## Commands you will need

| Purpose                  | Command                                           | Expected on success                   |
| ------------------------ | ------------------------------------------------- | ------------------------------------- |
| Focused validation tests | `bun run test -- src/registry/validation.test.ts` | exit 0                                |
| Registry validation      | `bun run registry:check`                          | exit 0, all source manifests validate |
| Typecheck                | `bun run typecheck`                               | exit 0                                |
| Full tests               | `bun run test`                                    | exit 0                                |
| Lint/format check        | `bun run check`                                   | exit 0                                |

## Scope

**In scope**:

- `src/registry/validation.ts`
- `src/registry/validation.test.ts`
- `plans/README.md` status row

**Out of scope**:

- Changing registry source manifests unless `registry:check` reveals an
  existing manifest is genuinely misclassified
- Component implementation files under `src/registry/`
- Origin fixture code under `tests/parity/fixtures/origin/`
- Generated registry output under `registry/`
- Reclassifying allowed packages such as `foldkit`, `effect`, `clsx`, or
  `tailwind-merge`

## Git workflow

- Branch: `codex/017-tighten-installable-runtime-dependency-validation`
- Commit message style: conventional commits, for example
  `fix: reject fixture-only installable runtime deps`
- Do not push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add regression tests for fixture-only runtime dependencies

In `src/registry/validation.test.ts`, add tests using the existing
`makeManifest` and `validateFixture` helpers. Cover at least:

- an installable manifest with `dependencies.runtime` containing `react` as
  `dev-or-fixture-only` is rejected;
- an installable manifest with `dependencies.runtime` containing `react-dom` as
  `dev-or-fixture-only` is rejected;
- a private or preview manifest may still record fixture-only runtime hints
  without triggering the installable gate, if that behavior is useful for
  planning;
- a development dependency classified as `dev-or-fixture-only` remains valid.

The rejection message may reuse the existing unresolved-runtime wording, or use
a clearer message such as:

```txt
Installable item has non-installable runtime dependency "react" classified as dev-or-fixture-only.
```

**Verify**:
`bun run test -- src/registry/validation.test.ts` fails before the validation
change for the new installable React case, then passes after Step 2.

### Step 2: Reject every non-allowed runtime classification for installable items

In `dependencyErrors` inside `src/registry/validation.ts`, change the
installable runtime dependency gate so `dependencies.runtime` entries are valid
only when `dependency.classification === 'allowed-runtime'`.

This should reject:

- `dev-or-fixture-only`
- `replace-with-foldkit`
- `reject-or-defer`
- `registry-local` if someone accidentally puts a local registry dependency in
  `dependencies.runtime` instead of `dependencies.registry`

Keep the existing registry dependency validation unchanged.

**Verify**:
`bun run test -- src/registry/validation.test.ts` exits 0.

### Step 3: Validate current manifests against the stricter rule

Run `bun run registry:check`. If it passes, continue.

If it fails because an existing installable manifest has a non-allowed runtime
dependency, inspect that manifest:

- If the dependency is only evidence or fixture support, move it to
  `dependencies.development`.
- If the dependency is a local registry dependency, move it to
  `dependencies.registry` and make sure `target` names an existing item.
- If installable source truly requires a forbidden runtime package, STOP and
  report because that component needs a separate implementation/deviation plan.

**Verify**: `bun run registry:check` exits 0.

### Step 4: Run the full verification gate

Run:

```bash
bun run test -- src/registry/validation.test.ts
bun run registry:check
bun run typecheck
bun run test
bun run check
```

**Verify**: all commands exit 0. If `bun run test` still prints the unrelated
devtools connection warning from the audit but exits 0, do not address it in
this plan.

## Test plan

- Extend `src/registry/validation.test.ts`.
- Reuse the existing `makeManifest` and `validateFixture` helpers.
- Assert exact validation error arrays for the new installable runtime
  rejection cases.

## Done criteria

- [ ] Installable runtime dependencies are accepted only when classified as
      `allowed-runtime`.
- [ ] `react` and `react-dom` under installable `dependencies.runtime` produce
      validation errors.
- [ ] Fixture/development dependency records remain valid when they are not in
      installable runtime dependencies.
- [ ] `bun run test -- src/registry/validation.test.ts`, `bun run registry:check`,
      `bun run typecheck`, `bun run test`, and `bun run check` exit 0.
- [ ] No unrelated manifests or component source files changed.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back if:

- The validator structure no longer matches the excerpts above.
- Existing installable component source truly imports or requires React,
  React DOM, Radix React, upstream Base UI React, or a local origin repo path.
- Tightening the gate requires changing public component APIs.
- You need to waive the ADR runtime boundary to make validation pass.

## Maintenance notes

Future component plans should continue putting origin/runtime evidence packages
under `dependencies.development` when they are fixture-only. Installable
`dependencies.runtime` should be boring and small: `foldkit`, `effect`, local
class helpers' allowed packages, and other explicitly allowed Foldkit-native
runtime dependencies.
