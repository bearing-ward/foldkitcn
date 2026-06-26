import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseRadioGroup from '../../base-ui/radio-group'

// MODEL

export type RadioGroupChangeReason = BaseRadioGroup.RadioGroupChangeReason
export type RadioGroupItemDescriptor = BaseRadioGroup.RadioGroupItemDescriptor
export type RadioGroupOrientation = BaseRadioGroup.RadioGroupOrientation
export type RadioGroupValueChange = BaseRadioGroup.RadioGroupValueChange

export const RadioGroupStyleOptions = S.Struct({
  className: S.optional(S.String),
  itemClassName: S.optional(S.String),
  indicatorClassName: S.optional(S.String),
})
export type RadioGroupStyleOptions = typeof RadioGroupStyleOptions.Type

// UPDATE

export const { checkedState, isChecked, itemFocusSelector, valueChange } =
  BaseRadioGroup

// VIEW

export type RadioGroupAttributes<Message> =
  BaseRadioGroup.RadioGroupAttributes<Message>
export type RadioGroupItemAttributes<Message> =
  BaseRadioGroup.RadioGroupItemAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseRadioGroup.ViewConfig<Message>,
  'toView'
> &
  RadioGroupStyleOptions &
  Readonly<{
    dir?: string
    toView?: (attributes: RadioGroupAttributes<Message>) => Html
  }>

export const radioGroupBaseClassName = 'grid w-full gap-2'

export const radioGroupItemBaseClassName =
  'group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary'

export const radioGroupIndicatorBaseClassName =
  'flex size-4 items-center justify-center'

const radioGroupDotClassName =
  'absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground'

export const radioGroupClassName = ({
  className,
}: Pick<RadioGroupStyleOptions, 'className'> = {}): string =>
  cn(radioGroupBaseClassName, className)

export const radioGroupItemClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(radioGroupItemBaseClassName, className)

export const radioGroupIndicatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(radioGroupIndicatorBaseClassName, className)

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'className' | 'dir'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'radio-group'),
  h.Class(radioGroupClassName({ className: config.className })),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'itemClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'radio-group-item'),
  h.Class(radioGroupItemClassName({ className: config.itemClassName })),
]

const indicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'indicatorClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'radio-group-indicator'),
  h.Class(
    radioGroupIndicatorClassName({
      className: config.indicatorClassName,
    }),
  ),
]

const shadcnItemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  item: RadioGroupItemAttributes<Message>,
): RadioGroupItemAttributes<Message> => ({
  item: item.item,
  root: [...item.root, ...itemAttributes(h, config)],
  indicator:
    item.indicator.length > 0
      ? [...item.indicator, ...indicatorAttributes(h, config)]
      : item.indicator,
  input: item.input,
})

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: RadioGroupAttributes<Message>,
): RadioGroupAttributes<Message> => ({
  root: [...attributes.root, ...rootAttributes(h, config)],
  items: attributes.items.map(item => shadcnItemAttributes(h, config, item)),
})

const radioDot = <Message>(h: ReturnType<typeof html<Message>>): Html =>
  h.span([h.Class(radioGroupDotClassName)], [])

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseRadioGroup.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const radioGroupAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(radioGroupAttributes)
      }

      return h.div(
        [...radioGroupAttributes.root],
        radioGroupAttributes.items.flatMap(item => [
          h.span(
            [...item.root],
            item.indicator.length > 0
              ? [h.span([...item.indicator], [radioDot(h)])]
              : [],
          ),
          h.input([...item.input]),
        ]),
      )
    },
  })
}
