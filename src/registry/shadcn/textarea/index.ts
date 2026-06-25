import { Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const TextareaChangeReason = S.Literal('none')
export type TextareaChangeReason = typeof TextareaChangeReason.Type

export const TextareaValueChange = S.Struct({
  value: S.String,
  reason: TextareaChangeReason,
})
export type TextareaValueChange = typeof TextareaValueChange.Type

export const TextareaOptions = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  value: S.optional(S.String),
  placeholder: S.optional(S.String),
  rows: S.optional(S.Number),
  cols: S.optional(S.Number),
  maxLength: S.optional(S.Number),
  minLength: S.optional(S.Number),
  wrap: S.optional(S.String),
  form: S.optional(S.String),
  dir: S.optional(S.String),
  ariaLabel: S.optional(S.String),
  ariaLabelledBy: S.optional(S.String),
  ariaDescribedBy: S.optional(S.String),
  isDisabled: S.optional(S.Boolean),
  isInvalid: S.optional(S.Boolean),
  isRequired: S.optional(S.Boolean),
  isReadOnly: S.optional(S.Boolean),
  isAutofocus: S.optional(S.Boolean),
  spellCheck: S.optional(S.Boolean),
})
export type TextareaOptions = typeof TextareaOptions.Type

export const TextareaStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type TextareaStyleOptions = typeof TextareaStyleOptions.Type

// VIEW

export type TextareaAttributes<Message> = Readonly<{
  textarea: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = TextareaOptions &
  TextareaStyleOptions &
  Readonly<{
    toView: (attributes: TextareaAttributes<Message>) => Html
    onValueChange?: (change: TextareaValueChange) => Message
    onFocus?: Message
    onBlur?: Message
  }>

export const textareaBaseClassName =
  'flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40'

export const textareaClassName = ({
  className,
}: TextareaStyleOptions = {}): string => cn(textareaBaseClassName, className)

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [toAttribute(value)] : []

const optionalNumberAttribute = <Message>(
  value: number | undefined,
  toAttribute: (value: number) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [toAttribute(value)] : []

const optionalBooleanAttribute = <Message>(
  value: boolean | undefined,
  toAttribute: (value: boolean) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [toAttribute(true)] : []

const valueAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  value: string | undefined,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [h.Value(value)] : []

const eventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ViewConfig<Message>,
    'isDisabled' | 'onBlur' | 'onFocus' | 'onValueChange'
  >,
): ReadonlyArray<Attribute<Message>> => {
  const { onValueChange } = config

  return [
    ...(Predicate.isNotUndefined(onValueChange) && !config.isDisabled
      ? [
          h.OnInput(value =>
            onValueChange({
              value,
              reason: 'none',
            }),
          ),
        ]
      : []),
    ...(Predicate.isNotUndefined(config.onFocus)
      ? [h.OnFocus(config.onFocus)]
      : []),
    ...(Predicate.isNotUndefined(config.onBlur)
      ? [h.OnBlur(config.onBlur)]
      : []),
  ]
}

const textareaAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'textarea'),
  h.Class(textareaClassName({ className: config.className })),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...optionalAttribute<Message>(config.name, value => h.Name(value)),
  ...optionalAttribute<Message>(config.placeholder, value =>
    h.Placeholder(value),
  ),
  ...optionalAttribute<Message>(config.wrap, value => h.Wrap(value)),
  ...optionalAttribute<Message>(config.form, value =>
    h.Attribute('form', value),
  ),
  ...optionalAttribute<Message>(config.dir, value => h.Dir(value)),
  ...optionalAttribute<Message>(config.ariaLabel, value => h.AriaLabel(value)),
  ...optionalAttribute<Message>(config.ariaLabelledBy, value =>
    h.AriaLabelledBy(value),
  ),
  ...optionalAttribute<Message>(config.ariaDescribedBy, value =>
    h.AriaDescribedBy(value),
  ),
  ...optionalNumberAttribute<Message>(config.rows, value => h.Rows(value)),
  ...optionalNumberAttribute<Message>(config.cols, value => h.Cols(value)),
  ...optionalNumberAttribute<Message>(config.maxLength, value =>
    h.Maxlength(value),
  ),
  ...optionalNumberAttribute<Message>(config.minLength, value =>
    h.Minlength(value),
  ),
  ...valueAttribute(h, config.value),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.Disabled(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isRequired, value =>
    h.Required(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isReadOnly, value =>
    h.Readonly(value),
  ),
  ...optionalBooleanAttribute<Message>(config.isAutofocus, value =>
    h.Autofocus(value),
  ),
  ...optionalBooleanAttribute<Message>(config.spellCheck, value =>
    h.Spellcheck(value),
  ),
  ...(config.isInvalid === true ? [h.AriaInvalid(true)] : []),
  ...eventAttributes(h, config),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView({
    textarea: textareaAttributes(h, config),
  })
}
