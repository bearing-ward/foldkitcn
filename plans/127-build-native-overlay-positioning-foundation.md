# Plan 127: Add a Foldkit-version-compatible anchored-overlay bridge

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
> git diff --stat 3598a04..HEAD -- src/registry/base-ui/tooltip src/registry/base-ui/popover src/registry/base-ui/menu src/registry/base-ui/select src/registry/shadcn/tooltip src/registry/shadcn/popover src/registry/shadcn/dropdown-menu src/registry/shadcn/select src/styles.css tests/e2e tests/parity repos/foldkit
> ```
>
> If a primitive, its browser tests, or Foldkit's DOM/Mount APIs changed since
> this plan was written, compare the live implementation with the excerpts
> below. Stop and report if the proposed seam would duplicate a newly available
> Foldkit primitive.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: plans/126-enforce-registry-and-browser-parity-gates.md
- **Category**: bug, tests
- **Planned at**: commit `3598a04`, 2026-07-09

## Why this matters

Foldkit CN's product goal is identical component UI and UX with Foldkit behind
the API. Today, several overlays expose origin-compatible `side`, `align`,
offset, and collision options but do not consistently make those values affect
rendered geometry. The docs preview host compensates with broad CSS coordinate
overrides, so the host can both mask portable-component defects and create
docs-only behavior. A stopped Plan 128 execution already established the
critical red case: removing the Popover preview override restores a visible
card but exposes a 390px right-edge collision. Use that evidence as the first
characterization case, then allow Plan 128 to enforce it across every public
surface after this foundation is green.

Published Foldkit 0.127 supplies most of the right seam:
`AnchorConfig` and `anchorSetup` own portal handling, `autoUpdate`, `flip`,
`shift`, and `size` cleanup. However, it always applies `flip` and `shift`.
Foldkit CN already exposes `collisionAvoidance: false` as public component
behavior, so adapting directly to the release would silently change that
contract. An upstream extension exists locally but is not published, and this
project must not wait for it.

This plan therefore introduces a small, deliberately redundant **Foldkit
compatibility bridge**. It keeps the public CN API faithful today, uses the
same supported Mount/Effect lifecycle as Foldkit, and is explicitly temporary:
once Foldkit publishes an equivalent collision toggle, replace the bridge with
the upstream primitive and delete it. The bridge is not a new general-purpose
positioning system or a source fork.

## Current state

- `repos/foldkit/packages/ui/src/anchor.ts:29-177` defines `AnchorConfig` and
  `anchorSetup`, with placement, gap, cross-axis offset, padding, portal,
  auto-update, flip, shift, size, and paired cleanup.

- `src/registry/base-ui/tooltip/index.ts:442-487` emits `data-side`, offsets,
  and collision attributes but gives its positioner only
  `position: absolute; inset: auto; margin: 0`; it has no anchor geometry or
  computed collision behavior.
- `src/registry/base-ui/popover/index.ts:344-430` records collision options as
  data attributes and uses CSS anchor expressions for requested placement, but
  does not consume collision avoidance/padding to flip or shift near viewport
  edges.
- `src/registry/base-ui/menu/index.ts:537-640` has the same split between
  data-only collision inputs and requested-side placement. Dropdown Menu,
  Navigation Menu, Context Menu, and Menubar compose this primitive.
- `src/registry/base-ui/select/index.ts:458-480` exposes collision metadata;
  its shadcn wrapper is `src/registry/shadcn/select/index.ts`.
- `src/styles.css:701-710` and `773-880` use preview-specific `:has()` and
  fixed/static coordinate overrides to keep open overlays inspectable. In
  particular, combobox/tooltip positioners are forced to `top: 4rem; left:
  1rem`, and several manual-popover surfaces are forced to `top: 0; left: 0`.
- `tests/e2e/shadcn-overlay-menu-regressions.test.ts` and
  `tests/e2e/docs.test.ts:1193-1248` contain local geometry/dismissal checks,
  but the current Combobox anchoring tolerance is 64px and Tooltip only checks
  repeatability, not origin-equivalent position or edge collisions.
- `tests/parity/workbench-cases.ts` has only Tabs and Empty focused cases.
  Screenshots remain advisory. Plan 126 now makes any Playwright case a Pages
  CI release gate, so focused browser characterization will protect the
  eventual shared implementation.

Foldkit constraints to preserve:

- `Model` is schema-backed, `update` and `view` are pure, and side effects are
  Commands, Mounts, Subscriptions, or ManagedResources selected by their true
  cause. Do not read layout or mutate the DOM from `update`/`view`.
- Use Foldkit's Mount and Effect lifecycle. The compatibility bridge may own
  the narrow missing policy switch around Floating UI middleware, because the
  published anchor API cannot express it. Do not read layout or mutate the DOM
  from `update`/`view`.
- Keep origin React repositories as fixtures/evidence only; no origin runtime
  imports in installable source.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Current artifact contract | `bun run registry:check` | exits 0 |
| Focused overlay browser tests | `bunx playwright test tests/e2e/shadcn-overlay-menu-regressions.test.ts tests/e2e/docs.test.ts --workers=1` | exits 0 |
| Focused parity tests | `bunx vitest run tests/parity` | exits 0 |
| Full unit suite | `bun run test` | exits 0 |
| Full browser suite | `bun run test:e2e` | exits 0 |
| Typecheck | `bun run typecheck` | exits 0 |
| Code quality | `bun run check` | exits 0 |

## Scope

**In scope**:

- A small `anchor-compat` adapter/Mount that maps existing CN placement options
  to the published Foldkit behavior while respecting `collisionAvoidance`, plus
  focused tests. It may add `@floating-ui/dom` as an explicit direct dependency
  at the exact compatible version instead of relying on Foldkit's transitive
  dependency.
- `src/registry/base-ui/tooltip/index.ts`
- `src/registry/base-ui/popover/index.ts`
- `src/registry/base-ui/menu/index.ts`
- `src/registry/base-ui/select/index.ts`
- Their direct shadcn wrappers only where adapting the new public geometry
  attributes/model wiring requires it.
- `src/styles.css` only to remove overrides replaced by real primitive behavior
  and retain narrowly necessary preview containment.
- Focused tests under `tests/e2e/` and `tests/parity/`, plus generator-owned
  artifacts if source registry files must change.
- `plans/README.md` status row.

**Out of scope**:

- Chart implementation or chart architecture.
- Deprecated `shadcn/toast`; native `base-ui/toast` swipe behavior is a
  separate plan.
- Dialog/Alert Dialog/Drawer/Sheet semantics, except tests needed to prove the
  adopted Foldkit anchor behavior does not regress them.
- A whole-site CSS redesign, changing Foldkit docs-shell identity, or replacing
  origin component APIs.
- React, Radix, Base UI React, or another positioning runtime dependency. The
  one explicit exception is a direct `@floating-ui/dom` dependency required by
  the compatibility bridge; it must be kept isolated to that bridge.

## Git workflow

- Branch: `codex/127-build-native-overlay-positioning-foundation`.
- Commit in logical units: characterization tests, Foldkit anchor adapter,
  primitive migrations, and generated artifacts if applicable.
- Do not push or open a pull request unless the operator asks.

## Steps

### Step 1: Write failing origin-backed geometry characterization

Before changing component code, add browser tests for Tooltip, Popover,
Dropdown Menu, and Select at each viewport edge and at a 390px mobile viewport.
For every case, assert all of the following:

- the open surface is anchored to its trigger within a tight, documented
  tolerance;
- it remains visible inside its intended preview/viewport boundary;
- collision behavior either flips to the opposite requested side or shifts
  without clipping;
- Escape and outside click preserve existing dismissal behavior; and
- keyboard opening/focus reaches the same visible surface.

Use pinned origin fixture screenshots/geometry where the existing harness can
provide them. If direct pixel comparison is not deterministic, record explicit
numeric geometry assertions from origin and local captures instead of a broad
advisory screenshot waiver.

**Verify**: the focused Playwright command initially fails for the unsupported
collision/placement case and passes only after later migration steps. Keep the
failure evidence in the test names/assertions; do not skip or weaken it.

### Step 2: Build the version-compatible anchor bridge

Create `src/registry/shared/anchor-compat.ts` (or the closest existing shared
registry location) with exactly two responsibilities:

1. map CN `side`, `align`, offset, direction, collision padding, and portal
   intent to Foldkit placement vocabulary; and
2. provide Mount-backed setup that matches published Foldkit anchor lifecycle
   (portal, `autoUpdate`, cleanup, size variables) but conditionally includes
   `flip` and `shift` only when the public `collisionAvoidance` option is true.

Use `Mount.define`, `Effect.acquireRelease`, and schema-backed configuration,
matching the published `AnchorPopover`/`AnchorMenu` implementation. Keep DOM
measurement and cleanup inside that Mount. Do not introduce an imperative
controller, store geometry in the Model, or export a generic geometry API.

Declare `@floating-ui/dom` directly, then pin its compatible range in the lock
file. Copy only the smallest lifecycle/middleware code that the published
Foldkit seam does not parameterize. Add a header note naming the Foldkit
version limitation and the deletion trigger.

**Verify**: focused tests prove every supported CN option resolves to the
expected placement, gap, cross-axis offset, padding, portal, and middleware
selection. Test LTR/RTL and both collision policy values.

### Step 3: Wire the bridge through primitive-owned Mounts

Render thin primitive-owned Mount definitions on each open positioner, each
delegating to the bridge. Preserve pure CN Model/Message/update/view code: the
bridge owns DOM measurement, auto-update, portal setup, collision policy, and
cleanup. Do not add `Mount.defineStream`, direct DOM access outside the bridge,
or per-component collision calculations.

**Verify**: typecheck passes and a focused Scene test proves mounted positioners
receive the expected anchor configuration while retaining ARIA/open state.

### Step 4: Migrate Tooltip and Popover first

Replace Tooltip's static-position fallback and Popover's data-only collision
behavior with the compatibility bridge. Preserve public `side`, `align`, offset,
collision, portal, ARIA, and dismissal APIs. Make resolved placement observable
through the existing data attributes, so shadcn animation classes follow the
actual side.

Delete only the corresponding `src/styles.css` fixed-coordinate preview hacks
after the primitive produces correct geometry in a preview. Do not remove all
containment CSS in one sweep.

**Verify**: Tooltip and Popover characterization tests pass at desktop and
390px; existing focused overlay tests remain green.

### Step 5: Migrate Menu/Dropdown and Select

Migrate Menu's root and submenu positioners and Select's positioner to the
same compatibility bridge. Preserve nested-menu parent anchors,
selection/checked-state behavior, RTL, close-on-select, typeahead, and portal
semantics. Do not duplicate placement calculations in shadcn wrappers.

Remove each preview host override only when its direct primitive/browser cases
prove the replacement is correct. If a docs-only containment requirement
cannot be represented by the primitive's real viewport boundary, retain a
narrow selector with a `// NOTE:` explaining the preview-only distinction.

