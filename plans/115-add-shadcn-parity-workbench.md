# Plan 115: Add an agent-first shadcn parity workbench

> **Executor instructions**: Follow this plan step by step. Build the CLI and
> report contract before adding a visual UI. Run every verification command and
> confirm the expected result before moving to the next step. If anything in the
> "STOP conditions" section occurs, stop and report - do not improvise. When
> done, update the status row for this plan in `plans/README.md` unless a
> reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**:
>
> ```sh
> git diff --stat c4315fd3..HEAD -- package.json .gitignore scripts/parity-dry-run.ts scripts/parity-origin-shadcn.ts src/registry/parity tests/parity playwright.config.ts vite.config.ts docs/decisions/0003-effect-native-tooling.md plans/README.md
> ```
>
> If any in-scope parity, script, or config file changed since this plan was
> written, compare the "Current state" notes against the live code before
> proceeding. On a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: Plans 003, 016, 107
- **Category**: parity tooling
- **Planned at**: commit `c4315fd3`, 2026-07-07
- **Execution status**: DONE on 2026-07-07. Reviewed worker commit `78f626be`
  in `/Volumes/Sync/Development/Bearing-Ward/projects/repos/foldkitcn-plan115`.
  The retry reconciled the pre-existing generated registry/public artifact
  drift via `bun run registry:build`, added the agent-first shadcn parity
  workbench, and passed reviewer verification.

## Why this matters

The current parity infrastructure can compare selected origin and Foldkit
snapshots, but it is still shaped like a test harness. When a component is off
by a little, an agent has to manually inspect origin examples, local examples,
demo data, styles, geometry, portal nodes, and interactions before it can make
a focused fix.

This plan adds a deterministic parity workbench whose first-class output is a
machine-readable report for agents and CI-style workflows. The human workbench
can come from the same artifacts later, but v1 must make one selected shadcn
case easy to compare, explain, and route to likely source files.

The diagnostic standard is complete origin parity. The product promise may
still allow documented Foldkit-native deviations, but those deviations must be
explicit and structured instead of silently normalized away.

## Current state

- `package.json` exposes `parity:check` and `parity:origin:shadcn`.
- `scripts/parity-dry-run.ts` discovers `tests/parity/slots.ts`, captures
  shadcn origin and Foldkit snapshots in subprocesses, and compares class
  tokens, attributes, DOM structure, computed style, colors, dimensions,
  bounding boxes, and keyboard behavior.
- `tests/parity/fixtures/origin/shadcn/runner.ts` uses Playwright, Vite, and
  pinned `repos/ui/apps/v4` origin examples to capture browser snapshots.
- `tests/parity/fixtures/foldkit/shadcn/runner.ts` captures local Foldkit
  shadcn snapshots through the matching fixture path.
- `tests/parity/fixtures/origin/shadcn/snapshot.ts` already captures canonical
  attributes, class tokens, selected computed styles, colors, dimensions,
  bounding boxes, and DOM structure.
- `src/registry/parity/canonicalize.ts` provides canonicalization helpers for
  class tokens, attributes, dimensions, colors, computed styles, bounding
  boxes, and DOM structure.
- `tests/parity/slots.ts` is the current parity slot source of truth. Do not
  create a second independent component registry for the workbench.
- `.gitignore` does not yet ignore parity workbench output directories.
- ADR 0003 requires new registry, docs-generation, and installer-style CLI
  tooling to use Effect programs, `effect/unstable/cli`, and Schema-derived
  boundary types.

## Decisions already made

- Build an agent/CI-oriented CLI first; make any human visual workbench a
  renderer over the same artifacts.
- Compare one selected shadcn component case at a time in v1. Batch mode is a
  follow-up.
- Use the pinned local `repos/ui` checkout as the authoritative origin source.
  The live shadcn website is diagnostic only.
- Capture from the selected root seam down, plus declared portal/layer zones
  elsewhere in `document.body`.
- Use a real browser for the workbench path. Happy DOM is not enough for
  layout, cascade, focus, portals, screenshots, or interactions.
- Capture full browser evidence, but gate on a curated deterministic subset.
- Treat screenshots and pixel diffs as advisory in v1.
- Use per-case interaction recipes built from shared primitives.
- Harvest origin demo data into neutral fixtures. Do not translate arbitrary
  React examples into Foldkit code.
- Default to literal parity, with structured allowlisted deviations.
- Emit JSON as the source report artifact, then Markdown and optional HTML from
  that JSON.
