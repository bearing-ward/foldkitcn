import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Button } from './index'

const buttonClass =
  'inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[disabled]:opacity-50'

const secondaryButtonClass =
  'inline-flex h-9 items-center justify-center rounded-md border border-input bg-secondary px-4 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[disabled]:opacity-50'

const groupClass = 'flex flex-wrap items-center gap-3'

export const ButtonDemo = (): Html => {
  const h = html<never>()

  return Button<never>({
    toView: attributes =>
      h.button([...attributes.button, h.Class(buttonClass)], ['Button']),
  })
}

export const ButtonDisabled = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class(groupClass)],
    [
      Button<never>({
        isDisabled: true,
        toView: attributes =>
          h.button([...attributes.button, h.Class(buttonClass)], ['Disabled']),
      }),
      Button<never>({
        isDisabled: true,
        isFocusableWhenDisabled: true,
        toView: attributes =>
          h.button(
            [...attributes.button, h.Class(secondaryButtonClass)],
            ['Focusable disabled'],
          ),
      }),
    ],
  )
}

export const ButtonNonNative = (): Html => {
  const h = html<never>()

  return Button<never>({
    isNativeButton: false,
    toView: attributes =>
      h.div([...attributes.button, h.Class(buttonClass)], ['Div button']),
  })
}

export const ButtonTypes = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class(groupClass)],
    [
      Button<never>({
        type: 'button',
        toView: attributes =>
          h.button([...attributes.button, h.Class(buttonClass)], ['Button']),
      }),
      Button<never>({
        type: 'submit',
        toView: attributes =>
          h.button([...attributes.button, h.Class(buttonClass)], ['Submit']),
      }),
      Button<never>({
        type: 'reset',
        toView: attributes =>
          h.button([...attributes.button, h.Class(buttonClass)], ['Reset']),
      }),
    ],
  )
}

export const ButtonLoading = (): Html => {
  const h = html<never>()

  return Button<never>({
    isDisabled: true,
    toView: attributes =>
      h.button(
        [...attributes.button, h.Class(buttonClass), h.AriaBusy(true)],
        ['Saving...'],
      ),
  })
}
