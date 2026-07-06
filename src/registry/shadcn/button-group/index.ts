import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseSeparator from '../../base-ui/separator'

// MODEL

type Child = Html | string

export const ButtonGroupOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type ButtonGroupOrientation = typeof ButtonGroupOrientation.Type

export const buttonGroupOrientationValues: ReadonlyArray<ButtonGroupOrientation> =
  ['horizontal', 'vertical']

export const ButtonGroupStyleOptions = S.Struct({
  className: S.optional(S.String),
  orientation: S.optional(ButtonGroupOrientation),
  dir: S.optional(S.String),
})
export type ButtonGroupStyleOptions = typeof ButtonGroupStyleOptions.Type

export const ButtonGroupTextStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type ButtonGroupTextStyleOptions =
  typeof ButtonGroupTextStyleOptions.Type

export const ButtonGroupSeparatorStyleOptions = S.Struct({
  className: S.optional(S.String),
  orientation: S.optional(
    S.Union([S.Literal('horizontal'), S.Literal('vertical')]),
  ),
})
export type ButtonGroupSeparatorStyleOptions =
  typeof ButtonGroupSeparatorStyleOptions.Type

// VIEW

export type ButtonGroupAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
}>

export type ButtonGroupTextAttributes<Message> = Readonly<{
  text: ReadonlyArray<Attribute<Message>>
}>

export type ButtonGroupSeparatorAttributes<Message> = Readonly<{
  separator: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = ButtonGroupStyleOptions &
  Readonly<{
    ariaLabel?: string
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: ButtonGroupAttributes<Message>) => Html
  }>

export type ButtonGroupTextConfig<Message> = ButtonGroupTextStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: ButtonGroupTextAttributes<Message>) => Html
  }>

export type ButtonGroupSeparatorConfig<Message> =
  ButtonGroupSeparatorStyleOptions &
    Readonly<{
      attributes?: ReadonlyArray<Attribute<Message>>
      toView?: (attributes: ButtonGroupSeparatorAttributes<Message>) => Html
    }>

export const buttonGroupBaseClassName =
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1"

export const buttonGroupRtlBaseClassName =
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1"

export const buttonGroupOrientationClassNames: Readonly<
  Record<ButtonGroupOrientation, string>
> = {
  horizontal:
    '*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0',
  vertical:
    'flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0',
}

export const buttonGroupRtlOrientationClassNames: Readonly<
  Record<ButtonGroupOrientation, string>
> = {
  horizontal:
    '*:data-slot:rounded-e-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-e-lg! [&>[data-slot]~[data-slot]]:rounded-s-none [&>[data-slot]~[data-slot]]:border-s-0',
  vertical: buttonGroupOrientationClassNames.vertical,
}

export const buttonGroupTextBaseClassName =
  "flex items-center gap-2 rounded-lg border bg-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"

export const buttonGroupSeparatorBaseClassName =
  'shrink-0 data-horizontal:h-px data-vertical:w-px data-vertical:self-stretch relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto'

export const buttonGroupClassName = ({
  className,
  dir,
  orientation = 'horizontal',
}: ButtonGroupStyleOptions = {}): string =>
  cn(
    dir === 'rtl' ? buttonGroupRtlBaseClassName : buttonGroupBaseClassName,
    dir === 'rtl'
      ? buttonGroupRtlOrientationClassNames[orientation]
      : buttonGroupOrientationClassNames[orientation],
    className,
  )

export const buttonGroupTextClassName = ({
  className,
}: ButtonGroupTextStyleOptions = {}): string =>
  cn(buttonGroupTextBaseClassName, className)

export const buttonGroupSeparatorClassName = ({
  className,
}: Pick<ButtonGroupSeparatorStyleOptions, 'className'> = {}): string =>
  cn(buttonGroupSeparatorBaseClassName, className)

const optionalDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [h.DataAttribute(name, value)]

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [toAttribute(value)]

const buttonGroupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ButtonGroupAttributes<Message> => ({
  root: [
    h.Role('group'),
    h.DataAttribute('slot', 'button-group'),
    ...optionalDataAttribute<Message>(h, 'orientation', config.orientation),
    h.Class(buttonGroupClassName(config)),
    ...optionalAttribute<Message>(config.dir, value => h.Dir(value)),
    ...optionalAttribute<Message>(config.ariaLabel, value =>
      h.AriaLabel(value),
    ),
    ...(config.attributes ?? []),
  ],
})

const buttonGroupTextAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ButtonGroupTextConfig<Message>,
): ButtonGroupTextAttributes<Message> => ({
  text: [
    h.DataAttribute('slot', 'button-group-text'),
    h.Class(buttonGroupTextClassName(config)),
    ...(config.attributes ?? []),
  ],
})

const buttonGroupSeparatorAttributes = <Message>(
  attributes: BaseSeparator.SeparatorAttributes<Message>,
  config: ButtonGroupSeparatorConfig<Message>,
  h: ReturnType<typeof html<Message>>,
): ButtonGroupSeparatorAttributes<Message> => ({
  separator: [
    ...attributes.separator,
    h.DataAttribute('slot', 'button-group-separator'),
    h.Class(buttonGroupSeparatorClassName({ className: config.className })),
    ...(config.attributes ?? []),
  ],
})

export const view = <Message>(config: ViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const attributes = buttonGroupAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.root], config.children ?? [])
    : config.toView(attributes)
}

export const ButtonGroup = view

export const ButtonGroupText = <Message>(
  config: ButtonGroupTextConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = buttonGroupTextAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.text], config.children ?? [])
    : config.toView(attributes)
}

export const ButtonGroupSeparator = <Message>(
  config: ButtonGroupSeparatorConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const { orientation = 'vertical' } = config

  return BaseSeparator.view<Message>({
    orientation,
    toView: attributes => {
      const separatorAttributes = buttonGroupSeparatorAttributes(
        attributes,
        config,
        h,
      )

      return config.toView === undefined
        ? h.div([...separatorAttributes.separator], [])
        : config.toView(separatorAttributes)
    },
  })
}
