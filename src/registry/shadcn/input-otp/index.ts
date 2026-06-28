import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseOTPField from '../../base-ui/otp-field'

// MODEL

export const {
  CompletedFocusOTPFieldInput,
  CommandMessage,
  FocusOTPFieldInput,
  OTPFieldChangeReason,
  OTPFieldFocusChange,
  OTPFieldOptions,
  OTPFieldValidationType,
  OTPFieldValueChange,
  commandForFocusChange,
  commandForValueChange,
  hiddenInputId,
  inputFocusSelector,
  inputId,
  normalizeOTPValue,
  normalizeOTPValueWithDetails,
  otpFieldFocusChange,
  otpFieldInputChange,
  otpFieldKeyboardFocusChange,
  otpFieldKeyboardValueChange,
  otpFieldPasteChange,
  otpFieldSlots,
  otpFieldState,
  removeOTPCharacter,
  replaceOTPValue,
  stripOTPWhitespace,
} = BaseOTPField
export type {
  OTPFieldSlotAttributes,
  OTPFieldSlotState,
  OTPFieldState,
} from '../../base-ui/otp-field'

export const InputOTPStyleOptions = S.Struct({
  className: S.optional(S.String),
  containerClassName: S.optional(S.String),
  groupClassName: S.optional(S.String),
  slotClassName: S.optional(S.String),
  separatorClassName: S.optional(S.String),
})
export type InputOTPStyleOptions = typeof InputOTPStyleOptions.Type

// VIEW

export type InputOTPSlotAttributes<Message> =
  BaseOTPField.OTPFieldSlotAttributes<Message> &
    Readonly<{
      slot: ReadonlyArray<Attribute<Message>>
      caret: ReadonlyArray<Attribute<Message>>
      caretLine: ReadonlyArray<Attribute<Message>>
    }>

export type InputOTPAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  group: ReadonlyArray<Attribute<Message>>
  slots: ReadonlyArray<InputOTPSlotAttributes<Message>>
  hiddenInput: ReadonlyArray<Attribute<Message>>
  separator: ReadonlyArray<Attribute<Message>>
  separatorIcon: ReadonlyArray<Attribute<Message>>
  state: BaseOTPField.OTPFieldState
}>

export type ViewConfig<Message> = Omit<
  BaseOTPField.ViewConfig<Message>,
  'toView'
> &
  InputOTPStyleOptions &
  Readonly<{
    toView?: (attributes: InputOTPAttributes<Message>) => Html
  }>

export type GroupConfig<Message> = Readonly<{
  attributes: InputOTPAttributes<Message>
  indexes: ReadonlyArray<number>
  className?: string | undefined
}>

export type SeparatorConfig = Readonly<{
  className?: string | undefined
}>

export const inputOTPContainerBaseClassName =
  'cn-input-otp flex items-center has-disabled:opacity-50'

export const inputOTPInputBaseClassName = 'disabled:cursor-not-allowed'

export const inputOTPGroupBaseClassName =
  'flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40'

export const inputOTPSlotBaseClassName =
  'relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40'

export const inputOTPSeparatorBaseClassName =
  "flex items-center [&_svg:not([class*='size-'])]:size-4"

const caretWrapperClassName =
  'pointer-events-none absolute inset-0 flex items-center justify-center'

const caretLineClassName =
  'h-4 w-px animate-caret-blink bg-foreground duration-1000'

export const inputOTPContainerClassName = ({
  containerClassName,
}: Pick<InputOTPStyleOptions, 'containerClassName'> = {}): string =>
  cn(inputOTPContainerBaseClassName, containerClassName)

export const inputOTPInputClassName = ({
  className,
}: Pick<InputOTPStyleOptions, 'className'> = {}): string =>
  cn(inputOTPInputBaseClassName, className)

export const inputOTPGroupClassName = ({
  className,
}: Pick<InputOTPStyleOptions, 'className'> = {}): string =>
  cn(inputOTPGroupBaseClassName, className)