- Keep bulky reports, screenshots, and traces local by default.
- Do not add an automatic CI gate in v1, but make the focused command stable
  enough for later CI promotion.

## Commands you will need

| Purpose                 | Command                                                                                                                                                                                                                                                 | Expected on success                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Drift check             | `git diff --stat c4315fd3..HEAD -- package.json .gitignore scripts/parity-dry-run.ts scripts/parity-origin-shadcn.ts src/registry/parity tests/parity playwright.config.ts vite.config.ts docs/decisions/0003-effect-native-tooling.md plans/README.md` | Empty unless later in-scope work changed these files                         |
| Existing dry-run parity | `bun run parity:check -- --grep shadcn/tabs --dry-run`                                                                                                                                                                                                  | Finds the existing shadcn tabs slot if it is still ready                     |
| Existing focused parity | `bun run parity:check -- --grep shadcn/tabs`                                                                                                                                                                                                            | Still exits 0 before and after this plan                                     |
| Workbench dry run       | `bun run parity:workbench -- --item shadcn/tabs --case tabs-demo --dry-run`                                                                                                                                                                             | Prints the selected slot, case, environment, capture zones, and output paths |
| Workbench report        | `bun run parity:workbench -- --item shadcn/tabs --case tabs-demo`                                                                                                                                                                                       | Writes JSON and Markdown report artifacts under the ignored output directory |
| Tests                   | `bun run test -- tests/parity`                                                                                                                                                                                                                          | exits 0                                                                      |
| Registry validation     | `bun run registry:check`                                                                                                                                                                                                                                | exits 0                                                                      |
| Typecheck               | `bun run typecheck`                                                                                                                                                                                                                                     | exits 0                                                                      |
| Lint/format check       | `bun run check`                                                                                                                                                                                                                                         | exits 0                                                                      |
| Build                   | `bun run build`                                                                                                                                                                                                                                         | exits 0                                                                      |

If `shadcn/tabs` is not ready when execution starts, choose another medium-risk
ready shadcn slot with existing origin and Foldkit fixtures, such as
`shadcn/accordion`, `shadcn/checkbox`, or `shadcn/slider`. Update commands in
the implementation notes and closeout accordingly.

## Scope

**In scope**:

- `package.json` for a new `parity:workbench` script.
- `.gitignore` for the local artifact directory, for example
  `.parity-workbench/`.
- `scripts/parity-workbench.ts` and small helper modules if needed.
- `src/registry/parity/**` for Schema-backed workbench types,
  canonicalization, comparison, and report rendering helpers.
- `tests/parity/**` for workbench config, selected-case metadata, fixture data,
  report tests, and browser capture tests.
- Existing shadcn origin/Foldkit fixture runners, only to extract reusable
  browser-capture helpers without changing accepted parity behavior.
- Generated registry/public artifacts under `registry/` and `public/r/`, only
  if `bun run registry:check` is already red on the base checkout and the
  executor runs `bun run registry:build` solely to reconcile that pre-existing
  generated-artifact drift. No source files outside the Plan 115 scope may be
  edited to justify those generated changes.
- `plans/README.md`, only to mark this row done after verification.

**Out of scope**:

- Public docs routes or public docs navigation for the workbench.
- Automatic batch comparison across all component cases.
- Automatic source patch generation.
- Making pixel diffs a hard failure.
- Comparing against the live shadcn website as a normal parity oracle.
- Rewriting React origin examples into Foldkit source.
- Adding a CI gate.
- Fetching or updating `repos/ui`, `repos/base-ui`, or `repos/foldkit`.
- New runtime dependencies for installable registry components.

## Git workflow

- Branch: `codex/115-add-shadcn-parity-workbench`
- Commit message style: conventional commits, for example
  `test: add shadcn parity workbench`
- Keep generated screenshots, traces, bulky JSON, and HTML reports out of git
  unless the operator explicitly asks to promote a specific artifact under
  `plans/artifacts/`.
- Do not push or open a PR unless the operator asks.

## Steps

### Step 1: Add the workbench schema and case config model

Add Schema-backed boundary types for the workbench under
`src/registry/parity/`. Use Effect Schema as the runtime source of truth.

The model should cover:

- `itemId`, for example `shadcn/tabs`;
- `caseId`, for example `tabs-demo`;
- `originKind`, starting with `pinned-shadcn`;
- `environment`, including viewport, color scheme, reduced motion, locale, and
  text direction fields, even if v1 uses one canonical environment;
