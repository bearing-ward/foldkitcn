import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Button } from '../button'
import { badgeView, groupCountView, groupView, view as Avatar } from './index'
import type {
  AvatarBadgePlacement,
  AvatarSize,
  ImageLoadingStatus,
} from './index'

type AvatarProfile = Readonly<{
  src: string
  alt: string
  fallback: string
}>

const shadcnProfile: AvatarProfile = {
  src: 'https://github.com/shadcn.png',
  alt: '@shadcn',
  fallback: 'CN',
}

const maxLeiterProfile: AvatarProfile = {
  src: 'https://github.com/maxleiter.png',
  alt: '@maxleiter',
  fallback: 'LR',
}

const evilRabbitProfile: AvatarProfile = {
  src: 'https://github.com/evilrabbit.png',
  alt: '@evilrabbit',
  fallback: 'ER',
}

const pranathiProfile: AvatarProfile = {
  src: 'https://github.com/pranathip.png',
  alt: '@pranathip',
  fallback: 'PP',
}

const arabicAvatarRtl = {
  dir: 'rtl',
  values: {
    moreUsers: '+٣',
  },
}

const plusIcon = (): Html => {
  const h = html<never>()

  return h.svg(
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
      h.Class('lucide lucide-plus'),
      h.AriaHidden(true),
    ],
    [h.path([h.D('M5 12h14M12 5v14')], [])],
  )
}

const avatar = (
  profile: AvatarProfile,
  options: Readonly<{
    className?: string
    imageClassName?: string
    size?: AvatarSize
    imageLoadingStatus?: ImageLoadingStatus
    children?: ReadonlyArray<Html>
  }> = {},
): Html => {
  const h = html<never>()
  const imageLoadingStatus = options.imageLoadingStatus ?? 'loaded'

  return Avatar<never>({
    imageLoadingStatus,
    size: options.size,
    className: options.className,
    image: {
      src: profile.src,
      alt: profile.alt,
      className: options.imageClassName,
    },
    toView: (attributes, state) =>
      h.span(
        [...attributes.root],
        [
          ...(state.shouldRenderImage ? [h.img([...attributes.image])] : []),
          ...(state.shouldRenderFallback
            ? [h.span([...attributes.fallback], [profile.fallback])]
            : []),
          ...(options.children ?? []),
        ],
      ),
  })
}

const badge = (
  className?: string,
  children: ReadonlyArray<Html> = [],
  placement?: AvatarBadgePlacement,
): Html => {
  const h = html<never>()

  return badgeView<never>({
    className,
    placement,
    toView: attributes => h.span([...attributes.badge], children),
  })
}

const group = (
  className: string | undefined,
  children: ReadonlyArray<Html>,
): Html => {
  const h = html<never>()

  return groupView<never>({
    className,
    toView: attributes => h.div([...attributes.group], children),
  })
}

const groupCount = (children: ReadonlyArray<Html | string>): Html => {
  const h = html<never>()

  return groupCountView<never>({
    toView: attributes => h.div([...attributes.count], children),
  })
}

const avatarGroup = (count?: Html | string): Html =>
  group('grayscale', [
    avatar(shadcnProfile),
    avatar(maxLeiterProfile),
    avatar(evilRabbitProfile),
    ...(count === undefined ? [] : [groupCount([count])]),
  ])

export const AvatarBadgeIconExample = (): Html =>
  avatar(pranathiProfile, {
    className: 'grayscale',
    children: [badge(undefined, [plusIcon()])],
  })

export const AvatarWithBadge = (): Html =>
  avatar(shadcnProfile, {
    children: [badge('bg-green-600 dark:bg-green-800')],
  })

export const AvatarBasic = (): Html =>
  avatar(shadcnProfile, { imageClassName: 'grayscale' })

export const AvatarDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-row flex-wrap items-center gap-6 md:gap-12')],
    [
      avatar(shadcnProfile, { imageClassName: 'grayscale' }),
      avatar(evilRabbitProfile, {
        children: [badge('bg-green-600 dark:bg-green-800')],
      }),
      avatarGroup('+3'),
    ],
  )
}

export const AvatarDropdown = (): Html => {
  const h = html<never>()

  return Button<never>({
    variant: 'ghost',
    size: 'icon',
    className: 'rounded-full',
    toView: attributes =>
      h.button(
        [
          ...attributes.button,
          h.Attribute('aria-haspopup', 'menu'),
          h.AriaExpanded(false),
        ],
        [avatar({ ...shadcnProfile, alt: 'shadcn' })],
      ),
  })
}

export const AvatarGroupCountIconExample = (): Html => avatarGroup(plusIcon())

export const AvatarGroupCountExample = (): Html => avatarGroup('+3')

export const AvatarGroupExample = (): Html => avatarGroup()

export const AvatarRtl = (): Html => {
  const h = html<never>()
  const { dir, values } = arabicAvatarRtl

  return h.div(
    [
      h.Class('flex flex-row flex-wrap items-center gap-6 md:gap-12'),
      h.Dir(dir),
    ],
    [
      avatar(shadcnProfile, { imageClassName: 'grayscale' }),
      avatar(evilRabbitProfile, {
        children: [badge('bg-green-600 dark:bg-green-800', [], 'inline-end')],
      }),
      avatarGroup(values.moreUsers),
    ],
  )
}

export const AvatarSizeExample = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex flex-wrap items-center gap-2 grayscale')],
    [
      avatar(shadcnProfile, { size: 'sm' }),
      avatar(shadcnProfile),
      avatar(shadcnProfile, { size: 'lg' }),
    ],
  )
}