**Verify**: all new edge/mobile tests and
`tests/e2e/shadcn-overlay-menu-regressions.test.ts` pass; no fixed
`top: 0; left: 0` rule remains for a migrated surface.

### Step 6: Add focused parity workbench coverage

Add workbench cases for at least one overlay/menu family and one Select or
Popover case. Each case needs origin/local fixture data, portal/layer selectors,
open/close/outside-click/keyboard recipes, and a non-advisory geometry result.
Do not change every component's screenshot policy in this plan; prove the
reusable high-risk case shape first.

**Verify**: each added `bun run parity:workbench -- --item ... --case ...
--dry-run` command resolves, and its corresponding test validates the recipe
and fixture mapping.

### Step 7: Regenerate and run release gates

Run `bun run registry:build` only if a registry-source change requires it.
Review generated output; do not hand-edit it. Then run every command in the
command table.

**Verify**: all commands exit 0, Pages CI's new `test:e2e` gate remains usable,
and the working tree contains only in-scope changes.

## Test plan

- Story tests for pure placement resolution: requested placement, collision
  flip/shift, padding, RTL, and constrained viewport size.
- Scene tests for schema/model/update wiring and preserved ARIA/dismissal
  contracts.
- Playwright tests for geometry, keyboard, outside click, and 390px viewports
  for Tooltip, Popover, Dropdown Menu/Submenu, and Select.
