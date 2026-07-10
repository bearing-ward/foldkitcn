# Plan 131: Roll out proven native anchoring to overlay primitives

> **Resolution**: The native-only constraint was disproved by browser evidence.
> The completed implementation uses a lifecycle-scoped Floating UI utility,
> owned by each interactive primitive through Foldkit Mount and reported back
> through an explicit completion Message. Static positioning remains available
> only for inert fixtures.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: Plan 130 (merged as `8d5df78`)
- **Planned at**: commit `f735a95`, 2026-07-09
- **State**: DONE, 2026-07-09
- **Implementation**: `5dc9ffb8`
- **Merged**: `bc8cd9ca`

### Design evidence

- With a normal trigger at viewport `y=434` and page `scrollY=1631`, a fixed
  Select popup rendered at `y=2114`; changing only the popup to absolute moved
  it to `y=466` and restored interaction.
- With the fixed Sidebar trigger, an absolute Menu popup was separated from
  its trigger by roughly 5803px. Forcing the popup to fixed removed that
  vertical error but introduced roughly 415px of horizontal detachment.
- `MenuOptions`, `SelectOptions`, and `TooltipOptions` expose placement,
  offset, and collision controls but no fixed/absolute strategy. The shadcn
  wrappers expose class overrides only; a native `@position-try` cannot change
  the positioning containing block.
- Floating UI's `autoUpdate` lifecycle and `computePosition` middleware handle
  both containing-block cases without preview-specific coordinates. Foldkit
  Mount owns acquisition and cleanup, while `CompletedPositionAnchoredSurface`
  preserves explicit unidirectional message flow.
- The shared utility is installable registry source rather than hidden docs
  infrastructure, so installed Tooltip, Menu/submenus, and Select retain the
  same runtime behavior as the documentation examples.

## Goal

Apply browser-proven anchored positioning and collision behavior to Tooltip,
Menu/Dropdown Menu (including submenus), and Select.
Remove only the corresponding docs-preview positioning overrides after each
primitive has a strict 390px browser contract.

## Scope

- `src/registry/base-ui/tooltip/index.ts`, `menu/index.ts`, and `select/index.ts`
- Direct shadcn wrappers/examples and generated registry artifacts only when
  needed for a controlled browser fixture
- `src/styles.css`, `tests/e2e/`, and focused unit/Scene tests

Do not touch Popover, charts, dialog-family components, or unrelated docs UI.

## Steps

1. Add strict browser cases at 390px for Tooltip, Dropdown Menu root/submenu,
   and Select: visible card surface, trigger anchoring, no viewport overflow,
   keyboard/outside dismissal, and selection behavior where applicable.
2. Use lifecycle-scoped Floating UI positioning for each interactive primitive,
   preserving each public side/align/RTL/collision API and data-side animation
   contract.
3. Remove only the matching preview CSS coordinates when the corresponding
   test passes twice.
4. Regenerate artifacts and run `bun run registry:check`, `bun run typecheck`,
   `bun run test`, `bun run test:e2e`, and `bun run check`.

## Done criteria

- [x] No targeted overlay uses a fixed docs-preview coordinate override.
- [x] Every target has a non-advisory 390px browser geometry test.
- [x] Keyboard/dismissal behavior remains green.
- [x] Registry, typecheck, unit, E2E, formatting, and prerender gates pass.

## Verification

- `bun run check`
- `bun run registry:check`
- `NODE_OPTIONS=--max-old-space-size=8192 bun run typecheck`
- `bun run test` (120 files, 1024 tests)
- `bun run test:e2e` (35 tests)
- `bun run docs:prerender` (109 routes)
