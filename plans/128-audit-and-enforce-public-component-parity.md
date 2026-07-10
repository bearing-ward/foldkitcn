# Plan 128: Audit and enforce public component parity contracts

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
>
> ```bash
> git diff --stat 3598a04..HEAD -- src/main.ts src/live-examples.ts src/styles.css src/registry/parity tests/parity tests/e2e scripts registry-src registry/docs public/r plans/README.md
> ```

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/126-enforce-registry-and-browser-parity-gates.md, plans/127-build-native-overlay-positioning-foundation.md
- **Category**: tests, dx
- **Planned at**: commit `3598a04`, 2026-07-09

## Why this matters

The public goal is identical origin UI/UX with Foldkit replacing the runtime,
but the current evidence model allows a component to be marked ready when only
its fixture structure passes. A screenshot supplied during QA shows the exact
failure: `PopoverBasic` renders the content text but loses the origin's visible
anchored card surface. The prior broad audit recorded screenshots, yet no
per-example contract made that state fail CI.

This plan creates a complete, executable parity contract for every public Base
UI and shadcn route and its rendered examples. The contract distinguishes
origin-source fixtures from docs/example-only evidence, defines required test
profiles by component family, captures origin/local evidence at desktop and
mobile, and fails CI if a public surface lacks required coverage or an approved
exception. It is an audit-and-guardrail plan; individual component fixes stay
in follow-up plans such as Plan 127. A first execution stopped correctly after
the new PopoverBasic assertion exposed a 390px collision failure; resume this
plan only after Plan 127 supplies native anchored collision behavior.

## Current state

- Generated docs expose 100 public component routes: 38 Base UI and 62 shadcn,
  with 442 example cards currently live-ready.
- `tests/parity/slots.ts` declares 97 ready parity slots. `shadcn/data-table`,
  `shadcn/date-picker`, and `shadcn/typography` are public but have no ready
  slot; their docs artifacts have docs/example provenance rather than a
  source-backed fixture contract.
- `tests/parity/workbench-cases.ts` registers only Tabs and Empty. Both make
  screenshots advisory, and the default workbench environment is 800×400
  light/LTR.
- `src/styles.css:830-835` forces open manual Popovers in a live preview to
  `position: static !important`. This overrides the anchor-relative positioner
  in `src/registry/base-ui/popover/index.ts` and produces the reported
  rendered-but-unbounded `PopoverBasic` surface.
- `tests/e2e/docs.test.ts` exercises `PopoverDemo`, not `PopoverBasic`; a
  component-level test can therefore pass while a public example is visibly
  wrong.
- Plan 126 added `test:e2e` to Pages CI, so a new browser contract becomes a
  release gate as soon as it is included under `tests/e2e`.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Public registry/docs contract | `bun run registry:check` | exits 0 |
| Existing slot inventory | `bun run parity:check -- --grep shadcn --dry-run` | prints public shadcn slots |
| Docs live preview inventory | `bun run docs:live-preview-gaps` | exits 0 with explicit coverage report |
| Focused browser tests | `bunx playwright test tests/e2e --workers=1` | exits 0 |
| Full browser suite | `bun run test:e2e` | exits 0 |
| Unit suite | `bun run test` | exits 0 |
| Typecheck and code quality | `bun run typecheck && bun run check` | both exit 0 |

## Scope

**In scope**:

- The parity schema, slot/workbench registry, fixture metadata, and scripts
  needed to declare/validate public component contracts.
- New generated audit artifacts under `plans/artifacts/128-public-component-parity/`.
- Playwright tests/helpers under `tests/e2e/` and parity tests under
  `tests/parity/`.
- `src/main.ts`, `src/live-examples.ts`, or `src/styles.css` only when needed
  to expose stable, semantic test hooks or to remove a proven docs-host override.
- Generator-owned output when a registry source/schema change requires it.
- `plans/README.md` status row.

**Out of scope**:

- Broad component behavior fixes; record them as owner-specific follow-ups.
- Chart implementation; it remains blocked by the native-chart foundation.
- Deprecated `shadcn/toast`; record the upstream successor exception as
  Toast → Sonner instead of treating it as missing.
- Rebranding the Foldkit docs shell or requiring shell visual parity.
- React, upstream Base UI, Radix, or Floating UI runtime dependencies.

## Required contract profiles

Every public route must select one profile and declare its origin evidence
mode, required viewports/states, and any approved deviation. CI must reject an
unprofiled public route.

| Profile | Required evidence |
| --- | --- |
| Anchored layer | desktop + 390px; side/alignment; edge collision; surface box/radius/border/shadow; trigger anchoring; portal/clipping; scroll re-anchor; pointer/keyboard open-close; outside/Escape; focus restoration; RTL where supported |
| Modal layer | desktop + 390px; bounded surface/backdrop; focus trap/restore; inert/scroll-lock; nested order; Escape/outside policy; close action |
| Selection/form | pointer and keyboard state transitions; disabled/required/error; ARIA name/state; orientation/range/RTL; mobile no-overflow |
| Data/time/layout | sort/filter/page/date navigation or drag/scroll behavior; empty/loading state; constrained desktop/mobile layout; no-overflow contract |
| Static/composition | variant/state visual region; accessible semantics; docs-card bounds; direction/theme only when origin supports them |

