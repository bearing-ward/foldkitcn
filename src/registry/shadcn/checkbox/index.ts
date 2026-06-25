import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseCheckbox from '../../base-ui/checkbox'

// MODEL

export type CheckboxChangeReason = BaseCheckbox.CheckboxChangeReason
export type CheckboxCheckedChange = BaseCheckbox.CheckboxCheckedChange
export type CheckboxCheckedState = BaseCheckbox.CheckboxCheckedState

export const CheckboxStyleOptions = S.Struct({
  className: S.optional(S.String),
  indicatorClassName: S.optional(S.String),
})
export type CheckboxStyleOptions = typeof CheckboxStyleOptions.Type

// UPDATE

export const { checkedChange, isChecked, isIndeterminate, nextCheckedState } =
  BaseCheckbox

// VIEW

export type CheckboxAttributes<Message> =
  BaseCheckbox.CheckboxAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseCheckbox.ViewConfig<Message>,
  'toView'
> &
  CheckboxStyleOptions &
  Readonly<{
    dir?: string
    toView?: (attributes: CheckboxAttributes<Message>) => Html
  }>

export const checkboxBaseClassName =
  'peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary'

export const checkboxIndicatorBaseClassName =
  'grid place-content-center text-current transition-none [&>svg]:size-3.5'

export const checkboxClassName = ({
  className,
}: Pick<CheckboxStyleOptions, 'className'> = {}): string =>
  cn(checkboxBaseClassName, className)

export const checkboxIndicatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(checkboxIndicatorBaseClassName, className)

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'className' | 'dir'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'checkbox'),
  h.Class(checkboxClassName({ className: config.className })),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

const indicatorAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'indicatorClassName'>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'checkbox-indicator'),
  h.Class(
    checkboxIndicatorClassName({
      className: config.indicatorClassName,
    }),
  ),
]

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: CheckboxAttributes<Message>,
): CheckboxAttributes<Message> => ({
  root: [...attributes.root, ...rootAttributes(h, config)],
  indicator:
    attributes.indicator.length > 0
      ? [...attributes.indicator, ...indicatorAttributes(h, config)]
      : attributes.indicator,
  input: attributes.input,
  uncheckedInput: attributes.uncheckedInput,
})

const checkIcon = <Message>(h: ReturnType<typeof html<Message>>): Html =>
  h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.AriaHidden(true),
    ],
    [h.path([h.D('M20 6 9 17l-5-5')], [])],
  )

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseCheckbox.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const checkboxAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(checkboxAttributes)
      }

      return h.span(
        [...checkboxAttributes.root],
        checkboxAttributes.indicator.length > 0
          ? [h.span([...checkboxAttributes.indicator], [checkIcon(h)])]
          : [],
      )
    },
  })
}
