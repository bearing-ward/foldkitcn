# Plan 099: Document shadcn Typography as a docs-only page

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report - do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
> `git diff --stat a751f80c..HEAD -- registry-src/shadcn/typography src/registry/shadcn/typography src/live-examples.ts src/main.ts src/scene.test.ts scripts/registry-common.ts scripts/registry-component-progress-common.test.ts docs/component-conversion-checklist.md docs/component-conversion-checklist.json registry/index.json registry/docs/index.json registry/docs/shadcn/typography.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/015-add-docs-example-only-held-row-planning.md, plans/061-add-docs-readiness-and-generated-documentation-artifacts.md, plans/068-add-live-component-example-runtime.md
- **Category**: docs
- **Planned at**: commit `a751f80c`, 2026-07-02

## Why this matters

`shadcn/typography` is still shown as a blocked component row, but origin does
not ship a Typography component. The origin page exists to explain that
typography styles are not included by default and to show utility-class
examples. Foldkit CN should match that intent: publish a discoverable
Typography docs page with live/static examples, make it clear that there is no
installable helper, and remove Typography from the "blocked component" mental
model without inventing a fake runtime API.

## Current state

- Origin Typography is docs/examples, not source-backed component code:
  `repos/ui/apps/v4/content/docs/components/base/typography.mdx:8` says
  "We do not ship any typography styles by default." The rest of that file
  lists example previews for h1, h2, h3, h4, p, blockquote, table, list,
  inline code, lead, large, small, muted, and RTL.
- The resolver already classifies Typography as docs/example-only:
  `scripts/origin-common.ts:440-490` records docs paths, example paths, public
  registry JSON paths, `react` and `@/components/language-selector` as fixture
  hints, and the blocker "Typography is docs/examples plus local style
  primitive evidence, not a single installable behavior component yet."
- Tests pin the current resolver behavior:
  `scripts/origin-common.test.ts:94-128` expects `resolutionStatus` to be
  `docs-example-only`, `sourcePaths` to be empty, the missing primary source to
  be `repos/ui/apps/v4/styles/base-nova/ui/typography.tsx`, and the same
  non-installable planning text to be present.
- The conversion checklist currently shows Typography as blocked:
  `docs/component-conversion-checklist.md:137-140` includes
  `shadcn/typography` in the Blocked table. The generated JSON at
  `docs/component-conversion-checklist.json:2392-2421` says
  `hasRegistryItem: false`, `availability: private`, and `readiness: blocked`.
- Plan 015 intentionally kept Typography non-installable while turning the
  resolver failure into docs/example-only evidence:
  `plans/015-add-docs-example-only-held-row-planning.md:330-354` says
  `shadcn/typography` is not a single behavior component, should be represented
  as docs/examples plus local style primitives, and must not become installable
  in that plan.
- The docs site only renders public component pages for `kind: "component"`
  rows with `availability: "installable"` or `"preview"`:
  `src/data.ts:133-136`.
- The generated docs artifact contract allows zero installable source paths:
  `src/registry/schema.ts:359-383` includes `installableSourcePaths` as an
  array in every docs artifact, and `scripts/registry-common.ts:310-316`
  falls back to `sourceRoot` for `localInstallPathForItem` when that array is
  empty.
- The generic component detail page currently assumes every public component
  has an importable helper. `src/main.ts:2641-2717` renders installation and
  usage sections, including an import snippet. `src/main.ts:3466-3504` renders
  the Source section by mapping `artifact.installableSourcePaths`, which would
  become an empty list for Typography. `src/main.ts:3509-3536` has a generic
  Foldkit Differences sentence about replacing React, CVA, and icon packages.
- Registry docs validation requires complete sidecar docs to include the item
  heading plus `Overview`, `Foldkit Model`, `Accessibility`, and
  `Foldkit Differences`: `src/registry/validation.ts:380-421`.
- Example docs artifacts become live-ready only when `scripts/registry-common.ts`
  includes the export name in `liveReadyExampleExportsByItemId`; otherwise they
  are static. See `scripts/registry-common.ts:861-889`.
- Runtime live previews resolve through `src/live-examples.ts:3005-3024`.
  Static examples can be registered with `staticExample`, as already done for
  `shadcn/table` at `src/live-examples.ts:2663-2667`.

## Commands you will need

| Purpose                          | Command                                                                                                                                              | Expected on success                                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Generate registry/docs artifacts | `bun run registry:build`                                                                                                                             | exit 0; updates `registry/index.json`, `registry/docs/index.json`, and `registry/docs/shadcn/typography.json` |
| Refresh conversion checklist     | `bun run origin:components:write`                                                                                                                    | exit 0; updates `docs/component-conversion-checklist.md` and `.json`                                          |
| Registry validation              | `bun run registry:check`                                                                                                                             | exit 0; prints `Verified docs/component-conversion-checklist.md is current.`                                  |
| Focused tests                    | `bun run test -- src/registry/validation.test.ts scripts/origin-common.test.ts scripts/registry-component-progress-common.test.ts src/scene.test.ts` | all tests pass                                                                                                |
| Typecheck                        | `bun run typecheck`                                                                                                                                  | exit 0, no TypeScript errors                                                                                  |
| Lint/format check                | `bun run check`                                                                                                                                      | exit 0                                                                                                        |
| Build                            | `bun run build`                                                                                                                                      | exit 0                                                                                                        |

Do not run `bun run fix` unless a reviewer explicitly asks for formatting
mutations. Use `bun run check` to verify formatting after your edits.

## Scope

**In scope**:

- `registry-src/shadcn/typography/item.json` (create)
- `registry-src/shadcn/typography/docs.md` (create)
- `src/registry/shadcn/typography/examples.ts` (create)
- `src/registry/shadcn/typography/typography.test.ts` (create)
- `src/live-examples.ts`
- `src/main.ts`
- `src/scene.test.ts`
- `scripts/registry-common.ts`
- `scripts/registry-component-progress-common.test.ts`
- Generated artifacts from `bun run registry:build`:
  - `registry/index.json`
  - `registry/docs/index.json`
  - `registry/docs/shadcn/typography.json`
- Generated checklist artifacts from `bun run origin:components:write`:
  - `docs/component-conversion-checklist.md`
  - `docs/component-conversion-checklist.json`
- `plans/README.md` status row for this plan

**Out of scope**:

- Do not create `src/registry/shadcn/typography/index.ts`.
- Do not add installable Typography helpers or style primitives.
- Do not add Typography to `installableSourcePaths`.
- Do not install or import React, `@/components/language-selector`, or origin
  repo paths.
- Do not change `scripts/origin-common.ts` resolver classification unless a
  validation failure proves the plan impossible. The docs/example-only
  classification is intentional evidence, not a bug.
- Do not broaden this into data-table, date-picker, or chart work.

## Git workflow

- Branch: `codex/099-document-shadcn-typography-docs-only`.
- Commit style: Conventional Commit, matching recent history such as
  `fix: stabilize sonner live previews` and
  `feat: expand shadcn live previews`.
- Keep this as one logical commit unless your operator asks for smaller commits.
- Do not push or open a PR unless explicitly instructed.

## Steps

### Step 1: Add the docs-only registry manifest

Create `registry-src/shadcn/typography/item.json` as a public preview component
page with no installable runtime source.

Use this target shape:

```json
{
  "schemaVersion": 1,
  "id": "shadcn/typography",
  "namespace": "shadcn",
  "name": "Typography",
  "kind": "component",
  "description": "Docs-only shadcn typography utility examples. Foldkit CN does not ship a Typography component or default prose styles.",
  "sourceRoot": "registry-src/shadcn/typography",
  "installableSourcePaths": [],
  "consumedThemeTokens": [
    "--background",
    "--border",
    "--foreground",
    "--muted-foreground"
  ],
  "originProvenance": [
    {
      "originKind": "shadcn",
      "originName": "shadcn Typography",
      "docsUrl": "https://ui.shadcn.com/docs/components/typography",
      "sourceUrl": "https://github.com/shadcn-ui/ui/tree/40c7064532185f5556f6cbff7dca3544987c0fe1/apps/v4/content/docs/components/base/typography.mdx",
      "localRepoPath": "repos/ui",
      "gitRef": "40c7064532185f5556f6cbff7dca3544987c0fe1",
      "inventoryHash": "40c7064532185f5556f6cbff7dca3544987c0fe1",
      "sourcePaths": [],
      "docsPaths": [
        "repos/ui/apps/v4/content/docs/components/base/typography.mdx",
        "repos/ui/apps/v4/content/docs/components/radix/typography.mdx"
      ],
      "examplePaths": [
        "repos/ui/apps/v4/examples/base/typography-demo.tsx",
        "repos/ui/apps/v4/examples/base/typography-h1.tsx",
        "repos/ui/apps/v4/examples/base/typography-h2.tsx",
        "repos/ui/apps/v4/examples/base/typography-h3.tsx",
        "repos/ui/apps/v4/examples/base/typography-h4.tsx",
        "repos/ui/apps/v4/examples/base/typography-p.tsx",
        "repos/ui/apps/v4/examples/base/typography-blockquote.tsx",
        "repos/ui/apps/v4/examples/base/typography-table.tsx",
        "repos/ui/apps/v4/examples/base/typography-list.tsx",
        "repos/ui/apps/v4/examples/base/typography-inline-code.tsx",
        "repos/ui/apps/v4/examples/base/typography-lead.tsx",
        "repos/ui/apps/v4/examples/base/typography-large.tsx",
        "repos/ui/apps/v4/examples/base/typography-small.tsx",
        "repos/ui/apps/v4/examples/base/typography-muted.tsx",
        "repos/ui/apps/v4/examples/base/typography-rtl.tsx"
      ],
      "testPaths": []
    }
  ],
  "dependencies": {
    "registry": [],
    "runtime": [],
    "development": [
      {
        "specifier": "react",
        "classification": "dev-or-fixture-only",
        "target": "",
        "reason": "Origin examples are React fixtures only; this docs-only row does not install React runtime source."
      },
      {
        "specifier": "@/components/language-selector",
        "classification": "dev-or-fixture-only",
        "target": "",
        "reason": "Origin RTL fixture helper is replaced with deterministic local RTL example copy."
      }
    ]
  },
  "examples": [
    {
      "id": "shadcn/typography-demo",
      "title": "TypographyDemo",
      "description": "Article-style typography utility-class example.",
      "sourcePath": "src/registry/shadcn/typography/examples.ts",
      "kind": "demo"
    }
  ],
  "parity": {
    "itemId": "shadcn/typography",
    "originFixturePath": "",
    "foldkitFixturePath": "",
    "requiredComparisons": [],
    "acceptedDeviationIds": ["shadcn-typography-docs-only"]
  },
  "lifecycle": {
    "implementationStatus": "implemented",
    "parityStatus": "waived",
    "driftStatus": "current",
    "availability": "preview",
    "docsStatus": "complete"
  },
  "deviations": [
    {
      "id": "shadcn-typography-docs-only",
      "summary": "Typography is documented as utility-class examples, not as an installable component.",
      "required": true,
      "status": "accepted",
      "rationale": "Origin explicitly does not ship typography styles by default, and Foldkit CN should not invent a runtime Typography API to satisfy a docs-only page."
    }
  ]
}
```

After creating the manifest, add the remaining Typography examples to the
`examples` array in the same order as the origin page: h1, h2, h3, h4, p,
blockquote, table, list, inline-code, lead, large, small, muted, rtl. Use ids
like `shadcn/typography-h1` and titles like `TypographyH1`.

**Verify**:

```bash
bun run registry:check
```

Expected result: it may still fail later because the examples source and docs
sidecar do not exist yet. It must not fail on JSON syntax or schema decoding for
the new manifest. If it fails with invalid schema fields, fix the manifest
before moving on.

### Step 2: Add the sidecar docs that explain the non-component decision

Create `registry-src/shadcn/typography/docs.md`.

The docs must include these headings exactly so registry validation passes:

```markdown
# Typography

