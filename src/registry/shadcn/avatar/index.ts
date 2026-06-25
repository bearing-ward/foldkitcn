import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseAvatar from '../../base-ui/avatar'

// MODEL

export type ImageLoadingStatus = BaseAvatar.ImageLoadingStatus
export type AvatarState = BaseAvatar.AvatarState
export type AvatarTransitionStatus = BaseAvatar.AvatarTransitionStatus
export type AvatarFallbackDelayStatus = BaseAvatar.AvatarFallbackDelayStatus
export type AvatarImageOptions = BaseAvatar.AvatarImageOptions
export type AvatarFallbackOptions = BaseAvatar.AvatarFallbackOptions

export const AvatarSize = S.Union([
  S.Literal('default'),
  S.Literal('sm'),
  S.Literal('lg'),
])
export type AvatarSize = typeof AvatarSize.Type

export const avatarSizeValues: ReadonlyArray<AvatarSize> = [
  'default',
  'sm',
  'lg',
]

export const AvatarStyleOptions = S.Struct({
  size: S.optional(AvatarSize),
  className: S.optional(S.String),
})
export type AvatarStyleOptions = typeof AvatarStyleOptions.Type

export const AvatarImageStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type AvatarImageStyleOptions = typeof AvatarImageStyleOptions.Type

export const AvatarFallbackStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type AvatarFallbackStyleOptions = typeof AvatarFallbackStyleOptions.Type

export const AvatarBadgePlacement = S.Union([
  S.Literal('right'),
  S.Literal('inline-end'),
])
export type AvatarBadgePlacement = typeof AvatarBadgePlacement.Type

export const AvatarBadgeStyleOptions = S.Struct({
  placement: S.optional(AvatarBadgePlacement),
  className: S.optional(S.String),
})
export type AvatarBadgeStyleOptions = typeof AvatarBadgeStyleOptions.Type

export const AvatarGroupStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type AvatarGroupStyleOptions = typeof AvatarGroupStyleOptions.Type

export const AvatarGroupCountStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type AvatarGroupCountStyleOptions =
  typeof AvatarGroupCountStyleOptions.Type

// UPDATE

export const { avatarState } = BaseAvatar

// VIEW

export type AvatarAttributes<Message> = BaseAvatar.AvatarAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseAvatar.ViewConfig<Message>,
  'toView' | 'image' | 'fallback'
> &
  AvatarStyleOptions &
  Readonly<{
    image?: BaseAvatar.AvatarImageOptions & AvatarImageStyleOptions
    fallback?: BaseAvatar.AvatarFallbackOptions & AvatarFallbackStyleOptions
    toView: (attributes: AvatarAttributes<Message>, state: AvatarState) => Html
  }>

export const avatarBaseClassName =
  'group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten'
export const avatarImageBaseClassName =
  'aspect-square size-full rounded-full object-cover'
export const avatarFallbackBaseClassName =
  'flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs'
export const avatarBadgeBaseClassName =
  'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2'
export const avatarBadgeInlineEndBaseClassName =
  'absolute end-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2'
export const avatarGroupBaseClassName =
  'group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background'
export const avatarGroupCountBaseClassName =
  'relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3'

export const avatarClassName = ({
  className,
}: AvatarStyleOptions = {}): string => cn(avatarBaseClassName, className)

export const avatarImageClassName = ({
  className,
}: AvatarImageStyleOptions = {}): string =>
  cn(avatarImageBaseClassName, className)

export const avatarFallbackClassName = ({
  className,
}: AvatarFallbackStyleOptions = {}): string =>
  cn(avatarFallbackBaseClassName, className)

export const avatarBadgeClassName = ({
  placement = 'right',
  className,
}: AvatarBadgeStyleOptions = {}): string =>
  cn(
    placement === 'inline-end'
      ? avatarBadgeInlineEndBaseClassName
      : avatarBadgeBaseClassName,
    className,
  )

export const avatarGroupClassName = ({
  className,
}: AvatarGroupStyleOptions = {}): string =>
  cn(avatarGroupBaseClassName, className)

export const avatarGroupCountClassName = ({
  className,
}: AvatarGroupCountStyleOptions = {}): string =>
  cn(avatarGroupCountBaseClassName, className)

const statusAttributeKeys = new Set(['loading', 'loaded', 'error'])

const withoutStatusAttributes = <Message>(
  attributes: ReadonlyArray<Attribute<Message>>,
): ReadonlyArray<Attribute<Message>> =>
  attributes.filter(
    attribute =>
      attribute._tag !== 'DataAttribute' ||
      !statusAttributeKeys.has(attribute.key),
  )

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  size: AvatarSize,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'avatar'),
  h.DataAttribute('size', size),
  h.Class(avatarClassName({ className })),
]

const imageAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'avatar-image'),
  h.Class(avatarImageClassName({ className })),
]

const fallbackAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string | undefined,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'avatar-fallback'),
  h.Class(avatarFallbackClassName({ className })),
]

export const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<
    ViewConfig<Message>,
    'size' | 'className' | 'image' | 'fallback'
  >,
  attributes: AvatarAttributes<Message>,
): AvatarAttributes<Message> => ({
  root: [
    ...withoutStatusAttributes(attributes.root),
    ...rootAttributes(h, config.size ?? 'default', config.className),
  ],
  image: [
    ...withoutStatusAttributes(attributes.image),
    ...imageAttributes(h, config.image?.className),
  ],
  fallback: [
    ...withoutStatusAttributes(attributes.fallback),
    ...fallbackAttributes(h, config.fallback?.className),
  ],
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseAvatar.view<Message>({
    ...baseConfig,
    toView: (attributes, state) =>
      toView(shadcnAttributes(h, config, attributes), state),
  })
}

export type AvatarBadgeAttributes<Message> = Readonly<{
  badge: ReadonlyArray<Attribute<Message>>
}>

export type AvatarGroupAttributes<Message> = Readonly<{
  group: ReadonlyArray<Attribute<Message>>
}>

export type AvatarGroupCountAttributes<Message> = Readonly<{
  count: ReadonlyArray<Attribute<Message>>
}>

export const badgeView = <Message>(
  config: AvatarBadgeStyleOptions &
    Readonly<{
      toView: (attributes: AvatarBadgeAttributes<Message>) => Html
    }>,
): Html => {
  const h = html<Message>()

  return config.toView({
    badge: [
      h.DataAttribute('slot', 'avatar-badge'),
      h.Class(
        avatarBadgeClassName({
          placement: config.placement,
          className: config.className,
        }),
      ),
    ],
  })
}

export const groupView = <Message>(
  config: AvatarGroupStyleOptions &
    Readonly<{
      toView: (attributes: AvatarGroupAttributes<Message>) => Html
    }>,
): Html => {
  const h = html<Message>()

  return config.toView({
    group: [
      h.DataAttribute('slot', 'avatar-group'),
      h.Class(avatarGroupClassName({ className: config.className })),
    ],
  })
}

export const groupCountView = <Message>(
  config: AvatarGroupCountStyleOptions &
    Readonly<{
      toView: (attributes: AvatarGroupCountAttributes<Message>) => Html
    }>,
): Html => {
  const h = html<Message>()

  return config.toView({
    count: [
      h.DataAttribute('slot', 'avatar-group-count'),
      h.Class(avatarGroupCountClassName({ className: config.className })),
    ],
  })
}
