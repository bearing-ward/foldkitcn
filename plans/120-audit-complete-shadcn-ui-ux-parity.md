# Plan 120: Audit complete shadcn UI and UX parity

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the next
> step. If anything in the "STOP conditions" section occurs, stop and report; do
> not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
>
> ```bash
> git diff --stat a46f944d..HEAD -- README.md package.json docs/decisions docs/component-conversion-checklist.md src registry registry-src public/r tests scripts plans/README.md
> ```
>
> If files that affect the shadcn docs surface changed since this plan was
> written, compare the "Current state" section below against the live repo and
> the two target URLs before proceeding. If the component inventory no longer
> matches the snapshot below, update the punch-list inventory from the live URLs
> and note the drift in the artifact.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: LOW
- **Depends on**: plans/119-fix-shadcn-slider-pointer-interactions.md
- **Category**: tests
- **Planned at**: commit `a46f944d`, 2026-07-08

## Why this matters

Foldkit CN is aiming for complete shadcn UI parity, and the remaining work now
needs a QA-grade punch list across the whole public component surface rather
than isolated reports. Prior plans fixed many targeted regressions, but they
also intentionally skipped chart and toast and did not require every component
page to be compared against the current live origin docs. This plan produces a
single evidence-backed cleanup backlog: every origin component, every local
counterpart, example content, visual layout, and interaction behavior.

## Current state

Relevant files and references:

- `README.md` - declares the repo commands and the generated docs/registry
  source split.
- `package.json` - declares the verification, parity, and Playwright-capable
  tooling commands.
- `docs/decisions/0001-foldkit-registry-architecture.md` - records the
  Foldkit-native registry architecture and the chart gate.
- `docs/decisions/0002-foldkit-cn-documentation-site.md` - records that site
  chrome does not need shadcn.com visual parity, while shadcn previews do.
- `docs/component-conversion-checklist.md` - current generated conversion
  status; it says shadcn has 62 imported rows out of 63 and `shadcn/chart` is
  blocked.
- `src/registry/shadcn/**` - local installable shadcn source and examples.
- `registry/docs/shadcn/*.json` - generated docs artifacts consumed by local
  component pages.
- `tests/e2e/*.test.ts` - current browser regression coverage for docs examples,
  overlays, forms/collections, and surface layout.
- `scripts/parity-workbench.ts`, `scripts/parity-origin-shadcn.ts`, and
  `scripts/parity-dry-run.ts` - existing parity tooling that should be reused
  for focused evidence when manual QA finds a discrepancy.

Repo command excerpts:

`README.md:5-19` lists the canonical commands:

```text
bun run dev
bun run build
bun run typecheck
bun run test
bun run check
bun run registry:build
```

`package.json:5-29` includes:

```json
"scripts": {
  "dev": "vite",
  "docs:live-preview-gaps": "bun run scripts/report-docs-live-preview-gaps.ts",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "check": "ultracite check --disable-nested-config",
  "registry:check": "bun run scripts/check-registry.ts",
  "origin:components:status": "bun run scripts/registry-component-progress.ts status",
  "parity:check": "bun run scripts/parity-dry-run.ts",
  "parity:origin:shadcn": "bun run scripts/parity-origin-shadcn.ts",
  "parity:workbench": "bun run scripts/parity-workbench.ts"
}
```

Architecture constraints:

`docs/decisions/0001-foldkit-registry-architecture.md:15-41` says public APIs
must use Foldkit `Model`, `Message`, `init`, `update`, `view`, Submodel,
OutMessage, commands, and local registry primitives; shadcn items must not
import upstream Base UI/Radix React packages. It also says charts are gated on
an explicit native chart foundation, live docs URLs are discovery inputs rather
than parity oracles, and React is allowed only in origin fixture infrastructure.

`docs/decisions/0002-foldkit-cn-documentation-site.md:44-49` says the docs shell
and component preview styling are separate concerns: the shell follows Foldkit
identity, shadcn previews render with shadcn/base-nova tokens, and component
parity remains scoped to origin component fixtures. For this QA plan, the user
explicitly asked to compare against the live origin URL, so use the live origin
docs as the visible UX standard and record any conflict with pinned origin
fixtures as "origin drift" instead of silently ignoring it.