## Steps

### Step 1: Produce a fresh exhaustive public-surface matrix

Enumerate every public Base UI and shadcn route from generated docs artifacts,
not handwritten lists. For every route and example, record: route/item/example
ID, origin evidence mode/path, local live-preview key, component profile,
desktop/mobile capture paths, required interaction recipes, parity slot and
workbench case status, and exception status.

Write the JSON matrix and a human-readable summary under
`plans/artifacts/128-public-component-parity/`. Preserve Chart as blocked and
Toast as a documented deprecation/successor exception.

**Verify**: matrix counts match generated public docs route counts; every
non-exception route has exactly one profile and an evidence mode.

### Step 2: Capture origin/local evidence for every declared contract

Use pinned origin fixtures for source-backed components. For docs/example-only
rows, introduce an explicit docs-origin fixture record rather than pretending a
source fixture exists. Capture stable regions at desktop and 390px. For
interactive examples, execute the profile's named state recipes before capture.

Capture DOM/ARIA, computed surface styles, trigger/surface geometry, overflow,
and screenshots. A screenshot is not sufficient by itself; a visible surface
must also have its required role/state and bounding box.

**Verify**: every matrix row has current local evidence; every source-backed
row has origin evidence; exceptions have a reason, owner, and review date.

### Step 3: Add universal docs-card host assertions

Create reusable Playwright assertions that run examples in their actual
generated docs card as well as fixture isolation. At minimum assert:

- every live-ready example mounts a visible preview root;
- document and preview horizontal overflow stay within the profile policy;
- open layered examples expose a non-zero, visible, bounded surface box;
- card surface tokens (background, border/radius, shadow where origin has one)
  are present; and
- a geometry-affecting docs CSS selector has a named owner/component contract.

Add `PopoverBasic` regression coverage using the user-reported state: it must
render a floating visible card, anchored to `Open Popover`, with the expected
border/radius/shadow and no clipping at desktop or 390px.

**Verify**: temporarily reproduce the static Popover rule as a red test, then
restore the expected behavior through the owning follow-up; the test remains
specific to PopoverBasic and the docs-card host.

### Step 4: Enforce profile coverage in CI

Make registry/parity validation fail when a public route lacks a contract
profile, required viewport/state case, origin-evidence mode, ready slot (or
reviewed waiver), or live-preview renderer. Make the existing Pages
`test:e2e` command execute the generated/profile-driven browser cases.

Keep waivers narrow: component/example scope, explicit reason, owner, and
expiry/review date. A generic "screenshots are advisory" waiver is not enough
for anchored or modal profiles.

**Verify**: unit tests prove missing profile, stale waiver, missing live
renderer, and missing required browser recipe fail validation; the complete
matrix passes validation.

### Step 5: Establish high-risk workbench cases

Add workbench coverage for one representative of each high-risk family before
declaring the framework complete: Popover, Tooltip, Dropdown Menu (including a
submenu), Select or Combobox, Dialog, Date Picker, Data Table, Slider, and
Sonner. Use portal/layer selectors and named interactions. Promote stable
surface screenshot/geometry comparisons to hard results for these cases.

**Verify**: each workbench case resolves in dry-run and its test confirms
fixture, viewport, capture zones, and interaction recipe.

### Step 6: Publish the audit backlog

Classify all observed discrepancies as: missing surface, origin drift,
docs-host-only regression, portable-component regression, intentional
deviation, or blocked. Create separate follow-up plans for each owner family;
do not hide failures by accepting them in the matrix.

**Verify**: the artifact summary has no unclassified mismatch and each failing
row links to an owner/follow-up plan or a time-bounded exception.

## Done criteria

- [ ] Every public route and public example has an evidence-backed contract.
- [ ] Every high-risk example is tested in its actual docs-card host and in
  fixture isolation.
- [ ] CI rejects a missing profile/slot/renderer/required state recipe or an
  expired exception.
- [ ] `PopoverBasic` cannot regress to rendered-but-unbounded/in-flow content.
- [ ] Public mobile overflow is checked at 390px according to profile policy.
- [ ] `bun run registry:check`, `bun run test`, `bun run test:e2e`,
  `bun run typecheck`, and `bun run check` all pass.

## STOP conditions

- Stop if a public route cannot be mapped to pinned source or docs-origin
  evidence; record it as a product/availability exception rather than guessing.
- Stop if stable screenshot capture remains nondeterministic across two runs;
  retain geometry/style/ARIA checks and report the deterministic blocker.
- Stop if profile enforcement would require every component to share one
  interaction model; preserve profile-specific contracts.
- Stop if a docs-host-only requirement cannot be expressed with an owner and
  test hook; split a docs preview architecture decision instead of adding
  another anonymous global CSS override.

## Maintenance notes

- New public registry items must add a profile and complete contract before
  lifecycle parity can be accepted.
- A docs preview is a product surface, not a non-authoritative demo. Any CSS
  that changes an open component's geometry needs a matching host-context test.
- Plan 127 consumes this matrix for its shared overlay migration; do not begin
  removing placement overrides without the PopoverBasic and family evidence.
