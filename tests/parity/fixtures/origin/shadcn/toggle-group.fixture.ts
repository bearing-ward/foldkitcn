import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../../../src/utils/cn'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotHtml } from '../../foldkit/render'

type IconName = 'alignCenter' | 'alignLeft' | 'alignRight' | 'bold' | 'italic'
type ToggleVariant = 'default' | 'outline'
type ToggleSize = 'default' | 'sm' | 'lg'
type ToggleGroupSpacing = 0 | 1 | 2 | 4
type ToggleGroupOrientation = 'horizontal' | 'vertical'

type ToggleGroupItemConfig = Readonly<{
  ariaLabel?: string
  children: ReadonlyArray<Html | string>
  id: string
  isDisabled?: boolean
  label: string
  value: string
}>

type ToggleGroupConfig = Readonly<{
  ariaLabel?: string
  childrenByValue?: Readonly<Record<string, ReadonlyArray<Html | string>>>
  className?: string
  dir?: string
  itemClassName?: string
  items: ReadonlyArray<ToggleGroupItemConfig>
  multiple?: boolean
  orientation?: ToggleGroupOrientation
  size?: ToggleSize
  spacing?: ToggleGroupSpacing
  value?: ReadonlyArray<string>
  variant?: ToggleVariant
}>

const baseKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowRight: 'focuses',
  ArrowLeft: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const verticalKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
  ArrowDown: 'focuses',
  ArrowUp: 'focuses',
  Home: 'focuses',
  End: 'focuses',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const iconPaths: Readonly<Record<IconName, string>> = {
  alignCenter: 'M17 12H7m12-6H5m14 12H5',
  alignLeft: 'M21 6H3m15 6H3m11 6H3',
  alignRight: 'M21 6H3m18 6H6m15 6H10',
  bold: 'M6 12h9a4 4 0 0 0 0-8H7a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h9a4 4 0 0 0 0-8',
  italic: 'M19 4h-9m4 16H5m10-16-4 16',
}

const iconClassNames: Readonly<Record<IconName, string>> = {
  alignCenter: 'lucide lucide-align-center-icon',
  alignLeft: 'lucide lucide-align-left-icon',
  alignRight: 'lucide lucide-align-right-icon',
  bold: 'lucide lucide-bold-icon',
  italic: 'lucide lucide-italic-icon',
}

const toggleBaseClassName =
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const toggleVariantClassNames: Readonly<Record<ToggleVariant, string>> = {
  default: 'bg-transparent',
  outline: 'border border-input bg-transparent hover:bg-muted',
}

const toggleSizeClassNames: Readonly<Record<ToggleSize, string>> = {
  default:
    'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
  sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
}

const toggleRtlSizeClassNames: Readonly<Record<ToggleSize, string>> = {
  default:
    'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
  sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
}

const toggleGroupBaseClassName =
  'group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-vertical:flex-col data-vertical:items-stretch'

const toggleGroupItemBaseClassName =
  'shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t'

const toggleClassName = (
  variant: ToggleVariant,
  size: ToggleSize,
  dir?: string,
): string =>
  cn(
    toggleBaseClassName,
    toggleVariantClassNames[variant],
    dir === 'rtl' ? toggleRtlSizeClassNames[size] : toggleSizeClassNames[size],
  )

const toggleGroupClassName = (className?: string): string =>
  cn(toggleGroupBaseClassName, className)