Current conversion checklist:

`docs/component-conversion-checklist.md:7-18` says shadcn docs are `62 / 63`
imported, with 1 blocked row, 60 source-backed rows, and 3 docs/example-only
rows.

`docs/component-conversion-checklist.md:137-139` says `shadcn/chart` is blocked:
its origin URL is `https://ui.shadcn.com/docs/components/chart`, parity is
`not-started`, and ADR 0001 gates charts on a native chart foundation.

Current rendered inventory snapshot, captured with Playwright on 2026-07-08:

- Origin URL: `https://ui.shadcn.com/docs/components`
- Local URL: `http://localhost:5173/components/shadcn`
- Origin rendered component count: 64
- Local rendered shadcn component count: 62
- Origin-only slugs: `chart`, `toast`
- Local-only slugs: none

Origin component inventory:

```text
accordion, alert, alert-dialog, aspect-ratio, attachment, avatar, badge,
breadcrumb, bubble, button, button-group, calendar, card, carousel, chart,
checkbox, collapsible, combobox, command, context-menu, data-table,
date-picker, dialog, direction, drawer, dropdown-menu, empty, field,
hover-card, input, input-group, input-otp, item, kbd, label, marker, menubar,
message, message-scroller, native-select, navigation-menu, pagination, popover,
progress, radio-group, resizable, scroll-area, select, separator, sheet,
sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea,
toast, toggle, toggle-group, tooltip, typography
```

Local shadcn inventory:

```text
accordion, alert, alert-dialog, aspect-ratio, attachment, avatar, badge,
breadcrumb, bubble, button, button-group, calendar, card, carousel, checkbox,
collapsible, combobox, command, context-menu, data-table, date-picker, dialog,
direction, drawer, dropdown-menu, empty, field, hover-card, input, input-group,
input-otp, item, kbd, label, marker, menubar, message, message-scroller,
native-select, navigation-menu, pagination, popover, progress, radio-group,
resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider,
sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip,
typography
```

Working-tree note at planning time:

- The operator's checkout already had unrelated local drift: modified
  `plans/README.md`, `skills-lock.json`, and `src/styles.css`, plus untracked
  skill folders and `plans/119-fix-shadcn-slider-pointer-interactions.md`.
  Treat those as pre-existing. Do not revert them. This plan may add only its
  plan artifact paths and update this plan's status row in `plans/README.md`.

## Commands you will need

| Purpose                    | Command                                                                                                                                        | Expected on success                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Check current git state    | `git status --short`                                                                                                                           | Prints current local drift; no changes from this plan outside `plans/artifacts/120-shadcn-ui-ux-parity-audit/**` and the Plan 120 status row |
| Start local docs if needed | `bun run dev -- --host 127.0.0.1 --port 5173`                                                                                                  | Vite serves `http://localhost:5173`; if that port is already serving the app, reuse it                                                       |
| Local docs smoke           | `node --input-type=module -e "const r = await fetch('http://localhost:5173/components/shadcn'); console.log(r.status)"`                        | Prints `200`                                                                                                                                 |
| Live preview inventory     | `bun run docs:live-preview-gaps`                                                                                                               | Exits 0; use output as QA input, not as proof of parity                                                                                      |
| Conversion status          | `bun run origin:components:status`                                                                                                             | Exits 0 and reports current shadcn progress                                                                                                  |
| Parity slot inventory      | `bun run parity:check -- --grep shadcn --dry-run`                                                                                              | Exits 0 and prints discovered shadcn parity slots                                                                                            |
| Focused parity evidence    | `bun run parity:workbench -- --item shadcn/<slug> --case <case-id> --output plans/artifacts/120-shadcn-ui-ux-parity-audit/workbench --dry-run` | Exits 0 for cases that exist; if no case exists, record that gap in the punch list                                                           |
| Full unit suite            | `bun run test`                                                                                                                                 | Exits 0                                                                                                                                      |
| Typecheck                  | `bun run typecheck`                                                                                                                            | Exits 0                                                                                                                                      |
| Lint/check                 | `bun run check`                                                                                                                                | Exits 0                                                                                                                                      |