- `captureZones`, including the root selector and declared portal/layer
  selectors;
- `comparisonPolicy`, split into hard comparisons and advisory comparisons;
- `interactionRecipes`, with named steps built from shared primitives;
- `allowedDeviations`, each with scope, comparison type, reason, and owner;
- `reportPaths`.

Do not create a second independent component registry. If you add a new
`tests/parity/workbench-cases.ts`, validate that every entry references an
existing `tests/parity/slots.ts` item and that the slot is ready before running
the workbench.

**Verify**:

```sh
bun run test -- tests/parity
bun run typecheck
```

### Step 2: Add the Effect-native CLI shell

Create `scripts/parity-workbench.ts` as an Effect program using
`effect/unstable/cli`. Add `parity:workbench` to `package.json`.

The first command shape should support:

- `--item shadcn/tabs`
- `--case tabs-demo`
- `--output .parity-workbench`
- `--dry-run`
- `--write-fixture` as an explicit opt-in for neutral fixture updates

Dry run should resolve the existing parity slot, the selected workbench case,
the canonical environment, capture zones, comparison policy, and report paths
without launching browsers.

**Verify**:

```sh
bun run parity:workbench -- --item shadcn/tabs --case tabs-demo --dry-run
bun run check
```

### Step 3: Build real-browser capture for one selected case

Refactor or wrap the existing shadcn origin and Foldkit browser runners so the
workbench can capture one selected case under identical conditions.

The capture must use Playwright/Chromium and record:

- root subtree DOM structure, attributes, text, roles, and ARIA state;
- class tokens;
- all computed style properties for debugging;
- curated computed style summaries for hard comparison;
- CSS custom properties visible on the seam;
- bounding boxes, client rects, scroll metrics, and viewport-relative geometry;
- declared portal/layer zones;
- focused element;
- accessibility role/name/state for the selected seam and declared zones;
- screenshots for origin and Foldkit, marked advisory in v1.

Keep one canonical v1 environment: fixed desktop viewport, one theme, reduced
motion, one direction, and stable fonts/assets. Add the schema fields now so
future variants do not need a redesign.

**Verify**:

```sh
bun run parity:workbench -- --item shadcn/tabs --case tabs-demo
```

The command should write a JSON report with non-empty origin and Foldkit
captures, even if comparisons are still limited.

### Step 4: Add neutral demo-data harvesting

Add a small harvester for the selected origin example data. It should extract
obvious stable data such as labels, options, rows, dates, values, image URLs,
menu trees, and static text into a neutral fixture proposal.

Normal mode must report fixture differences without changing files. The
`--write-fixture` flag may create or update a small committed fixture file under
`tests/parity/fixtures/data/shadcn/<component>/<case>.json` or an equivalent
Schema-decoded fixture location.

Do not attempt arbitrary React-to-Foldkit code translation.

**Verify**:

```sh
bun run parity:workbench -- --item shadcn/tabs --case tabs-demo
bun run parity:workbench -- --item shadcn/tabs --case tabs-demo --write-fixture
bun run test -- tests/parity
```

If `--write-fixture` changes a file, inspect the diff and keep it small,
reviewable, and source-data-only.

### Step 5: Implement structured comparisons and deviations

Compare the selected case across origin and Foldkit using hard and advisory
categories.

Hard comparisons in v1:

- selected DOM structure;
- attributes, roles, ARIA state, and accessible names;
- class tokens where meaningful;
- selected computed style properties;
- geometry within explicit tolerances;
- fixture data;
- interaction state after declared recipe steps.

Advisory comparisons in v1:

- screenshots and pixel diffs;
- animation timing;
- non-gating computed style properties outside the curated set;
- broad accessibility-tree differences outside the selected seam and zones.

Allowed deviations must live in structured config, not in comparison code.
Every deviation needs a reason and a narrow scope.

**Verify**:

```sh
bun run parity:workbench -- --item shadcn/tabs --case tabs-demo
bun run test -- tests/parity
```

The JSON report should include categorized diffs, pass/fail status for hard
comparisons, advisory findings, and any applied deviations.

### Step 6: Add per-case interaction recipes

Add shared interaction primitives such as click, hover, focus, tab, press key,
escape, outside click, and wait-for-stable-layout. Then define at least one
per-case recipe for the selected component.

