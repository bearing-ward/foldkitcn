import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type { AnchorPositioningMessage } from '../../../utils/anchor-positioning'
import * as Avatar from '../avatar'
import * as Button from '../button'
import * as Collapsible from '../collapsible'
import * as DropdownMenu from '../dropdown-menu'
import * as Tooltip from '../tooltip'
import * as Sidebar from './index'

type IconName =
  | 'activity'
  | 'bot'
  | 'book'
  | 'chevronDown'
  | 'chevronUp'
  | 'chevronRight'
  | 'chevronsUpDown'
  | 'folder'
  | 'galleryVerticalEnd'
  | 'layout'
  | 'panelLeft'
  | 'panelLeftClose'
  | 'panelLeftOpen'
  | 'map'
  | 'moreHorizontal'
  | 'plus'
  | 'settings'
  | 'sparkles'
  | 'squareTerminal'
  | 'users'

const iconPaths: Readonly<Record<IconName, ReadonlyArray<string>>> = {
  activity: ['M22 12h-4l-3 9-4-18-3 9H2'],
  bot: [
    'M12 8V4H8',
    'M20 8V4h-4',
    'M4 16v-4',
    'M20 16v-4',
    'M8 16h8',
    'M9 12h.01',
    'M15 12h.01',
    'M8 20h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4',
  ],
  book: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20'],
  chevronDown: ['m6 9 6 6 6-6'],
  chevronUp: ['m18 15-6-6-6 6'],
  chevronRight: ['m9 18 6-6-6-6'],
  chevronsUpDown: ['m7 15 5 5 5-5', 'm7 9 5-5 5 5'],
  folder: [
    'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  ],
  galleryVerticalEnd: [
    'M7 2h10',
    'M5 6h14',
    'M6 10h12',
    'M8 14h8',
    'M10 18h4',
    'M11 22h2',
  ],
  layout: ['M3 5h18', 'M3 12h18', 'M3 19h18', 'M8 5v14', 'M16 5v14'],
  panelLeft: ['M9 3v18', 'M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3'],
  panelLeftClose: [
    'M9 3v18',
    'M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3',
    'm16 15-3-3 3-3',
  ],
  panelLeftOpen: [
    'M9 3v18',
    'M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3',
    'm14 9 3 3-3 3',
  ],
  map: ['M10 6 3 9v12l7-3 7 3 7-3V6l-7 3z'],
  moreHorizontal: ['M12 12h.01', 'M19 12h.01', 'M5 12h.01'],
  plus: ['M5 12h14', 'M12 5v14'],
  settings: [
    'M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8z',
    'M4 12h2',
    'M18 12h2',
    'M12 4V2',
    'M12 22v-2',
  ],
  sparkles: ['M9.9 2.6 11.5 8l5.4 1.6-5.4 1.6-1.6 5.4-1.6-5.4L3 9.6 8.4 8z'],
  squareTerminal: [
    'M7 11 9 13 7 15',
    'M11 15h4',
    'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
  ],
  users: [
    'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2',
    'M17 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  ],
}

const icon = (name: IconName, className = 'size-4'): Html => {
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
      h.Class(className),
    ],
    iconPaths[name].map(path => h.path([h.D(path)], [])),
  )
}

const frameIcon = (className = 'size-4'): Html => {
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
      h.Class(className),
    ],
    [
      h.line([h.X1('22'), h.X2('2'), h.Y1('6'), h.Y2('6')], []),
      h.line([h.X1('22'), h.X2('2'), h.Y1('18'), h.Y2('18')], []),
      h.line([h.X1('6'), h.X2('6'), h.Y1('2'), h.Y2('22')], []),
      h.line([h.X1('18'), h.X2('18'), h.Y1('2'), h.Y2('22')], []),
    ],
  )
}

const pieChartIcon = (className = 'size-4'): Html => {
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
      h.Class(className),
    ],
    [
      h.path(
        [
          h.D(
            'M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z',
          ),
        ],
        [],
      ),
      h.path([h.D('M21.21 15.89A10 10 0 1 1 8 2.83')], []),
    ],
  )
}

const lifeBuoyIcon = (className = 'size-4'): Html => {
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
      h.Class(className),
    ],
    [
      h.path([h.D('m4.93 4.93 4.24 4.24')], []),
      h.path([h.D('m14.83 9.17 4.24-4.24')], []),
      h.path([h.D('m14.83 14.83 4.24 4.24')], []),
      h.path([h.D('m9.17 14.83-4.24 4.24')], []),
      h.circle([h.Cx('12'), h.Cy('12'), h.R('4')], []),
    ],
  )
}

const mapIcon = (className = 'size-4'): Html => {
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
      h.Class(className),
    ],
    [
      h.path(
        [
          h.D(
            'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z',
          ),
        ],
        [],
      ),
      h.path([h.D('M15 5.764v15')], []),
      h.path([h.D('M9 3.236v15')], []),
    ],
  )
}

const galleryVerticalEndLucideIcon = (className = 'size-4'): Html => {
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
      h.Class(`lucide lucide-gallery-vertical-end ${className}`),
    ],
    [
      h.path([h.D('M7 2h10')], []),
      h.path([h.D('M5 6h14')], []),
      h.rect(
        [
          h.X('3'),
          h.Y('10'),
          h.Width('18'),
          h.Height('12'),
          h.Attribute('rx', '2'),
        ],
        [],
      ),
    ],
  )
}

type LucideNode =
  | Readonly<{ tag: 'path'; attributes: Readonly<Record<string, string>> }>
  | Readonly<{ tag: 'rect'; attributes: Readonly<Record<string, string>> }>
  | Readonly<{ tag: 'circle'; attributes: Readonly<Record<string, string>> }>
  | Readonly<{ tag: 'line'; attributes: Readonly<Record<string, string>> }>

const lucideIcon = (
  name: string,
  nodes: ReadonlyArray<LucideNode>,
  className?: string,
): Html => {
  const h = html<never>()
  const classes = [`lucide`, `lucide-${name}`, className]
    .filter(Boolean)
    .join(' ')

  const nodeAttributes = (attributes: Readonly<Record<string, string>>) =>
    Object.entries(attributes).map(([attributeName, value]) =>
      h.Attribute(attributeName, value),
    )

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
      h.Class(classes),
    ],
    nodes.map(node => {
      if (node.tag === 'path') {
        return h.path(nodeAttributes(node.attributes), [])
      }

      if (node.tag === 'rect') {
        return h.rect(nodeAttributes(node.attributes), [])
      }

      if (node.tag === 'circle') {
        return h.circle(nodeAttributes(node.attributes), [])
      }

      return h.line(nodeAttributes(node.attributes), [])
    }),
  )
}

const squareTerminalLucideIcon = (className?: string): Html =>
  lucideIcon(
    'square-terminal',
    [
      { tag: 'path', attributes: { d: 'm7 11 2-2-2-2' } },
      { tag: 'path', attributes: { d: 'M11 13h4' } },
      {
        tag: 'rect',
        attributes: {
          width: '18',
          height: '18',
          x: '3',
          y: '3',
          rx: '2',
          ry: '2',
        },
      },
    ],
    className,
  )

const botLucideIcon = (className?: string): Html =>
  lucideIcon(
    'bot',
    [
      { tag: 'path', attributes: { d: 'M12 8V4H8' } },
      {
        tag: 'rect',
        attributes: { width: '16', height: '12', x: '4', y: '8', rx: '2' },
      },
      { tag: 'path', attributes: { d: 'M2 14h2' } },
      { tag: 'path', attributes: { d: 'M20 14h2' } },
      { tag: 'path', attributes: { d: 'M15 13v2' } },
      { tag: 'path', attributes: { d: 'M9 13v2' } },
    ],
    className,
  )

