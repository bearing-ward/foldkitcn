import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseToggle from '../../base-ui/toggle'

// MODEL

export type ToggleChangeReason = BaseToggle.ToggleChangeReason
export type TogglePressedChange = BaseToggle.TogglePressedChange

export const ToggleVariant = S.Union([
  S.Literal('default'),
  S.Literal('outline'),
])
export type ToggleVariant = typeof ToggleVariant.Type

export const ToggleSize = S.Union([
  S.Literal('default'),
  S.Literal('sm'),
  S.Literal('lg'),
])
export type ToggleSize = typeof ToggleSize.Type

export const toggleVariantValues: ReadonlyArray<ToggleVariant> = [
  'default',
  'outline',
]

export const toggleSizeValues: ReadonlyArray<ToggleSize> = [
  'default',
  'sm',
  'lg',
]

export const ToggleStyleOptions = S.Struct({
  variant: S.optional(ToggleVariant),
  size: S.optional(ToggleSize),
  className: S.optional(S.String),
})
export type ToggleStyleOptions = typeof ToggleStyleOptions.Type

// UPDATE

export const { pressedChange } = BaseToggle

// VIEW

export type ToggleAttributes<Message> = BaseToggle.ToggleAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseToggle.ViewConfig<Message>,
  'toView'
> &
  ToggleStyleOptions &
  Readonly<{
    dir?: string | undefined
    toView: (attributes: ToggleAttributes<Message>) => Html
  }>

export const baseClassName =
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export const variantClassNames: Readonly<Record<ToggleVariant, string>> = {
  default: 'bg-transparent',
  outline: 'border border-input bg-transparent hover:bg-muted',
}

export const sizeClassNames: Readonly<Record<ToggleSize, string>> = {
  default:
    'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
  sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
}

export const rtlSizeClassNames: Readonly<Record<ToggleSize, string>> = {
  default:
    'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
  sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
}

export const toggleVariants = ({
  variant = 'default',
  size = 'default',
  className,
  dir,
}: ToggleStyleOptions & Readonly<{ dir?: string | undefined }> = {}): string =>
  cn(
    baseClassName,
    variantClassNames[variant],
    dir === 'rtl' ? rtlSizeClassNames[size] : sizeClassNames[size],
    className,
  )

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'className' | 'dir' | 'size' | 'variant'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'toggle'),
  h.Class(
    toggleVariants({
      ...(config.variant === undefined ? {} : { variant: config.variant }),
      ...(config.size === undefined ? {} : { size: config.size }),
      ...(config.className === undefined
        ? {}
        : { className: config.className }),
      ...(config.dir === undefined ? {} : { dir: config.dir }),
    }),
  ),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseToggle.view<Message>({
    ...baseConfig,
    toView: attributes =>
      toView({
        button: [...attributes.button, ...shadcnAttributes(h, config)],
      }),
  })
}
