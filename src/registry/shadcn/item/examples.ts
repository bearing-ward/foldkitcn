import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Avatar from '../avatar'
import { view as Button } from '../button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from './index'

type IconName =
  | 'badge-check'
  | 'chevron-down'
  | 'chevron-right'
  | 'external-link'
  | 'inbox'
  | 'plus'
  | 'shield-alert'

type Person = Readonly<{
  username: string
  avatar: string
  email: string
}>

type Music = Readonly<{
  title: string
  artist: string
  album: string
  duration: string
}>

type ModelCard = Readonly<{
  name: string
  description: string
  image: string
}>

const people: ReadonlyArray<Person> = [
  {
    username: 'shadcn',
    avatar: 'https://github.com/shadcn.png',
    email: 'shadcn@vercel.com',
  },
  {
    username: 'maxleiter',
    avatar: 'https://github.com/maxleiter.png',
    email: 'maxleiter@vercel.com',
  },
  {
    username: 'evilrabbit',
    avatar: 'https://github.com/evilrabbit.png',
    email: 'evilrabbit@vercel.com',
  },
]

const music: ReadonlyArray<Music> = [
  {
    title: 'Midnight City Lights',
    artist: 'Neon Dreams',
    album: 'Electric Nights',
    duration: '3:45',
  },
  {
    title: 'Coffee Shop Conversations',
    artist: 'The Morning Brew',
    album: 'Urban Stories',
    duration: '4:05',
  },
  {
    title: 'Digital Rain',
    artist: 'Cyber Symphony',
    album: 'Binary Beats',
    duration: '3:30',
  },
]

const models: ReadonlyArray<ModelCard> = [
  {
    name: 'v0-1.5-sm',
    description: 'Everyday tasks and UI generation.',
    image:
      'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop',
  },
  {
    name: 'v0-1.5-lg',
    description: 'Advanced thinking or reasoning.',
    image:
      'https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop',
  },
  {
    name: 'v0-2.0-mini',
    description: 'Open Source model for everyone.',
    image:
      'https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop',
  },
]

const arabicItemRtl = {
  dir: 'rtl',
  values: {
    basicItem: 'عنصر أساسي',
    basicItemDesc: 'عنصر بسيط يحتوي على عنوان ووصف.',
    action: 'إجراء',
    verifiedTitle: 'تم التحقق من ملفك الشخصي.',
  },
} as const

const iconPaths: Readonly<Record<IconName, ReadonlyArray<string>>> = {
  'badge-check': [
    'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.75',
    'm9 12 2 2 4-4',
  ],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  'external-link': [
    'M15 3h6v6',
    'M10 14 21 3',
    'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  ],
  inbox: [
    'M22 12h-6l-2 3h-4l-2-3H2',
    'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  ],
  plus: ['M5 12h14', 'M12 5v14'],
  'shield-alert': [
    'M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z',
    'M12 8v4',
    'M12 16h.01',
  ],
}

const iconClassNames: Readonly<Record<IconName, string>> = {
  'badge-check': 'lucide lucide-badge-check',
  'chevron-down': 'lucide lucide-chevron-down',
  'chevron-right': 'lucide lucide-chevron-right',
  'external-link': 'lucide lucide-external-link',
  inbox: 'lucide lucide-inbox',
  plus: 'lucide lucide-plus',
  'shield-alert': 'lucide lucide-shield-alert',
}

const icon = (name: IconName, className?: string): Html => {
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
      h.Class([iconClassNames[name], className].filter(Boolean).join(' ')),
      h.AriaHidden(true),
    ],
    iconPaths[name].map(path => h.path([h.D(path)], [])),
  )
}

const button = (
  label: string,
  config: Readonly<{
    variant?: 'outline' | 'ghost'
    size?: 'sm' | 'icon' | 'icon-sm'
    className?: string
    ariaLabel?: string
    children?: ReadonlyArray<Html | string>
  }> = {},
): Html => {
  const h = html<never>()

  return Button<never>({
    variant: config.variant,
    size: config.size,
    className: config.className,
    toView: attributes =>
      h.button(
        [
          ...attributes.button,
          ...(config.ariaLabel === undefined
            ? []
            : [h.AriaLabel(config.ariaLabel)]),
        ],
        config.children ?? [label],
      ),
  })
}

const personByUsername = (username: string): Person => {
  const person = people.find(candidate => candidate.username === username)

  if (person === undefined) {
    throw new Error(`Unknown Item example person: ${username}`)
  }

  return person
}

