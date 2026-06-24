import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const ButtonType = S.Union([
  S.Literal('button'),
  S.Literal('submit'),
  S.Literal('reset'),
])
export type ButtonType = typeof ButtonType.Type

export const ButtonOptions = S.Struct({
  isDisabled: S.optional(S.Boolean),
  isFocusableWhenDisabled: S.optional(S.Boolean),
  isNativeButton: S.optional(S.Boolean),
  type: S.optional(ButtonType),
  isAutofocus: S.optional(S.Boolean),
})
export type ButtonOptions = typeof ButtonOptions.Type

// VIEW

export type ButtonAttributes<Message> = Readonly<{
  button: ReadonlyArray<Attribute<Message>>
}>

export type ViewConfig<Message> = ButtonOptions &
  Readonly<{
    toView: (attributes: ButtonAttributes<Message>) => Html
    onClick?: Message
    onMouseDown?: Message
    onPointerDown?: Message
    onPointerUp?: Message
  }>

const activationKeys = new Set(['Enter', ' '])

const toSome = <Message>(message: Message): Option.Option<Message> =>
  Option.some(message)

const nativeDisabledAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  isFocusableWhenDisabled: boolean,
): ReadonlyArray<Attribute<Message>> =>
  isFocusableWhenDisabled
    ? [h.AriaDisabled(true), h.Tabindex(0), h.DataAttribute('disabled', '')]
    : [h.Disabled(true), h.Tabindex(0), h.DataAttribute('disabled', '')]

const nonNativeDisabledAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  isFocusableWhenDisabled: boolean,
): ReadonlyArray<Attribute<Message>> => [
  h.AriaDisabled(true),
  h.Tabindex(isFocusableWhenDisabled ? 0 : -1),
  h.DataAttribute('disabled', ''),
]

const disabledAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  isDisabled: boolean,
  isFocusableWhenDisabled: boolean,
  isNativeButton: boolean,
): ReadonlyArray<Attribute<Message>> => {
  if (!isDisabled) {
    return []
  }

  return isNativeButton
    ? nativeDisabledAttributes(h, isFocusableWhenDisabled)
    : nonNativeDisabledAttributes(h, isFocusableWhenDisabled)
}

const buttonKindAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  isNativeButton: boolean,
  type: ButtonType,
): ReadonlyArray<Attribute<Message>> =>
  isNativeButton
    ? [h.Type(type), h.Tabindex(0)]
    : [h.Role('button'), h.Tabindex(0)]

const clickAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  onClick: Message | undefined,
  isDisabled: boolean,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(onClick) && !isDisabled ? [h.OnClick(onClick)] : []

const mouseAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  onMouseDown: Message | undefined,
  isDisabled: boolean,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(onMouseDown) && !isDisabled
    ? [h.OnMouseDown(onMouseDown)]
    : []

const pointerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  onPointerDown: Message | undefined,
  onPointerUp: Message | undefined,
  isDisabled: boolean,
): ReadonlyArray<Attribute<Message>> => {
  if (isDisabled) {
    return []
  }

  const pointerDownAttributes = Predicate.isNotUndefined(onPointerDown)
    ? [h.OnPointerDown(() => toSome(onPointerDown))]
    : []
  const pointerUpAttributes = Predicate.isNotUndefined(onPointerUp)
    ? [h.OnPointerUp(() => toSome(onPointerUp))]
    : []

  return [...pointerDownAttributes, ...pointerUpAttributes]
}

const keyboardAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  onClick: Message | undefined,
  isDisabled: boolean,
  isNativeButton: boolean,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(onClick) && !isDisabled && !isNativeButton
    ? [
        h.OnKeyDownPreventDefault(key =>
          activationKeys.has(key) ? toSome(onClick) : Option.none(),
        ),
      ]
    : []

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  const {
    toView,
    onClick,
    onMouseDown,
    onPointerDown,
    onPointerUp,
    isDisabled = false,
    isFocusableWhenDisabled = false,
    isNativeButton = true,
    type = 'button',
    isAutofocus = false,
  } = config
  const autofocusAttributes = isAutofocus ? [h.Autofocus(true)] : []

  return toView({
    button: [
      ...buttonKindAttributes(h, isNativeButton, type),
      ...disabledAttributes(
        h,
        isDisabled,
        isFocusableWhenDisabled,
        isNativeButton,
      ),
      ...clickAttributes(h, onClick, isDisabled),
      ...mouseAttributes(h, onMouseDown, isDisabled),
      ...pointerAttributes(h, onPointerDown, onPointerUp, isDisabled),
      ...keyboardAttributes(h, onClick, isDisabled, isNativeButton),
      ...autofocusAttributes,
    ],
  })
}