const bookOpenLucideIcon = (className?: string): Html =>
  lucideIcon(
    'book-open',
    [
      { tag: 'path', attributes: { d: 'M12 7v14' } },
      {
        tag: 'path',
        attributes: {
          d: 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
        },
      },
    ],
    className,
  )

const settings2LucideIcon = (className?: string): Html =>
  lucideIcon(
    'settings2',
    [
      { tag: 'path', attributes: { d: 'M20 7h-9' } },
      { tag: 'path', attributes: { d: 'M14 17H5' } },
      { tag: 'circle', attributes: { cx: '17', cy: '17', r: '3' } },
      { tag: 'circle', attributes: { cx: '7', cy: '7', r: '3' } },
    ],
    className,
  )

const chevronRightLucideIcon = (className?: string): Html =>
  lucideIcon(
    'chevron-right',
    [{ tag: 'path', attributes: { d: 'm9 18 6-6-6-6' } }],
    className,
  )

const moreHorizontalLucideIcon = (className?: string): Html =>
  lucideIcon(
    'ellipsis',
    [
      { tag: 'circle', attributes: { cx: '12', cy: '12', r: '1' } },
      { tag: 'circle', attributes: { cx: '19', cy: '12', r: '1' } },
      { tag: 'circle', attributes: { cx: '5', cy: '12', r: '1' } },
    ],
    className,
  )

const chevronsUpDownLucideIcon = (className?: string): Html =>
  lucideIcon(
    'chevrons-up-down',
    [
      { tag: 'path', attributes: { d: 'm7 15 5 5 5-5' } },
      { tag: 'path', attributes: { d: 'm7 9 5-5 5 5' } },
    ],
    className,
  )

const activityIcon = (className?: string): Html =>
  icon('activity', className ?? 'size-4')

const frameLucideIcon = (className?: string): Html =>
  lucideIcon(
    'frame',
    [
      { tag: 'line', attributes: { x1: '22', x2: '2', y1: '6', y2: '6' } },
      { tag: 'line', attributes: { x1: '22', x2: '2', y1: '18', y2: '18' } },
      { tag: 'line', attributes: { x1: '6', x2: '6', y1: '2', y2: '22' } },
      { tag: 'line', attributes: { x1: '18', x2: '18', y1: '2', y2: '22' } },
    ],
    className,
  )

const pieChartLucideIcon = (className?: string): Html =>
  lucideIcon(
    'chart-pie',
    [
      {
        tag: 'path',
        attributes: {
          d: 'M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z',
        },
      },
      { tag: 'path', attributes: { d: 'M21.21 15.89A10 10 0 1 1 8 2.83' } },
    ],
    className,
  )

const mapLucideIcon = (className?: string): Html =>
  lucideIcon(
    'map',
    [
      {
        tag: 'path',
        attributes: {
          d: 'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z',
        },
      },
      { tag: 'path', attributes: { d: 'M15 5.764v15' } },
      { tag: 'path', attributes: { d: 'M9 3.236v15' } },
    ],
    className,
  )

const sendIcon = (className = 'size-4'): Html => {
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
      h.Class(className),
    ],
    [
      h.path(
        [
          h.D(
            'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z',
          ),
        ],
        [],
      ),
      h.path([h.D('m21.854 2.147-10.94 10.939')], []),
    ],
  )
}

const panelLeftCloseIcon = (className = 'size-4'): Html => {
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
      h.Class(className),
    ],
    [
      h.rect(
        [
          h.X('3'),
          h.Y('3'),
          h.Width('18'),
          h.Height('18'),
          h.Attribute('rx', '2'),
        ],
        [],
      ),
      h.path([h.D('M9 3v18')], []),
      h.path([h.D('m16 15-3-3 3-3')], []),
    ],
  )
}

const panelLeftOpenIcon = (className = 'size-4'): Html => {
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
      h.Class(className),
    ],
    [
      h.rect(
        [
          h.X('3'),
          h.Y('3'),
          h.Width('18'),
          h.Height('18'),
          h.Attribute('rx', '2'),
        ],
        [],
      ),
      h.path([h.D('M9 3v18')], []),
      h.path([h.D('m14 9 3 3-3 3')], []),
    ],
  )
}

const subButton = (
  label: string,
  options: Readonly<{
    href?: string
    isActive?: boolean
    dir?: string
    size?: 'sm' | 'md'
  }> = {},
): Html => {
  const h = html<never>()

  return Sidebar.SidebarMenuSubButton<never>({
    ...(options.href === undefined ? {} : { href: options.href }),
    ...(options.isActive === undefined ? {} : { isActive: options.isActive }),
    ...(options.dir === undefined ? {} : { dir: options.dir }),
    ...(options.size === undefined ? {} : { size: options.size }),
    children: [h.span([], [label])],
  })
}

const simpleGroup = (label: string, children: ReadonlyArray<Html>): Html =>
  Sidebar.SidebarGroup<never>({
    children: [
      Sidebar.SidebarGroupLabel<never>({ children: [label] }),
      Sidebar.SidebarGroupContent<never>({ children }),
    ],
  })

const defaultSidebarTeam = {
  name: 'Acme Inc',
  plan: 'Enterprise',
  logo: galleryVerticalEndLucideIcon,
}

const sidebarDemoData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    defaultSidebarTeam,
    { name: 'Acme Corp.', plan: 'Startup', logo: activityIcon },
    { name: 'Evil Corp.', plan: 'Free', logo: squareTerminalLucideIcon },
  ],
  navMain: [
    {
      title: 'Playground',
      iconName: 'squareTerminal' as const,
      isActive: true,
      items: ['History', 'Starred', 'Settings'],
    },
    {
      title: 'Models',
      iconName: 'bot' as const,
      items: ['Genesis', 'Explorer', 'Quantum'],
    },
    {
      title: 'Documentation',
      iconName: 'book' as const,
      items: ['Introduction', 'Get Started', 'Tutorials', 'Changelog'],
    },
    {
      title: 'Settings',
      iconName: 'settings' as const,
      items: ['General', 'Team', 'Billing', 'Limits'],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      icon: frameLucideIcon,
    },
    {
      name: 'Sales & Marketing',
      icon: pieChartLucideIcon,
    },
    {
      name: 'Travel',
      icon: mapLucideIcon,
    },
  ],
}

const sidebarTeamByName = (name: string) =>
  sidebarDemoData.teams.find(team => team.name === name) ?? defaultSidebarTeam

const sidebarTooltip = (label: string): Html => {
  const h = html<never>()

  return h.div(
    [h.Class(Tooltip.tooltipPositionerClassName())],
    [
      h.div(
        [
          h.DataAttribute('slot', 'tooltip-content'),
          h.DataAttribute('side', 'top'),
          h.Class(Tooltip.tooltipContentClassName()),
          h.Attribute('side', 'right'),
          h.Attribute('align', 'center'),
          h.Hidden(true),
        ],
        [h.div([h.Class(Tooltip.tooltipArrowClassName())], []), label],
      ),
    ],
  )
}

const demoAvatar = (): Html => {
  const h = html<never>()

  return Avatar.view<never>({
    size: 'default',
    className: 'h-8 w-8 rounded-lg',
    imageLoadingStatus: 'error',
    image: {
      src: sidebarDemoData.user.avatar,
      alt: sidebarDemoData.user.name,
      className: 'rounded-lg',
    },
    fallback: { className: 'rounded-lg' },
    toView: (attributes, state) =>
      h.span(
        [...attributes.root],
        [
          ...(state.shouldRenderImage ? [h.img([...attributes.image])] : []),
          ...(state.shouldRenderFallback
            ? [h.span([...attributes.fallback], ['CN'])]
            : []),
        ],
      ),
  })
}