const avatar = (
  person: Person,
  config: Readonly<{
    className?: string
    imageClassName?: string
    imageAlt?: string
  }> = {},
): Html => {
  const h = html<never>()

  return Avatar.view<never>({
    imageLoadingStatus: 'loaded',
    className: config.className,
    image: {
      src: person.avatar,
      alt: config.imageAlt,
      className: config.imageClassName,
    },
    fallback: { className: undefined },
    toView: (attributes, state) =>
      h.span(
        [...attributes.root],
        [
          ...(state.shouldRenderImage ? [h.img([...attributes.image])] : []),
          ...(state.shouldRenderFallback
            ? [
                h.span(
                  [...attributes.fallback],
                  [person.username.charAt(0).toUpperCase()],
                ),
              ]
            : []),
        ],
      ),
  })
}

const profileAvatar = (
  username: string,
  config: Readonly<{
    className?: string
    imageClassName?: string
    imageAlt?: string
  }> = {},
): Html => {
  const person = personByUsername(username)
  const avatarConfig = {
    ...(config.className === undefined ? {} : { className: config.className }),
    ...(config.imageClassName === undefined
      ? {}
      : { imageClassName: config.imageClassName }),
    ...(config.imageAlt === undefined ? {} : { imageAlt: config.imageAlt }),
  }

  return avatar(
    {
      ...person,
      email: person.email,
    },
    avatarConfig,
  )
}

const image = (
  src: string,
  alt: string,
  config: Readonly<{
    width?: string
    height?: string
    className?: string
  }> = {},
): Html => {
  const h = html<never>()

  return h.img([
    h.Src(src),
    h.Alt(alt),
    ...(config.width === undefined ? [] : [h.Width(config.width)]),
    ...(config.height === undefined ? [] : [h.Height(config.height)]),
    ...(config.className === undefined ? [] : [h.Class(config.className)]),
  ])
}

const basicOutlineItem = (): Html =>
  Item<never>({
    variant: 'outline',
    children: [
      ItemContent<never>({
        children: [
          ItemTitle<never>({ children: ['Basic Item'] }),
          ItemDescription<never>({
            children: ['A simple item with title and description.'],
          }),
        ],
      }),
      ItemActions<never>({
        children: [button('Action', { variant: 'outline', size: 'sm' })],
      }),
    ],
  })

const verifiedItem = (
  values: Readonly<{ title: string }>,
  config: Readonly<{ dir?: 'rtl' | 'ltr' }> = {},
): Html => {
  const h = html<never>()

  return Item<never>({
    variant: 'outline',
    size: 'sm',
    dir: config.dir,
    toView: (attributes, children) =>
      h.a([...attributes.item, h.Href('#')], children),
    children: [
      ItemMedia<never>({ children: [icon('badge-check', 'size-5')] }),
      ItemContent<never>({
        children: [ItemTitle<never>({ children: [values.title] })],
      }),
      ItemActions<never>({
        children: [icon('chevron-right', 'size-4')],
      }),
    ],
  })
}

const personItem = (person: Person): Html =>
  Item<never>({
    variant: 'outline',
    children: [
      ItemMedia<never>({
        children: [avatar(person, { imageClassName: 'grayscale' })],
      }),
      ItemContent<never>({
        className: 'gap-1',
        children: [
          ItemTitle<never>({ children: [person.username] }),
          ItemDescription<never>({ children: [person.email] }),
        ],
      }),
      ItemActions<never>({
        children: [
          button('', {
            variant: 'ghost',
            size: 'icon',
            className: 'rounded-full',
            children: [icon('plus')],
          }),
        ],
      }),
    ],
  })

export const ItemDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-md flex-col gap-6')],
    [
      basicOutlineItem(),
      verifiedItem({ title: 'Your profile has been verified.' }),
    ],
  )
}