const toggleGroupItemClassName = (
  config: Readonly<{
    className?: string
    dir?: string
    size: ToggleSize
    variant: ToggleVariant
  }>,
): string =>
  cn(
    toggleGroupItemBaseClassName,
    toggleClassName(config.variant, config.size, config.dir),
    config.className,
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

const iconSlot = (name: IconName): Html => {
  const h = html<never>()

  return h.span([h.DataAttribute('icon', 'inline-start')], [icon(name)])
}

const selectedTabValue = (
  items: ReadonlyArray<ToggleGroupItemConfig>,
  value: ReadonlyArray<string>,
): string | undefined =>
  items.find(item => value.includes(item.value) && item.isDisabled !== true)
    ?.value ?? items.find(item => item.isDisabled !== true)?.value

const itemAttributes = (
  h: ReturnType<typeof html<never>>,
  config: ToggleGroupConfig,
  item: ToggleGroupItemConfig,
): ReadonlyArray<ReturnType<typeof h.Attribute>> => {
  const value = config.value ?? ['center']
  const variant = config.variant ?? 'default'
  const size = config.size ?? 'default'
  const spacing = config.spacing ?? 2
  const orientation = config.orientation ?? 'horizontal'
  const isPressed = value.includes(item.value)
  const isDisabled = item.isDisabled === true

  return [
    h.Type('button'),
    h.Tabindex(
      selectedTabValue(config.items, value) === item.value && !isDisabled
        ? 0
        : -1,
    ),
    h.Id(item.id),
    h.AriaPressed(String(isPressed)),
    h.DataAttribute('state', isPressed ? 'on' : 'off'),
    ...(isPressed ? [h.DataAttribute('pressed', '')] : []),
    ...(isDisabled
      ? [h.AriaDisabled(true), h.DataAttribute('disabled', '')]
      : []),
    h.DataAttribute('orientation', orientation),
    h.DataAttribute('slot', 'toggle-group-item'),
    h.DataAttribute('variant', variant),
    h.DataAttribute('size', size),
    h.DataAttribute('spacing', String(spacing)),
    h.Class(
      toggleGroupItemClassName({
        className: config.itemClassName,
        dir: config.dir,
        size,
        variant,
      }),
    ),
    ...(item.ariaLabel === undefined ? [] : [h.AriaLabel(item.ariaLabel)]),
  ]
}

const toggleGroup = (config: ToggleGroupConfig): Html => {
  const h = html<never>()
  const value = config.value ?? ['center']
  const { variant } = config
  const { size } = config
  const spacing = config.spacing ?? 2
  const orientation = config.orientation ?? 'horizontal'

  return h.div(
    [
      h.Role('group'),
      h.DataAttribute('orientation', orientation),
      ...(config.multiple === true ? [h.DataAttribute('multiple', '')] : []),
      h.DataAttribute('slot', 'toggle-group'),
      ...(variant === undefined ? [] : [h.DataAttribute('variant', variant)]),
      ...(size === undefined ? [] : [h.DataAttribute('size', size)]),
      h.DataAttribute('spacing', String(spacing)),
      h.Style({ '--gap': String(spacing) }),
      h.Class(toggleGroupClassName(config.className)),
      ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
      ...(config.ariaLabel === undefined
        ? []
        : [h.AriaLabel(config.ariaLabel)]),
    ],
    config.items.map(item =>
      h.button(
        [...itemAttributes(h, { ...config, value }, item)],
        config.childrenByValue?.[item.value] ?? item.children,
      ),
    ),
  )
}

const alignmentItems: ReadonlyArray<ToggleGroupItemConfig> = [
  {
    id: 'align-left',
    value: 'left',
    label: 'Left',
    children: [iconSlot('alignLeft')],
  },
  {
    id: 'align-center',
    value: 'center',
    label: 'Center',
    children: [iconSlot('alignCenter')],
  },
  {
    id: 'align-right',
    value: 'right',
    label: 'Right',
    children: [iconSlot('alignRight')],
  },
]

const ToggleGroupDemoOrigin = (): Html =>
  toggleGroup({
    ariaLabel: 'Text alignment',
    value: ['center'],
    variant: 'outline',
    items: alignmentItems,
  })

const ToggleGroupDisabledOrigin = (): Html =>
  toggleGroup({
    value: ['bold'],
    multiple: true,
    variant: 'outline',
    items: [
      { id: 'format-bold', value: 'bold', label: 'Bold', children: ['Bold'] },
      {
        id: 'format-italic',
        value: 'italic',
        label: 'Italic',
        children: ['Italic'],
      },
      {
        id: 'format-strikethrough',
        value: 'strikethrough',
        label: 'Disabled',
        isDisabled: true,
        children: ['Disabled'],
      },
    ],
  })

const ToggleGroupFontWeightSelectorOrigin = (): Html =>
  toggleGroup({
    ariaLabel: 'Font weight',
    value: ['bold'],
    multiple: true,
    variant: 'outline',
    items: [
      {
        id: 'format-bold',
        value: 'bold',
        label: 'Bold',
        children: [icon('bold')],
      },
      {
        id: 'format-italic',
        value: 'italic',
        label: 'Italic',
        children: [icon('italic')],
      },
    ],
  })

const ToggleGroupOutlineOrigin = (): Html =>
  toggleGroup({
    ariaLabel: 'Text alignment outline',
    value: ['center'],
    variant: 'outline',
    spacing: 0,
    items: alignmentItems,
  })

const ToggleGroupRtlOrigin = (): Html =>
  toggleGroup({
    ariaLabel: 'محاذاة النص',
    dir: 'rtl',
    value: ['center'],
    variant: 'outline',
    items: [
      {
        id: 'align-left',
        value: 'left',
        label: 'Left',
        children: [iconSlot('alignRight')],
      },
      {
        id: 'align-center',
        value: 'center',
        label: 'Center',
        children: [iconSlot('alignCenter')],
      },
      {
        id: 'align-right',
        value: 'right',
        label: 'Right',
        children: [iconSlot('alignLeft')],
      },
    ],
  })

const ToggleGroupSizesOrigin = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2')],
    [
      toggleGroup({
        ariaLabel: 'Small alignment',
        value: ['center'],
        size: 'sm',
        variant: 'outline',
        items: alignmentItems,
      }),
      toggleGroup({
        ariaLabel: 'Default alignment',
        value: ['center'],
        size: 'default',
        variant: 'outline',
        items: alignmentItems,
      }),
      toggleGroup({
        ariaLabel: 'Large alignment',
        value: ['center'],
        size: 'lg',
        variant: 'outline',
        items: alignmentItems,
      }),
    ],
  )
}