const rtlDemoAvatar = (): Html => {
  const h = html<never>()

  return Avatar.view<never>({
    size: 'default',
    className: 'rounded-lg',
    imageLoadingStatus: 'error',
    image: {
      src: sidebarDemoData.user.avatar,
      alt: sidebarDemoData.user.name,
      className: 'rounded-lg',
    },
    fallback: { className: 'rounded-lg' },
    toView: (attributes, state) =>
      h.span(
        [...attributes.root],
        [
          ...(state.shouldRenderImage ? [h.img([...attributes.image])] : []),
          ...(state.shouldRenderFallback
            ? [h.span([...attributes.fallback], ['CN'])]
            : []),
        ],
      ),
  })
}

const sidebarDemoNavIcon = (name: IconName): Html => {
  switch (name) {
    case 'bot': {
      return botLucideIcon()
    }
    case 'book': {
      return bookOpenLucideIcon()
    }
    case 'settings': {
      return settings2LucideIcon()
    }
    case 'squareTerminal': {
      return squareTerminalLucideIcon()
    }
    default: {
      return icon(name)
    }
  }
}

export type SidebarOpenChange = Readonly<{ open: boolean }>
export type SidebarPanelOpenChange = Readonly<{
  panelId: string
  open: boolean
}>
export type SidebarSelectedValueChange = Readonly<{
  panelId: string
  value: string
}>
export type SidebarController<Message> = Readonly<{
  open: boolean
  onOpenChange: (change: SidebarOpenChange) => Message
  panelIsOpen: (panelId: string, defaultOpen: boolean) => boolean
  onPanelOpenChange: (change: SidebarPanelOpenChange) => Message
  selectedValueFor: (panelId: string, defaultValue: string) => string
  onSelectedValueChange: (change: SidebarSelectedValueChange) => Message
  onPositioned?: (message: AnchorPositioningMessage) => Message
}>
export type SidebarControlledOpenChange = SidebarOpenChange
export type SidebarControlledController<Message> = SidebarController<Message>

const sidebarIsOpen = <Message>(
  controller?: SidebarController<Message>,
): boolean => controller?.open ?? true

const sidebarPanelIsOpen = <Message>(
  controller: SidebarController<Message> | undefined,
  panelId: string,
  defaultOpen: boolean,
): boolean => controller?.panelIsOpen(panelId, defaultOpen) ?? defaultOpen

const sidebarSelectedValue = <Message>(
  controller: SidebarController<Message> | undefined,
  panelId: string,
  defaultValue: string,
): string => controller?.selectedValueFor(panelId, defaultValue) ?? defaultValue

type SidebarDropdownItem = Readonly<{
  value: string
  label: string
  icon?: (className?: string) => Html
  shortcut?: string
  isDisabled?: boolean
}>

const sidebarDropdownPopup = <Message>(
  popup: DropdownMenu.MenuPopupAttributes<Message>,
  items: ReadonlyArray<SidebarDropdownItem>,
  label?: string,
): ReadonlyArray<Html> => {
  const h = html<Message>()
  const popupAttributes = popup.popup.root

  if (!popup.isMounted) {
    return []
  }

  return [
    h.div([...popup.backdrop.root], []),
    h.div(
      [...popup.positioner.root],
      [
        h.div(
          [...popupAttributes],
          [
            h.div([...popup.arrow.root], []),
            h.div(
              [...popup.group],
              [
                ...(label === undefined
                  ? []
                  : [h.div([...popup.groupLabel], [label])]),
                ...popup.items.map(itemAttributes => {
                  const item =
                    items.find(
                      candidate =>
                        candidate.value === itemAttributes.item.value,
                    ) ?? itemAttributes.item

                  return h.div(
                    [...itemAttributes.root],
                    [
                      ...('icon' in item && item.icon !== undefined
                        ? [item.icon('text-muted-foreground')]
                        : []),
                      h.span([...itemAttributes.label], [item.label]),
                      ...('shortcut' in item && item.shortcut !== undefined
                        ? [
                            h.span(
                              [...itemAttributes.shortcut],
                              [item.shortcut],
                            ),
                          ]
                        : []),
                    ],
                  )
                }),
              ],
            ),
          ],
        ),
      ],
    ),
  ]
}

const sidebarDropdown = <Message>(
  config: Readonly<{
    id: string
    controller?: SidebarController<Message> | undefined
    items: ReadonlyArray<SidebarDropdownItem>
    label?: string | undefined
    contentClassName?: string | undefined
    side?: DropdownMenu.MenuSide | undefined
    align?: DropdownMenu.MenuAlign | undefined
    onItemPressPanelId?: string | undefined
    trigger: (attributes: DropdownMenu.MenuAttributes<Message>) => Html
  }>,
): Html => {
  const { controller } = config
  const contentClassName = [
    config.contentClassName,
    config.side === 'top'
      ? 'data-[side=top]:top-auto! data-[side=top]:bottom-0!'
      : undefined,
  ]
    .filter((className): className is string => className !== undefined)
    .join(' ')

  return DropdownMenu.view<Message>({
    id: config.id,
    open: sidebarPanelIsOpen(controller, config.id, false),
    items: config.items.map(item => ({
      value: item.value,
      label: item.label,
      ...(item.isDisabled === undefined ? {} : { isDisabled: item.isDisabled }),
    })),
    highlightedValue: config.items.find(item => item.isDisabled !== true)
      ?.value,
    ...(contentClassName === '' ? {} : { contentClassName }),
    side: config.side ?? 'right',
    align: config.align ?? 'start',
    ...(controller === undefined
      ? {}
      : {
          onOpenChange: change =>
            controller.onPanelOpenChange({
              panelId: config.id,
              open: change.open,
            }),
          onItemPress: press =>
            controller.onSelectedValueChange({
              panelId: config.onItemPressPanelId ?? config.id,
              value: press.value,
            }),
          ...(controller.onPositioned === undefined
            ? { positioning: 'static' as const }
            : { onPositioned: controller.onPositioned }),
        }),
    toView: attributes => {
      const h = html<Message>()

      return h.div(
        [...attributes.root, h.Class('relative')],
        [
          config.trigger(attributes),
          h.div(
            [...attributes.portal],
            sidebarDropdownPopup(attributes.popup, config.items, config.label),
          ),
        ],
      )
    },
  })
}

const sidebarDemoTeamSwitcher = <Message>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()

  if (controller === undefined) {
    return Sidebar.SidebarMenu<Message>({
      children: [
        Sidebar.SidebarMenuItem<Message>({
          children: [
            Sidebar.SidebarMenuButton<Message>({
              size: 'lg',
              className:
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
              attributes: [h.AriaExpanded(false), h.AriaHasPopup('menu')],
              children: [
                h.div(
                  [
                    h.Class(
                      'flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground',
                    ),
                  ],
                  [galleryVerticalEndLucideIcon()],
                ),
                h.div(
                  [h.Class('grid flex-1 text-left text-sm leading-tight')],
                  [
                    h.span(
                      [h.Class('truncate font-medium')],
                      [defaultSidebarTeam.name],
                    ),
                    h.span(
                      [h.Class('truncate text-xs')],
                      [defaultSidebarTeam.plan],
                    ),
                  ],
                ),
                chevronsUpDownLucideIcon('ml-auto'),
              ],
            }),
          ],
        }),
      ],
    })
  }

  const activeTeam = sidebarTeamByName(
    sidebarSelectedValue(controller, 'team-switcher', defaultSidebarTeam.name),
  )

  return Sidebar.SidebarMenu<Message>({
    children: [
      Sidebar.SidebarMenuItem<Message>({
        children: [
          sidebarDropdown<Message>({
            id: 'team-switcher',
            controller,
            label: 'Teams',
            contentClassName: 'min-w-56 rounded-lg',
            items: [
              ...sidebarDemoData.teams.map((team, index) => ({
                value: team.name,
                label: team.name,
                icon: team.logo,
                shortcut: `⌘${index + 1}`,
              })),
              {
                value: 'add-team',
                label: 'Add team',
                icon: (className?: string) => icon('plus', className),
                isDisabled: true,
              },
            ],
            trigger: attributes =>
              Sidebar.SidebarMenuButton<Message>({
                size: 'lg',
                className:
                  'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                attributes: [...attributes.trigger],
                children: [
                  h.div(
                    [
                      h.Class(
                        'flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground',
                      ),
                    ],
                    [activeTeam.logo()],
                  ),
                  h.div(
                    [h.Class('grid flex-1 text-left text-sm leading-tight')],
                    [
                      h.span(
                        [h.Class('truncate font-medium')],
                        [activeTeam.name],
                      ),
                      h.span([h.Class('truncate text-xs')], [activeTeam.plan]),
                    ],
                  ),
                  chevronsUpDownLucideIcon('ml-auto'),
                ],
              }),
          }),
        ],
      }),
    ],
  })
}

