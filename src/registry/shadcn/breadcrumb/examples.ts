import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Button } from '../button'
import { view as DropdownMenu } from '../dropdown-menu'
import type { DropdownMenuExampleController } from '../dropdown-menu/examples'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './index'

type Child = Html | string

type BreadcrumbExampleDefinition = Readonly<{
  id: string
  title: string
  view: () => Html
}>

const dropdownItems: ReadonlyArray<string> = [
  'Documentation',
  'Themes',
  'GitHub',
]

const arabicBreadcrumbRtl: Readonly<{
  dir: 'rtl'
  language: 'ar'
  values: Readonly<{
    home: string
    components: string
    documentation: string
    themes: string
    github: string
    breadcrumb: string
  }>
}> = {
  dir: 'rtl',
  language: 'ar',
  values: {
    home: 'الرئيسية',
    components: 'المكونات',
    documentation: 'التوثيق',
    themes: 'السمات',
    github: 'جيت هاب',
    breadcrumb: 'مسار التنقل',
  },
}

const icon = <Message>(
  className: string,
  attributes: ReadonlyArray<Attribute<Message>>,
  children: ReadonlyArray<Html>,
): Html => {
  const h = html<Message>()

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
      h.Class(className),
      ...attributes,
    ],
    children,
  )
}

const dotIcon = (): Html => {
  const h = html<never>()

  return icon(
    'lucide lucide-dot',
    [],
    [h.circle([h.Cx('12.1'), h.Cy('12.1'), h.R('1')], [])],
  )
}

const chevronDownIcon = (
  config: Readonly<{
    className?: string
    attributes?: ReadonlyArray<Attribute<never>>
  }> = {},
): Html => {
  const h = html<never>()

  return icon(
    config.className === undefined
      ? 'lucide lucide-chevron-down'
      : `lucide lucide-chevron-down ${config.className}`,
    config.attributes ?? [],
    [h.path([h.D('m6 9 6 6 6-6')], [])],
  )
}

const breadcrumbLink = (href: string, label: string): Html =>
  BreadcrumbLink<never>({ href, children: [label] })

const breadcrumbPage = (label: string): Html =>
  BreadcrumbPage<never>({ children: [label] })

const breadcrumbItem = (children: ReadonlyArray<Child>): Html =>
  BreadcrumbItem<never>({ children })

const breadcrumbSeparator = (children?: ReadonlyArray<Child>): Html =>
  children === undefined
    ? BreadcrumbSeparator<never>()
    : BreadcrumbSeparator<never>({ children })

