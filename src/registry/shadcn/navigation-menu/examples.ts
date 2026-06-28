import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as NavigationMenu from './index'
import type { NavigationMenuItemDescriptor } from './index'

type ExampleDefinition = Readonly<{
  id: string
  title: string
  view: () => Html
}>

type ComponentLink = Readonly<{
  title: string
  href: string
  description: string
}>

type NavigationMenuContentView = (
  itemAttributes: NavigationMenu.NavigationMenuItemAttributes<never>,
) => Html

const components: ReadonlyArray<ComponentLink> = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element on focus or hover.',
  },
]

const navigationItems: ReadonlyArray<NavigationMenuItemDescriptor> = [
  { value: 'getting-started', label: 'Getting started' },
  { value: 'components', label: 'Components' },
  { value: 'with-icon', label: 'With Icon' },
  {
    value: 'docs',
    label: 'Docs',
    kind: 'link',
    href: '/docs',
    isActive: true,
  },
]

const rtlNavigationItems: ReadonlyArray<NavigationMenuItemDescriptor> = [
  { value: 'getting-started', label: 'البدء' },
  { value: 'components', label: 'المكونات' },
  { value: 'with-icon', label: 'مع أيقونة' },
  {
    value: 'docs',
    label: 'الوثائق',
    kind: 'link',
    href: '/docs',
    isActive: true,
  },
]

const slotClassAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  h.Class(className),
]

const listItem = (
  link: Readonly<{
    title: string
    href: string
    description: string
  }>,
): Html => {
  const h = html<never>()

  return h.li(
    [],
    [
      h.a(
        [
          ...slotClassAttributes(
            h,
            'navigation-menu-link',
            NavigationMenu.navigationMenuLinkClassName(),
          ),
          h.Href(link.href),
        ],
        [
          h.div(
            [h.Class('flex flex-col gap-1 text-sm')],
            [
              h.div([h.Class('leading-none font-medium')], [link.title]),
              h.div(
                [h.Class('line-clamp-2 text-muted-foreground')],
                [link.description],
              ),
            ],
          ),
        ],
      ),
    ],
  )
}

const statusIcon = (path: string): Html => {
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
      h.AriaHidden(true),
    ],
    [h.path([h.D(path)], [])],
  )
}

const iconLink = (label: string, icon: Html): Html => {
  const h = html<never>()

  return h.a(
    [
      ...slotClassAttributes(
        h,
        'navigation-menu-link',
        NavigationMenu.navigationMenuLinkClassName({
          className: 'flex-row items-center gap-2',
        }),
      ),
      h.Href('#'),
    ],
    [icon, label],
  )
}

const gettingStartedContent = (
  itemAttributes: NavigationMenu.NavigationMenuItemAttributes<never>,
): Html => {
  const h = html<never>()

  return h.div(
    [...itemAttributes.content.root],
    [
      h.ul(
        [h.Class('w-96')],
        [
          listItem({
            href: '/docs',
            title: 'Introduction',
            description: 'Re-usable components built with Tailwind CSS.',
          }),
          listItem({
            href: '/docs/installation',
            title: 'Installation',
            description: 'How to install dependencies and structure your app.',
          }),
          listItem({
            href: '/docs/primitives/typography',
            title: 'Typography',
            description: 'Styles for headings, paragraphs, lists...etc',
          }),
        ],
      ),
    ],
  )
}

const componentsContent = (
  itemAttributes: NavigationMenu.NavigationMenuItemAttributes<never>,
): Html => {
  const h = html<never>()

  return h.div(
    [...itemAttributes.content.root],
    [
      h.ul(
        [
          h.Class(
            'grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]',
          ),
        ],
        components.map(listItem),
      ),
    ],
  )
}

const iconContent = (
  itemAttributes: NavigationMenu.NavigationMenuItemAttributes<never>,
): Html => {
  const h = html<never>()

  return h.div(
    [...itemAttributes.content.root],
    [
      h.ul(
        [h.Class('grid w-[200px]')],
        [
          h.li(
            [],
            [
              iconLink('Backlog', statusIcon('M12 2a10 10 0 1 0 0 20')),
              iconLink('To Do', statusIcon('M8 12h8')),
              iconLink('Done', statusIcon('m9 12 2 2 4-4')),
            ],
          ),
        ],
      ),
    ],
  )
}

