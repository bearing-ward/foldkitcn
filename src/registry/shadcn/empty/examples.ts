import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Avatar } from '../avatar'
import { view as Button } from '../button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../input-group'
import { view as Kbd } from '../kbd'
import { Spinner } from '../spinner'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './index'

type Child = Html | string

type IconName =
  | 'arrowUpRight'
  | 'bell'
  | 'cloud'
  | 'folder'
  | 'folderCode'
  | 'plus'
  | 'refreshCcw'
  | 'search'

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

const arabicEmptyRtl = {
  dir: 'rtl',
  values: {
    title: 'لا توجد مشاريع بعد',
    description: 'لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.',
    createProject: 'إنشاء مشروع',
    importProject: 'استيراد مشروع',
    learnMore: 'تعرف على المزيد',
  },
}

const iconPaths: Readonly<Record<IconName, ReadonlyArray<string>>> = {
  arrowUpRight: ['M7 7h10v10', 'M7 17 17 7'],
  bell: [
    'M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6',
    'M9 17v1a3 3 0 0 0 6 0v-1',
  ],
  cloud: [
    'M6.657 18C4.085 18 2 15.993 2 13.517 2 11.04 4.085 9.033 6.657 9.033c.395-2.766 2.836-4.894 5.791-4.894 3.237 0 5.861 2.525 5.861 5.64v.05C20.39 10.478 22 12.341 22 14.497 22 16.432 20.37 18 18.358 18H6.657',
  ],
  folder: [
    'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z',
  ],
  folderCode: [
    'M10 10.5 8 13l2 2.5',
    'm14 10.5 2 2.5-2 2.5',
    'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z',
  ],
  plus: ['M5 12h14', 'M12 5v14'],
  refreshCcw: [
    'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
    'M3 21v-5h5',
    'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
    'M16 8h5V3',
  ],
  search: ['m21 21-4.34-4.34'],
}

const iconClassNames: Readonly<Record<IconName, string>> = {
  arrowUpRight: 'lucide lucide-arrow-up-right-icon',
  bell: 'tabler-icon tabler-icon-bell',
  cloud: 'tabler-icon tabler-icon-cloud',
  folder: 'lucide lucide-folder-icon',
  folderCode: 'tabler-icon tabler-icon-folder-code',
  plus: 'lucide lucide-plus-icon',
  refreshCcw: 'lucide lucide-refresh-ccw-icon',
  search: 'lucide lucide-search-icon',
}

const icon = (
  name: IconName,
  attributes: ReadonlyArray<Attribute<never>> = [],
  className?: string,
): Html => {
  const h = html<never>()
  const paths = iconPaths[name].map(path => h.path([h.D(path)], []))
  const extra =
    name === 'search' ? [h.circle([h.Cx('11'), h.Cy('11'), h.R('8')], [])] : []

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
      h.Class(
        className === undefined
          ? iconClassNames[name]
          : `${iconClassNames[name]} ${className}`,
      ),
      h.AriaHidden(true),
      ...attributes,
    ],
    [...paths, ...extra],
  )
}

const avatar = (
  profile: AvatarProfile,
  options: Readonly<{
    className?: string
    imageClassName?: string
    imageLoadingStatus?: 'loaded' | 'loading' | 'error'
  }> = {},
): Html => {
  const h = html<never>()

  return Avatar<never>({
    imageLoadingStatus: options.imageLoadingStatus ?? 'loaded',
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
        ],
      ),
  })
}

const button = (
  children: ReadonlyArray<Child>,
  config: Readonly<{
    variant?: 'default' | 'outline' | 'link'
    size?: 'default' | 'sm'
    className?: string
    href?: string
  }> = {},
): Html => {
  const h = html<never>()
  const isLink = config.href !== undefined

  return Button<never>({
    variant: config.variant,
    size: config.size,
    className: config.className,
    isNativeButton: !isLink,
    toView: attributes =>
      isLink
        ? h.a([...attributes.button, h.Href(config.href ?? '#')], children)
        : h.button([...attributes.button], children),
  })
}

const kbd = (children: ReadonlyArray<Child>): Html => {
  const h = html<never>()

  return Kbd<never>({
    toView: attributes => h.kbd([...attributes.kbd], children),
  })
}

const avatarGroup = (): Html => {
  const h = html<never>()

  return h.div(
    [
      h.Class(
        'flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale',
      ),
    ],
    [
      avatar(shadcnProfile),
      avatar(maxLeiterProfile),
      avatar(evilRabbitProfile),
    ],
  )
}

export const EmptyAvatarGroup = (): Html =>
  Empty<never>({
    children: [
      EmptyHeader<never>({
        children: [
          EmptyMedia<never>({ children: [avatarGroup()] }),
          EmptyTitle<never>({ children: ['No Team Members'] }),
          EmptyDescription<never>({
            children: ['Invite your team to collaborate on this project.'],
          }),
        ],
      }),
      EmptyContent<never>({
        children: [
          button([icon('plus'), 'Invite Members'], {
            size: 'sm',
          }),
        ],
      }),
    ],
  })

export const EmptyAvatar = (): Html =>
  Empty<never>({
    children: [
      EmptyHeader<never>({
        children: [
          EmptyMedia<never>({
            variant: 'default',
            children: [
              avatar(
                {
                  ...shadcnProfile,
                  alt: '',
                  fallback: 'LR',
                },
                { className: 'size-12', imageClassName: 'grayscale' },
              ),
            ],
          }),
          EmptyTitle<never>({ children: ['User Offline'] }),
          EmptyDescription<never>({
            children: [
              'This user is currently offline. You can leave a message to notify them or try again later.',
            ],
          }),
        ],
      }),
      EmptyContent<never>({
        children: [button(['Leave Message'], { size: 'sm' })],
      }),
    ],
  })

