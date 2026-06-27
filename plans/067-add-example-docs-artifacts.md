<!-- prettier-ignore-start -->
<!-- Generated improve plan: preserve command tables and source excerpts literally. -->

# Plan 067: Add structured example docs artifacts

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat f3617d28..HEAD -- src/registry/schema.ts scripts/registry-common.ts scripts/build-registry.ts src/registry/shadcn/button/examples.ts registry-src/shadcn/button/item.json registry/docs src`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/063-add-component-docs-sidecar-and-button-page.md
- **Category**: docs
- **Planned at**: commit `f3617d28`, 2026-06-27

## Why this matters

Component examples are currently file paths and exported functions. The docs
site needs a structured example contract before it can safely display snippets
or later run live previews. This plan adds generated example docs artifacts with
source snippets, preview readiness, and dependency metadata, while still keeping
milestone examples static.

## Current state

- `ExampleManifest` has `id`, `title`, `description`, `sourcePath`, and `kind`.
- `src/registry/shadcn/button/examples.ts` exports many static example
  functions, but the docs site should not guess how to run arbitrary exports.
- Live examples were explicitly deferred until a later runtime contract exists.

Relevant excerpts:

```ts
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

src/registry/shadcn/button/examples.ts:95-101
export const ButtonDefault = (): Html => {
  const h = html<never>()

  return Button<never>({
    toView: attributes => h.button([...attributes.button], ['Button']),
  })
}
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Registry/docs build | `bun run registry:build` | exit 0; example docs artifacts generated |
| Targeted tests | `bun run test -- src/registry/schema.test.ts scripts/registry-common.test.ts src/scene.test.ts` | all pass |
| Registry check | `bun run registry:check` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Build | `bun run build` | exit 0 |
| Whitespace | `git diff --check -- src scripts registry/docs plans` | exit 0 |

## Scope

**In scope**:

- `src/registry/schema.ts`
- `src/registry/schema.test.ts`
- `scripts/registry-common.ts`
- `scripts/registry-common.test.ts`
- `scripts/build-registry.ts`
- generated example docs artifacts under `registry/docs/**`
- docs site example rendering under `src/**`
- `src/scene.test.ts`
- `plans/README.md` status row update

**Out of scope**:

- Do not implement live example execution.
- Do not require AST extraction in this plan.
- Do not parse arbitrary TypeScript beyond explicit source file/snippet
  extraction.
- Do not modify component example runtime behavior.

## Git workflow

- Branch: `codex/067-example-docs-artifacts`
- Commit after artifact generation, rendering, and tests pass.
- Do not push or open a PR unless the operator explicitly instructs it.

## Steps

### Step 1: Add ExampleDocsArtifact schema

Define a Schema-backed example docs artifact, with fields equivalent to:

```ts
export const ExamplePreviewStatus = S.Union([
  S.Literal('static'),
  S.Literal('live-ready'),
  S.Literal('blocked'),
])

export const ExampleDocsArtifact = S.Struct({
  id: S.String,
  title: S.String,
  description: S.String,
  componentItemId: S.String,
  sourcePath: S.String,
  snippet: S.String,
  previewStatus: ExamplePreviewStatus,
  previewExportName: S.Option(S.String),
  requiredRegistryItems: S.Array(S.String),
  notes: S.Array(S.String),
})
```

Use `Option` fields in Schema rather than `null` or `undefined`.

**Verify**: `bun run test -- src/registry/schema.test.ts` -> tests cover
encoding/decoding `static`, `live-ready`, and `blocked` examples.

### Step 2: Generate example docs artifacts

Extend docs artifact generation so each `ComponentDocsArtifact.examples` entry
contains an `ExampleDocsArtifact`.

Milestone behavior:

- read the referenced `sourcePath`.
- include the full file or an explicit exported-function snippet if a simple,
  reliable marker exists.
- set `previewStatus: "static"` by default.
- set `previewExportName` when it can be derived from manifest title/export name.
- list registry dependencies from the parent item.

If snippet extraction becomes fragile, use whole-file snippets in this plan and
record function-level extraction as a follow-up.

**Verify**: `bun run registry:build && rg -n "ButtonDefault|previewStatus|static|snippet" registry/docs/shadcn/button.json` -> exit 0.

### Step 3: Render static examples on component pages

Update the Button page examples section to render example cards/sections with:

- title.
- description.
- static code snippet.
- copy button if plan 064 is complete.
- preview status badge.

Do not render the actual Html example view yet.

**Verify**: `bun run test -- src/scene.test.ts` -> Button page shows at least
ButtonDefault and its snippet text.

### Step 4: Add validation

Add validation that every example listed in an installable/preview component
manifest has a readable source file and a non-empty generated snippet.

**Verify**: `bun run registry:check` -> exit 0 and tests fail on a fixture with a
missing example source path.

### Step 5: Update the plan index

Mark plan 067 as DONE in `plans/README.md` when complete, unless a reviewer owns
the index.

**Verify**: `rg -n "\\| 067 \\| Add structured example docs artifacts \\| P2 \\| M \\| 063 \\| DONE \\|" plans/README.md` -> exit 0.

## Test plan

- Schema tests for example docs artifacts.
- Registry-common tests for snippet generation.
- Validation tests for missing example source.
- Scene tests for Button example rendering.

## Done criteria

- [ ] Example docs artifacts are Schema-backed.
- [ ] Button docs artifact contains generated snippets and preview statuses.
- [ ] Button page renders static example snippets.
- [ ] Example source paths are validated.
- [ ] `bun run registry:check`, `bun run test`, `bun run typecheck`,
  `bun run check`, `bun run build`, and `git diff --check -- src scripts registry/docs plans` exit 0.

## STOP conditions

Stop and report back if:

- Reliable snippet extraction requires a complex TypeScript AST extractor.
- Rendering snippets starts to require live example runtime.
- Existing examples cannot be associated with export names without changing
  component source.

## Maintenance notes

This is the ramp toward live examples. Reviewers should ensure static snippets
are honest and generated from source, not hand-copied into docs Markdown.

<!-- prettier-ignore-end -->