export const inputOTPSlotClassName = ({
  className,
}: Pick<InputOTPStyleOptions, 'className'> = {}): string =>
  cn(inputOTPSlotBaseClassName, className)

export const inputOTPSeparatorClassName = ({
  className,
}: Pick<InputOTPStyleOptions, 'className'> = {}): string =>
  cn(inputOTPSeparatorBaseClassName, className)

const shadcnRootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
  containerClassName: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'input-otp'),
  h.Class(cn(inputOTPContainerClassName({ containerClassName }), className)),
]

const shadcnInputAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'input-otp-input'),
  h.Class(inputOTPInputClassName({ className })),
]

const shadcnGroupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'input-otp-group'),
  h.Class(inputOTPGroupClassName({ className })),
]

const shadcnSlotAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: BaseOTPField.OTPFieldSlotState,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'input-otp-slot'),
  h.DataAttribute('active', slot.isActive ? 'true' : 'false'),
  h.Class(inputOTPSlotClassName({ className })),
]

const shadcnSeparatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'input-otp-separator'),
  h.Role('separator'),
  h.Class(inputOTPSeparatorClassName({ className })),
]

export const InputOTPGroup = <Message>(config: GroupConfig<Message>): Html => {
  const h = html<Message>()

  return h.div(
    [
      ...config.attributes.group,
      h.Class(inputOTPGroupClassName({ className: config.className })),
    ],
    config.indexes.flatMap(index => {
      const slot = config.attributes.slots[index]

      return slot === undefined
        ? []
        : [
            h.input([
              ...slot.input,
              h.Class(inputOTPSlotClassName({ className: config.className })),
            ]),
          ]
    }),
  )
}

export const InputOTPSeparator = <Message>(
  config: SeparatorConfig = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [...shadcnSeparatorAttributes(h, config.className)],
    [
      h.svg(
        [
          h.Attribute('data-icon', 'minus'),
          h.Attribute('viewBox', '0 0 24 24'),
          h.Attribute('fill', 'none'),
          h.Attribute('stroke', 'currentColor'),
          h.Attribute('stroke-width', '2'),
          h.Attribute('stroke-linecap', 'round'),
          h.Attribute('stroke-linejoin', 'round'),
          h.AriaHidden(true),
        ],
        [
          h.line(
            [
              h.Attribute('x1', '5'),
              h.Attribute('x2', '19'),
              h.Attribute('y1', '12'),
              h.Attribute('y2', '12'),
            ],
            [],
          ),
        ],
      ),
    ],
  )
}

const defaultToView = <Message>(
  attributes: InputOTPAttributes<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [...attributes.root],
    [
      h.div(
        [...attributes.group],
        attributes.slots.map(slot => h.input([...slot.input])),
      ),
      h.input([...attributes.hiddenInput]),
    ],
  )
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView = defaultToView, ...baseConfig } = config

  return BaseOTPField.view<Message>({
    ...baseConfig,
    toView: attributes =>
      toView({
        ...attributes,
        root: [
          ...attributes.root,
          ...shadcnRootAttributes(
            h,
            config.className,
            config.containerClassName,
          ),
        ],
        group: shadcnGroupAttributes(h, config.groupClassName),
        slots: attributes.slots.map(slot => ({
          ...slot,
          input: [
            ...slot.input,
            ...shadcnInputAttributes(h, config.className),
            ...shadcnSlotAttributes(h, slot.state, config.slotClassName),
          ],
          slot: shadcnSlotAttributes(h, slot.state, config.slotClassName),
          caret: [h.Class(caretWrapperClassName)],
          caretLine: [h.Class(caretLineClassName)],
        })),
        hiddenInput: attributes.hiddenInput,
        separator: shadcnSeparatorAttributes(h, config.separatorClassName),
        separatorIcon: [h.Attribute('data-icon', 'minus'), h.AriaHidden(true)],
      }),
  })
}