## Overview

## Foldkit Model

## Usage

## Examples

## Accessibility

## Foldkit Differences
```

Required content:

- State plainly that Foldkit CN does not ship default typography styles or a
  Typography component.
- Say this page demonstrates utility classes applied directly to semantic HTML.
- In `Foldkit Model`, say there is no Model, Message, update function, Command,
  or installable helper for Typography; parent views own their markup.
- In `Usage`, show a direct Foldkit Html example such as
  `h.h1([h.Class('scroll-m-20 text-4xl font-extrabold tracking-tight')], ['...'])`
  instead of an import from `shadcn/typography`.
- In `Foldkit Differences`, explain that React and the origin language selector
  are fixture evidence only, and that the local RTL example uses deterministic
  text.

**Verify**:

```bash
bun run registry:check
```

Expected result: no "Complete docs require ..." errors for
`registry-src/shadcn/typography/docs.md`. If errors remain for missing example
source, continue to Step 3.

### Step 3: Add deterministic utility-class examples

Create `src/registry/shadcn/typography/examples.ts`.

This file is example source only. It must not export a component API and must
not be listed in `installableSourcePaths`.

Match local example conventions:

- Import `type { Html }` and `html` from `foldkit/html`.
- Use `const h = html<never>()` inside each exported example function.
- Export one `const` per example named exactly like the manifest titles.
- Return semantic elements (`h.h1`, `h.h2`, `h.p`, `h.blockquote`,
  `h.table`, `h.ul`, `h.code`, etc.) with shadcn/base-nova utility classes.
- Use deterministic local strings. Do not import the origin language selector.

Minimum exports:

- `TypographyDemo`
- `TypographyH1`
- `TypographyH2`
- `TypographyH3`
- `TypographyH4`
- `TypographyP`
- `TypographyBlockquote`
- `TypographyTable`
- `TypographyList`
- `TypographyInlineCode`
- `TypographyLead`
- `TypographyLarge`
- `TypographySmall`
- `TypographyMuted`
- `TypographyRtl`

Create `src/registry/shadcn/typography/typography.test.ts` with Scene tests
that render representative examples:

- `TypographyDemo` contains a heading, paragraphs, a blockquote, a list, and a
  table.
- `TypographyInlineCode` renders `code`.
- `TypographyRtl` renders an element with `dir="rtl"` or an equivalent
  direction attribute and deterministic RTL text.

**Verify**:

```bash
bun run test -- src/registry/shadcn/typography/typography.test.ts
```

Expected result: all new tests pass.

### Step 4: Register Typography examples as live-ready previews

Update `scripts/registry-common.ts`:

- Add a `'shadcn/typography'` entry to `liveReadyExampleExportsByItemId`.
- Include every export from Step 3.

Update `src/live-examples.ts`:

- Import the Typography example exports from
  `./registry/shadcn/typography/examples`.
- Add `liveExampleViews` entries using `staticExample(...)`, following the
  existing `shadcn/table` pattern at `src/live-examples.ts:2663-2667`.

Then run:

```bash
bun run registry:build
```

Expected result:

- `registry/docs/shadcn/typography.json` exists.
- Its examples have `"previewStatus": "live-ready"`.
- Its `"installableSourcePaths"` array is empty.
- Its quality availability is `"preview"` and parity status is `"waived"`.

Use this check:

```bash
node -e "const doc=require('./registry/docs/shadcn/typography.json'); console.log(doc.installableSourcePaths.length, doc.quality.availability, doc.quality.parityStatus, doc.examples.every(e => e.previewStatus === 'live-ready'))"
```

Expected output:

```text
0 preview waived true
```

### Step 5: Teach the docs shell to avoid import/install copy for docs-only rows

Update `src/main.ts` narrowly so a public component with a docs artifact and
zero `installableSourcePaths` renders docs-only copy instead of install/import
copy.

Add a small helper near the component detail helpers:

```ts
const isDocsOnlyComponent = (component: PublicComponent): boolean =>
  Option.match(component.maybeDocsArtifact, {
    onNone: () => false,
    onSome: artifact =>
      Array.isReadonlyArrayEmpty(artifact.installableSourcePaths),
  })
