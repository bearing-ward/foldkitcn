import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as ShadcnButton from '../button'
import * as ShadcnInput from '../input'
import * as ShadcnTextarea from '../textarea'

// MODEL

type Child = Html | string

export const InputGroupAddonAlign = S.Union([
  S.Literal('inline-start'),
  S.Literal('inline-end'),
  S.Literal('block-start'),
  S.Literal('block-end'),
])
export type InputGroupAddonAlign = typeof InputGroupAddonAlign.Type

export const InputGroupButtonSize = S.Union([
  S.Literal('xs'),
  S.Literal('sm'),
  S.Literal('icon-xs'),
  S.Literal('icon-sm'),
])
export type InputGroupButtonSize = typeof InputGroupButtonSize.Type

export const inputGroupAddonAlignValues: ReadonlyArray<InputGroupAddonAlign> = [
  'inline-start',
  'inline-end',
  'block-start',
  'block-end',
]

export const inputGroupButtonSizeValues: ReadonlyArray<InputGroupButtonSize> = [
  'xs',
  'sm',
  'icon-xs',
  'icon-sm',
]

export const InputGroupStyleOptions = S.Struct({
  className: S.optional(S.String),
  dir: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
})
export type InputGroupStyleOptions = typeof InputGroupStyleOptions.Type

export const InputGroupAddonStyleOptions = S.Struct({
  align: S.optional(InputGroupAddonAlign),
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type InputGroupAddonStyleOptions =
  typeof InputGroupAddonStyleOptions.Type

export const InputGroupButtonStyleOptions = S.Struct({
  size: S.optional(InputGroupButtonSize),
  className: S.optional(S.String),
})
export type InputGroupButtonStyleOptions =
  typeof InputGroupButtonStyleOptions.Type

export const InputGroupTextStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type InputGroupTextStyleOptions = typeof InputGroupTextStyleOptions.Type

// VIEW

export type InputGroupAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
}>

export type InputGroupAddonAttributes<Message> = Readonly<{
  addon: ReadonlyArray<Attribute<Message>>
}>

export type InputGroupButtonAttributes<Message> =
  ShadcnButton.ButtonAttributes<Message>

export type InputGroupTextAttributes<Message> = Readonly<{
  text: ReadonlyArray<Attribute<Message>>
}>

export type InputGroupInputAttributes<Message> =
  ShadcnInput.InputAttributes<Message>

export type InputGroupTextareaAttributes<Message> =
  ShadcnTextarea.TextareaAttributes<Message>

export type ViewConfig<Message> = InputGroupStyleOptions &
  Readonly<{
    ariaLabel?: string
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: InputGroupAttributes<Message>) => Html
  }>

export type InputGroupAddonConfig<Message> = InputGroupAddonStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: InputGroupAddonAttributes<Message>) => Html
  }>

export type InputGroupButtonConfig<Message> = Omit<
  ShadcnButton.ViewConfig<Message>,
  'size' | 'toView'
> &
  InputGroupButtonStyleOptions &
  Readonly<{
    ariaLabel?: string
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: InputGroupButtonAttributes<Message>) => Html
  }>

export type InputGroupTextConfig<Message> = InputGroupTextStyleOptions &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    children?: ReadonlyArray<Child>
    toView?: (attributes: InputGroupTextAttributes<Message>) => Html
  }>

export type InputGroupInputConfig<Message> = Omit<
  ShadcnInput.ViewConfig<Message>,
  'toView'
> &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    toView?: (attributes: InputGroupInputAttributes<Message>) => Html
  }>

export type InputGroupTextareaConfig<Message> = Omit<
  ShadcnTextarea.ViewConfig<Message>,
  'toView'
> &
  Readonly<{
    attributes?: ReadonlyArray<Attribute<Message>>
    toView?: (attributes: InputGroupTextareaAttributes<Message>) => Html
  }>

export const inputGroupBaseClassName =
  'group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3'

export const inputGroupBaseLtrClassName =
  'has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5'

export const inputGroupBaseRtlClassName =
  'has-[>[data-align=inline-end]]:[&>input]:pe-1.5 has-[>[data-align=inline-start]]:[&>input]:ps-1.5'

export const inputGroupAddonBaseClassName =
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4"

export const inputGroupAddonAlignClassNames: Readonly<
  Record<InputGroupAddonAlign, string>
> = {
  'inline-start':
    'order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]',
  'inline-end':
    'order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]',
  'block-start':
    'order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2',
  'block-end':
    'order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2',
}

export const inputGroupAddonRtlAlignClassNames: Readonly<
  Record<InputGroupAddonAlign, string>
> = {
  'inline-start':
    'order-first ps-2 has-[>button]:ms-[-0.3rem] has-[>kbd]:ms-[-0.15rem]',
  'inline-end':
    'order-last pe-2 has-[>button]:me-[-0.3rem] has-[>kbd]:me-[-0.15rem]',
  'block-start': inputGroupAddonAlignClassNames['block-start'],
  'block-end': inputGroupAddonAlignClassNames['block-end'],
}

export const inputGroupButtonBaseClassName =
  'flex items-center gap-2 text-sm shadow-none'

export const inputGroupButtonSizeClassNames: Readonly<
  Record<InputGroupButtonSize, string>
> = {
  xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
  sm: '',
  'icon-xs': 'size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0',
  'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
}

export const inputGroupTextBaseClassName =
  "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"

export const inputGroupInputBaseClassName =
  'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent'

export const inputGroupTextareaBaseClassName =
  'flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent'