const sidebarDemoNavMain = <Message>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()

  return Sidebar.SidebarGroup<Message>({
    children: [
      Sidebar.SidebarGroupLabel<Message>({ children: ['Platform'] }),
      Sidebar.SidebarMenu<Message>({
        children: sidebarDemoData.navMain.map(item => {
          const defaultOpen = item.isActive ?? false
          const panel =
            controller === undefined && item.isActive !== true
              ? undefined
              : {
                  id:
                    controller === undefined
                      ? 'base-ui-_r_0_'
                      : `sidebar-demo-${item.title.toLowerCase()}-panel`,
                  label: `${item.title} navigation`,
                }

          return Collapsible.view<Message>({
            open:
              controller === undefined
                ? defaultOpen
                : sidebarPanelIsOpen(
                    controller,
                    `nav-main:${item.title}`,
                    defaultOpen,
                  ),
            className: 'group/collapsible',
            panel,
            ...(controller === undefined
              ? {}
              : {
                  onOpenChange: change =>
                    controller.onPanelOpenChange({
                      panelId: `nav-main:${item.title}`,
                      open: change.open,
                    }),
                }),
            toView: attributes =>
              h.div(
                [...attributes.root],
                [
                  Sidebar.SidebarMenuItem<Message>({
                    children: [
                      h.button(
                        [
                          ...attributes.trigger,
                          h.DataAttribute('sidebar', 'menu-button'),
                          h.DataAttribute('size', 'default'),
                          h.Class(Sidebar.sidebarMenuButtonClassName()),
                          h.Attribute('aria-disabled', 'false'),
                          h.Tabindex(0),
                        ],
                        [
                          sidebarDemoNavIcon(item.iconName),
                          h.span([], [item.title]),
                          chevronRightLucideIcon(
                            'ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90',
                          ),
                        ],
                      ),
                      sidebarTooltip(item.title),
                      attributes.panel.isMounted
                        ? h.div(
                            [
                              ...attributes.panel.root,
                              h.Attribute(
                                'style',
                                '--collapsible-panel-height: auto; --collapsible-panel-width: auto; animation-name: none;',
                              ),
                            ],
                            [
                              Sidebar.SidebarMenuSub<never>({
                                children: item.items.map(subItem =>
                                  Sidebar.SidebarMenuSubItem<never>({
                                    children: [
                                      subButton(subItem, { href: '#' }),
                                    ],
                                  }),
                                ),
                              }),
                            ],
                          )
                        : h.empty,
                    ],
                  }),
                ],
              ),
          })
        }),
      }),
    ],
  })
}

const sidebarDemoProjects = <Message>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()

  return Sidebar.SidebarGroup<Message>({
    className: 'group-data-[collapsible=icon]:hidden',
    children: [
      Sidebar.SidebarGroupLabel<Message>({ children: ['Projects'] }),
      Sidebar.SidebarMenu<Message>({
        children: [
          ...sidebarDemoData.projects.map(project =>
            Sidebar.SidebarMenuItem<Message>({
              children: [
                Sidebar.SidebarMenuButton<Message>({
                  href: '#',
                  children: [project.icon(), h.span([], [project.name])],
                }),
                controller === undefined
                  ? Sidebar.SidebarMenuAction<Message>({
                      showOnHover: true,
                      attributes: [
                        h.AriaExpanded(false),
                        h.AriaHasPopup('menu'),
                      ],
                      children: [
                        moreHorizontalLucideIcon(),
                        h.span([h.Class('sr-only')], ['More']),
                      ],
                    })
                  : sidebarDropdown<Message>({
                      id: `project-actions:${project.name}`,
                      controller,
                      contentClassName: 'w-48 rounded-lg',
                      items: [
                        { value: 'view-project', label: 'View Project' },
                        { value: 'share-project', label: 'Share Project' },
                        { value: 'delete-project', label: 'Delete Project' },
                      ],
                      trigger: attributes =>
                        Sidebar.SidebarMenuAction<Message>({
                          showOnHover: true,
                          className: 'z-10',
                          attributes: [...attributes.trigger],
                          children: [
                            moreHorizontalLucideIcon(),
                            h.span(
                              [h.Class('sr-only')],
                              [`More ${project.name}`],
                            ),
                          ],
                        }),
                    }),
              ],
            }),
          ),
          Sidebar.SidebarMenuItem<Message>({
            children: [
              Sidebar.SidebarMenuButton<Message>({
                className: 'text-sidebar-foreground/70',
                children: [
                  moreHorizontalLucideIcon('text-sidebar-foreground/70'),
                  h.span([], ['More']),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

const sidebarDemoUser = <Message>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()

  if (controller === undefined) {
    return Sidebar.SidebarMenu<Message>({
      children: [
        Sidebar.SidebarMenuItem<Message>({
          children: [
            Sidebar.SidebarMenuButton<Message>({
              size: 'lg',
              className:
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
              attributes: [h.AriaExpanded(false), h.AriaHasPopup('menu')],
              children: [
                demoAvatar(),
                h.div(
                  [h.Class('grid flex-1 text-left text-sm leading-tight')],
                  [
                    h.span(
                      [h.Class('truncate font-medium')],
                      [sidebarDemoData.user.name],
                    ),
                    h.span(
                      [h.Class('truncate text-xs')],
                      [sidebarDemoData.user.email],
                    ),
                  ],
                ),
                chevronsUpDownLucideIcon('ml-auto size-4'),
              ],
            }),
          ],
        }),
      ],
    })
  }

  return Sidebar.SidebarMenu<Message>({
    children: [
      Sidebar.SidebarMenuItem<Message>({
        children: [
          sidebarDropdown<Message>({
            id: 'user-menu',
            controller,
            contentClassName: 'min-w-56 rounded-lg',
            side: 'right',
            align: 'end',
            items: [
              { value: 'upgrade', label: 'Upgrade to Pro' },
              { value: 'account', label: 'Account' },
              { value: 'billing', label: 'Billing' },
              { value: 'notifications', label: 'Notifications' },
              { value: 'log-out', label: 'Log out' },
            ],
            trigger: attributes =>
              Sidebar.SidebarMenuButton<Message>({
                size: 'lg',
                className:
                  'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                attributes: [...attributes.trigger],
                children: [
                  demoAvatar(),
                  h.div(
                    [h.Class('grid flex-1 text-left text-sm leading-tight')],
                    [
                      h.span(
                        [h.Class('truncate font-medium')],
                        [sidebarDemoData.user.name],
                      ),
                      h.span(
                        [h.Class('truncate text-xs')],
                        [sidebarDemoData.user.email],
                      ),
                    ],
                  ),
                  chevronsUpDownLucideIcon('ml-auto size-4'),
                ],
              }),
          }),
        ],
      }),
    ],
  })
}

const sidebarToggleAttributes = <Message>(
  controller?: SidebarController<Message>,
): ReadonlyArray<Attribute<Message>> => {
  if (controller === undefined) {
    return []
  }

  const h = html<Message>()

  return [h.OnClick(controller.onOpenChange({ open: !controller.open }))]
}

const sidebarTrigger = <Message>(
  controller?: SidebarController<Message>,
  config: Readonly<{ className?: string }> = {},
): Html =>
  Sidebar.SidebarTrigger<Message>({
    ...config,
    attributes: sidebarToggleAttributes(controller),
  })

const sidebarRail = <Message>(
  controller?: SidebarController<Message>,
  config: Readonly<{ dir?: string }> = {},
): Html =>
  Sidebar.SidebarRail<Message>({
    ...config,
    attributes: sidebarToggleAttributes(controller),
  })

const controlledShell = <Message>(
  config: Readonly<{
    id: string
    open: boolean
    sidebarChildren: ReadonlyArray<Html>
    insetChildren: ReadonlyArray<Html>
  }>,
): Html =>
  Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: config.id,
        open: config.open,
        children: config.sidebarChildren,
      }),
      Sidebar.SidebarInset<Message>({
        children: config.insetChildren,
      }),
    ],
  })

export const SidebarDemo = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()

  return Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: 'sidebar-demo',
        open: sidebarIsOpen(controller),
        collapsible: 'icon',
        children: [
          Sidebar.SidebarHeader<Message>({
            children: [sidebarDemoTeamSwitcher(controller)],
          }),
          Sidebar.SidebarContent<Message>({
            children: [
              sidebarDemoNavMain(controller),
              sidebarDemoProjects(controller),
            ],
          }),
          Sidebar.SidebarFooter<Message>({
            children: [sidebarDemoUser(controller)],
          }),
          sidebarRail(controller),
        ],
      }),
      Sidebar.SidebarInset<Message>({
        children: [
          h.header(
            [
              h.Class(
                'flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
              ),
            ],
            [
              h.div(
                [h.Class('flex items-center gap-2 px-4')],
                [sidebarTrigger(controller)],
              ),
            ],
          ),
        ],
      }),
    ],
  })
}