```

Then adjust:

- `installationSectionView`: before the availability match, if
  `isDocsOnlyComponent(component)` is true, render a paragraph explaining that
  there is no installable component for this page.
- `usageSectionView`: if docs-only, render direct utility-class guidance and do
  not call `snippetBlockView(importSnippetFor(component), ...)`.
- `apiSectionView`: accept `component` as an argument and render "No component
  API is exported for this docs-only page" for docs-only rows.
- `sourceSectionView`: when `artifact.installableSourcePaths` is empty, render
  a sentence such as "No installable source files are published for this
  docs-only page" instead of an empty list.
- `foldkitDifferencesSectionView`: for docs-only rows, replace the generic
  React/CVA/icon-package copy with Typography-specific copy.

Keep the existing behavior unchanged for installable components such as
`shadcn/button`.

Update `src/scene.test.ts`:

- Add a component detail test for
  `ComponentDetailRoute({ namespace: 'shadcn', slug: 'typography' })`.
- Assert that the page has the `Typography` heading.
- Assert that it contains the no-default-typography/no-installable-component
  copy.
- Assert that it does **not** contain
  `bunx foldkitcn add shadcn/typography`.
- Assert that it does **not** contain
  `import { Typography } from '@/components/foldkitcn/shadcn/typography'`.
- Assert that at least one live preview heading, such as `TypographyDemo`, is
  present.

Also keep the existing Button tests passing so the installable component path is
not regressed.

**Verify**:

```bash
bun run test -- src/scene.test.ts
```

Expected result: all scene tests pass.

### Step 6: Refresh the origin progress checklist and stale held-row tests

Because `shadcn/typography` now has a registry item, the progress report should
mark it imported even though the origin resolver remains docs/example-only.

Update `scripts/registry-component-progress-common.test.ts`:

- In the held-row test, keep `shadcn/data-table`, `shadcn/date-picker`, and
  `shadcn/chart` blocked.
- Remove `shadcn/toast` from the blocked expectation if it is still present,
  because Plan 098 already added a registry item for toast.
- Remove `shadcn/typography` from the blocked expectation.
- Add assertions that `requireRow('shadcn/toast').readiness` and
  `requireRow('shadcn/typography').readiness` are `imported`.

Run:

```bash
bun run origin:components:write
bun run test -- scripts/registry-component-progress-common.test.ts
```

Expected result:

- `docs/component-conversion-checklist.md` no longer lists
  `shadcn/typography` in the Blocked section.
- `docs/component-conversion-checklist.json` has
  `"hasRegistryItem": true` and `"readiness": "imported"` for
  `shadcn/typography`.
- The focused progress test passes.

### Step 7: Run final verification

Run the full gates for this plan:

```bash
bun run registry:check
bun run test -- src/registry/validation.test.ts scripts/origin-common.test.ts scripts/registry-component-progress-common.test.ts src/registry/shadcn/typography/typography.test.ts src/scene.test.ts
bun run typecheck
bun run check
bun run build
```

Expected result: all commands exit 0.

Check scope:

```bash
git status --short
```

Expected result: only in-scope files from this plan are modified. If
`.codex/hooks.json` is present as an unrelated untracked file, leave it
unstaged and do not modify it.

## Test plan

- `src/registry/shadcn/typography/typography.test.ts` covers the new example
  source directly with Scene.
- `src/scene.test.ts` covers the rendered component detail route and the
  docs-only UI branch.
- `scripts/registry-component-progress-common.test.ts` covers the tracker
  transition from blocked to imported for Typography.
- Existing `scripts/origin-common.test.ts` should continue to pass unchanged,
  proving origin evidence is still docs/example-only.

## Done criteria

All must hold:

- [ ] No `src/registry/shadcn/typography/index.ts` exists.
- [ ] `registry-src/shadcn/typography/item.json` has
      `"installableSourcePaths": []`.
- [ ] `registry/docs/shadcn/typography.json` exists and has an empty
      `installableSourcePaths` array.
- [ ] `/components/shadcn/typography` is a public preview component page.
- [ ] The Typography page explains that no default typography styles or
      installable Typography component are shipped.
- [ ] The Typography page does not show `bunx foldkitcn add shadcn/typography`.
- [ ] The Typography page does not show an import snippet for
      `@/components/foldkitcn/shadcn/typography`.
- [ ] Typography examples are rendered as `.live-example-preview` cards.
- [ ] `docs/component-conversion-checklist.md` no longer lists
      `shadcn/typography` under Blocked.
- [ ] `bun run registry:check` exits 0.
- [ ] The focused Vitest command in Step 7 exits 0.
- [ ] `bun run typecheck`, `bun run check`, and `bun run build` exit 0.
- [ ] No out-of-scope files are modified.
- [ ] The status row for Plan 099 in `plans/README.md` is updated to DONE.

## STOP conditions

Stop and report back instead of improvising if:

- Registry schema validation requires every public `kind: "component"` item to
  have at least one `installableSourcePaths` entry.
- The docs route cannot render `shadcn/typography` without adding an installable
  source file.
- Satisfying the page requires changing the registry schema availability enum or
  adding a new lifecycle enum.
- The implementation starts to look like a real Typography component API rather
  than docs/examples.
- A verification command fails twice after a focused fix attempt.
- A necessary change falls outside the in-scope file list.

## Maintenance notes

- Future Typography API work should be a separate plan. This plan intentionally
  resolves the current blocker by matching origin's "we do not ship typography
  styles" stance.
- Reviewers should scrutinize that `src/main.ts` only changes the docs-only
  branch and does not regress installable component install/import snippets.
- If the registry later gets first-class docs-only item kinds or availability
  values, this page can migrate from `kind: "component"`,
  `availability: "preview"` to that explicit vocabulary. Do not invent that
  schema expansion in this plan.