export const inputGroupClassName = ({
  className,
  dir,
}: InputGroupStyleOptions = {}): string =>
  cn(
    inputGroupBaseClassName,
    dir === 'rtl' ? inputGroupBaseRtlClassName : inputGroupBaseLtrClassName,
    className,
  )

export const inputGroupAddonClassName = ({
  align = 'inline-start',
  className,
  dir,
}: InputGroupAddonStyleOptions = {}): string =>
  cn(
    inputGroupAddonBaseClassName,
    dir === 'rtl'
      ? inputGroupAddonRtlAlignClassNames[align]
      : inputGroupAddonAlignClassNames[align],
    className,
  )

export const inputGroupButtonClassName = ({
  className,
  size = 'xs',
}: InputGroupButtonStyleOptions = {}): string =>
  cn(
    inputGroupButtonBaseClassName,
    inputGroupButtonSizeClassNames[size],
    className,
  )

export const inputGroupTextClassName = ({
  className,
}: InputGroupTextStyleOptions = {}): string =>
  cn(inputGroupTextBaseClassName, className)

export const inputGroupInputClassName = ({
  className,
}: ShadcnInput.InputStyleOptions = {}): string =>
  cn(inputGroupInputBaseClassName, className)

export const inputGroupTextareaClassName = ({
  className,
}: ShadcnTextarea.TextareaStyleOptions = {}): string =>
  cn(inputGroupTextareaBaseClassName, className)

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [toAttribute(value)]

const dataDisabledAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.DataAttribute('disabled', 'true')] : []

const inputGroupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): InputGroupAttributes<Message> => ({
  root: [
    h.Role('group'),
    h.DataAttribute('slot', 'input-group'),
    ...dataDisabledAttribute(h, config.isDisabled),
    h.Class(inputGroupClassName(config)),
    ...optionalAttribute<Message>(config.dir, value => h.Dir(value)),
    ...optionalAttribute<Message>(config.ariaLabel, value =>
      h.AriaLabel(value),
    ),
    ...(config.attributes ?? []),
  ],
})

const inputGroupAddonAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: InputGroupAddonConfig<Message>,
): InputGroupAddonAttributes<Message> => {
  const align = config.align ?? 'inline-start'

  return {
    addon: [
      h.Role('group'),
      h.DataAttribute('slot', 'input-group-addon'),
      h.DataAttribute('align', align),
      h.Class(inputGroupAddonClassName(config)),
      ...(config.attributes ?? []),
    ],
  }
}

const inputGroupTextAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: InputGroupTextConfig<Message>,
): InputGroupTextAttributes<Message> => ({
  text: [
    h.Class(inputGroupTextClassName(config)),
    ...(config.attributes ?? []),
  ],
})

export const view = <Message>(config: ViewConfig<Message> = {}): Html => {
  const h = html<Message>()
  const attributes = inputGroupAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.root], config.children ?? [])
    : config.toView(attributes)
}

export const InputGroup = view

export const InputGroupAddon = <Message>(
  config: InputGroupAddonConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = inputGroupAddonAttributes(h, config)

  return config.toView === undefined
    ? h.div([...attributes.addon], config.children ?? [])
    : config.toView(attributes)
}

export const InputGroupButton = <Message>(
  config: InputGroupButtonConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const {
    ariaLabel,
    attributes = [],
    children = [],
    className,
    size = 'xs',
    toView,
    ...buttonConfig
  } = config

  return ShadcnButton.view<Message>({
    ...buttonConfig,
    variant: buttonConfig.variant ?? 'ghost',
    size: 'default',
    className: cn(inputGroupButtonClassName({ className, size })),
    toView: buttonAttributes => {
      const mergedAttributes: InputGroupButtonAttributes<Message> = {
        button: [
          ...buttonAttributes.button,
          h.DataAttribute('size', size),
          ...optionalAttribute<Message>(ariaLabel, value => h.AriaLabel(value)),
          ...attributes,
        ],
      }

      return toView === undefined
        ? h.button([...mergedAttributes.button], children)
        : toView(mergedAttributes)
    },
  })
}

export const InputGroupText = <Message>(
  config: InputGroupTextConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const attributes = inputGroupTextAttributes(h, config)

  return config.toView === undefined
    ? h.span([...attributes.text], config.children ?? [])
    : config.toView(attributes)
}

export const InputGroupInput = <Message>(
  config: InputGroupInputConfig<Message>,
): Html => {
  const h = html<Message>()
  const { attributes = [], className, toView, ...inputConfig } = config

  return ShadcnInput.view<Message>({
    ...inputConfig,
    className: inputGroupInputClassName({ className }),
    toView: inputAttributes => {
      const mergedAttributes: InputGroupInputAttributes<Message> = {
        input: [
          ...inputAttributes.input,
          h.DataAttribute('slot', 'input-group-control'),
          ...attributes,
        ],
      }

      return toView === undefined
        ? h.input([...mergedAttributes.input])
        : toView(mergedAttributes)
    },
  })
}

export const InputGroupTextarea = <Message>(
  config: InputGroupTextareaConfig<Message>,
): Html => {
  const h = html<Message>()
  const { attributes = [], className, toView, ...textareaConfig } = config

  return ShadcnTextarea.view<Message>({
    ...textareaConfig,
    className: inputGroupTextareaClassName({ className }),
    toView: textareaAttributes => {
      const mergedAttributes: InputGroupTextareaAttributes<Message> = {
        textarea: [
          ...textareaAttributes.textarea,
          h.DataAttribute('slot', 'input-group-control'),
          ...attributes,
        ],
      }

      return toView === undefined
        ? h.textarea([...mergedAttributes.textarea], [])
        : toView(mergedAttributes)
    },
  })
}