export const ItemAvatar = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-lg flex-col gap-6')],
    [
      Item<never>({
        variant: 'outline',
        children: [
          ItemMedia<never>({
            children: [
              avatar(personByUsername('evilrabbit'), {
                className: 'size-10',
              }),
            ],
          }),
          ItemContent<never>({
            children: [
              ItemTitle<never>({ children: ['Evil Rabbit'] }),
              ItemDescription<never>({
                children: ['Last seen 5 months ago'],
              }),
            ],
          }),
          ItemActions<never>({
            children: [
              button('', {
                size: 'icon-sm',
                variant: 'outline',
                className: 'rounded-full',
                ariaLabel: 'Invite',
                children: [icon('plus')],
              }),
            ],
          }),
        ],
      }),
      Item<never>({
        variant: 'outline',
        children: [
          ItemMedia<never>({
            children: [
              h.div(
                [
                  h.Class(
                    'flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale',
                  ),
                ],
                [
                  profileAvatar('shadcn', {
                    className: 'hidden sm:flex',
                    imageAlt: '@shadcn',
                  }),
                  profileAvatar('maxleiter', {
                    className: 'hidden sm:flex',
                    imageAlt: '@maxleiter',
                  }),
                  profileAvatar('evilrabbit', { imageAlt: '@evilrabbit' }),
                ],
              ),
            ],
          }),
          ItemContent<never>({
            children: [
              ItemTitle<never>({ children: ['No Team Members'] }),
              ItemDescription<never>({
                children: ['Invite your team to collaborate on this project.'],
              }),
            ],
          }),
          ItemActions<never>({
            children: [button('Invite', { size: 'sm', variant: 'outline' })],
          }),
        ],
      }),
    ],
  )
}

export const ItemDropdown = (): Html => {
  const h = html<never>()

  return Button<never>({
    variant: 'outline',
    toView: attributes =>
      h.button(
        [
          ...attributes.button,
          h.Attribute('aria-haspopup', 'menu'),
          h.AriaExpanded(false),
        ],
        ['Select ', icon('chevron-down')],
      ),
  })
}

export const ItemGroupExample = (): Html =>
  ItemGroup<never>({
    className: 'max-w-sm',
    children: people.map(personItem),
  })

export const ItemHeaderDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-xl flex-col gap-6')],
    [
      ItemGroup<never>({
        className: 'grid grid-cols-3 gap-4',
        children: models.map(model =>
          Item<never>({
            variant: 'outline',
            children: [
              ItemHeader<never>({
                children: [
                  image(model.image, model.name, {
                    width: '128',
                    height: '128',
                    className: 'aspect-square w-full rounded-sm object-cover',
                  }),
                ],
              }),
              ItemContent<never>({
                children: [
                  ItemTitle<never>({ children: [model.name] }),
                  ItemDescription<never>({
                    children: [model.description],
                  }),
                ],
              }),
            ],
          }),
        ),
      }),
    ],
  )
}

export const ItemIcon = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-lg flex-col gap-6')],
    [
      Item<never>({
        variant: 'outline',
        children: [
          ItemMedia<never>({
            variant: 'icon',
            children: [icon('shield-alert')],
          }),
          ItemContent<never>({
            children: [
              ItemTitle<never>({ children: ['Security Alert'] }),
              ItemDescription<never>({
                children: ['New login detected from unknown device.'],
              }),
            ],
          }),
          ItemActions<never>({
            children: [button('Review', { size: 'sm', variant: 'outline' })],
          }),
        ],
      }),
    ],
  )
}

export const ItemImage = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-md flex-col gap-6')],
    [
      ItemGroup<never>({
        className: 'gap-4',
        children: music.map(song =>
          Item<never>({
            variant: 'outline',
            attributes: [h.Role('listitem')],
            toView: (attributes, children) =>
              h.a([...attributes.item, h.Href('#')], children),
            children: [
              ItemMedia<never>({
                variant: 'image',
                children: [
                  image(`https://avatar.vercel.sh/${song.title}`, song.title, {
                    width: '32',
                    height: '32',
                    className: 'object-cover grayscale',
                  }),
                ],
              }),
              ItemContent<never>({
                children: [
                  ItemTitle<never>({
                    className: 'line-clamp-1',
                    children: [
                      `${song.title} - `,
                      h.span([h.Class('text-muted-foreground')], [song.album]),
                    ],
                  }),
                  ItemDescription<never>({ children: [song.artist] }),
                ],
              }),
              ItemContent<never>({
                className: 'flex-none text-center',
                children: [
                  ItemDescription<never>({ children: [song.duration] }),
                ],
              }),
            ],
          }),
        ),
      }),
    ],
  )
}