export const EmptyMuted = (): Html =>
  Empty<never>({
    className: 'h-full bg-muted/30',
    children: [
      EmptyHeader<never>({
        children: [
          EmptyMedia<never>({
            variant: 'icon',
            children: [icon('bell')],
          }),
          EmptyTitle<never>({ children: ['No Notifications'] }),
          EmptyDescription<never>({
            className: 'max-w-xs text-pretty',
            children: [
              "You're all caught up. New notifications will appear here.",
            ],
          }),
        ],
      }),
      EmptyContent<never>({
        children: [
          button(
            [
              icon('refreshCcw', [
                html<never>().DataAttribute('icon', 'inline-start'),
              ]),
              'Refresh',
            ],
            {
              variant: 'outline',
            },
          ),
        ],
      }),
    ],
  })

export const EmptyInCard = (): Html =>
  Empty<never>({
    children: [
      EmptyHeader<never>({
        children: [
          EmptyMedia<never>({
            variant: 'icon',
            children: [icon('folder')],
          }),
          EmptyTitle<never>({ children: ['No projects yet'] }),
          EmptyDescription<never>({
            children: [
              "You haven't created any projects yet. Get started by creating your first project.",
            ],
          }),
        ],
      }),
      EmptyContent<never>({
        children: [
          html<never>().div(
            [html<never>().Class('flex gap-2')],
            [
              button(['Create project'], { href: '#' }),
              button(['Import project'], { variant: 'outline' }),
            ],
          ),
          button(['Learn more ', icon('arrowUpRight')], {
            variant: 'link',
            href: '#',
          }),
        ],
      }),
    ],
  })

export const EmptyDemo = (): Html =>
  Empty<never>({
    children: [
      EmptyHeader<never>({
        children: [
          EmptyMedia<never>({
            variant: 'icon',
            children: [icon('folderCode')],
          }),
          EmptyTitle<never>({ children: ['No Projects Yet'] }),
          EmptyDescription<never>({
            children: [
              "You haven't created any projects yet. Get started by creating your first project.",
            ],
          }),
        ],
      }),
      EmptyContent<never>({
        className: 'flex-row justify-center gap-2',
        children: [
          button(['Create Project']),
          button(['Import Project'], { variant: 'outline' }),
        ],
      }),
      button(['Learn More ', icon('arrowUpRight')], {
        variant: 'link',
        size: 'sm',
        href: '#',
      }),
    ],
  })

export const EmptyInputGroup = (): Html => {
  const h = html<never>()

  return Empty<never>({
    children: [
      EmptyHeader<never>({
        children: [
          EmptyTitle<never>({ children: ['404 - Not Found'] }),
          EmptyDescription<never>({
            children: [
              "The page you're looking for doesn't exist. Try searching for what you need below.",
            ],
          }),
        ],
      }),
      EmptyContent<never>({
        children: [
          InputGroup<never>({
            className: 'sm:w-3/4',
            children: [
              InputGroupInput<never>({
                placeholder: 'Try searching for pages...',
              }),
              InputGroupAddon<never>({
                children: [icon('search')],
              }),
              InputGroupAddon<never>({
                align: 'inline-end',
                children: [kbd(['/'])],
              }),
            ],
          }),
          EmptyDescription<never>({
            children: ['Need help? ', h.a([h.Href('#')], ['Contact support'])],
          }),
        ],
      }),
    ],
  })
}

export const EmptyOutline = (): Html =>
  Empty<never>({
    className: 'border border-dashed',
    children: [
      EmptyHeader<never>({
        children: [
          EmptyMedia<never>({
            variant: 'icon',
            children: [icon('cloud')],
          }),
          EmptyTitle<never>({ children: ['Cloud Storage Empty'] }),
          EmptyDescription<never>({
            children: [
              'Upload files to your cloud storage to access them anywhere.',
            ],
          }),
        ],
      }),
      EmptyContent<never>({
        children: [
          button(['Upload Files'], {
            variant: 'outline',
            size: 'sm',
          }),
        ],
      }),
    ],
  })

export const EmptyRtl = (): Html => {
  const { dir, values } = arabicEmptyRtl

  return Empty<never>({
    dir,
    children: [
      EmptyHeader<never>({
        children: [
          EmptyMedia<never>({
            variant: 'icon',
            children: [icon('folderCode')],
          }),
          EmptyTitle<never>({ children: [values.title] }),
          EmptyDescription<never>({ children: [values.description] }),
        ],
      }),
      EmptyContent<never>({
        className: 'flex-row justify-center gap-2',
        children: [
          button([values.createProject]),
          button([values.importProject], { variant: 'outline' }),
        ],
      }),
      button(
        [
          values.learnMore,
          ' ',
          icon(
            'arrowUpRight',
            [html<never>().DataAttribute('icon', 'inline-end')],
            'rtl:rotate-270',
          ),
        ],
        {
          variant: 'link',
          size: 'sm',
          href: '#',
        },
      ),
    ],
  })
}

export const SpinnerEmpty = (): Html =>
  Empty<never>({
    className: 'w-full',
    children: [
      EmptyHeader<never>({
        children: [
          EmptyMedia<never>({
            variant: 'icon',
            children: [Spinner<never>()],
          }),
          EmptyTitle<never>({ children: ['Processing your request'] }),
          EmptyDescription<never>({
            children: [
              'Please wait while we process your request. Do not refresh the page.',
            ],
          }),
        ],
      }),
      EmptyContent<never>({
        children: [
          button(['Cancel'], {
            variant: 'outline',
            size: 'sm',
          }),
        ],
      }),
    ],
  })