Do not run `bun run registry:build`, `bun run fix`, or any command that rewrites
source/generator output during this QA audit. This plan is for evidence and
punch-list creation only.

## Scope

**In scope**:

- Create `plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md`.
- Create `plans/artifacts/120-shadcn-ui-ux-parity-audit/component-matrix.json`.
- Create screenshots or workbench outputs under
  `plans/artifacts/120-shadcn-ui-ux-parity-audit/**`.
- Update only the Plan 120 status row in `plans/README.md` when the audit is
  done or blocked.
- Use the live origin docs as the requested visible standard:
  `https://ui.shadcn.com/docs/components/base/<slug>`.
- Use local docs pages as the product surface under test:
  `http://localhost:5173/components/shadcn/<slug>`.

**Out of scope**:

- Do not fix component source, examples, styles, generated registry output, or
  tests in this plan.
- Do not hand-edit `registry/`, `public/r/`, or `dist/`.
- Do not add React/Radix/upstream Base UI runtime dependencies.
- Do not remove existing intentional Foldkit identity from the docs shell.
- Do not mark a disparity "accepted" merely because an older plan skipped it;
  if origin now exposes it and local does not, record it with context.

## Git workflow

- Branch: use `codex/120-shadcn-ui-ux-parity-audit` if a branch is needed.
- Commit style: match the existing plan commits if the operator asks for a
  commit. Otherwise do not commit.
- This is an advisor/QA artifact plan. Keep implementation fixes for follow-up
  plans generated from the punch list.

## Steps

### Step 1: Capture the live component inventories

Start or reuse the local dev server, then render both inventory pages with
Playwright. The inventory extraction must deduplicate repeated sidebar/content
links and normalize origin `/docs/components/base/<slug>` to local
`/components/shadcn/<slug>`.

Create `plans/artifacts/120-shadcn-ui-ux-parity-audit/component-matrix.json`
with this shape:

```json
{
  "generatedAt": "2026-07-08T00:00:00.000Z",
  "originIndexUrl": "https://ui.shadcn.com/docs/components",
  "localIndexUrl": "http://localhost:5173/components/shadcn",
  "components": [
    {
      "slug": "accordion",
      "title": "Accordion",
      "originUrl": "https://ui.shadcn.com/docs/components/base/accordion",
      "localUrl": "http://localhost:5173/components/shadcn/accordion",
      "surfaceStatus": "present-in-both",
      "qaStatus": "not-started"
    }
  ]
}
```

Allowed `surfaceStatus` values:

- `present-in-both`
- `origin-only`
- `local-only`

Allowed `qaStatus` values:

- `not-started`
- `matches`
- `minor-disparities`
- `major-disparities`
- `blocked`

The first matrix must include all 64 origin slugs in the current snapshot:
`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `attachment`, `avatar`,
`badge`, `breadcrumb`, `bubble`, `button`, `button-group`, `calendar`, `card`,
`carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`,
`context-menu`, `data-table`, `date-picker`, `dialog`, `direction`, `drawer`,
`dropdown-menu`, `empty`, `field`, `hover-card`, `input`, `input-group`,
`input-otp`, `item`, `kbd`, `label`, `marker`, `menubar`, `message`,
`message-scroller`, `native-select`, `navigation-menu`, `pagination`, `popover`,
`progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`,
`sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`,
`tabs`, `textarea`, `toast`, `toggle`, `toggle-group`, `tooltip`, `typography`.

Mark `chart` and `toast` as `origin-only` unless local has gained pages by the
time you run this. For `chart`, include the ADR 0001 chart-foundation blocker.
For `toast`, include the Plan 112 context that it was removed from the public
shadcn registry surface, then still record it as a parity gap because the user
now asked for complete origin parity.

**Verify**:

```bash
node --input-type=module -e "import fs from 'node:fs'; const m = JSON.parse(fs.readFileSync('plans/artifacts/120-shadcn-ui-ux-parity-audit/component-matrix.json', 'utf8')); console.log(m.components.length); console.log(m.components.filter(c => c.surfaceStatus === 'origin-only').map(c => c.slug).join(','));"
```

Expected: prints `64` and, on the current snapshot, `chart,toast`.

### Step 2: Create the punch-list artifact skeleton

Create `plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md`. Use this
top-level structure exactly so follow-up agents can split it into implementation
plans:

```md
# shadcn UI/UX Parity Punch List

