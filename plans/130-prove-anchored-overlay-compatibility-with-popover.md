# Plan 130: Prove the anchored-overlay compatibility bridge with Popover

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. Stop
> and report if a STOP condition occurs. A reviewer maintains `plans/README.md`.
>
> **Drift check**:
>
> ```bash
> git diff --stat 175ca441..HEAD -- package.json bun.lock src/registry/base-ui/popover src/registry/shared src/styles.css tests/e2e tests/parity
> ```
>
> If these files changed, compare the live APIs with this plan. Stop if the
> published Foldkit release now exposes a collision policy toggle.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: HIGH
- **Depends on**: plans/126-enforce-registry-and-browser-parity-gates.md
- **Category**: bug, tests
- **Planned at**: commit `175ca441`, 2026-07-09

## Why this matters

PopoverBasic currently demonstrates the exact failure the parity system must
catch: removing the docs-only static-position rule reveals the real card, but
at a 390px viewport it overflows the right edge. Published Foldkit 0.127 has
the correct Mount/Effect anchoring lifecycle but always enables `flip` and
`shift`, while Foldkit CN already publishes `collisionAvoidance: false`.

Prove one isolated compatibility bridge through Popover before extending it to
other primitives. The bridge is temporary: it preserves the current public
contract without waiting for an upstream release, and must be easy to delete
when Foldkit exposes the same option.

## Current state

- `repos/foldkit/packages/ui/src/anchor.ts:103-177` uses `Mount.define`,
  `Effect.acquireRelease`, Floating UI `autoUpdate`, `computePosition`, portal
  cleanup, `size`, `flip`, and `shift`; the published `AnchorConfig` has no
  `collisionAvoidance` field.
- `src/registry/base-ui/popover/index.ts:344-430` already accepts `side`,
  `align`, offsets, collision padding/avoidance, and renders a positioner. Its
  CSS-anchor placement records values but does not implement the collision
  policy.
- `src/styles.css:830-835` currently forces manual popover content static in
  docs previews. This causes the visible PopoverBasic content to lose its card
  surface/anchor relationship.
- `tests/e2e/docs.test.ts` is the existing browser-test home for docs previews.
  There is no separate layout-capable E2E fixture app, so a controlled Popover
  card is the required real-browser harness for collision true/false proof.
- Foldkit conventions: Model/update/view stay pure; DOM lifecycle belongs in
  `Mount.define` plus `Effect.acquireRelease`; see the published
  `AnchorPopover` in `repos/foldkit/packages/ui/src/popover/index.ts:422-451`.

## Commands

| Purpose                   | Command                                                   | Expected result                                             |
| ------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| Install                   | `bun install`                                             | exits 0                                                     |
| Focused docs browser test | `bunx playwright test tests/e2e/docs.test.ts --workers=1` | exits 0                                                     |
| Registry                  | `bun run registry:check`                                  | exits 0                                                     |
| Typecheck                 | `bun run typecheck`                                       | exits 0                                                     |
| Unit suite                | `bun run test`                                            | exits 0                                                     |
| Browser suite             | `bun run test:e2e`                                        | exits 0                                                     |
| Quality                   | `bun run check`                                           | exits 0, except a pre-existing unrelated documented failure |

## Scope

**In scope**:

- `package.json`, `bun.lock` only if adding direct `@floating-ui/dom` is
  required to avoid relying on a transitive dependency.
- One shared bridge under `src/registry/shared/`.
- `src/registry/base-ui/popover/index.ts` and directly generated artifacts.
- One controlled Popover edge-case example plus its manifest/live-preview
  mapping and generated docs artifacts, solely for collision-policy coverage.
- The narrow Popover docs-preview CSS override only after browser proof.
- Focused Popover Story/Scene tests if a matching local test home exists, and
  `tests/e2e/docs.test.ts`.

**Out of scope**:

- Tooltip, Menu, Dropdown Menu, Select, Combobox, Calendar, and all shadcn
  wrapper migrations (Plan 131).
- A second bridge, per-component geometry math, React/Radix/Base UI runtime,
  docs-shell redesign, or an upstream Foldkit change.

## Git workflow