const ToggleGroupSpacingOrigin = (): Html =>
  toggleGroup({
    ariaLabel: 'Spaced alignment',
    value: ['center'],
    spacing: 4,
    variant: 'outline',
    items: alignmentItems,
  })

const ToggleGroupVerticalOrigin = (): Html =>
  toggleGroup({
    ariaLabel: 'Vertical text alignment',
    value: ['center'],
    orientation: 'vertical',
    variant: 'outline',
    items: alignmentItems,
  })

const snapshot = (
  sourceHtml: Html,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => ({
  ...snapshotHtml(sourceHtml, keyboardBehavior),
  keyboardBehavior,
})

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'toggle-group-demo',
    snapshot: snapshot(ToggleGroupDemoOrigin()),
  },
  {
    id: 'toggle-group-disabled',
    snapshot: snapshot(ToggleGroupDisabledOrigin()),
  },
  {
    id: 'toggle-group-font-weight-selector',
    snapshot: snapshot(ToggleGroupFontWeightSelectorOrigin()),
  },
  {
    id: 'toggle-group-outline',
    snapshot: snapshot(ToggleGroupOutlineOrigin()),
  },
  {
    id: 'toggle-group-rtl',
    snapshot: snapshot(ToggleGroupRtlOrigin()),
  },
  {
    id: 'toggle-group-sizes',
    snapshot: snapshot(ToggleGroupSizesOrigin()),
  },
  {
    id: 'toggle-group-spacing',
    snapshot: snapshot(ToggleGroupSpacingOrigin()),
  },
  {
    id: 'toggle-group-vertical',
    snapshot: snapshot(ToggleGroupVerticalOrigin(), verticalKeyboard),
  },
]
