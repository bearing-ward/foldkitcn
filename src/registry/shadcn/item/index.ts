import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as Separator from '../separator'

// MODEL

export const ItemVariant = S.Union([
  S.Literal('default'),
  S.Literal('outline'),
  S.Literal('muted'),
])
export type ItemVariant = typeof ItemVariant.Type

export const ItemSize = S.Union([
  S.Literal('default'),
  S.Literal('sm'),
  S.Literal('xs'),
])
export type ItemSize = typeof ItemSize.Type

export const ItemMediaVariant = S.Union([
  S.Literal('default'),
  S.Literal('icon'),
  S.Literal('image'),
])
export type ItemMediaVariant = typeof ItemMediaVariant.Type

export const itemVariantValues: ReadonlyArray<ItemVariant> = [
  'default',
  'outline',
  'muted',
]

export const itemSizeValues: ReadonlyArray<ItemSize> = ['default', 'sm', 'xs']

export const itemMediaVariantValues: ReadonlyArray<ItemMediaVariant> = [
  'default',
  'icon',
  'image',
]

export const ItemStyleOptions = S.Struct({
  variant: S.optional(ItemVariant),
  size: S.optional(ItemSize),
  className: S.optional(S.String),
  dir: S.optional(S.String),
})
export type ItemStyleOptions = typeof ItemStyleOptions.Type

export const ItemMediaStyleOptions = S.Struct({
  variant: S.optional(ItemMediaVariant),
  className: S.optional(S.String),
})
export type ItemMediaStyleOptions = typeof ItemMediaStyleOptions.Type

export const ItemPartStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type ItemPartStyleOptions = typeof ItemPartStyleOptions.Type

type Child = Html | string

// VIEW

export type ItemAttributes<Message> = Readonly<{
  item: ReadonlyArray<Attribute<Message>>
}>

export type ItemGroupAttributes<Message> = Readonly<{
  group: ReadonlyArray<Attribute<Message>>
}>

export type ItemSeparatorAttributes<Message> = Readonly<{
  separator: ReadonlyArray<Attribute<Message>>
}>

export type ItemPartAttributes<Message> = Readonly<{
  part: ReadonlyArray<Attribute<Message>>
}>

export type ItemConfig<Message> = ItemStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
    toView?: (
      attributes: ItemAttributes<Message>,
      children: ReadonlyArray<Child>,
    ) => Html
  }>

export type ItemPartConfig<Message> = ItemPartStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export type ItemMediaConfig<Message> = ItemMediaStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export const itemGroupBaseClassName =
  'group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2'

export const itemSeparatorBaseClassName = 'my-2'

export const itemBaseClassName =
  'group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted'

export const itemVariantClassNames: Readonly<Record<ItemVariant, string>> = {
  default: 'border-transparent',
  outline: 'border-border',
  muted: 'border-transparent bg-muted/50',
}

export const itemSizeClassNames: Readonly<Record<ItemSize, string>> = {
  default: 'gap-2.5 px-3 py-2.5',
  sm: 'gap-2.5 px-3 py-2.5',
  xs: 'gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0',
}

export const itemMediaBaseClassName =
  'flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none'

export const itemMediaVariantClassNames: Readonly<
  Record<ItemMediaVariant, string>
> = {
  default: 'bg-transparent',
  icon: "[&_svg:not([class*='size-'])]:size-4",
  image:
    'size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover',
}

export const itemContentBaseClassName =
  'flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none'

export const itemTitleBaseClassName =
  'line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4'

export const itemDescriptionBaseClassName =
  'line-clamp-2 text-left text-sm leading-normal font-normal text-muted-foreground group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'

export const itemActionsBaseClassName = 'flex items-center gap-2'

export const itemHeaderBaseClassName =
  'flex basis-full items-center justify-between gap-2'

export const itemFooterBaseClassName =
  'flex basis-full items-center justify-between gap-2'

export const itemGroupClassName = ({
  className,
}: ItemPartStyleOptions = {}): string => cn(itemGroupBaseClassName, className)

export const itemSeparatorClassName = ({
  className,
}: ItemPartStyleOptions = {}): string =>
  Separator.separatorClassName({
    className: cn(itemSeparatorBaseClassName, className),
  })

export const itemClassName = ({
  variant = 'default',
  size = 'default',
  className,
}: ItemStyleOptions = {}): string =>
  cn(
    itemBaseClassName,
    itemVariantClassNames[variant],
    itemSizeClassNames[size],
    className,
  )