Generated: <timestamp>
Origin: https://ui.shadcn.com/docs/components
Local: http://localhost:5173/components/shadcn

## Executive Summary

## P0 Missing Surface

## P1 Major UI/UX Disparities

## P2 Minor UI/UX Disparities

## P3 Polish / Origin Drift Notes

## Component Matrix

## Evidence Index

## Coverage Checklist
```

For every finding, use this row shape:

```md
### <severity>: <component title> - <short problem>

- **Component**: `shadcn/<slug>`
- **Origin URL**: <url>
- **Local URL**: <url or "missing">
- **Origin evidence**: <screenshot path, workbench path, or exact visual/interaction observation>
- **Local evidence**: <screenshot path, workbench path, or exact visual/interaction observation>
- **Expected**: <what origin does>
- **Actual**: <what local does>
- **Impact**: <why users notice or why parity acceptance is blocked>
- **Suggested owner files**: <likely source/docs/test paths, or "needs follow-up investigation">
- **Recommended follow-up**: <fix plan, test plan, architecture decision, or "blocked by native foundation">
```

Severity guidance:

- `P0 Missing Surface`: origin has no local equivalent, or local page cannot load.
- `P1 Major UI/UX Disparities`: core example content missing, impossible or
  broken interactions, broken keyboard/focus/dismissal, materially wrong
  overlay placement, or visual layout that changes the component meaning.
- `P2 Minor UI/UX Disparities`: visible styling, spacing, labels, examples, or
  affordances differ but the component is usable and understandable.
- `P3 Polish / Origin Drift Notes`: differences caused by live origin drift,
  docs-shell differences that are out of scope for component parity, or low-risk
  copy/details that should not block implementation work.

**Verify**:

```bash
test -f plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md
rg -n "## P0 Missing Surface|## P1 Major UI/UX Disparities|## Coverage Checklist" plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md
```

Expected: `test` exits 0 and `rg` prints all three required sections.

### Step 3: Compare every component page visually and structurally

For each component in `component-matrix.json`:

1. Open the origin page at `https://ui.shadcn.com/docs/components/base/<slug>`.
2. Open the local page at `http://localhost:5173/components/shadcn/<slug>`.
3. Capture desktop screenshots at `1440x1200`.
4. Capture mobile screenshots at `390x844`.
5. Compare example inventory: example titles, visible example count, default
   example content, source/code panel availability, install command visibility,
   and any badges such as `New` or `preview`.
6. Compare visible component UX: spacing, size, typography, borders, colors,
   iconography, empty states, scroll containment, and responsive layout.
7. Update the component row in `component-matrix.json` and add findings to
   `punch-list.md`.

Screenshot naming convention:

```text
plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/<slug>/origin-desktop.png
plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/<slug>/local-desktop.png
plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/<slug>/origin-mobile.png
plans/artifacts/120-shadcn-ui-ux-parity-audit/screenshots/<slug>/local-mobile.png
```

Do not compare site chrome as a defect unless it interferes with component
inspection. ADR 0002 explicitly says site-level visual parity with shadcn.com is
not a goal. Do compare component preview frames, example content, source/preview
tabs, install panel behavior, and component-specific interactions.

**Verify**:

```bash
node --input-type=module -e "import fs from 'node:fs'; const m = JSON.parse(fs.readFileSync('plans/artifacts/120-shadcn-ui-ux-parity-audit/component-matrix.json','utf8')); const pending = m.components.filter(c => c.qaStatus === 'not-started'); console.log(pending.map(c => c.slug).join(',')); if (pending.length > 0) process.exit(1);"
```

Expected: exits 0 and prints a blank line.

### Step 4: Run interaction parity passes for behavior components

Run a hands-on interaction pass for every behavior-heavy component. At minimum,
cover:

```text
accordion, alert-dialog, calendar, carousel, checkbox, collapsible, combobox,
command, context-menu, data-table, date-picker, dialog, direction, drawer,
dropdown-menu, hover-card, input, input-group, input-otp, menubar,
navigation-menu, pagination, popover, radio-group, resizable, scroll-area,
select, sheet, sidebar, slider, sonner, switch, tabs, textarea, toggle,
toggle-group, tooltip
```

