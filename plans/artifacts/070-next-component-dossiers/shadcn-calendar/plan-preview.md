# shadcn/calendar Dossier Preview

## Batch

- `shadcn/calendar`

This dossier does not implement registry source. It prepares a future improve plan for the local Foldkit registry.

## Origin Evidence

### shadcn Calendar

- Registry item: `shadcn/calendar`
- Origin kind: `shadcn`
- Docs URL: https://ui.shadcn.com/docs/components/calendar
- Local repo: `repos/ui`
- Pinned ref: `40c7064532185f5556f6cbff7dca3544987c0fe1`
- Resolution status: `source-backed`
- Source paths: `repos/ui/apps/v4/styles/base-nova/ui/calendar.tsx`
- Missing primary source: `none`
- Docs paths: `repos/ui/apps/v4/content/docs/components/base/calendar.mdx`, `repos/ui/apps/v4/content/docs/components/radix/calendar.mdx`
- Demo paths: `repos/ui/apps/v4/examples/base/calendar-basic.tsx`, `repos/ui/apps/v4/examples/base/calendar-booked-dates.tsx`, `repos/ui/apps/v4/examples/base/calendar-caption.tsx`, `repos/ui/apps/v4/examples/base/calendar-custom-days.tsx`, `repos/ui/apps/v4/examples/base/calendar-demo.tsx`, `repos/ui/apps/v4/examples/base/calendar-hijri.tsx`, `repos/ui/apps/v4/examples/base/calendar-multiple.tsx`, `repos/ui/apps/v4/examples/base/calendar-presets.tsx`, `repos/ui/apps/v4/examples/base/calendar-range.tsx`, `repos/ui/apps/v4/examples/base/calendar-rtl.tsx`, `repos/ui/apps/v4/examples/base/calendar-time.tsx`, `repos/ui/apps/v4/examples/base/calendar-week-numbers.tsx`
- Test/spec paths: `none`
- Style variants: `repos/ui/apps/v4/styles/base-luma/ui/calendar.tsx`, `repos/ui/apps/v4/styles/base-lyra/ui/calendar.tsx`, `repos/ui/apps/v4/styles/base-maia/ui/calendar.tsx`, `repos/ui/apps/v4/styles/base-mira/ui/calendar.tsx`, `repos/ui/apps/v4/styles/base-nova/ui-rtl/calendar.tsx`, `repos/ui/apps/v4/styles/base-nova/ui/calendar.tsx`, `repos/ui/apps/v4/styles/base-rhea/ui/calendar.tsx`, `repos/ui/apps/v4/styles/base-sera/ui/calendar.tsx`, `repos/ui/apps/v4/styles/base-vega/ui/calendar.tsx`
- Public registry paths: `none`
- Runtime hints: `@/components/language-selector`, `date-fns`, `lucide-react`, `next/font/google`, `react`, `react-day-picker`, `react-day-picker/locale`, `react-day-picker/persian`
- Registry hints: `shadcn/button`, `shadcn/card`, `shadcn/field`, `shadcn/input-group`, `utils/cn`
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
- `date-fns`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `lucide-react`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `next/font/google`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react`: `dev-or-fixture-only` -> `defer` (React is origin fixture evidence only, not installable Foldkit source.)
- `react-day-picker`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react-day-picker/locale`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `react-day-picker/persian`: `reject-or-defer` -> `defer` (Review before implementation; keep as fixture-only, replace locally, or defer the row.)
- `shadcn/button`: `registry-local` -> `shadcn/button` (Origin examples compose this local shadcn registry item.)
- `shadcn/card`: `registry-local` -> `shadcn/card` (Origin examples compose this local shadcn registry item.)
- `shadcn/field`: `registry-local` -> `shadcn/field` (Origin examples compose this local shadcn registry item.)
- `shadcn/input-group`: `registry-local` -> `shadcn/input-group` (Origin examples compose this local shadcn registry item.)
- `utils/cn`: `registry-local` -> `utils/cn` (Local shadcn class canonicalization and Tailwind conflict handling.)

## Origin Test Classification

- `none`: `not-applicable` (No origin tests or specs were discovered.)

## Future Improve Plan Shape

1. Create these registry items as dossier-backed implementation slices: `shadcn/calendar`.
2. Add semantic Story and Scene tests for the Foldkit messages, state, accessibility, and view behavior each item owns.
3. Add local origin and Foldkit parity fixtures for each registry item.
4. Replace upstream React, Radix, Base UI React, and CVA dependencies with local Foldkit and Effect-native implementations.
5. Add theme token coverage and class canonicalization parity for shadcn items.
6. Run `bun run registry:check`, `bun run parity:check -- --grep <component> --dry-run`, `bun run test`, `bun run typecheck`, `bun run check`, and `bun run build`.
