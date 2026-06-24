# Shadcn Button Origin Import Graph

## Pinned Origins

- `repos/ui` at `95471a0fb95b2b205e1850841e05d93f3fcae659`
- `repos/base-ui` at `ea3818dec91923d4287b38be21322d2e5068d347`

## Required Shadcn Button Files

### `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`

- imports `@base-ui/react/button`
- imports `class-variance-authority`
- imports `@/lib/utils`
- exports `Button`
- exports `buttonVariants`

### `repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx`

- imports `lucide-react`
- imports `@/lib/utils`
- exports `Spinner`

### `repos/ui/apps/v4/examples/base/button-default.tsx`

- imports `@/styles/base-nova/ui/button`
- renders the default `Button`

### `repos/ui/apps/v4/examples/base/button-demo.tsx`

- imports `lucide-react`
- imports `@/styles/base-nova/ui/button`
- renders outline Button variants and an icon Button

### `repos/ui/apps/v4/examples/base/button-render.tsx`

- imports `@/styles/base-nova/ui/button`
- renders a plain anchor using the exported `buttonVariants` class helper

### `repos/ui/apps/v4/examples/base/button-rtl.tsx`

- imports `lucide-react`
- imports `@/components/language-selector`
- imports `@/styles/base-nova/ui-rtl/button`
- imports `@/styles/base-nova/ui-rtl/spinner`
- renders RTL Button variants, icons, and spinner content

## Fixture Alias Requirements

- `@/styles/base-nova/ui/button` -> `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`
- `@/styles/base-nova/ui/spinner` -> `repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx`
- `@/styles/base-nova/ui-rtl/button` -> `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`
- `@/styles/base-nova/ui-rtl/spinner` -> `repos/ui/apps/v4/styles/base-nova/ui/spinner.tsx`
- `@/lib/utils` -> `repos/ui/apps/v4/lib/utils.ts`
- `@/components/language-selector` -> fixture-only shim preserving `useTranslation`
- `@base-ui/react/button` -> `repos/base-ui/packages/react/src/button/index.ts`
- `@base-ui/utils/*` -> `repos/base-ui/packages/utils/src/*`
- `lucide-react`, `@tabler/icons-react`, `class-variance-authority`, `react`, and `react-dom` are fixture-only dev dependencies.

## Required Style Layer

- The browser fixture imports Tailwind through `@tailwindcss/vite` and `@import "tailwindcss"`.
- The browser fixture imports pinned shadcn Tailwind helpers from `repos/ui/packages/shadcn/src/tailwind.css`.
- The browser fixture declares Tailwind `@source` entries for:
  - `repos/ui/apps/v4/examples/base/button-default.tsx`
  - `repos/ui/apps/v4/examples/base/button-render.tsx`
  - `repos/ui/apps/v4/styles/base-nova/ui/button.tsx`
- The browser fixture defines the base-nova theme variables used by `bg-primary`, `text-primary-foreground`, radius utilities, border/input/ring utilities, and selection colors.
