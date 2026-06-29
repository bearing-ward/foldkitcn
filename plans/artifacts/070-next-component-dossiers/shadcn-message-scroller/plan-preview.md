# shadcn/message-scroller Dossier Preview

## Batch

- `shadcn/message-scroller`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### shadcn Message Scroller

- Registry item: `shadcn/message-scroller`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/message-scroller
- Local repo: `repos/ui`
- Pinned ref: `40c7064532185f5556f6cbff7dca3544987c0fe1`
- Resolution status: `source-backed`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/message-scroller.tsx`
- Missing primary source: `none`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/message-scroller.mdx`, `repos/ui/apps/v4/content/docs/components/radix/message-scroller.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/message-scroller-anchoring.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-animation.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-commands.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-demo.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-group-chat.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-load-history.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-opening-position.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-previous-context.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-scrollable.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-state.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-streaming.tsx`, `repos/ui/apps/v4/examples/base/message-scroller-visibility.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/message-scroller.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/message-scroller.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/message-scroller.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/message-scroller.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/message-scroller.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/message-scroller.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/message-scroller.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/message-scroller.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/message-scroller.tsx`
- Public registry paths: `none`
- Runtime hints: `@/components/message-animated`, `@/lib/ai`, `@/lib/message-animations`, `@ai-sdk/react`, `@shadcn/react/message-scroller`, `lucide-react`, `react`, `sonner`
- Registry hints: `shadcn/bubble`, `shadcn/button`, `shadcn/card`, `shadcn/dropdown-menu`, `shadcn/empty`, `shadcn/hover-card`, `shadcn/input-group`, `shadcn/marker`, `shadcn/message`, `shadcn/select`, `shadcn/slider`, `shadcn/tabs`, `shadcn/toggle-group`, `shadcn/tooltip`, `utils/cn`
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

- `@/components/message-animated`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `@/lib/ai`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `@/lib/message-animations`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `@ai-sdk/react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `@shadcn/react/message-scroller`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `shadcn/bubble`: `registry-local` -> `shadcn/bubble` (Origin examples compose this local shadcn registry item.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `shadcn/card`: `registry-local` -> `shadcn/card` (Origin examples compose this local shadcn registry item.)
- `shadcn/dropdown-menu`: `registry-local` -> `shadcn/dropdown-menu` (Origin examples compose this local shadcn registry item.)
- `shadcn/empty`: `registry-local` -> `shadcn/empty` (Origin examples compose this local shadcn registry item.)
- `shadcn/hover-card`: `registry-local` -> `shadcn/hover-card` (Origin examples compose this local shadcn registry item.)
- `shadcn/input-group`: `registry-local` -> `shadcn/input-group` (Origin examples compose this local shadcn registry item.)
- `shadcn/marker`: `registry-local` -> `shadcn/marker` (Origin examples compose this local shadcn registry item.)
- `shadcn/message`: `registry-local` -> `shadcn/message` (Origin examples compose this local shadcn registry item.)
- `shadcn/select`: `registry-local` -> `shadcn/select` (Origin examples compose this local shadcn registry item.)
- `shadcn/slider`: `registry-local` -> `shadcn/slider` (Origin examples compose this local shadcn registry item.)
- `shadcn/tabs`: `registry-local` -> `shadcn/tabs` (Origin examples compose this local shadcn registry item.)
- `shadcn/toggle-group`: `registry-local` -> `shadcn/toggle-group` (Origin examples compose this local shadcn registry item.)
- `shadcn/tooltip`: `registry-local` -> `shadcn/tooltip` (Origin examples compose this local shadcn registry item.)
- `sonner`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `none`: `not-applicable` (No origin tests or specs were discovered.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `shadcn/message-scroller`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
