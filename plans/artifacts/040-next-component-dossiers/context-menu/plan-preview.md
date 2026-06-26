# base-ui/context-menu + shadcn/context-menu Dossier Preview

## Batch

- `base-ui/context-menu`
- `shadcn/context-menu`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Context Menu

- Registry item: `base-ui/context-menu`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/context-menu
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Resolution status: `source-backed`
- Source paths: `repos/base-ui/packages/react/src/context-menu/index.parts.ts`, `repos/base-ui/packages/react/src/context-menu/index.ts`, `repos/base-ui/packages/react/src/context-menu/root/ContextMenuRoot.tsx`, `repos/base-ui/packages/react/src/context-menu/root/ContextMenuRootContext.ts`, `repos/base-ui/packages/react/src/context-menu/trigger/ContextMenuTrigger.tsx`, `repos/base-ui/packages/react/src/context-menu/trigger/ContextMenuTriggerDataAttributes.ts`
- Missing primary source: `none`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/demos/hero/tailwind/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/demos/submenu/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/demos/submenu/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/demos/submenu/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/context-menu/demos/submenu/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/context-menu/root/ContextMenuRoot.non-mac.test.tsx`, `repos/base-ui/packages/react/src/context-menu/root/ContextMenuRoot.test.tsx`, `repos/base-ui/packages/react/src/context-menu/trigger/ContextMenuTrigger.test.tsx`
- Style variants: `none`
- Public registry paths: `none`
- Runtime hints: `@base-ui-components/react/context-menu`
- Registry hints: `none`
- Blockers: `none`
- Confidence: `high`

### shadcn Context Menu

- Registry item: `shadcn/context-menu`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/context-menu
- Local repo: `repos/ui`
- Pinned ref: `40c7064532185f5556f6cbff7dca3544987c0fe1`
- Resolution status: `source-backed`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/context-menu.tsx`
- Missing primary source: `none`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/context-menu.mdx`, `repos/ui/apps/v4/content/docs/components/radix/context-menu.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/context-menu-basic.tsx`, `repos/ui/apps/v4/examples/base/context-menu-checkboxes.tsx`, `repos/ui/apps/v4/examples/base/context-menu-demo.tsx`, `repos/ui/apps/v4/examples/base/context-menu-destructive.tsx`, `repos/ui/apps/v4/examples/base/context-menu-groups.tsx`, `repos/ui/apps/v4/examples/base/context-menu-icons.tsx`, `repos/ui/apps/v4/examples/base/context-menu-radio.tsx`, `repos/ui/apps/v4/examples/base/context-menu-rtl.tsx`, `repos/ui/apps/v4/examples/base/context-menu-shortcuts.tsx`, `repos/ui/apps/v4/examples/base/context-menu-sides.tsx`, `repos/ui/apps/v4/examples/base/context-menu-submenu.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/context-menu.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/context-menu.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/context-menu.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/context-menu.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/context-menu.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/context-menu.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/context-menu.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/context-menu.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/context-menu.tsx`
- Public registry paths: `none`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/context-menu`, `lucide-react`, `react`
- Registry hints: `base-ui/context-menu`, `utils/cn`
- Blockers: `none`
- Confidence: `medium`

## Foldkit Mapping

- Keep Base UI origins as unstyled Foldkit behavior primitives or stateless render helpers according to the local component shape.
- Keep shadcn origins as styled Foldkit wrappers or compositions over local primitives.
- Map origin `render` and shadcn `asChild` support to Foldkit `toView` or named part-renderer composition.
- Use `cn` from `utils/cn` when a shadcn source imports `@/lib/utils`.
- Represent style variants with Effect Schema literals and pure class maps.
- Record consumed theme tokens before marking any shadcn item installable.

## Dependencies

- `@/components/language-selector`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `@base-ui-components/react/context-menu`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/context-menu`: `replace-with-foldkit` -> `base-ui/context-menu` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/context-menu`: `registry-local` -> `base-ui/context-menu` (The styled shadcn item composes this local Base UI primitive.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/context-menu/root/ContextMenuRoot.non-mac.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/context-menu/root/ContextMenuRoot.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/context-menu/trigger/ContextMenuTrigger.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/context-menu`, `shadcn/context-menu`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
