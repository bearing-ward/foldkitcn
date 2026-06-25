import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseSwitch from '../../base-ui/switch'

// MODEL

export type SwitchChangeReason = BaseSwitch.SwitchChangeReason
export type SwitchCheckedChange = BaseSwitch.SwitchCheckedChange
export type SwitchCheckedState = BaseSwitch.SwitchCheckedState

export const SwitchSize = S.Union([S.Literal('sm'), S.Literal('default')])
export type SwitchSize = typeof SwitchSize.Type

export const SwitchStyleOptions = S.Struct({
  className: S.optional(S.String),
  thumbClassName: S.optional(S.String),
  size: S.optional(SwitchSize),
})
export type SwitchStyleOptions = typeof SwitchStyleOptions.Type

// UPDATE

export const { checkedChange, checkedState } = BaseSwitch

// VIEW

export type SwitchAttributes<Message> = BaseSwitch.SwitchAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseSwitch.ViewConfig<Message>,
  'toView'
> &
  SwitchStyleOptions &
  Readonly<{
    dir?: string
    toView?: (attributes: SwitchAttributes<Message>) => Html
  }>

export const switchBaseClassName =
  'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50'

export const switchThumbBaseClassName =
  'pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground'

export const switchRtlThumbBaseClassName =
  'pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] rtl:group-data-[size=default]/switch:data-checked:-translate-x-[calc(100%-2px)] rtl:group-data-[size=sm]/switch:data-checked:-translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 rtl:group-data-[size=default]/switch:data-unchecked:-translate-x-0 rtl:group-data-[size=sm]/switch:data-unchecked:-translate-x-0 dark:data-unchecked:bg-foreground'

export const switchClassName = ({
  className,
}: Pick<SwitchStyleOptions, 'className'> = {}): string =>
  cn(switchBaseClassName, className)

export const switchThumbClassName = (
  options?: Readonly<{
    className?: string | undefined
    dir?: string | undefined
  }>,
): string =>
  cn(
    options?.dir === 'rtl'
      ? switchRtlThumbBaseClassName
      : switchThumbBaseClassName,
    options?.className,
  )

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'className' | 'dir' | 'size'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'switch'),
  h.DataAttribute('size', config.size ?? 'default'),
  h.Class(switchClassName({ className: config.className })),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

const thumbAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'dir' | 'thumbClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'switch-thumb'),
  h.Class(
    switchThumbClassName({
      className: config.thumbClassName,
      dir: config.dir,
    }),
  ),
]

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: SwitchAttributes<Message>,
): SwitchAttributes<Message> => ({
  root: [...attributes.root, ...rootAttributes(h, config)],
  thumb: [...attributes.thumb, ...thumbAttributes(h, config)],
  input: attributes.input,
  uncheckedInput: attributes.uncheckedInput,
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseSwitch.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const switchAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(switchAttributes)
      }

      return h.span(
        [...switchAttributes.root],
        [h.span([...switchAttributes.thumb], [])],
      )
    },
  })
}
