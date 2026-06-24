import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseSeparator from '../../base-ui/separator'

// MODEL

export type SeparatorOrientation = BaseSeparator.SeparatorOrientation

export const SeparatorStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type SeparatorStyleOptions = typeof SeparatorStyleOptions.Type

// VIEW

export type SeparatorAttributes<Message> =
  BaseSeparator.SeparatorAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseSeparator.ViewConfig<Message>,
  'toView'
> &
  SeparatorStyleOptions &
  Readonly<{
    toView: (attributes: SeparatorAttributes<Message>) => Html
  }>

export const baseClassName =
  'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch'

export const separatorClassName = ({
  className,
}: SeparatorStyleOptions = {}): string => cn(baseClassName, className)

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'separator'),
  h.Class(separatorClassName({ className })),
]

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, className, ...baseConfig } = config

  return BaseSeparator.view<Message>({
    ...baseConfig,
    toView: attributes =>
      toView({
        separator: [...attributes.separator, ...shadcnAttributes(h, className)],
      }),
  })
}
