import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const NativeSelectSize = S.Union([S.Literal('default'), S.Literal('sm')])
export type NativeSelectSize = typeof NativeSelectSize.Type

export const nativeSelectSizeValues: ReadonlyArray<NativeSelectSize> = [
  'default',
  'sm',
]

export const NativeSelectStyleOptions = S.Struct({
  size: S.optional(NativeSelectSize),
  direction: S.optional(S.Union([S.Literal('ltr'), S.Literal('rtl')])),
  className: S.optional(S.String),
})
export type NativeSelectStyleOptions = typeof NativeSelectStyleOptions.Type

export const NativeSelectOptionStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type NativeSelectOptionStyleOptions =
  typeof NativeSelectOptionStyleOptions.Type

export const NativeSelectOptGroupStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type NativeSelectOptGroupStyleOptions =
  typeof NativeSelectOptGroupStyleOptions.Type

export const NativeSelectIconStyleOptions = S.Struct({
  direction: S.optional(S.Union([S.Literal('ltr'), S.Literal('rtl')])),
  className: S.optional(S.String),
})
export type NativeSelectIconStyleOptions =
  typeof NativeSelectIconStyleOptions.Type

// VIEW

export type NativeSelectAttributes<Message> = Readonly<{
  wrapper: ReadonlyArray<Attribute<Message>>
  select: ReadonlyArray<Attribute<Message>>
  icon: ReadonlyArray<Attribute<Message>>
}>

export type NativeSelectOptionAttributes<Message> = Readonly<{
  option: ReadonlyArray<Attribute<Message>>
}>

export type NativeSelectOptGroupAttributes<Message> = Readonly<{
  optGroup: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = NativeSelectStyleOptions &
  Readonly<{
    selectClassName?: string
    iconClassName?: string
    disabled?: boolean
    invalid?: boolean
    dir?: string
    toView: (attributes: NativeSelectAttributes<Message>) => Html
  }>

export type OptionViewConfig<Message> = NativeSelectOptionStyleOptions &
  Readonly<{
    value?: string
    disabled?: boolean
    selected?: boolean
    toView: (attributes: NativeSelectOptionAttributes<Message>) => Html
  }>

export type OptGroupViewConfig<Message> = NativeSelectOptGroupStyleOptions &
  Readonly<{
    label: string
    disabled?: boolean
    toView: (attributes: NativeSelectOptGroupAttributes<Message>) => Html
  }>

export const wrapperBaseClassName =
  'group/native-select relative w-fit has-[select:disabled]:opacity-50'

export const selectBaseClassName =
  'h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-sm transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40'

export const selectRtlBaseClassName =
  'h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent py-1 ps-2.5 pe-8 text-sm transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40'

export const optionBaseClassName = 'bg-[Canvas] text-[CanvasText]'
export const optGroupBaseClassName = 'bg-[Canvas] text-[CanvasText]'

export const iconBaseClassName =
  'pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground select-none'

export const iconRtlBaseClassName =
  'pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground select-none'

export const wrapperClassName = ({
  className,
}: NativeSelectStyleOptions = {}): string => cn(wrapperBaseClassName, className)

export const selectClassName = ({
  direction = 'ltr',
  className,
}: NativeSelectStyleOptions = {}): string =>
  cn(
    direction === 'rtl' ? selectRtlBaseClassName : selectBaseClassName,
    className,
  )

export const optionClassName = ({
  className,
}: NativeSelectOptionStyleOptions = {}): string =>
  cn(optionBaseClassName, className)

export const optGroupClassName = ({
  className,
}: NativeSelectOptGroupStyleOptions = {}): string =>
  cn(optGroupBaseClassName, className)

export const iconClassName = ({
  direction = 'ltr',
  className,
}: NativeSelectIconStyleOptions = {}): string =>
  cn(direction === 'rtl' ? iconRtlBaseClassName : iconBaseClassName, className)

const booleanAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.Attribute(name, '')] : []

const wrapperAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  size: NativeSelectSize,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'native-select-wrapper'),
  h.DataAttribute('size', size),
  h.Class(wrapperClassName({ className })),
]

const selectAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ViewConfig<Message>,
    'direction' | 'disabled' | 'dir' | 'invalid' | 'selectClassName'
  > &
    Readonly<{ size: NativeSelectSize }>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'native-select'),
  h.DataAttribute('size', config.size),
  h.Class(
    selectClassName({
      direction: config.direction,
      className: config.selectClassName,
    }),
  ),
  ...booleanAttribute(h, 'disabled', config.disabled),
  ...(config.invalid === true ? [h.Attribute('aria-invalid', 'true')] : []),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

const iconAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  direction: NativeSelectIconStyleOptions['direction'],
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'native-select-icon'),
  h.Class(iconClassName({ direction, className })),
  h.AriaHidden(true),
]

const optionAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    OptionViewConfig<Message>,
    'className' | 'disabled' | 'selected' | 'value'
  >,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'native-select-option'),
  h.Class(optionClassName({ className: config.className })),
  ...(config.value === undefined ? [] : [h.Attribute('value', config.value)]),
  ...booleanAttribute(h, 'disabled', config.disabled),
  ...booleanAttribute(h, 'selected', config.selected),
]

const optGroupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<OptGroupViewConfig<Message>, 'className' | 'disabled' | 'label'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'native-select-optgroup'),
  h.Class(optGroupClassName({ className: config.className })),
  h.Attribute('label', config.label),
  ...booleanAttribute(h, 'disabled', config.disabled),
]

export const chevronDownIcon = <Message>(
  attributes: ReadonlyArray<Attribute<Message>>,
): Html => {
  const h = html<Message>()

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
      ...attributes,
    ],
    [h.path([h.D('m6 9 6 6 6-6')], [])],
  )
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const {
    toView,
    size = 'default',
    direction = 'ltr',
    className,
    iconClassName: iconClassNameConfig,
    ...selectConfig
  } = config

  return toView({
    wrapper: wrapperAttributes(h, size, className),
    select: selectAttributes(h, { ...selectConfig, size, direction }),
    icon: iconAttributes(h, direction, iconClassNameConfig),
  })
}

export const optionView = <Message>(
  config: OptionViewConfig<Message>,
): Html => {
  const h = html<Message>()
  const { toView, ...optionConfig } = config

  return toView({
    option: optionAttributes(h, optionConfig),
  })
}

export const optGroupView = <Message>(
  config: OptGroupViewConfig<Message>,
): Html => {
  const h = html<Message>()
  const { toView, ...optGroupConfig } = config

  return toView({
    optGroup: optGroupAttributes(h, optGroupConfig),
  })
}