For each applicable component, compare origin and local for:

- Mouse/pointer behavior.
- Keyboard behavior: Tab, Shift+Tab, Enter, Space, Arrow keys, Escape.
- Focus-visible styling and focus restoration after close/dismiss.
- Disabled, checked, selected, expanded, invalid, loading, and empty states.
- Outside click, Escape, scroll, and viewport collision behavior for overlays.
- Mobile viewport behavior, especially sheets, drawers, sidebar, menus, popovers,
  date picker, carousel, and resizable surfaces.
- RTL/direction examples where origin exposes them.

Use existing focused e2e tests as reference for what the repo already guards:

- `tests/e2e/shadcn-overlay-menu-regressions.test.ts`
- `tests/e2e/shadcn-form-collection-regressions.test.ts`
- `tests/e2e/shadcn-surface-layout-regressions.test.ts`
- `tests/e2e/docs.test.ts`

When a behavior disparity is clear and high-impact, add a suggested test target
in the finding, but do not add or modify tests in this plan.

**Verify**:

```bash
rg -n "Keyboard|Escape|focus|pointer|mobile|Suggested owner files" plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md
```

Expected: prints multiple findings or coverage notes showing that behavior
parity was assessed, not just screenshots.

### Step 5: Use parity tooling for focused evidence

For high-risk or ambiguous discrepancies, run the existing parity tooling
instead of relying only on subjective screenshot review:

```bash
bun run parity:check -- --grep shadcn/<slug> --dry-run
bun run parity:workbench -- --item shadcn/<slug> --case <case-id> --output plans/artifacts/120-shadcn-ui-ux-parity-audit/workbench --dry-run
```

Use the workbench when the component has a matching case and the discrepancy is
about DOM structure, attributes, computed style, dimensions, focus, or a
repeatable interaction recipe. If no parity slot or workbench case exists for a
component that needs one, record that as a QA harness gap in the punch list.

Run these broad read-only commands once and include summaries in the artifact:

```bash
bun run docs:live-preview-gaps
bun run origin:components:status
bun run parity:check -- --grep shadcn --dry-run
```

**Verify**:

```bash
rg -n "docs:live-preview-gaps|origin:components:status|parity:check|parity:workbench|QA harness gap" plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md
```

Expected: prints the tooling summary section and any harness gaps discovered.

### Step 6: Prioritize the cleanup backlog

Convert raw observations into an implementation-ready backlog in
`punch-list.md`:

- Group findings by `P0`, `P1`, `P2`, and `P3`.
- Deduplicate shared root causes. Example: if menu, context menu, menubar, and
  navigation menu share one positioning fault, write one parent finding with
  affected components rather than four vague duplicates.
- For each finding, identify likely owner paths such as
  `src/registry/shadcn/<slug>/index.ts`,
  `src/registry/shadcn/<slug>/examples.ts`,
  `registry-src/shadcn/<slug>/docs.md`, `src/live-examples.ts`, or a specific
  e2e file.
- Separate architecture blockers from ordinary defects. `chart` should point to
  the native chart foundation gate. `toast` should point to the Plan 112 product
  decision and the user's new complete-parity goal.
- Include recommended follow-up plan slices sized for executor agents. A good
  slice fixes one component family or one shared primitive, with tests.

**Verify**:

```bash
rg -n "^### P0:|^### P1:|^### P2:|^### P3:" plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md
node --input-type=module -e "import fs from 'node:fs'; const text = fs.readFileSync('plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md','utf8'); for (const required of ['chart', 'toast', 'Component Matrix', 'Evidence Index', 'Coverage Checklist']) { if (!text.includes(required)) { throw new Error('missing ' + required) } } console.log('punch list shape ok')"
```

Expected: `rg` prints at least the P0 missing-surface findings for `chart` and
`toast`; the Node command prints `punch list shape ok`.

### Step 7: Final QA artifact review

Before marking the plan DONE:

1. Confirm every origin component has a row in `component-matrix.json`.
2. Confirm every row has a non-`not-started` `qaStatus`.
3. Confirm every P1/P2 finding includes origin evidence, local evidence,
   expected behavior, actual behavior, impact, owner hints, and a follow-up
   recommendation.
