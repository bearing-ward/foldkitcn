<!-- prettier-ignore-start -->
<!-- Generated improve plan: preserve command tables and source excerpts literally. -->

# Plan 061: Add docs readiness and generated documentation artifacts

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat f3617d28..HEAD -- src/registry/schema.ts src/registry/schema.test.ts src/registry/validation.ts src/registry/validation.test.ts scripts/registry-common.ts scripts/build-registry.ts scripts/registry-common.test.ts registry-src registry/index.json package.json docs/decisions/0002-foldkit-cn-documentation-site.md docs/decisions/0003-effect-native-tooling.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/060-record-docs-and-tooling-architecture.md
- **Category**: docs
- **Planned at**: commit `f3617d28`, 2026-06-27

## Why this matters

The docs site should consume generated registry artifacts, not scrape
`registry-src` at runtime. The registry schema already tracks component
description, provenance, examples, parity, lifecycle, and deviations, but it
does not yet track docs readiness or emit separate docs artifacts. This plan
adds the machine-readable docs layer that later website routes can render
without becoming a second registry builder.

## Current state

- `src/registry/schema.ts` defines `Lifecycle` with implementation, parity,
  drift, and availability, but no `docsStatus`.
- `ExampleManifest` records example ids and source paths, but there is no
  generated docs artifact for snippets or preview readiness.
- `scripts/build-registry.ts` only writes `registry/index.json`.
- `registry-src/shadcn/button/item.json` is the agreed docs exemplar: it is
  installable, composes `base-ui/button`, and has many examples.

Relevant excerpts:

```ts
src/registry/schema.ts:57-63
export const Lifecycle = S.Struct({
  implementationStatus: ImplementationStatus,
  parityStatus: ParityStatus,
  driftStatus: DriftStatus,
  availability: Availability,
})

src/registry/schema.ts:232-244
export const ExampleManifest = S.Struct({
  id: S.String,
  title: S.String,
  description: S.String,
  sourcePath: S.String,
  kind: S.Union([
    S.Literal('origin-fixture'),
    S.Literal('foldkit-fixture'),
    S.Literal('demo'),
    S.Literal('docs'),
  ]),
})

scripts/build-registry.ts:7-14
const outputPath = 'registry/index.json'
const index = buildRegistryIndex({
  previousIndex: readRegistryIndex(outputPath),
})

writeJson(outputPath, index)
console.log(`Built ${outputPath} with ${index.items.length} item(s).`)
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Targeted schema tests | `bun run test -- src/registry/schema.test.ts scripts/registry-common.test.ts src/registry/validation.test.ts` | all pass |
| Registry validation | `bun run registry:check` | exit 0 |
| Registry/docs build | `bun run registry:build` | exit 0; writes `registry/index.json` plus docs artifacts |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Whitespace | `git diff --check -- src scripts registry-src registry docs plans package.json` | exit 0 |

## Suggested executor toolkit

- Read `docs/decisions/0002-foldkit-cn-documentation-site.md` before shaping the
  artifact names and routes.
- Read `docs/decisions/0003-effect-native-tooling.md` before adding or changing
  scripts. If a new script is needed, implement it as an Effect program using
  `effect/unstable/cli` and Schema-derived boundary types.

## Scope

**In scope**:

- `src/registry/schema.ts`
- `src/registry/schema.test.ts`
- `src/registry/validation.ts`
- `src/registry/validation.test.ts`
- `scripts/registry-common.ts`
- `scripts/registry-common.test.ts`
- `scripts/build-registry.ts`
- `package.json` only if a new script name is required
- `registry-src/**/item.json` only for mechanical `docsStatus` backfill
- `registry/index.json`
- generated docs artifacts under `registry/docs/**`
- `plans/README.md` status row update

**Out of scope**:

- Do not implement website routes or views.
- Do not write component prose sidecars except optional empty/stub fixtures if
  tests require them.
- Do not implement live example runtime.
- Do not implement the installer CLI.
- Do not modify vendored origins under `repos/**`.

## Git workflow

- Branch: `codex/061-docs-artifacts`
- Commit per logical unit if useful: schema/backfill, artifact generation,
  validation/tests.
- Do not push or open a PR unless the operator explicitly instructs it.

## Steps

### Step 1: Add docs readiness to lifecycle

Add a Schema literal union:

```ts
export const DocsStatus = S.Union([
  S.Literal('missing'),
  S.Literal('stub'),
  S.Literal('complete'),
])
export type DocsStatus = typeof DocsStatus.Type
```

Add `docsStatus: DocsStatus` to `Lifecycle`. Backfill existing
`registry-src/**/item.json` lifecycle records with `"docsStatus": "missing"`.
Do not mark any item complete in this plan unless a sidecar with the validated
template exists.

**Verify**: `rg -n "DocsStatus|docsStatus" src/registry/schema.ts registry-src` -> exit 0 and every registry item lifecycle has `docsStatus`.

### Step 2: Define docs artifact schemas

Add Schema-backed artifacts in `src/registry/schema.ts` for generated docs data.
Use names close to these:

```ts
export const ComponentDocsRoute = S.Struct({
  itemId: S.String,
  routePath: S.String,
  docsArtifactPath: S.String,
})

