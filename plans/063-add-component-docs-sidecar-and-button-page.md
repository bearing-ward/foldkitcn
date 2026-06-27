<!-- prettier-ignore-start -->
<!-- Generated improve plan: preserve command tables and source excerpts literally. -->

# Plan 063: Add component docs sidecars and the shadcn Button page

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan
> in `plans/README.md` unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat f3617d28..HEAD -- registry-src/shadcn/button src/registry/shadcn/button src/registry/schema.ts scripts/registry-common.ts registry/docs src plans/README.md docs/decisions/0002-foldkit-cn-documentation-site.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/061-add-docs-artifact-schema-and-generator.md, plans/062-replace-starter-app-with-docs-shell.md
- **Category**: docs
- **Planned at**: commit `f3617d28`, 2026-06-27

## Why this matters

The docs shell needs one complete component page to prove the generated-data
plus hand-authored-prose contract. `shadcn/button` is the right exemplar because
it is installable, has a Base UI dependency, has many examples, has accepted
parity, and has an accepted Foldkit-specific deviation without complex state.
This plan creates the sidecar template and renders the first real page.

## Current state

- `registry-src/shadcn/button/item.json` has structured manifest data, examples,
  dependencies, lifecycle, parity, and deviations.
- `src/registry/shadcn/button/examples.ts` exports static demo functions.
- No `registry-src/shadcn/button/docs.md` exists yet.
- The agreed sidecar location is `registry-src/<namespace>/<item>/docs.md`.

Relevant excerpts:

```json
registry-src/shadcn/button/item.json:3-12
"id": "shadcn/button",
"namespace": "shadcn",
"name": "Button",
"kind": "component",
"description": "Foldkit-native shadcn base-nova Button wrapper using local Base UI Button behavior and pure class maps.",
"sourceRoot": "registry-src/shadcn/button",
"installableSourcePaths": [
  "src/registry/shadcn/button/index.ts",
  "src/registry/shadcn/button/examples.ts"
]

registry-src/shadcn/button/item.json:65-77
"registry": [
  {
    "specifier": "base-ui/button",
    "classification": "registry-local",
    "target": "base-ui/button",
    "reason": "shadcn Button composes the local Base UI Button primitive."
  },
  {
    "specifier": "utils/cn",
    "classification": "registry-local",
    "target": "utils/cn",
    "reason": "shadcn Button uses the local class composition helper instead of CVA."
  }
]

registry-src/shadcn/button/item.json:247-252
"lifecycle": {
  "implementationStatus": "implemented",
  "parityStatus": "accepted",
  "driftStatus": "current",
  "availability": "installable"
}

registry-src/shadcn/button/item.json:255-259
"summary": "Icon examples use local inline SVGs instead of origin icon packages.",
"required": true,
"status": "accepted",
"rationale": "Installable source cannot depend on lucide-react or @tabler/icons-react."
```

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Registry/docs build | `bun run registry:build` | exit 0; `registry/docs/shadcn/button.json` includes complete docs |
| Targeted tests | `bun run test -- src/scene.test.ts src/story.test.ts src/registry/schema.test.ts scripts/registry-common.test.ts` | all pass |
| Registry validation | `bun run registry:check` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Full tests | `bun run test` | exit 0 |
| Lint/check | `bun run check` | exit 0 |
| Build | `bun run build` | exit 0 |
| Whitespace | `git diff --check -- registry-src/shadcn/button registry/docs src scripts plans` | exit 0 |

## Scope

**In scope**:

- `registry-src/shadcn/button/docs.md` (create)
- `registry-src/shadcn/button/item.json`
- docs artifact generation/validation code from plan 061 only if the sidecar
  template needs a small adjustment
- docs site component detail route/view files under `src/**`
- `src/scene.test.ts`
- `src/story.test.ts`
- `registry/docs/shadcn/button.json`
- `registry/docs/index.json`
- `plans/README.md` status row update

**Out of scope**:

- Do not backfill docs for any other component.
- Do not implement live examples.
- Do not implement the installer CLI.
- Do not change Button component runtime behavior or parity fixtures.
- Do not move the manifest fields into Markdown.

## Git workflow

- Branch: `codex/063-button-docs-page`
- Commit after the sidecar, generated artifact, page rendering, and tests pass.
- Do not push or open a PR unless the operator explicitly instructs it.

