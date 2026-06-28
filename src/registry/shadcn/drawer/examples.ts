import { Array } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Drawer } from './index'
import type { DrawerDirection } from './index'

const buttonClassName = (className: string): string =>
  [
    'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
    className,
  ].join(' ')

const icon = (path: string): Html => {
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

const minusIcon = (): Html => icon('M5 12h14')

const plusIcon = (): Html => icon('M5 12h14M12 5v14')

const paragraphText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const chartData: ReadonlyArray<number> = [
  400, 300, 200, 300, 200, 278, 189, 239, 300, 200, 278, 189, 349,
]

const chart = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('mt-3 flex h-[120px] items-end gap-1')],
    chartData.map((goal, index) =>
      h.div(
        [
          h.Class('flex-1 rounded-sm bg-primary/80'),
          h.Style({ height: `${Math.round(goal / 4)}%` }),
          h.AriaLabel(`Goal sample ${index + 1}`),
        ],
        [],
      ),
    ),
  )
}

const goalControls = (
  labels: Readonly<{
    caloriesPerDay: string
    decrease: string
    goal: string
    increase: string
  }>,
): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('p-4 pb-0')],
    [
      h.div(
        [h.Class('flex items-center justify-center space-x-2')],
        [
          h.button(
            [
              h.Type('button'),
              h.Class(
                buttonClassName('h-8 w-8 shrink-0 rounded-full border-border'),
              ),
            ],
            [minusIcon(), h.span([h.Class('sr-only')], [labels.decrease])],
          ),
          h.div(
            [h.Class('flex-1 text-center')],
            [
              h.div(
                [h.Class('text-7xl font-bold tracking-tighter')],
                [labels.goal],
              ),
              h.div(
                [h.Class('text-[0.70rem] text-muted-foreground uppercase')],
                [labels.caloriesPerDay],
              ),
            ],
          ),
          h.button(
            [
              h.Type('button'),
              h.Class(
                buttonClassName('h-8 w-8 shrink-0 rounded-full border-border'),
              ),
            ],
            [plusIcon(), h.span([h.Class('sr-only')], [labels.increase])],
          ),
        ],
      ),
      chart(),
    ],
  )
}

const footerButtons = (
  labels: Readonly<{ cancel: string; submit: string }>,
): ReadonlyArray<Html> => {
  const h = html<never>()

  return [
    h.button(
      [
        h.Class(
          buttonClassName('bg-primary text-primary-foreground px-2.5 h-8'),
        ),
      ],
      [labels.submit],
    ),
    h.button(
      [h.Class(buttonClassName('border-border bg-background px-2.5 h-8'))],
      [labels.cancel],
    ),
  ]
}

const drawerShell = (
  config: Readonly<{
    id: string
    trigger: string
    title: string
    description: string
    direction?: DrawerDirection
    dir?: string
    lang?: string
    contentClassName?: string
    headerClassName?: string
    body?: ReadonlyArray<Html>
    footer?: ReadonlyArray<Html>
  }>,
): Html => {
  const h = html<never>()

  return Drawer<never>({
    id: config.id,
    open: true,
    titleId: `${config.id}-title`,
    descriptionId: `${config.id}-description`,
    direction: config.direction,
    dir: config.dir,
    contentClassName: config.contentClassName,
    headerClassName: config.headerClassName,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.button(
            [
              ...attributes.trigger,
              h.Class(
                buttonClassName('border-border bg-background px-2.5 h-8'),
              ),
            ],
            [config.trigger],
          ),
          h.dialog(
            [...attributes.dialog],
            [
              h.div([...attributes.backdrop.root], []),
              h.div(
                [
                  ...attributes.popup.root,
                  ...(config.lang === undefined
                    ? []
                    : [h.DataAttribute('lang', config.lang)]),
                ],
                [
                  h.div([...attributes.handle], []),
                  h.div(
                    [...attributes.header],
                    [
                      h.h2([...attributes.title], [config.title]),
                      h.p([...attributes.description], [config.description]),
                    ],
                  ),
                  ...(config.body ?? []),
                  config.footer === undefined
                    ? h.empty
                    : h.div([...attributes.footer], config.footer),
                ],
              ),
            ],
          ),
        ],
      ),
  })
}

const scrollableBody = (): ReadonlyArray<Html> => {
  const h = html<never>()

  return [
    h.div(
      [h.Class('no-scrollbar overflow-y-auto px-4')],
      Array.makeBy(10, index =>
        h.p(
          [h.Class('mb-4 leading-normal')],
          [`${paragraphText} ${index + 1}`],
        ),
      ),
    ),
  ]
}

export const DrawerDemo = (): Html => {
  const h = html<never>()

  return drawerShell({
    id: 'drawer-demo',
    trigger: 'Open Drawer',
    title: 'Move Goal',
    description: 'Set your daily activity goal.',
    body: [
      h.div(
        [h.Class('mx-auto w-full max-w-sm')],
        [
          goalControls({
            caloriesPerDay: 'Calories/day',
            decrease: 'Decrease',
            goal: '350',
            increase: 'Increase',
          }),
        ],
      ),
    ],
    footer: footerButtons({ cancel: 'Cancel', submit: 'Submit' }),
  })
}

export const DrawerScrollableContent = (): Html =>
  drawerShell({
    id: 'drawer-scrollable-content',
    trigger: 'Scrollable Content',
    title: 'Move Goal',
    description: 'Set your daily activity goal.',
    direction: 'right',
    body: scrollableBody(),
    footer: footerButtons({ cancel: 'Cancel', submit: 'Submit' }),
  })

const drawerDirections: ReadonlyArray<DrawerDirection> = [
  'top',
  'right',
  'bottom',
  'left',
]

export const DrawerWithSides = (): Html => {
  const localHtml = html<never>()

  return localHtml.div(
    [localHtml.Class('flex flex-wrap gap-2')],
    drawerDirections.map(direction =>
      drawerShell({
        id: `drawer-${direction}`,
        trigger: direction,
        title: 'Move Goal',
        description: 'Set your daily activity goal.',
        direction,
        contentClassName:
          'data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]',
        body: scrollableBody(),
        footer: footerButtons({ cancel: 'Cancel', submit: 'Submit' }),
      }),
    ),
  )
}

export const DrawerRtl = (): Html =>
  drawerShell({
    id: 'drawer-rtl',
    trigger: 'فتح الدرج',
    title: 'نقل الهدف',
    description: 'حدد هدف نشاطك اليومي.',
    dir: 'rtl',
    lang: 'ar',
    body: [
      goalControls({
        caloriesPerDay: 'سعرات حرارية/يوم',
        decrease: 'تقليل',
        goal: '٣٥٠',
        increase: 'زيادة',
      }),
    ],
    footer: footerButtons({ cancel: 'إلغاء', submit: 'إرسال' }),
  })