export const SidebarControlled = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()
  const isOpen = sidebarIsOpen(controller)

  return controlledShell<Message>({
    id: 'sidebar-controlled',
    open: isOpen,
    sidebarChildren: [
      Sidebar.SidebarContent<Message>({
        children: [
          simpleGroup('Projects', [
            Sidebar.SidebarMenu<Message>({
              children: [
                Sidebar.SidebarMenuItem<Message>({
                  children: [
                    Sidebar.SidebarMenuButton<Message>({
                      href: '#',
                      children: [
                        frameIcon(),
                        h.span([], ['Design Engineering']),
                      ],
                    }),
                  ],
                }),
                Sidebar.SidebarMenuItem<Message>({
                  children: [
                    Sidebar.SidebarMenuButton<Message>({
                      href: '#',
                      children: [
                        pieChartIcon(),
                        h.span([], ['Sales & Marketing']),
                      ],
                    }),
                  ],
                }),
                Sidebar.SidebarMenuItem<Message>({
                  children: [
                    Sidebar.SidebarMenuButton<Message>({
                      href: '#',
                      children: [mapIcon(), h.span([], ['Travel'])],
                    }),
                  ],
                }),
                Sidebar.SidebarMenuItem<Message>({
                  children: [
                    Sidebar.SidebarMenuButton<Message>({
                      href: '#',
                      children: [lifeBuoyIcon(), h.span([], ['Support'])],
                    }),
                  ],
                }),
                Sidebar.SidebarMenuItem<Message>({
                  children: [
                    Sidebar.SidebarMenuButton<Message>({
                      href: '#',
                      children: [sendIcon(), h.span([], ['Feedback'])],
                    }),
                  ],
                }),
              ],
            }),
          ]),
        ],
      }),
    ],
    insetChildren: [
      h.header(
        [h.Class('flex h-12 items-center justify-between px-4')],
        [
          Button.view<Message>({
            variant: 'ghost',
            size: 'sm',
            toView: attributes =>
              h.button(
                [...attributes.button, ...sidebarToggleAttributes(controller)],
                [
                  isOpen ? panelLeftCloseIcon() : panelLeftOpenIcon(),
                  h.span([], [isOpen ? 'Close Sidebar' : 'Open Sidebar']),
                ],
              ),
          }),
        ],
      ),
    ],
  })
}