export const ItemLink = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex w-full max-w-md flex-col gap-4')],
    [
      Item<never>({
        toView: (attributes, children) =>
          h.a([...attributes.item, h.Href('#')], children),
        children: [
          ItemContent<never>({
            children: [
              ItemTitle<never>({ children: ['Visit our documentation'] }),
              ItemDescription<never>({
                children: ['Learn how to get started with our components.'],
              }),
            ],
          }),
          ItemActions<never>({
            children: [icon('chevron-right', 'size-4')],
          }),
        ],
      }),
      Item<never>({
        variant: 'outline',
        toView: (attributes, children) =>
          h.a(
            [
              ...attributes.item,
              h.Href('#'),
              h.Attribute('target', '_blank'),
              h.Rel('noopener noreferrer'),
            ],
            children,
          ),
        children: [
          ItemContent<never>({
            children: [
              ItemTitle<never>({ children: ['External resource'] }),
              ItemDescription<never>({
                children: ['Opens in a new tab with security attributes.'],
              }),
            ],
          }),
          ItemActions<never>({
            children: [icon('external-link', 'size-4')],
          }),
        ],
      }),
    ],
  )
}

export const ItemRtl = (): Html => {
  const h = html<never>()
  const { dir, values } = arabicItemRtl

  return h.div(
    [h.Class('flex w-full max-w-md flex-col gap-6'), h.Dir(dir)],
    [
      Item<never>({
        variant: 'outline',
        dir,
        children: [
          ItemContent<never>({
            children: [
              ItemTitle<never>({ children: [values.basicItem] }),
              ItemDescription<never>({ children: [values.basicItemDesc] }),
            ],
          }),
          ItemActions<never>({
            children: [
              button(values.action, { variant: 'outline', size: 'sm' }),
            ],
          }),
        ],
      }),
      verifiedItem({ title: values.verifiedTitle }, { dir }),
    ],
  )
}

export const ItemSizeDemo = (): Html => {
  const h = html<never>()
  const sizedItem = (
    title: string,
    description: string,
    size?: 'sm' | 'xs',
  ): Html =>
    Item<never>({
      variant: 'outline',
      size,
      children: [
        ItemMedia<never>({ variant: 'icon', children: [icon('inbox')] }),
        ItemContent<never>({
          children: [
            ItemTitle<never>({ children: [title] }),
            ItemDescription<never>({ children: [description] }),
          ],
        }),
      ],
    })

  return h.div(
    [h.Class('flex w-full max-w-md flex-col gap-6')],
    [
      sizedItem('Default Size', 'The standard size for most use cases.'),
      sizedItem('Small Size', 'A compact size for dense layouts.', 'sm'),
      sizedItem('Extra Small Size', 'The most compact size available.', 'xs'),
    ],
  )
}

export const ItemVariant = (): Html => {
  const h = html<never>()
  const variantItem = (
    title: string,
    description: string,
    variant?: 'outline' | 'muted',
  ): Html =>
    Item<never>({
      variant,
      children: [
        ItemMedia<never>({ variant: 'icon', children: [icon('inbox')] }),
        ItemContent<never>({
          children: [
            ItemTitle<never>({ children: [title] }),
            ItemDescription<never>({ children: [description] }),
          ],
        }),
      ],
    })

  return h.div(
    [h.Class('flex w-full max-w-md flex-col gap-6')],
    [
      variantItem('Default Variant', 'Transparent background with no border.'),
      variantItem(
        'Outline Variant',
        'Outlined style with a visible border.',
        'outline',
      ),
      variantItem(
        'Muted Variant',
        'Muted background for secondary content.',
        'muted',
      ),
    ],
  )
}

export const itemExampleViews = [
  { id: 'item-demo', title: 'ItemDemo', view: ItemDemo },
  { id: 'item-avatar', title: 'ItemAvatar', view: ItemAvatar },
  { id: 'item-dropdown', title: 'ItemDropdown', view: ItemDropdown },
  { id: 'item-group', title: 'ItemGroupExample', view: ItemGroupExample },
  { id: 'item-header', title: 'ItemHeaderDemo', view: ItemHeaderDemo },
  { id: 'item-icon', title: 'ItemIcon', view: ItemIcon },
  { id: 'item-image', title: 'ItemImage', view: ItemImage },
  { id: 'item-link', title: 'ItemLink', view: ItemLink },
  { id: 'item-rtl', title: 'ItemRtl', view: ItemRtl },
  { id: 'item-size', title: 'ItemSizeDemo', view: ItemSizeDemo },
  { id: 'item-variant', title: 'ItemVariant', view: ItemVariant },
] as const
