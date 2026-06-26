import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../../../src/utils/cn'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { nativeEnabledKeyboard, suppressedKeyboard } from '../../../fixture'
import { snapshotHtml } from '../../foldkit/render'

type IconName = 'bookmark' | 'bold' | 'italic'
type ToggleVariant = 'default' | 'outline'
type ToggleSize = 'default' | 'sm' | 'lg'

const iconPaths: Readonly<Record<IconName, string>> = {
  bookmark: 'M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16',
  bold: 'M6 12h9a4 4 0 0 0 0-8H7a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h9a4 4 0 0 0 0-8',
  italic: 'M19 4h-9m4 16H5m10-16-4 16',
}

const iconClassNames: Readonly<Record<IconName, string>> = {
  bookmark: 'lucide lucide-bookmark group-aria-pressed/toggle:fill-foreground',
  bold: 'lucide lucide-bold-icon',
  italic: 'lucide lucide-italic-icon',
}

const baseClassName =
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const variantClassNames: Readonly<Record<ToggleVariant, string>> = {
  default: 'bg-transparent',
  outline: 'border border-input bg-transparent hover:bg-muted',
}

const sizeClassNames: Readonly<Record<ToggleSize, string>> = {
  default:
    'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
  sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
}

const rtlSizeClassNames: Readonly<Record<ToggleSize, string>> = {
  default:
    'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
  sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
}

const className = (
  variant: ToggleVariant,
  size: ToggleSize,
  dir?: string,
): string =>
  cn(
    baseClassName,
    variantClassNames[variant],
    dir === 'rtl' ? rtlSizeClassNames[size] : sizeClassNames[size],
  )

const icon = (name: IconName): Html => {
  const h = html<never>()

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.Class(iconClassNames[name]),
      h.AriaHidden(true),
    ],
    [h.path([h.D(iconPaths[name])], [])],
  )
}

const toggleButton = (
  h: ReturnType<typeof html<never>>,
  config: Readonly<{
    ariaLabel: string
    children: ReadonlyArray<Html | string>
    dir?: string
    isDisabled?: boolean
    size?: ToggleSize
    variant?: ToggleVariant
  }>,
): Html =>
  h.button(
    [
      h.Type('button'),
      h.Tabindex(0),
      ...(config.isDisabled === true
        ? [h.Disabled(true), h.DataAttribute('disabled', '')]
        : []),
      h.AriaPressed('false'),
      h.DataAttribute('slot', 'toggle'),
      h.Class(
        className(
          config.variant ?? 'default',
          config.size ?? 'default',
          config.dir,
        ),
      ),
      ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
      h.AriaLabel(config.ariaLabel),
    ],
    [...config.children],
  )

const ToggleDemoOrigin = (): Html => {
  const h = html<never>()

  return toggleButton(h, {
    ariaLabel: 'Toggle bookmark',
    size: 'sm',
    variant: 'outline',
    children: [icon('bookmark'), 'Bookmark'],
  })
}

const ToggleDisabledOrigin = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2')],
    [
      toggleButton(h, {
        ariaLabel: 'Toggle disabled',
        isDisabled: true,
        children: ['Disabled'],
      }),
      toggleButton(h, {
        ariaLabel: 'Toggle disabled outline',
        isDisabled: true,
        variant: 'outline',
        children: ['Disabled'],
      }),
    ],
  )
}

const ToggleOutlineOrigin = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2')],
    [
      toggleButton(h, {
        ariaLabel: 'Toggle italic',
        variant: 'outline',
        children: [icon('italic'), 'Italic'],
      }),
      toggleButton(h, {
        ariaLabel: 'Toggle bold',
        variant: 'outline',
        children: [icon('bold'), 'Bold'],
      }),
    ],
  )
}

const ToggleRtlOrigin = (): Html => {
  const h = html<never>()

  return toggleButton(h, {
    ariaLabel: 'Toggle bookmark',
    dir: 'rtl',
    size: 'sm',
    variant: 'outline',
    children: [icon('bookmark'), 'إشارة مرجعية'],
  })
}

const ToggleSizesOrigin = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2')],
    [
      toggleButton(h, {
        ariaLabel: 'Toggle small',
        size: 'sm',
        variant: 'outline',
        children: ['Small'],
      }),
      toggleButton(h, {
        ariaLabel: 'Toggle default',
        size: 'default',
        variant: 'outline',
        children: ['Default'],
      }),
      toggleButton(h, {
        ariaLabel: 'Toggle large',
        size: 'lg',
        variant: 'outline',
        children: ['Large'],
      }),
    ],
  )
}

const ToggleTextOrigin = (): Html => {
  const h = html<never>()

  return toggleButton(h, {
    ariaLabel: 'Toggle italic',
    children: [icon('italic'), 'Italic'],
  })
}

const snapshot = (
  sourceHtml: Html,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'],
): FixtureSnapshot => ({
  ...snapshotHtml(sourceHtml, keyboardBehavior),
  keyboardBehavior,
})

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'toggle-demo',
    snapshot: snapshot(ToggleDemoOrigin(), nativeEnabledKeyboard),
  },
  {
    id: 'toggle-disabled',
    snapshot: snapshot(ToggleDisabledOrigin(), {}),
  },
  {
    id: 'toggle-outline',
    snapshot: snapshot(ToggleOutlineOrigin(), {}),
  },
  {
    id: 'toggle-rtl',
    snapshot: snapshot(ToggleRtlOrigin(), nativeEnabledKeyboard),
  },
  {
    id: 'toggle-sizes',
    snapshot: snapshot(ToggleSizesOrigin(), {}),
  },
  {
    id: 'toggle-text',
    snapshot: snapshot(ToggleTextOrigin(), nativeEnabledKeyboard),
  },
  {
    id: 'toggle-disabled-button',
    snapshot: snapshot(ToggleDisabledOrigin(), suppressedKeyboard),
  },
]