export const SidebarFooter = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()

  return Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: 'sidebar-footer',
        open: sidebarIsOpen(controller),
        collapsible: 'icon',
        children: [
          Sidebar.SidebarHeader<Message>({ children: [] }),
          Sidebar.SidebarContent<Message>({ children: [] }),
          Sidebar.SidebarFooter<Message>({
            children: [
              Sidebar.SidebarMenu<Message>({
                children: [
                  Sidebar.SidebarMenuItem<Message>({
                    children: [
                      controller === undefined
                        ? Sidebar.SidebarMenuButton<Message>({
                            className:
                              'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                            attributes: [
                              h.AriaExpanded(false),
                              h.AriaHasPopup('menu'),
                            ],
                            children: [
                              'Username',
                              icon('chevronUp', 'ml-auto'),
                            ],
                          })
                        : sidebarDropdown<Message>({
                            id: 'sidebar-footer-user-menu',
                            controller,
                            side: 'top',
                            align: 'end',
                            contentClassName: 'min-w-48 rounded-lg',
                            items: [
                              { value: 'account', label: 'Account' },
                              { value: 'billing', label: 'Billing' },
                              { value: 'sign-out', label: 'Sign out' },
                            ],
                            trigger: attributes =>
                              Sidebar.SidebarMenuButton<Message>({
                                className:
                                  'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                                attributes: [...attributes.trigger],
                                children: [
                                  'Username',
                                  icon('chevronUp', 'ml-auto'),
                                ],
                              }),
                          }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      Sidebar.SidebarInset<Message>({
        children: [
          h.header(
            [h.Class('flex h-12 items-center justify-between px-4')],
            [sidebarTrigger(controller)],
          ),
        ],
      }),
    ],
  })
}

export const SidebarGroupAction = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()

  return Sidebar.SidebarProvider<Message>({
    children: [
      h.div(
        [
          h.DataAttribute('sonner-toaster', ''),
          h.Attribute('position', 'bottom-left'),
          h.Attribute('toastoptions', '[object Object]'),
        ],
        [],
      ),
      Sidebar.Sidebar<Message>({
        id: 'sidebar-group-action',
        open: sidebarIsOpen(controller),
        children: [
          Sidebar.SidebarContent<Message>({
            children: [
              Sidebar.SidebarGroup<Message>({
                children: [
                  Sidebar.SidebarGroupLabel<Message>({
                    children: ['Projects'],
                  }),
                  ' ',
                  Sidebar.SidebarGroupAction<Message>({
                    attributes: [h.Title('Add Project')],
                    children: [
                      icon('plus'),
                      h.span([h.Class('sr-only')], ['Add Project']),
                    ],
                  }),
                  Sidebar.SidebarGroupContent<Message>({
                    children: [
                      Sidebar.SidebarMenu<Message>({
                        children: [
                          Sidebar.SidebarMenuItem<Message>({
                            children: [
                              Sidebar.SidebarMenuButton<Message>({
                                href: '#',
                                children: [
                                  frameIcon(),
                                  h.span([], ['Design Engineering']),
                                ],
                              }),
                            ],
                          }),
                          Sidebar.SidebarMenuItem<Message>({
                            children: [
                              Sidebar.SidebarMenuButton<Message>({
                                href: '#',
                                children: [
                                  pieChartIcon(),
                                  h.span([], ['Sales & Marketing']),
                                ],
                              }),
                            ],
                          }),
                          Sidebar.SidebarMenuItem<Message>({
                            children: [
                              Sidebar.SidebarMenuButton<Message>({
                                href: '#',
                                children: [mapIcon(), h.span([], ['Travel'])],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export const SidebarGroupCollapsible = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()
  const panelId = 'group:help'
  const open = sidebarPanelIsOpen(controller, panelId, true)

  return Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: 'sidebar-group-collapsible',
        open: sidebarIsOpen(controller),
        children: [
          Sidebar.SidebarContent<Message>({
            children: [
              Collapsible.view<Message>({
                open,
                className: 'group/collapsible',
                panel: {
                  id: 'sidebar-group-collapsible-help',
                  label: 'Help',
                },
                ...(controller === undefined
                  ? {}
                  : {
                      onOpenChange: change =>
                        controller.onPanelOpenChange({
                          panelId,
                          open: change.open,
                        }),
                    }),
                toView: attributes =>
                  h.div(
                    [...attributes.root],
                    [
                      Sidebar.SidebarGroup<Message>({
                        children: [
                          h.button(
                            [
                              ...attributes.trigger,
                              h.DataAttribute('sidebar', 'group-label'),
                              h.DataAttribute('slot', 'sidebar-group-label'),
                              h.Class(
                                Sidebar.sidebarGroupLabelClassName({
                                  className:
                                    'text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                }),
                              ),
                              h.Attribute('aria-disabled', 'false'),
                              h.Tabindex(0),
                            ],
                            [
                              'Help',
                              icon(
                                'chevronDown',
                                'ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180',
                              ),
                            ],
                          ),
                          attributes.panel.isMounted
                            ? h.div(
                                [
                                  ...attributes.panel.root,
                                  h.Attribute(
                                    'style',
                                    '--collapsible-panel-height: auto; --collapsible-panel-width: auto; animation-name: none;',
                                  ),
                                ],
                                [
                                  Sidebar.SidebarGroupContent<Message>({
                                    children: [
                                      Sidebar.SidebarMenu<Message>({
                                        children: [
                                          Sidebar.SidebarMenuItem<Message>({
                                            children: [
                                              Sidebar.SidebarMenuButton<Message>(
                                                {
                                                  children: [
                                                    lifeBuoyIcon(),
                                                    'Support',
                                                  ],
                                                },
                                              ),
                                            ],
                                          }),
                                          Sidebar.SidebarMenuItem<Message>({
                                            children: [
                                              Sidebar.SidebarMenuButton<Message>(
                                                {
                                                  children: [
                                                    sendIcon(),
                                                    'Feedback',
                                                  ],
                                                },
                                              ),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              )
                            : h.empty,
                        ],
                      }),
                    ],
                  ),
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export const SidebarHeader = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()
  const workspaceItems: ReadonlyArray<SidebarDropdownItem> = [
    { value: 'acme', label: 'Acme Inc' },
    { value: 'evil-rabbit', label: 'Evil Rabbit' },
    { value: 'monsters', label: 'Monsters Inc' },
  ]
  const selectedWorkspace = sidebarSelectedValue(
    controller,
    'sidebar-header-workspace-menu',
    'Select Workspace',
  )
  const workspaceLabel =
    workspaceItems.find(item => item.value === selectedWorkspace)?.label ??
    selectedWorkspace

  return Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: 'sidebar-header',
        open: sidebarIsOpen(controller),
        children: [
          Sidebar.SidebarHeader<Message>({
            children: [
              Sidebar.SidebarMenu<Message>({
                children: [
                  Sidebar.SidebarMenuItem<Message>({
                    children: [
                      controller === undefined
                        ? Sidebar.SidebarMenuButton<Message>({
                            className:
                              'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                            attributes: [
                              h.AriaExpanded(false),
                              h.AriaHasPopup('menu'),
                            ],
                            children: [
                              'Select Workspace',
                              icon('chevronDown', 'ml-auto'),
                            ],
                          })
                        : sidebarDropdown<Message>({
                            id: 'sidebar-header-workspace-menu',
                            controller,
                            contentClassName: 'min-w-48 rounded-lg',
                            items: workspaceItems,
                            trigger: attributes =>
                              Sidebar.SidebarMenuButton<Message>({
                                className:
                                  'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                                attributes: [...attributes.trigger],
                                children: [
                                  workspaceLabel,
                                  icon('chevronDown', 'ml-auto'),
                                ],
                              }),
                          }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      Sidebar.SidebarInset<Message>({
        children: [
          h.header(
            [h.Class('flex h-12 items-center justify-between px-4')],
            [sidebarTrigger(controller)],
          ),
        ],
      }),
    ],
  })
}

export const SidebarMenuAction = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()
  const projects = [
    { name: 'Design Engineering', icon: frameIcon },
    { name: 'Sales & Marketing', icon: pieChartIcon },
    { name: 'Travel', icon: mapIcon },
    { name: 'Support', icon: lifeBuoyIcon },
    { name: 'Feedback', icon: sendIcon },
  ] as const

  return Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: 'sidebar-menu-action',
        open: sidebarIsOpen(controller),
        children: [
          Sidebar.SidebarContent<Message>({
            children: [
              Sidebar.SidebarGroup<Message>({
                children: [
                  Sidebar.SidebarGroupLabel<Message>({
                    children: ['Projects'],
                  }),
                  Sidebar.SidebarGroupContent<Message>({
                    children: [
                      Sidebar.SidebarMenu<Message>({
                        children: projects.map(project =>
                          Sidebar.SidebarMenuItem<Message>({
                            children: [
                              Sidebar.SidebarMenuButton<Message>({
                                href: '#',
                                className:
                                  'group-has-[[data-state=open]]/menu-item:bg-sidebar-accent',
                                children: [
                                  project.icon(),
                                  h.span([], [project.name]),
                                ],
                              }),
                              controller === undefined
                                ? Sidebar.SidebarMenuAction<Message>({
                                    attributes: [
                                      h.AriaExpanded(false),
                                      h.AriaHasPopup('menu'),
                                    ],
                                    children: [
                                      icon('moreHorizontal'),
                                      h.span([h.Class('sr-only')], ['More']),
                                    ],
                                  })
                                : sidebarDropdown<Message>({
                                    id: `menu-action:${project.name}`,
                                    controller,
                                    contentClassName: 'w-44 rounded-lg',
                                    items: [
                                      {
                                        value: 'view-project',
                                        label: 'View Project',
                                      },
                                      {
                                        value: 'share-project',
                                        label: 'Share Project',
                                      },
                                      {
                                        value: 'archive-project',
                                        label: 'Archive Project',
                                      },
                                    ],
                                    trigger: attributes =>
                                      Sidebar.SidebarMenuAction<Message>({
                                        className: 'z-10',
                                        attributes: [...attributes.trigger],
                                        children: [
                                          icon('moreHorizontal'),
                                          h.span(
                                            [h.Class('sr-only')],
                                            [`More ${project.name}`],
                                          ),
                                        ],
                                      }),
                                  }),
                            ],
                          }),
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export const SidebarMenuBadge = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()
  const projects = [
    { name: 'Design Engineering', icon: frameIcon, badge: '24' },
    { name: 'Sales & Marketing', icon: pieChartIcon, badge: '12' },
    { name: 'Travel', icon: mapIcon, badge: '3' },
    { name: 'Support', icon: lifeBuoyIcon, badge: '21' },
    { name: 'Feedback', icon: sendIcon, badge: '8' },
  ] as const

  return Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: 'sidebar-menu-badge',
        open: sidebarIsOpen(controller),
        children: [
          Sidebar.SidebarContent<Message>({
            children: [
              Sidebar.SidebarGroup<Message>({
                children: [
                  Sidebar.SidebarGroupLabel<Message>({
                    children: ['Projects'],
                  }),
                  Sidebar.SidebarGroupContent<Message>({
                    children: [
                      Sidebar.SidebarMenu<Message>({
                        children: projects.map(project =>
                          Sidebar.SidebarMenuItem<Message>({
                            children: [
                              Sidebar.SidebarMenuButton<Message>({
                                href: '#',
                                className:
                                  'group-has-[[data-state=open]]/menu-item:bg-sidebar-accent',
                                children: [
                                  project.icon(),
                                  h.span([], [project.name]),
                                ],
                              }),
                              Sidebar.SidebarMenuBadge<Message>({
                                children: [project.badge],
                              }),
                            ],
                          }),
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export const SidebarMenuCollapsible = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()

  const items = [
    {
      title: 'Getting Started',
      items: ['Installation', 'Project Structure'],
    },
    { title: 'Build Your Application', items: [] },
    { title: 'API Reference', items: [] },
    { title: 'Architecture', items: [] },
  ] as const

  return Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: 'sidebar-menu-collapsible',
        open: sidebarIsOpen(controller),
        children: [
          Sidebar.SidebarContent<Message>({
            children: [
              Sidebar.SidebarGroup<Message>({
                children: [
                  Sidebar.SidebarGroupContent<Message>({
                    children: [
                      Sidebar.SidebarMenu<Message>({
                        children: items.map((item, index) =>
                          Collapsible.view<Message>({
                            open: sidebarPanelIsOpen(
                              controller,
                              `menu:${item.title}`,
                              index === 0,
                            ),
                            className: 'group/collapsible',
                            panel: {
                              id: `sidebar-menu-collapsible-${index}`,
                              label: item.title,
                            },
                            ...(controller === undefined
                              ? {}
                              : {
                                  onOpenChange: change =>
                                    controller.onPanelOpenChange({
                                      panelId: `menu:${item.title}`,
                                      open: change.open,
                                    }),
                                }),
                            toView: attributes =>
                              h.div(
                                [...attributes.root],
                                [
                                  Sidebar.SidebarMenuItem<Message>({
                                    children: [
                                      h.button(
                                        [
                                          ...attributes.trigger,
                                          h.DataAttribute(
                                            'sidebar',
                                            'menu-button',
                                          ),
                                          h.DataAttribute('size', 'default'),
                                          h.Class(
                                            Sidebar.sidebarMenuButtonClassName(),
                                          ),
                                          h.Attribute('aria-disabled', 'false'),
                                          h.Tabindex(0),
                                        ],
                                        [
                                          h.span([], [item.title]),
                                          icon(
                                            'chevronRight',
                                            'ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90',
                                          ),
                                        ],
                                      ),
                                      attributes.panel.isMounted
                                        ? h.div(
                                            [
                                              ...attributes.panel.root,
                                              h.Attribute(
                                                'style',
                                                '--collapsible-panel-height: auto; --collapsible-panel-width: auto; animation-name: none;',
                                              ),
                                            ],
                                            [
                                              Sidebar.SidebarMenuSub<Message>({
                                                children: item.items.map(
                                                  subItem =>
                                                    Sidebar.SidebarMenuSubItem<Message>(
                                                      {
                                                        children: [
                                                          Sidebar.SidebarMenuSubButton<Message>(
                                                            {
                                                              href: '#',
                                                              children: [
                                                                h.span(
                                                                  [],
                                                                  [subItem],
                                                                ),
                                                              ],
                                                            },
                                                          ),
                                                        ],
                                                      },
                                                    ),
                                                ),
                                              }),
                                            ],
                                          )
                                        : h.empty,
                                    ],
                                  }),
                                ],
                              ),
                          }),
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export const SidebarMenuSub = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()

  const items = [
    {
      title: 'Getting Started',
      items: ['Installation', 'Project Structure'],
    },
    {
      title: 'Build Your Application',
      items: [
        'Routing',
        'Data Fetching',
        'Rendering',
        'Caching',
        'Styling',
        'Optimizing',
        'Configuring',
        'Testing',
        'Authentication',
        'Deploying',
        'Upgrading',
        'Examples',
      ],
    },
    {
      title: 'API Reference',
      items: [
        'Components',
        'File Conventions',
        'Functions',
        'next.config.js Options',
        'CLI',
        'Edge Runtime',
      ],
    },
    {
      title: 'Architecture',
      items: [
        'Accessibility',
        'Fast Refresh',
        'Next.js Compiler',
        'Supported Browsers',
        'Turbopack',
      ],
    },
  ] as const

  return Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: 'sidebar-menu-sub',
        open: sidebarIsOpen(controller),
        children: [
          Sidebar.SidebarContent<Message>({
            children: [
              Sidebar.SidebarGroup<Message>({
                children: [
                  Sidebar.SidebarGroupContent<Message>({
                    children: [
                      Sidebar.SidebarMenu<Message>({
                        children: items.map(item =>
                          Sidebar.SidebarMenuItem<Message>({
                            children: [
                              Sidebar.SidebarMenuButton<Message>({
                                href: '#',
                                children: [h.span([], [item.title])],
                              }),
                              Sidebar.SidebarMenuSub<Message>({
                                children: item.items.map(subItem =>
                                  Sidebar.SidebarMenuSubItem<Message>({
                                    children: [
                                      Sidebar.SidebarMenuSubButton<Message>({
                                        href: '#',
                                        children: [h.span([], [subItem])],
                                      }),
                                    ],
                                  }),
                                ),
                              }),
                            ],
                          }),
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export const SidebarMenu = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()
  const projects = [
    { name: 'Design Engineering', icon: frameIcon },
    { name: 'Sales & Marketing', icon: pieChartIcon },
    { name: 'Travel', icon: mapIcon },
    { name: 'Support', icon: lifeBuoyIcon },
    { name: 'Feedback', icon: sendIcon },
  ] as const

  return Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: 'sidebar-menu',
        open: sidebarIsOpen(controller),
        children: [
          Sidebar.SidebarContent<Message>({
            children: [
              Sidebar.SidebarGroup<Message>({
                children: [
                  Sidebar.SidebarGroupLabel<Message>({
                    children: ['Projects'],
                  }),
                  Sidebar.SidebarGroupContent<Message>({
                    children: [
                      Sidebar.SidebarMenu<Message>({
                        children: projects.map(project =>
                          Sidebar.SidebarMenuItem<Message>({
                            children: [
                              Sidebar.SidebarMenuButton<Message>({
                                href: '#',
                                children: [
                                  project.icon(),
                                  h.span([], [project.name]),
                                ],
                              }),
                            ],
                          }),
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export const SidebarRsc = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const widths = ['70%', '63%', '71%', '64%', '61%'] as const

  return Sidebar.SidebarProvider<Message>({
    children: [
      Sidebar.Sidebar<Message>({
        id: 'sidebar-rsc',
        open: sidebarIsOpen(controller),
        children: [
          Sidebar.SidebarContent<Message>({
            children: [
              Sidebar.SidebarGroup<Message>({
                children: [
                  Sidebar.SidebarGroupLabel<Message>({
                    children: ['Projects'],
                  }),
                  Sidebar.SidebarGroupContent<Message>({
                    children: [
                      Sidebar.SidebarMenu<Message>({
                        children: widths.map(width =>
                          Sidebar.SidebarMenuItem<Message>({
                            children: [
                              Sidebar.SidebarMenuSkeleton<Message>({
                                showIcon: true,
                                width,
                              }),
                            ],
                          }),
                        ),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export const SidebarRtl = <Message = never>(
  controller?: SidebarController<Message>,
): Html => {
  const h = html<Message>()
  const team = { name: 'شركة أكمي', plan: 'المؤسسة' }
  const navMain: ReadonlyArray<
    Readonly<{
      title: string
      icon: (className?: string) => Html
      isActive?: boolean
      items: ReadonlyArray<string>
    }>
  > = [
    {
      title: 'ملعب',
      icon: squareTerminalLucideIcon,
      isActive: true,
      items: ['السجل', 'المميز', 'الإعدادات'],
    },
    {
      title: 'النماذج',
      icon: botLucideIcon,
      items: ['جينيسيس', 'إكسبلورر', 'كوانتوم'],
    },
    {
      title: 'التوثيق',
      icon: bookOpenLucideIcon,
      items: ['مقدمة', 'ابدأ', 'الدروس', 'سجل التغييرات'],
    },
    {
      title: 'الإعدادات',
      icon: settings2LucideIcon,
      items: ['عام', 'الفريق', 'الفوترة', 'الحدود'],
    },
  ] as const
  const projects = [
    { name: 'هندسة التصميم', icon: frameLucideIcon },
    { name: 'المبيعات والتسويق', icon: pieChartLucideIcon },
    { name: 'السفر', icon: mapLucideIcon },
  ] as const

  return h.div(
    [h.Class('relative'), h.Dir('rtl')],
    [
      h.span([h.DataAttribute('name', 'language-selector')], ['ar']),
      Sidebar.SidebarProvider<Message>({
        children: [
          Sidebar.Sidebar<Message>({
            id: 'sidebar-rtl',
            open: sidebarIsOpen(controller),
            side: 'right',
            variant: 'floating',
            collapsible: 'icon',
            children: [
              Sidebar.SidebarHeader<Message>({
                children: [
                  Sidebar.SidebarMenu<Message>({
                    children: [
                      Sidebar.SidebarMenuItem<Message>({
                        children: [
                          Sidebar.SidebarMenuButton<Message>({
                            href: '#',
                            size: 'lg',
                            dir: 'rtl',
                            children: [
                              h.div(
                                [
                                  h.Class(
                                    'flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground',
                                  ),
                                ],
                                [galleryVerticalEndLucideIcon()],
                              ),
                              h.div(
                                [h.Class('flex flex-col gap-0.5 leading-none')],
                                [
                                  h.span([h.Class('font-medium')], [team.name]),
                                  h.span(
                                    [h.Attribute('class', '')],
                                    [team.plan],
                                  ),
                                ],
                              ),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              Sidebar.SidebarContent<Message>({
                children: [
                  Sidebar.SidebarGroup<Message>({
                    children: [
                      Sidebar.SidebarGroupLabel<Message>({
                        children: ['المنصة'],
                      }),
                      Sidebar.SidebarMenu<Message>({
                        children: navMain.map(item =>
                          Collapsible.view<never>({
                            open: item.isActive ?? false,
                            className: 'group/collapsible',
                            panel:
                              item.isActive === true
                                ? { id: 'base-ui-_r_0_', label: item.title }
                                : undefined,
                            toView: attributes =>
                              h.div(
                                [...attributes.root],
                                [
                                  Sidebar.SidebarMenuItem<never>({
                                    children: [
                                      h.button(
                                        [
                                          ...attributes.trigger,
                                          h.DataAttribute(
                                            'sidebar',
                                            'menu-button',
                                          ),
                                          h.DataAttribute('size', 'default'),
                                          h.Class(
                                            Sidebar.sidebarMenuButtonClassName({
                                              dir: 'rtl',
                                            }),
                                          ),
                                          h.Attribute('aria-disabled', 'false'),
                                          h.Tabindex(0),
                                        ],
                                        [
                                          item.icon(),
                                          h.span([], [item.title]),
                                          chevronRightLucideIcon(
                                            'ms-auto transition-transform duration-200 group-data-open/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-open/collapsible:rotate-90',
                                          ),
                                        ],
                                      ),
                                      sidebarTooltip(item.title),
                                      attributes.panel.isMounted
                                        ? h.div(
                                            [
                                              ...attributes.panel.root,
                                              h.Attribute(
                                                'style',
                                                '--collapsible-panel-height: auto; --collapsible-panel-width: auto; animation-name: none;',
                                              ),
                                            ],
                                            [
                                              Sidebar.SidebarMenuSub<never>({
                                                dir: 'rtl',
                                                children: item.items.map(
                                                  subItem =>
                                                    Sidebar.SidebarMenuSubItem<never>(
                                                      {
                                                        children: [
                                                          Sidebar.SidebarMenuSubButton<never>(
                                                            {
                                                              href: '#',
                                                              dir: 'rtl',
                                                              children: [
                                                                h.span(
                                                                  [],
                                                                  [subItem],
                                                                ),
                                                              ],
                                                            },
                                                          ),
                                                        ],
                                                      },
                                                    ),
                                                ),
                                              }),
                                            ],
                                          )
                                        : h.empty,
                                    ],
                                  }),
                                ],
                              ),
                          }),
                        ),
                      }),
                    ],
                  }),
                  Sidebar.SidebarGroup<Message>({
                    className: 'group-data-[collapsible=icon]:hidden',
                    children: [
                      Sidebar.SidebarGroupLabel<Message>({
                        children: ['المشاريع'],
                      }),
                      Sidebar.SidebarMenu<Message>({
                        children: [
                          ...projects.map(project =>
                            Sidebar.SidebarMenuItem<Message>({
                              children: [
                                Sidebar.SidebarMenuButton<Message>({
                                  href: '#',
                                  dir: 'rtl',
                                  children: [
                                    project.icon(),
                                    h.span([], [project.name]),
                                  ],
                                }),
                                Sidebar.SidebarMenuAction<Message>({
                                  showOnHover: true,
                                  dir: 'rtl',
                                  attributes: [
                                    h.AriaExpanded(false),
                                    h.AriaHasPopup('menu'),
                                  ],
                                  children: [
                                    moreHorizontalLucideIcon(),
                                    h.span([h.Class('sr-only')], ['المزيد']),
                                  ],
                                }),
                              ],
                            }),
                          ),
                          Sidebar.SidebarMenuItem<Message>({
                            children: [
                              Sidebar.SidebarMenuButton<Message>({
                                dir: 'rtl',
                                className: 'text-sidebar-foreground/70',
                                children: [
                                  moreHorizontalLucideIcon(
                                    'text-sidebar-foreground/70',
                                  ),
                                  h.span([], ['المزيد']),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              Sidebar.SidebarFooter<Message>({
                children: [
                  Sidebar.SidebarMenu<Message>({
                    children: [
                      Sidebar.SidebarMenuItem<Message>({
                        children: [
                          Sidebar.SidebarMenuButton<Message>({
                            size: 'lg',
                            dir: 'rtl',
                            className:
                              'data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground',
                            attributes: [
                              h.AriaExpanded(false),
                              h.AriaHasPopup('menu'),
                            ],
                            children: [
                              rtlDemoAvatar(),
                              h.div(
                                [
                                  h.Class(
                                    'grid flex-1 text-start text-sm leading-tight',
                                  ),
                                ],
                                [
                                  h.span(
                                    [h.Class('truncate font-medium')],
                                    ['shadcn'],
                                  ),
                                  h.span(
                                    [h.Class('truncate text-xs')],
                                    ['m@example.com'],
                                  ),
                                ],
                              ),
                              chevronsUpDownLucideIcon('ms-auto size-4'),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              sidebarRail(controller, { dir: 'rtl' }),
            ],
          }),
          Sidebar.SidebarInset<Message>({
            dir: 'rtl',
            children: [
              h.header(
                [
                  h.Dir('rtl'),
                  h.Class(
                    'flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
                  ),
                ],
                [
                  h.div(
                    [h.Class('flex items-center gap-2 px-4')],
                    [sidebarTrigger(controller)],
                  ),
                ],
              ),
            ],
          }),
        ],
      }),
    ],
  )
}