## Steps

### Step 1: Create the docs sidecar template

Create `registry-src/shadcn/button/docs.md` with the required headings:

```md
# Button

## Overview

## Foldkit Model

## Usage

## Examples

## Accessibility

## Foldkit Differences
```

Write concise, user-facing prose. It should explain that the shadcn Button is a
styled Foldkit wrapper around local Base UI Button behavior and `utils/cn`, and
that origin icon packages are represented with local inline SVGs.

Do not add raw HTML or arbitrary runtime directives. Markdown should use
headings, paragraphs, lists, code fences, and links only.

**Verify**: `rg -n "^# Button|^## Overview|^## Foldkit Model|^## Usage|^## Examples|^## Accessibility|^## Foldkit Differences" registry-src/shadcn/button/docs.md` -> exit 0 and all headings present.

### Step 2: Mark Button docs complete

Update `registry-src/shadcn/button/item.json` lifecycle to
`"docsStatus": "complete"` if plan 061 added that field. Leave all other
components at their current docs status.

**Verify**: `rg -n '"docsStatus": "complete"' registry-src/shadcn/button/item.json` -> exit 0.

### Step 3: Regenerate docs artifacts

Run the registry build. Confirm `registry/docs/shadcn/button.json` decodes and
contains the sidecar Markdown, headings, install command metadata, dependencies,
examples, quality data, and source/provenance references.

**Verify**: `bun run registry:build && rg -n "Button|Foldkit Differences|shadcn/button|base-ui/button|accepted|installable" registry/docs/shadcn/button.json` -> exit 0.

### Step 4: Render the component detail page

Update the docs app so `/components/shadcn/button` renders from the generated
artifact. The page must include these sections:

- Overview
- Installation
- Usage
- Examples
- API
- Accessibility
- Quality
- Source
- Foldkit Differences

The API section may say API extraction is pending, but the slot must exist.
Quality should show availability, implementation, parity, drift, origin, and
accepted deviations in user-facing language.

**Verify**: `bun run test -- src/scene.test.ts` -> tests assert
`/components/shadcn/button` renders all section headings.

### Step 5: Render dependency relationship panels

On `shadcn/button`, render a compact "Composes" panel listing:

- `base-ui/button`
- `utils/cn`

If the shell supports a Base UI detail route, the later `base-ui/button` page can
show "Used by"; do not implement a full graph in this plan.

**Verify**: `bun run test -- src/scene.test.ts` -> tests can locate "Composes",
`base-ui/button`, and `utils/cn` on the Button page.

### Step 6: Update the plan index

Mark plan 063 as DONE in `plans/README.md` when complete, unless a reviewer owns
the index.

**Verify**: `rg -n "\\| 063 \\| Add component docs sidecars and the shadcn Button page \\| P1 \\| M \\| 061, 062 \\| DONE \\|" plans/README.md` -> exit 0.

## Test plan

- Add Scene coverage for `/components/shadcn/button` required sections.
- Add Scene coverage for "Composes" and quality status.
- Add registry/docs validation tests for required `docs.md` headings and for
  rejecting raw HTML if the parser supports that check.

## Done criteria

- [ ] `registry-src/shadcn/button/docs.md` exists and passes the template check.
- [ ] `shadcn/button` has complete docs status.
- [ ] `registry/docs/shadcn/button.json` includes sidecar markdown and headings.
- [ ] `/components/shadcn/button` renders required sections.
- [ ] The page exposes dependency, quality, source, and Foldkit difference data.
- [ ] `bun run registry:check`, `bun run test`, `bun run typecheck`,
  `bun run check`, `bun run build`, and `git diff --check -- registry-src/shadcn/button registry/docs src scripts plans` exit 0.

## STOP conditions

Stop and report back if:

- `shadcn/button` is no longer installable or its manifest path changed.
- The generated docs artifact from plan 061 cannot represent sidecar Markdown.
- Rendering the page appears to require live examples.
- You need to change Button runtime source to make docs work.

## Maintenance notes

This page is the exemplar for future docs backfill. Reviewers should check that
the prose teaches Foldkit differences rather than repeating origin docs, and
that generated facts still come from registry artifacts instead of hand-authored
Markdown.

<!-- prettier-ignore-end -->