4. Confirm screenshots or workbench outputs exist for every P1 finding.
5. Confirm no source files were changed by this QA plan.
6. Update the Plan 120 status row in `plans/README.md` to `DONE` or `BLOCKED`
   with a one-line reason.

**Verify**:

```bash
node --input-type=module -e "import fs from 'node:fs'; const m = JSON.parse(fs.readFileSync('plans/artifacts/120-shadcn-ui-ux-parity-audit/component-matrix.json','utf8')); const missing = m.components.filter(c => !c.slug || !c.originUrl || !c.qaStatus || c.qaStatus === 'not-started'); if (m.components.length !== 64 || missing.length > 0) { console.log({ count: m.components.length, missing }); process.exit(1) } console.log('matrix complete')"
git status --short
```

Expected: Node prints `matrix complete`. `git status --short` shows only the
pre-existing drift plus files under
`plans/artifacts/120-shadcn-ui-ux-parity-audit/**` and the intended Plan 120
status row update.

## Test plan

This is a QA artifact plan, not a source-fix plan. Do not add tests here. The
punch list must recommend concrete follow-up tests for each actionable defect:

- Visual/content defects should recommend screenshot, DOM, or example inventory
  assertions in the most relevant e2e file.
- Interaction defects should recommend Playwright tests that reproduce the exact
  origin-vs-local behavior, following the current style in
  `tests/e2e/shadcn-overlay-menu-regressions.test.ts`,
  `tests/e2e/shadcn-form-collection-regressions.test.ts`, and
  `tests/e2e/shadcn-surface-layout-regressions.test.ts`.
- Shared primitive defects should recommend component-level Story/Scene tests
  where possible, then a docs e2e guard for the public surface.

Verification for this plan is artifact completeness plus the read-only commands
listed above.

## Done criteria

- [ ] `plans/artifacts/120-shadcn-ui-ux-parity-audit/component-matrix.json`
      exists and contains all 64 origin components.
- [ ] Every component row has `qaStatus` other than `not-started`.
- [ ] `plans/artifacts/120-shadcn-ui-ux-parity-audit/punch-list.md` exists and
      has P0/P1/P2/P3 sections.
- [ ] `chart` and `toast` are explicitly recorded as origin-only parity gaps
      unless they have been implemented before execution.
- [ ] Every P1 finding has origin evidence, local evidence, expected behavior,
      actual behavior, impact, suggested owner files, and a recommended
      follow-up.
- [ ] The artifact distinguishes component-preview parity from docs-shell visual
      identity per ADR 0002.
- [ ] No source, registry, generated public output, or test files are modified.
- [ ] `bun run docs:live-preview-gaps`, `bun run origin:components:status`, and
      `bun run parity:check -- --grep shadcn --dry-run` were run or their failure
      is recorded as a blocker.
- [ ] `plans/README.md` Plan 120 row is updated to `DONE` or `BLOCKED`.

## STOP conditions

Stop and report back instead of improvising if:

- `http://localhost:5173/components/shadcn` cannot be served locally after a
  normal `bun run dev -- --host 127.0.0.1 --port 5173` attempt.
- The live origin site cannot be reached, blocks browser automation, or changes
  route shape away from `/docs/components/base/<slug>`.
- The origin component count changes by more than 5 components from the current
  snapshot; the scope should be reapproved before spending a full QA pass.
- Completing the audit would require modifying source files, generated registry
  files, or tests.
- A command tries to write outside `plans/artifacts/120-shadcn-ui-ux-parity-audit/**`.
- The discrepancy appears to require reversing an ADR or product decision rather
  than fixing a component. Record the evidence and ask for a direction decision.

## Maintenance notes

This artifact should become the source backlog for the next cleanup wave. After
the punch list is complete, generate follow-up improve plans by grouping
findings around shared roots: missing surface (`chart`, `toast`), overlay/menu
families, form/collection controls, data/date/navigation widgets, static visual
surfaces, and docs/example artifact drift. Keep future implementation plans
small enough that each can add exact red tests, fix one family, refresh generated
artifacts only when necessary, and run the relevant focused Playwright suite.
