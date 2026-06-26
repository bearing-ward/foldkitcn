import { Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Button from '../button'

// MODEL

export const ToggleChangeReason = S.Literal('none')
export type ToggleChangeReason = typeof ToggleChangeReason.Type

export const TogglePressedChange = S.Struct({
  isPressed: S.Boolean,
  reason: ToggleChangeReason,
})
export type TogglePressedChange = typeof TogglePressedChange.Type

export const ToggleOptions = S.Struct({
  isPressed: S.Boolean,
  isDisabled: S.optional(S.Boolean),
  isNativeButton: S.optional(S.Boolean),
})
export type ToggleOptions = typeof ToggleOptions.Type

// UPDATE

export const pressedChange = (isPressed: boolean): TogglePressedChange => ({
  isPressed,
  reason: 'none',
})

// VIEW

export type ToggleAttributes<Message> = Button.ButtonAttributes<Message>

export type ViewConfig<Message> = ToggleOptions &
  Omit<Button.ViewConfig<Message>, 'onClick' | 'toView' | 'type'> &
  Readonly<{
    toView: (attributes: ToggleAttributes<Message>) => Html
    onPressedChange?: (change: TogglePressedChange) => Message
  }>

const pressedAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  isPressed: boolean,
): ReadonlyArray<Attribute<Message>> => [
  h.AriaPressed(String(isPressed)),
  ...(isPressed ? [h.DataAttribute('pressed', '')] : []),
]

const nextPressedMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'isPressed' | 'onPressedChange'>,
): Message | undefined =>
  Predicate.isNotUndefined(config.onPressedChange)
    ? config.onPressedChange(pressedChange(!config.isPressed))
    : undefined

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const {
    toView,
    isPressed,
    onPressedChange: _onPressedChange,
    ...buttonConfig
  } = config
  const onClick = nextPressedMessage(config)

  return Button.view<Message>({
    ...buttonConfig,
    type: 'button',
    ...(onClick === undefined ? {} : { onClick }),
    toView: attributes =>
      toView({
        button: [...attributes.button, ...pressedAttributes(h, isPressed)],
      }),
  })
}