const breadcrumbDropdownShell = <Message>(
  controller?: DropdownMenuExampleController<Message>,
): Html => {
  const h = html<Message>()
  const open = controller?.isOpenFor('breadcrumb-dropdown', false) ?? true
  const onItemPress = controller?.onItemPress

  return DropdownMenu<Message>({
    id: 'breadcrumb-dropdown',
    items: dropdownItems.map(value => ({ value, label: value })),
    open,
    openSubmenuValues: [],
    ...(controller === undefined
      ? {}
      : {
          onOpenChange: change =>
            controller.onOpenChange('breadcrumb-dropdown', change),
        }),
    ...(onItemPress === undefined
      ? {}
      : {
          onItemPress: press => onItemPress('breadcrumb-dropdown', press),
        }),
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.button(
            [
              ...attributes.trigger,
              h.AriaHasPopup('menu'),
              h.AriaExpanded(open),
              h.Class('flex items-center gap-1'),
            ],
            [
              'Components',
              chevronDownIcon({
                attributes: [h.DataAttribute('icon', 'inline-end')],
                className: 'size-3.5',
              }),
            ],
          ),
          h.div(
            [...attributes.portal],
            attributes.popup.isMounted
              ? [
                  h.div([...attributes.popup.backdrop.root], []),
                  h.div(
                    [...attributes.popup.positioner.root],
                    [
                      h.div(
                        [...attributes.popup.popup.root],
                        [
                          h.div(
                            [...attributes.popup.group],
                            attributes.popup.items.map(itemAttributes =>
                              h.div(
                                [...itemAttributes.root],
                                [
                                  h.span(
                                    [...itemAttributes.label],
                                    [itemAttributes.item.label],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ]
              : [],
          ),
        ],
      ),
  })
}

const breadcrumbShell = (
  children: ReadonlyArray<Child>,
  config: Readonly<{ dir?: 'ltr' | 'rtl' }> = {},
): Html =>
  Breadcrumb<never>({
    ...(config.dir === undefined ? {} : { dir: config.dir }),
    children: [BreadcrumbList<never>({ children })],
  })

const ellipsisMenuButton = (): Html => {
  const h = html<never>()

  return Button<never>({
    size: 'icon-sm',
    variant: 'ghost',
    toView: attributes =>
      h.button(
        [...attributes.button, h.AriaHasPopup('menu'), h.AriaExpanded(false)],
        [
          BreadcrumbEllipsis<never>(),
          h.span([h.Class('sr-only')], ['Toggle menu']),
        ],
      ),
  })
}

const componentsMenuButton = (
  label: string,
  iconAttributes: ReadonlyArray<Attribute<never>> = [],
): Html => {
  const h = html<never>()

  return h.button(
    [
      h.AriaHasPopup('menu'),
      h.AriaExpanded(false),
      h.Class('flex items-center gap-1'),
    ],
    [
      label,
      chevronDownIcon({ attributes: iconAttributes, className: 'size-6' }),
    ],
  )
}

export const BreadcrumbBasic = (): Html =>
  breadcrumbShell([
    breadcrumbItem([breadcrumbLink('#', 'Home')]),
    breadcrumbSeparator(),
    breadcrumbItem([breadcrumbLink('#', 'Components')]),
    breadcrumbSeparator(),
    breadcrumbItem([breadcrumbPage('Breadcrumb')]),
  ])

export const BreadcrumbDemo = (): Html =>
  breadcrumbShell([
    breadcrumbItem([breadcrumbLink('#', 'Home')]),
    breadcrumbSeparator(),
    breadcrumbItem([ellipsisMenuButton()]),
    breadcrumbSeparator(),
    breadcrumbItem([breadcrumbLink('#', 'Components')]),
    breadcrumbSeparator(),
    breadcrumbItem([breadcrumbPage('Breadcrumb')]),
  ])

export const BreadcrumbDropdown = <Message = never>(
  controller?: DropdownMenuExampleController<Message>,
): Html => {
  if (controller !== undefined) {
    return breadcrumbDropdownShell(controller)
  }

  const h = html<never>()

  return breadcrumbShell([
    breadcrumbItem([breadcrumbLink('/', 'Home')]),
    breadcrumbSeparator([dotIcon()]),
    breadcrumbItem([
      componentsMenuButton('Components', [
        h.DataAttribute('icon', 'inline-end'),
      ]),
    ]),
    breadcrumbSeparator([dotIcon()]),
    breadcrumbItem([breadcrumbPage('Breadcrumb')]),
  ])
}

export const BreadcrumbEllipsisDemo = (): Html =>
  breadcrumbShell([
    breadcrumbItem([breadcrumbLink('/', 'Home')]),
    breadcrumbSeparator(),
    breadcrumbItem([BreadcrumbEllipsis<never>()]),
    breadcrumbSeparator(),
    breadcrumbItem([breadcrumbLink('/docs/components', 'Components')]),
    breadcrumbSeparator(),
    breadcrumbItem([breadcrumbPage('Breadcrumb')]),
  ])

export const BreadcrumbLinkDemo = (): Html =>
  breadcrumbShell([
    breadcrumbItem([breadcrumbLink('#link-component', 'Home')]),
    breadcrumbSeparator(),
    breadcrumbItem([breadcrumbLink('#link-component', 'Components')]),
    breadcrumbSeparator(),
    breadcrumbItem([breadcrumbPage('Breadcrumb')]),
  ])

export const BreadcrumbRtl = (): Html => {
  const h = html<never>()
  const { dir, values } = arabicBreadcrumbRtl

  return breadcrumbShell(
    [
      breadcrumbItem([breadcrumbLink('/', values.home)]),
      breadcrumbSeparator([dotIcon()]),
      breadcrumbItem([
        h.button(
          [
            h.AriaHasPopup('menu'),
            h.AriaExpanded(false),
            h.Class('flex items-center gap-1'),
          ],
          [
            values.components,
            chevronDownIcon({
              attributes: [h.DataAttribute('icon', 'inline-end')],
              className: 'size-3.5',
            }),
          ],
        ),
      ]),
      breadcrumbSeparator([dotIcon()]),
      breadcrumbItem([breadcrumbPage(values.breadcrumb)]),
    ],
    { dir },
  )
}

export const BreadcrumbSeparatorDemo = (): Html =>
  breadcrumbShell([
    breadcrumbItem([breadcrumbLink('/', 'Home')]),
    breadcrumbSeparator([dotIcon()]),
    breadcrumbItem([breadcrumbLink('/components', 'Components')]),
    breadcrumbSeparator([dotIcon()]),
    breadcrumbItem([breadcrumbPage('Breadcrumb')]),
  ])

export const breadcrumbExampleViews: ReadonlyArray<BreadcrumbExampleDefinition> =
  [
    {
      id: 'shadcn/breadcrumb-basic',
      title: 'BreadcrumbBasic',
      view: BreadcrumbBasic,
    },
    {
      id: 'shadcn/breadcrumb-demo',
      title: 'BreadcrumbDemo',
      view: BreadcrumbDemo,
    },
    {
      id: 'shadcn/breadcrumb-dropdown',
      title: 'BreadcrumbDropdown',
      view: BreadcrumbDropdown,
    },
    {
      id: 'shadcn/breadcrumb-ellipsis',
      title: 'BreadcrumbEllipsisDemo',
      view: BreadcrumbEllipsisDemo,
    },
    {
      id: 'shadcn/breadcrumb-link',
      title: 'BreadcrumbLinkDemo',
      view: BreadcrumbLinkDemo,
    },
    {
      id: 'shadcn/breadcrumb-rtl',
      title: 'BreadcrumbRtl',
      view: BreadcrumbRtl,
    },
    {
      id: 'shadcn/breadcrumb-separator',
      title: 'BreadcrumbSeparatorDemo',
      view: BreadcrumbSeparatorDemo,
    },
  ]