- Branch: `codex/130-prove-anchored-overlay-compatibility-with-popover`.
- Commit only a complete passing Popover slice with a conventional commit.
- Do not push or merge.

## Steps

### Step 1: Characterize the public Popover contract in-browser

Add one controlled edge-positioned Popover regression example to the existing
Popover examples, manifest metadata, and `src/live-examples.ts` mapping. Keep
its public label explicitly parity-focused and render both collision-policy
variants without adding unrelated docs features. Generate its artifacts.

Add browser tests for PopoverBasic at desktop and a 390px viewport. Assert the
open surface has a visible card box, is anchored to its trigger, stays inside
the viewport with `collisionAvoidance: true`, closes via Escape/outside click,
and restores the intended trigger focus. Use the controlled card for an
explicitly configured `collisionAvoidance: false` case that proves it retains requested placement
rather than silently flipping/shifting. Use numeric bounding-box assertions;
do not use an advisory screenshot waiver.

**Verify**: the focused test fails against the current static host override.

### Step 2: Implement exactly one Popover-compatible bridge

Create a schema-backed bridge in `src/registry/shared/` with a clearly named
temporary-deletion comment. It must map Popover side/align, RTL, offsets,
padding, portal intent, and collision policy to Floating UI placement.

**Approved compatibility exception:** `base-ui/popover` is a generic
stateless attribute generator whose `Message` is owned by its consumer. The
standard `Mount.define` contract requires a concrete completion Message, and
adding one would widen every Popover consumer's public API. The bridge may
therefore construct one named, schema-checked `MountAction<never>` directly:
its stream acquires the lifecycle resource and then remains open until unmount,
emitting no message. This is a narrow lifecycle adapter, not a drained or
retyped `Mount.define` result, and it must be the only no-message mount action
in this bridge. Keep DOM access, `autoUpdate`, portal, positioning, and cleanup
inside it.

Always apply `offset` and `size`; apply `flip` and `shift` only when
`collisionAvoidance` is true. Preserve Foldkit's shadow-root strategy, portal
root behavior, first-position visibility, focus behavior, and cleanup unless a
documented Popover public behavior differs. Add `@floating-ui/dom` directly
only if needed, and isolate its import to this bridge.

**Verify**: `bun run typecheck` exits 0 and focused tests prove true/false
middleware policy plus RTL mapping.

### Step 3: Integrate Popover and remove only its proven preview hack

Wire the bridge through Popover's existing positioner/trigger IDs while
preserving ARIA, data-side animation attributes, modal/backdrop behavior, and
public props. Remove only the `PopoverBasic`/manual-popover static positioning
override after the new browser test passes. Do not change global overlay CSS.

**Verify**: focused docs test passes twice in succession.

### Step 4: Regenerate and run release gates

Regenerate artifacts only if registry source changes require it. Review every
generated hunk; do not hand edit generated files. Run every command in the
table and remove `test-results/` before committing.

## Test plan

- Pure configuration tests: LTR/RTL side-align mapping and collision true/false
  middleware selection.
- Browser tests: card geometry, trigger anchoring, 390px edge collision,
  collision opt-out, Escape, outside click, and focus restoration.
- Re-run the complete unit and browser suites so the bridge cannot regress
  unrelated docs previews.

## Done criteria

- [ ] One named no-message lifecycle bridge exists; no direct geometry logic is added to
      Popover view/update code.
- [ ] PopoverBasic is a bounded, visible card anchored to its trigger at 390px.
- [ ] `collisionAvoidance: false` remains observably distinct from true.
- [ ] `bun run registry:check`, `bun run typecheck`, `bun run test`, and
      `bun run test:e2e` exit 0.
- [ ] No out-of-scope primitive or docs-shell files changed.

## STOP conditions

- Stop if Popover cannot use the bridge without changing its public portal,
  focus, dismissal, or data-side contract.
- Stop if the browser contract is nondeterministic in two consecutive runs.
- Stop if the bridge needs any behavior beyond conditional `flip`/`shift` plus
  the published Foldkit lifecycle.

## Maintenance notes

Plan 131 must consume this exact bridge rather than create another one. When a
released Foldkit version exposes equivalent collision policy, replace this
bridge with upstream anchor setup, remove direct Floating UI, and retain these
browser tests as the migration proof.