export const itemMediaClassName = ({
  variant = 'default',
  className,
}: ItemMediaStyleOptions = {}): string =>
  cn(itemMediaBaseClassName, itemMediaVariantClassNames[variant], className)

export const itemContentClassName = ({
  className,
}: ItemPartStyleOptions = {}): string => cn(itemContentBaseClassName, className)

export const itemTitleClassName = ({
  className,
}: ItemPartStyleOptions = {}): string => cn(itemTitleBaseClassName, className)

export const itemDescriptionClassName = ({
  className,
}: ItemPartStyleOptions = {}): string =>
  cn(itemDescriptionBaseClassName, className)

export const itemActionsClassName = ({
  className,
}: ItemPartStyleOptions = {}): string => cn(itemActionsBaseClassName, className)

export const itemHeaderClassName = ({
  className,
}: ItemPartStyleOptions = {}): string => cn(itemHeaderBaseClassName, className)

export const itemFooterClassName = ({
  className,
}: ItemPartStyleOptions = {}): string => cn(itemFooterBaseClassName, className)

const optionalDir = <Message>(
  h: ReturnType<typeof html<Message>>,
  dir: string | undefined,
): ReadonlyArray<Attribute<Message>> => (dir === undefined ? [] : [h.Dir(dir)])

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ItemConfig<Message>,
): ReadonlyArray<Attribute<Message>> => {
  const variant = config.variant ?? 'default'
  const size = config.size ?? 'default'

  return [
    h.DataAttribute('slot', 'item'),
    h.DataAttribute('variant', variant),
    h.DataAttribute('size', size),
    h.Class(itemClassName(config)),
    ...optionalDir(h, config.dir),
    ...(config.attributes ?? []),
  ]
}

const partAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
  config: ItemPartConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  h.Class(className),
  ...(config.attributes ?? []),
]

const withoutSeparatorSlotAndClass = <Message>(
  attributes: ReadonlyArray<Attribute<Message>>,
): ReadonlyArray<Attribute<Message>> =>
  attributes.filter(attribute => {
    if (attribute._tag === 'Class') {
      return false
    }

    return attribute._tag !== 'DataAttribute' || attribute.key !== 'slot'
  })

export const ItemGroup = <Message>(
  config: ItemPartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      h.Role('list'),
      h.DataAttribute('slot', 'item-group'),
      h.Class(itemGroupClassName(config)),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const ItemSeparator = <Message>(
  config: ItemPartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return Separator.view<Message>({
    orientation: 'horizontal',
    className: cn(itemSeparatorBaseClassName, config.className),
    toView: attributes =>
      h.div(
        [
          ...withoutSeparatorSlotAndClass(attributes.separator),
          h.DataAttribute('slot', 'item-separator'),
          h.Class(itemSeparatorClassName(config)),
          ...(config.attributes ?? []),
        ],
        [],
      ),
  })
}

export const Item = <Message>(config: ItemConfig<Message> = {}): Html => {
  const h = html<Message>()
  const children = config.children ?? []
  const attributes = { item: itemAttributes(h, config) }

  if (config.toView !== undefined) {
    return config.toView(attributes, children)
  }

  return h.div([...attributes.item], children)
}

export const ItemMedia = <Message>(
  config: ItemMediaConfig<Message> = {},
): Html => {
  const h = html<Message>()
  const variant = config.variant ?? 'default'

  return h.div(
    [
      h.DataAttribute('slot', 'item-media'),
      h.DataAttribute('variant', variant),
      h.Class(itemMediaClassName(config)),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const ItemContent = <Message>(
  config: ItemPartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      ...partAttributes(
        h,
        'item-content',
        itemContentClassName(config),
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const ItemTitle = <Message>(
  config: ItemPartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [...partAttributes(h, 'item-title', itemTitleClassName(config), config)],
    config.children ?? [],
  )
}

export const ItemDescription = <Message>(
  config: ItemPartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.p(
    [
      ...partAttributes(
        h,
        'item-description',
        itemDescriptionClassName(config),
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const ItemActions = <Message>(
  config: ItemPartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      ...partAttributes(
        h,
        'item-actions',
        itemActionsClassName(config),
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const ItemHeader = <Message>(
  config: ItemPartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [...partAttributes(h, 'item-header', itemHeaderClassName(config), config)],
    config.children ?? [],
  )
}

export const ItemFooter = <Message>(
  config: ItemPartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [...partAttributes(h, 'item-footer', itemFooterClassName(config), config)],
    config.children ?? [],
  )
}