Each recipe step should capture before and after state for:

- DOM and attributes;
- computed style summary;
- geometry;
- focus target;
- accessibility role/name/state;
- declared portals/layers.

Do not use one global "try every interaction" script for every component.

**Verify**:

```sh
bun run parity:workbench -- --item shadcn/tabs --case tabs-demo
bun run test -- tests/parity
```

### Step 7: Render agent-readable reports

Render Markdown from the JSON report. Optional HTML is allowed, but it must be a
renderer over the JSON artifact, not a separate source of truth.

The report should include:

- selected item, case, environment, and command to rerun;
- origin source file path from pinned `repos/ui`;
- Foldkit fixture/source hints;
- capture zones;
- hard failures;
- advisory differences;
- fixture-data differences;
- applied deviations;
- likely owner files, such as `src/registry/shadcn/<component>/index.ts`,
  `examples.ts`, shared base-ui dependency, fixture data, theme/CSS, or
  deviation config.

The tool may route likely owner files, but it must not generate source patches
in v1.

**Verify**:

```sh
bun run parity:workbench -- --item shadcn/tabs --case tabs-demo
find .parity-workbench -maxdepth 3 -type f | sort
```

The output directory should contain JSON and Markdown reports. Screenshots and
HTML may exist if implemented, but they must remain ignored local artifacts.

### Step 8: Preserve existing parity behavior

Run the existing focused parity command for the selected component and the
current parity test suite. The workbench must not weaken or replace the current
`parity:check` contract.

**Verify**:

```sh
bun run parity:check -- --grep shadcn/tabs --dry-run
bun run parity:check -- --grep shadcn/tabs
bun run test -- tests/parity
```

If the selected component changes from `shadcn/tabs`, update these verification
commands consistently.

### Step 9: Final verification

Run:

```sh
bun run parity:workbench -- --item shadcn/tabs --case tabs-demo --dry-run
bun run parity:workbench -- --item shadcn/tabs --case tabs-demo
bun run parity:check -- --grep shadcn/tabs
bun run test -- tests/parity
bun run registry:check
bun run typecheck
bun run check
bun run build
git diff --check -- package.json .gitignore scripts src tests plans
```

Update `plans/README.md` status for plan 115 to `DONE` only after every command
passes.

## Done criteria

- [ ] `bun run parity:workbench -- --item shadcn/tabs --case tabs-demo --dry-run`
      resolves a ready slot, selected case, environment, capture zones, and
      report paths.
- [ ] `bun run parity:workbench -- --item shadcn/tabs --case tabs-demo` writes
      a JSON report and Markdown report under an ignored local artifact
      directory.
- [ ] The report includes origin and Foldkit browser captures from a real
      Chromium run.
- [ ] The report distinguishes hard failures from advisory differences.
- [ ] Root seam and declared portal/layer zones are represented in the capture
      model.
- [ ] At least one per-case interaction recipe captures before/after state.
- [ ] Demo-data differences are reported, and `--write-fixture` is the only
      mode that updates neutral fixture data.
- [ ] Allowed deviations are structured and scoped.
- [ ] Existing `parity:check` behavior for the selected component still passes.
- [ ] No public docs route, CI gate, or source patch generation was added.
- [ ] `bun run test -- tests/parity`, `bun run registry:check`,
      `bun run typecheck`, `bun run check`, and `bun run build` exit 0.

## STOP conditions

Stop and report back if:

- The selected shadcn case cannot be rendered from pinned `repos/ui` without
  fetching or updating origin repositories.
- The workbench requires live shadcn website data for normal execution.
- A useful report requires rewriting arbitrary React example code into Foldkit
  code.
- The implementation starts duplicating `tests/parity/slots.ts` as a second
  component registry instead of validating against it.
- The only viable comparison is a brittle screenshot diff with no supporting
  DOM, style, geometry, or interaction evidence.
- A required fix would add React, Base UI React, or shadcn-only dependencies to
  installable registry runtime source.
- The CLI cannot follow ADR 0003's Effect-native boundary style without a
  broader script/tooling migration.

## Follow-up candidates

- Add batch mode for every workbench case in one selected component.
- Add a local-only `/__parity` or static HTML workbench UI that reads the JSON
  artifacts.
- Promote stable hard comparisons for selected components into CI.
- Add environment variants for dark mode, RTL, mobile, high contrast, and
  forced colors.
- Extend the same namespace-neutral schema to Base UI parity cases.