export const ComponentDocsArtifact = S.Struct({
  schemaVersion: RegistrySchemaVersion,
  itemId: S.String,
  routePath: S.String,
  title: S.String,
  description: S.String,
  docsStatus: DocsStatus,
  markdownPath: S.Option(S.String),
  markdown: S.Option(S.String),
  headings: S.Array(S.Struct({ id: S.String, text: S.String, level: S.Number })),
  installCommand: S.Option(S.String),
  localInstallPath: S.String,
  defaultImportPath: S.String,
  examples: S.Array(ExampleDocsArtifact),
  quality: S.Struct({
    availability: Availability,
    implementationStatus: ImplementationStatus,
    parityStatus: ParityStatus,
    driftStatus: DriftStatus,
    deviations: S.Array(DeviationRecord),
  }),
})
```

Adjust names if needed to match local conventions, but keep all boundary types
Schema-derived.

**Verify**: `bun run test -- src/registry/schema.test.ts` -> exit 0 and tests cover encoding/decoding docs artifacts.

### Step 3: Generate separate docs artifacts

Extend the registry build path so `bun run registry:build` writes:

- `registry/index.json` as the structured catalog.
- `registry/docs/index.json` as a route/index artifact for docs pages.
- `registry/docs/<namespace>/<slug>.json` as one docs artifact per registry item.

The docs generator should read from built registry item data and optional
`registry-src/<namespace>/<slug>/docs.md`. Missing sidecars produce
`docsStatus: "missing"` artifacts with `markdown: Option.none()`.

Use `registry-src/<namespace>/<slug>/docs.md` for sidecars; do not put Markdown
inside `item.json`.

**Verify**: `bun run registry:build && test -f registry/docs/index.json && test -f registry/docs/shadcn/button.json` -> exit 0.

### Step 4: Add validation and drift checks

Update `registry:check` or shared validation so:

- generated docs artifacts decode through Schema.
- `docsStatus` in each manifest is valid.
- `docsStatus: "complete"` is rejected when `docs.md` is missing.
- `docsStatus: "complete"` is rejected when required headings are missing.
- existing installable components with `docsStatus: "missing"` are allowed
  during migration, but this exception is explicit in code/tests.

**Verify**: `bun run test -- src/registry/validation.test.ts scripts/registry-common.test.ts` -> all pass with tests for missing/stub/complete docs status.

### Step 5: Update the plan index

Mark plan 061 as DONE in `plans/README.md` when complete, unless a reviewer owns
the index.

**Verify**: `rg -n "\\| 061 \\| Add docs readiness and generated documentation artifacts \\| P1 \\| L \\| 060 \\| DONE \\|" plans/README.md` -> exit 0.

## Test plan

- Add schema tests for `DocsStatus`, `ComponentDocsRoute`,
  `ComponentDocsArtifact`, and any example docs artifact.
- Add validation tests for complete docs without a sidecar, complete docs with
  missing headings, and missing docs allowed for existing installable items.
- Add build tests or focused registry-common tests proving the generated docs
  artifact path for `shadcn/button` is `registry/docs/shadcn/button.json`.

## Done criteria

- [ ] `Lifecycle` includes `docsStatus`.
- [ ] Existing registry manifests have a valid docs status.
- [ ] `bun run registry:build` writes `registry/docs/index.json` and per-item
  docs artifacts.
- [ ] Docs artifacts decode through Effect Schema.
- [ ] Missing sidecars are represented as missing docs artifacts, not runtime
  errors.
- [ ] `bun run registry:check`, `bun run typecheck`, `bun run test`,
  `bun run check`, and `git diff --check -- src scripts registry-src registry docs plans package.json` exit 0.
- [ ] No files outside the in-scope list are modified.

## STOP conditions

Stop and report back if:

- Adding required `docsStatus` reveals generated or hand-authored manifests that
  cannot be safely backfilled mechanically.
- The docs artifact generator appears to require parsing arbitrary Markdown or
  rendering website views.
- `registry/index.json` would need to inline all Markdown content instead of
  pointing at separate docs artifacts.
- New script work cannot follow ADR 0003's Effect/Schema tooling rule.

## Maintenance notes

This plan creates the data contract used by the docs website. Later plans should
consume `registry/index.json` and `registry/docs/**`, not `registry-src/**`
directly at runtime. Future tightening can reject new installable components
without complete docs, but this migration plan intentionally does not fail the
already-installable backlog.

<!-- prettier-ignore-end -->
