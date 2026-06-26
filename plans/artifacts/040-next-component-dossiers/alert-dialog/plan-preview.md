# base-ui/alert-dialog + shadcn/alert-dialog Dossier Preview

## Batch

- `base-ui/alert-dialog`
- `shadcn/alert-dialog`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### Base UI Alert Dialog

- Registry item: `base-ui/alert-dialog`
- Origin kind: `base-ui`
- Docs URL: https://base-ui.com/react/components/alert-dialog
- Local repo: `repos/base-ui`
- Pinned ref: `ea3818dec91923d4287b38be21322d2e5068d347`
- Resolution status: `source-backed`
- Source paths: `repos/base-ui/packages/react/src/alert-dialog/handle.ts`, `repos/base-ui/packages/react/src/alert-dialog/index.parts.ts`, `repos/base-ui/packages/react/src/alert-dialog/index.ts`, `repos/base-ui/packages/react/src/alert-dialog/root/AlertDialogRoot.tsx`, `repos/base-ui/packages/react/src/alert-dialog/trigger/AlertDialogTrigger.tsx`, `repos/base-ui/packages/react/src/alert-dialog/trigger/AlertDialogTriggerDataAttributes.ts`
- Missing primary source: `none`
- Docs paths: `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/page.mdx`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/types.md`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/types.ts`
- Demo paths: `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/_index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/detached-triggers-controlled/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/detached-triggers-controlled/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/detached-triggers-controlled/tailwind/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/detached-triggers-simple/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/detached-triggers-simple/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/detached-triggers-simple/tailwind/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/hero/css-modules/index.module.css`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/hero/css-modules/index.tsx`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/hero/index.ts`, `repos/base-ui/docs/src/app/(docs)/react/components/alert-dialog/demos/hero/tailwind/index.tsx`
- Test/spec paths: `repos/base-ui/packages/react/src/alert-dialog/root/AlertDialogRoot.test.tsx`, `repos/base-ui/packages/react/src/alert-dialog/root/AlertDialogRoot.spec.tsx`
- Style variants: `none`
- Public registry paths: `none`
- Runtime hints: `@base-ui-components/react/alert-dialog`
- Registry hints: `none`
- Blockers: `none`
- Confidence: `high`

### shadcn Alert Dialog

- Registry item: `shadcn/alert-dialog`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/alert-dialog
- Local repo: `repos/ui`
- Pinned ref: `40c7064532185f5556f6cbff7dca3544987c0fe1`
- Resolution status: `source-backed`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/alert-dialog.tsx`
- Missing primary source: `none`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/alert-dialog.mdx`, `repos/ui/apps/v4/content/docs/components/radix/alert-dialog.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/alert-dialog-basic.tsx`, `repos/ui/apps/v4/examples/base/alert-dialog-demo.tsx`, `repos/ui/apps/v4/examples/base/alert-dialog-destructive.tsx`, `repos/ui/apps/v4/examples/base/alert-dialog-media.tsx`, `repos/ui/apps/v4/examples/base/alert-dialog-rtl.tsx`, `repos/ui/apps/v4/examples/base/alert-dialog-small-media.tsx`, `repos/ui/apps/v4/examples/base/alert-dialog-small.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/alert-dialog.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/alert-dialog.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/alert-dialog.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/alert-dialog.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/alert-dialog.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/alert-dialog.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/alert-dialog.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/alert-dialog.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/alert-dialog.tsx`
- Public registry paths: `none`
- Runtime hints: `@/components/language-selector`, `@base-ui/react/alert-dialog`, `lucide-react`, `react`
- Registry hints: `base-ui/alert-dialog`, `shadcn/button`, `utils/cn`
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
- `@base-ui-components/react/alert-dialog`: `replace-with-foldkit` -> `defer` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `@base-ui/react/alert-dialog`: `replace-with-foldkit` -> `base-ui/alert-dialog` (Replace the upstream React primitive with the local Foldkit registry implementation.)
- `base-ui/alert-dialog`: `registry-local` -> `base-ui/alert-dialog` (The styled shadcn item composes this local Base UI primitive.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `repos/base-ui/packages/react/src/alert-dialog/root/AlertDialogRoot.test.tsx`: `port-semantically` (Foldkit Story and Scene tests should preserve behavior without React internals.)
- `repos/base-ui/packages/react/src/alert-dialog/root/AlertDialogRoot.spec.tsx`: `covered-by-parity` (DOM attributes and browser behavior belong in origin parity fixtures.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `base-ui/alert-dialog`, `shadcn/alert-dialog`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
