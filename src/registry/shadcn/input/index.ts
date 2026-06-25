import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseInput from '../../base-ui/input'

// MODEL

export const InputStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type InputStyleOptions = typeof InputStyleOptions.Type

// VIEW

export type InputAttributes<Message> = BaseInput.InputAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseInput.ViewConfig<Message>,
  'toView'
> &
  InputStyleOptions &
  Readonly<{
    toView: (attributes: InputAttributes<Message>) => Html
  }>

export const inputBaseClassName =
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40'

export const inputClassName = ({ className }: InputStyleOptions = {}): string =>
  cn(inputBaseClassName, className)

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'input'),
  h.Class(inputClassName({ className })),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, className, ...baseConfig } = config

  return BaseInput.view<Message>({
    ...baseConfig,
    toView: attributes =>
      toView({
        input: [...attributes.input, ...shadcnAttributes(h, className)],
      }),
  })
}