- Workbench tests and at least two high-risk origin/local cases with explicit
  layer capture zones and interaction recipes.
- Full unit, browser, typecheck, lint, registry, and generated-artifact gates.

## Done criteria

- [ ] Tooltip, Popover, Menu, and Select resolve placement/collision through
  one local, Mount-backed compatibility bridge, not docs-host coordinate
  overrides or per-component geometry code.
- [ ] Geometry is origin-characterized at desktop and 390px for each migrated
  primitive, including an edge/collision case.
- [ ] Keyboard, outside-click, focus, and close-on-select behavior remain
  covered and passing.
- [ ] At least two high-risk parity workbench cases exercise layers and
  interactions with non-advisory geometry evidence.
- [ ] `bun run registry:check`, `bun run test`, `bun run test:e2e`,
  `bun run typecheck`, and `bun run check` all exit 0.
- [ ] No React, Radix, Base UI React, or global docs-shell visual rewrite is
  introduced. The sole direct positioning dependency is `@floating-ui/dom`,
  isolated to the compatibility bridge.

## STOP conditions

- Stop if the compatibility bridge needs behavior beyond Foldkit's current
  anchor lifecycle plus the conditional `flip`/`shift` policy; report the
  smallest missing capability instead of growing it into a local positioning
  system.
- Stop if a single shared geometry model cannot express Tooltip, Popover, Menu,
  and Select without erasing a documented public API distinction.
- Stop if correct origin behavior requires a browser/platform feature that
  cannot be represented through Foldkit's supported DOM lifecycle APIs.
- Stop if the docs preview containment requirement is fundamentally incompatible
  with origin geometry; capture the exact browser evidence and split a
  preview-host architecture decision rather than shipping component-specific
  coordinates.
- Stop if the new browser tests are nondeterministic over two consecutive runs.

## Maintenance notes

- Future overlay primitives should compose the compatibility bridge rather than
  add preview CSS coordinates or local geometry code. Do not add a second
  bridge.
- When a released Foldkit version exposes the same collision policy, add a
  focused migration that replaces the bridge with upstream `AnchorConfig` /
  `anchorSetup`, removes the direct Floating UI dependency, and preserves the
  existing browser contracts.
- Reviewers should scrutinize DOM lifecycle cleanup, bridge scope, RTL
  behavior, and every change to preview containment.
- This plan intentionally leaves Toast swipe mechanics, Dialog semantic repair,
  accepted-parity-slot enforcement, and the full mobile sweep as separate
  follow-up slices once anchored overlay behavior is trustworthy.
