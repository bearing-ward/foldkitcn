import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseToggleGroup from '../../base-ui/toggle-group'
import * as Toggle from '../toggle'

// MODEL

export type ToggleGroupChangeReason = BaseToggleGroup.ToggleGroupChangeReason
export type ToggleGroupHighlightChange =
  BaseToggleGroup.ToggleGroupHighlightChange
export type ToggleGroupItemDescriptor =
  BaseToggleGroup.ToggleGroupItemDescriptor
export type ToggleGroupOrientation = BaseToggleGroup.ToggleGroupOrientation
export type ToggleGroupSelectionMode = BaseToggleGroup.ToggleGroupSelectionMode
export type ToggleGroupValueChange = BaseToggleGroup.ToggleGroupValueChange

export const ToggleGroupSpacing = S.Union([
  S.Literal(0),
  S.Literal(1),
  S.Literal(2),
  S.Literal(4),
])
export type ToggleGroupSpacing = typeof ToggleGroupSpacing.Type

export const toggleGroupSpacingValues: ReadonlyArray<ToggleGroupSpacing> = [
  0, 1, 2, 4,
]

export const ToggleGroupStyleOptions = S.Struct({
  className: S.optional(S.String),
  itemClassName: S.optional(S.String),
  variant: S.optional(Toggle.ToggleVariant),
  size: S.optional(Toggle.ToggleSize),
  spacing: S.optional(ToggleGroupSpacing),
})
export type ToggleGroupStyleOptions = typeof ToggleGroupStyleOptions.Type

// UPDATE

export const {
  highlightChange,
  isPressed,
  itemFocusSelector,
  nextValue,
  pressedState,
  valueChange,
} = BaseToggleGroup

// VIEW

export type ToggleGroupAttributes<Message> =
  BaseToggleGroup.ToggleGroupAttributes<Message>
export type ToggleGroupItemAttributes<Message> =
  BaseToggleGroup.ToggleGroupItemAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseToggleGroup.ViewConfig<Message>,
  'toView'
> &
  ToggleGroupStyleOptions &
  Readonly<{
    dir?: string
    toView?: (attributes: ToggleGroupAttributes<Message>) => Html
  }>

export const toggleGroupBaseClassName =
  'group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-vertical:flex-col data-vertical:items-stretch'

export const toggleGroupItemBaseClassName =
  'shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t'

export const toggleGroupClassName = ({
  className,
}: Pick<ToggleGroupStyleOptions, 'className'> = {}): string =>
  cn(toggleGroupBaseClassName, className)

export const toggleGroupItemClassName = ({
  className,
  dir,
  size = 'default',
  variant = 'default',
}: Pick<ToggleGroupStyleOptions, 'className' | 'size' | 'variant'> &
  Readonly<{ dir?: string | undefined }> = {}): string =>
  cn(
    toggleGroupItemBaseClassName,
    Toggle.toggleVariants({ dir, size, variant }),
    className,
  )

const optionalDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: string | number | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [h.DataAttribute(name, String(value))]

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ViewConfig<Message>,
    'className' | 'dir' | 'orientation' | 'size' | 'spacing' | 'variant'
  >,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'toggle-group'),
  ...optionalDataAttribute(h, 'variant', config.variant),
  ...optionalDataAttribute(h, 'size', config.size),
  h.DataAttribute('spacing', String(config.spacing ?? 2)),
  h.DataAttribute('orientation', config.orientation ?? 'horizontal'),
  h.Style({ '--gap': String(config.spacing ?? 2) }),
  h.Class(toggleGroupClassName({ className: config.className })),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ViewConfig<Message>,
    'dir' | 'itemClassName' | 'size' | 'spacing' | 'variant'
  >,
): ReadonlyArray<Attribute<Message>> => {
  const variant = config.variant ?? 'default'
  const size = config.size ?? 'default'

  return [
    h.DataAttribute('slot', 'toggle-group-item'),
    h.DataAttribute('variant', variant),
    h.DataAttribute('size', size),
    h.DataAttribute('spacing', String(config.spacing ?? 2)),
    h.Class(
      toggleGroupItemClassName({
        className: config.itemClassName,
        dir: config.dir,
        size,
        variant,
      }),
    ),
  ]
}

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: ToggleGroupAttributes<Message>,
): ToggleGroupAttributes<Message> => ({
  root: [...attributes.root, ...rootAttributes(h, config)],
  items: attributes.items.map(item => ({
    item: item.item,
    root: [...item.root, ...itemAttributes(h, config)],
  })),
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseToggleGroup.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const toggleGroupAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(toggleGroupAttributes)
      }

      return h.div(
        [...toggleGroupAttributes.root],
        toggleGroupAttributes.items.map(item =>
          h.button([...item.root], [item.item.label ?? item.item.value]),
        ),
      )
    },
  })
}