const rtlGettingStartedContent = (
  itemAttributes: NavigationMenu.NavigationMenuItemAttributes<never>,
): Html => {
  const h = html<never>()

  return h.div(
    [...itemAttributes.content.root, h.DataAttribute('lang', 'ar')],
    [
      h.ul(
        [h.Class('w-96')],
        [
          listItem({
            href: '/docs',
            title: 'مقدمة',
            description:
              'مكونات قابلة لإعادة الاستخدام مبنية باستخدام Tailwind CSS.',
          }),
          listItem({
            href: '/docs/installation',
            title: 'التثبيت',
            description: 'كيفية تثبيت التبعيات وتنظيم تطبيقك.',
          }),
          listItem({
            href: '/docs/primitives/typography',
            title: 'الطباعة',
            description: 'أنماط للعناوين والفقرات والقوائم.',
          }),
        ],
      ),
    ],
  )
}

const rtlComponentsContent = (
  itemAttributes: NavigationMenu.NavigationMenuItemAttributes<never>,
): Html => {
  const h = html<never>()

  return h.div(
    [...itemAttributes.content.root, h.DataAttribute('lang', 'ar')],
    [
      h.ul(
        [
          h.Class(
            'grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]',
          ),
        ],
        components.map(component =>
          listItem({
            href: component.href,
            title: component.title,
            description: component.description,
          }),
        ),
      ),
    ],
  )
}

const rtlIconContent = (
  itemAttributes: NavigationMenu.NavigationMenuItemAttributes<never>,
): Html => {
  const h = html<never>()

  return h.div(
    [...itemAttributes.content.root, h.DataAttribute('lang', 'ar')],
    [
      h.ul(
        [h.Class('grid w-[200px]')],
        [
          h.li(
            [],
            [
              iconLink('قائمة الانتظار', statusIcon('M12 2a10 10 0 1 0 0 20')),
              iconLink('المهام', statusIcon('M8 12h8')),
              iconLink('منجز', statusIcon('m9 12 2 2 4-4')),
            ],
          ),
        ],
      ),
    ],
  )
}

const contentView = (value: string, rtl = false): NavigationMenuContentView => {
  if (value === 'components') {
    return rtl ? rtlComponentsContent : componentsContent
  }

  if (value === 'with-icon') {
    return rtl ? rtlIconContent : iconContent
  }

  return rtl ? rtlGettingStartedContent : gettingStartedContent
}

const navigationMenuExample = (
  config: Readonly<{
    id: string
    items: ReadonlyArray<NavigationMenuItemDescriptor>
    value: string
    dir?: string
    rtl?: boolean
  }>,
): Html => {
  const h = html<never>()

  return NavigationMenu.view<never>({
    id: config.id,
    items: config.items,
    value: config.value,
    dir: config.dir,
    align: config.dir === 'rtl' ? 'end' : 'start',
    toView: attributes =>
      h.nav(
        [...attributes.root],
        [
          h.ul(
            [...attributes.list],
            attributes.items.map(itemAttributes =>
              h.li(
                [...itemAttributes.root],
                NavigationMenu.itemKind(itemAttributes.item) === 'link'
                  ? [h.a([...itemAttributes.link], [itemAttributes.item.label])]
                  : [
                      h.button(
                        [...itemAttributes.trigger],
                        [
                          itemAttributes.item.label,
                          NavigationMenu.chevronDownIcon(itemAttributes.icon),
                        ],
                      ),
                    ],
              ),
            ),
          ),
          h.div(
            [...attributes.portal],
            [
              h.div(
                [...attributes.positioner.root],
                [
                  h.nav(
                    [...attributes.popup.root],
                    [
                      h.div(
                        [...attributes.viewport.root],
                        attributes.items
                          .filter(
                            itemAttributes => itemAttributes.content.isMounted,
                          )
                          .map(itemAttributes =>
                            contentView(
                              itemAttributes.item.value,
                              config.rtl === true,
                            )(itemAttributes),
                          ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
  })
}

export const NavigationMenuDemo = (): Html =>
  navigationMenuExample({
    id: 'navigation-menu-demo',
    items: navigationItems,
    value: 'getting-started',
  })

export const NavigationMenuRtl = (): Html =>
  navigationMenuExample({
    id: 'navigation-menu-rtl',
    items: rtlNavigationItems,
    value: 'getting-started',
    dir: 'rtl',
    rtl: true,
  })

export const navigationMenuExampleViews: ReadonlyArray<ExampleDefinition> = [
  {
    id: 'shadcn/navigation-menu-demo',
    title: 'NavigationMenuDemo',
    view: NavigationMenuDemo,
  },
  {
    id: 'shadcn/navigation-menu-rtl',
    title: 'NavigationMenuRtl',
    view: NavigationMenuRtl,
  },
]
