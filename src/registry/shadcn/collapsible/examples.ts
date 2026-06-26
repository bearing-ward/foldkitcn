import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Collapsible } from './index'

type FileTreeItem = Readonly<
  | { name: string; kind: 'file' }
  | { name: string; kind: 'folder'; items: ReadonlyArray<FileTreeItem> }
>

const card = (children: ReadonlyArray<Html>): Html => {
  const h = html<never>()

  return h.div(
    [
      h.Class(
        'bg-card text-card-foreground mx-auto flex w-full max-w-sm flex-col gap-6 rounded-xl border py-6 shadow-sm',
      ),
    ],
    [h.div([h.Class('px-6')], children)],
  )
}

const buttonClassName = (className: string): string =>
  [
    'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
    className,
  ].join(' ')

const chevronsIcon = (): Html => {
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
    [h.path([h.D('m7 15 5 5 5-5')], []), h.path([h.D('m7 9 5-5 5 5')], [])],
  )
}

const chevronRightIcon = (): Html => {
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
    [h.path([h.D('m9 18 6-6-6-6')], [])],
  )
}

const fileIcon = (): Html => {
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
    [
      h.path(
        [h.D('M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z')],
        [],
      ),
      h.path([h.D('M14 2v4a2 2 0 0 0 2 2h4')], []),
    ],
  )
}

const folderIcon = (): Html => {
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
    [
      h.path(
        [
          h.D(
            'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z',
          ),
        ],
        [],
      ),
    ],
  )
}

export const CollapsibleDemo = (): Html => {
  const h = html<never>()

  return Collapsible<never>({
    open: false,
    className: 'flex w-[350px] flex-col gap-2',
    panel: {
      id: 'order-details',
      label: 'Order details',
    },
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.div(
            [h.Class('flex items-center justify-between gap-4 px-4')],
            [
              h.h4([h.Class('text-sm font-semibold')], ['Order #4189']),
              h.button(
                [
                  ...attributes.trigger,
                  h.Class(buttonClassName('size-8 bg-transparent p-0')),
                ],
                [
                  chevronsIcon(),
                  h.span([h.Class('sr-only')], ['Toggle details']),
                ],
              ),
            ],
          ),
          h.div(
            [
              h.Class(
                'flex items-center justify-between rounded-md border px-4 py-2 text-sm',
              ),
            ],
            [
              h.span([h.Class('text-muted-foreground')], ['Status']),
              h.span([h.Class('font-medium')], ['Shipped']),
            ],
          ),
          attributes.panel.isMounted
            ? h.keyed('div')(
                attributes.panel.isOpen ? 'open' : 'closed',
                [...attributes.panel.root, h.Class('flex flex-col gap-2')],
                [
                  h.div(
                    [h.Class('rounded-md border px-4 py-2 text-sm')],
                    [
                      h.p([h.Class('font-medium')], ['Shipping address']),
                      h.p(
                        [h.Class('text-muted-foreground')],
                        ['100 Market St, San Francisco'],
                      ),
                    ],
                  ),
                  h.div(
                    [h.Class('rounded-md border px-4 py-2 text-sm')],
                    [
                      h.p([h.Class('font-medium')], ['Items']),
                      h.p(
                        [h.Class('text-muted-foreground')],
                        ['2x Studio Headphones'],
                      ),
                    ],
                  ),
                ],
              )
            : h.empty,
        ],
      ),
  })
}

export const CollapsibleBasic = (): Html => {
  const h = html<never>()

  return card([
    Collapsible<never>({
      open: true,
      className: 'rounded-md data-open:bg-muted',
      panel: {
        id: 'product-details',
        label:
          'This panel can be expanded or collapsed to reveal additional content.',
      },
      triggerClassName: buttonClassName('w-full bg-transparent px-3 py-2'),
      contentClassName: 'flex flex-col items-start gap-2 p-2.5 pt-0 text-sm',
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button(
              [...attributes.trigger],
              [
                'Product details',
                h.span(
                  [h.Class('ml-auto group-data-panel-open/button:rotate-180')],
                  [chevronRightIcon()],
                ),
              ],
            ),
            attributes.panel.isMounted
              ? h.keyed('div')(
                  attributes.panel.isOpen ? 'open' : 'closed',
                  [...attributes.panel.root],
                  [
                    h.div(
                      [],
                      [
                        'This panel can be expanded or collapsed to reveal additional content.',
                      ],
                    ),
                    h.button(
                      [h.Class(buttonClassName('h-7 px-2 text-xs'))],
                      ['Learn More'],
                    ),
                  ],
                )
              : h.empty,
          ],
        ),
    }),
  ])
}

export const CollapsibleSettings = (): Html => {
  const h = html<never>()

  return Collapsible<never>({
    open: true,
    className: 'flex w-[320px] flex-col gap-4 rounded-lg border p-4',
    panel: {
      id: 'radius-settings',
      label: 'Radius settings',
    },
    contentClassName: 'grid gap-3',
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.div(
            [h.Class('flex items-center justify-between')],
            [
              h.div(
                [],
                [
                  h.h4([h.Class('text-sm font-medium')], ['Radius']),
                  h.p(
                    [h.Class('text-muted-foreground text-sm')],
                    ['Set the corner radius of the element.'],
                  ),
                ],
              ),
              h.button(
                [
                  ...attributes.trigger,
                  h.Class(buttonClassName('size-8 bg-transparent p-0')),
                ],
                [chevronsIcon(), h.span([h.Class('sr-only')], ['Toggle'])],
              ),
            ],
          ),
          attributes.panel.isMounted
            ? h.keyed('div')(
                attributes.panel.isOpen ? 'open' : 'closed',
                [...attributes.panel.root],
                [
                  h.label(
                    [h.Class('grid gap-1 text-sm')],
                    [
                      'Radius X',
                      h.input([
                        h.Type('number'),
                        h.Value('8'),
                        h.Class(
                          'h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm',
                        ),
                      ]),
                    ],
                  ),
                  h.label(
                    [h.Class('grid gap-1 text-sm')],
                    [
                      'Radius Y',
                      h.input([
                        h.Type('number'),
                        h.Value('8'),
                        h.Class(
                          'h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm',
                        ),
                      ]),
                    ],
                  ),
                ],
              )
            : h.empty,
        ],
      ),
  })
}

const fileTree: ReadonlyArray<FileTreeItem> = [
  {
    name: 'components',
    kind: 'folder',
    items: [
      {
        name: 'ui',
        kind: 'folder',
        items: [
          { name: 'button.tsx', kind: 'file' },
          { name: 'card.tsx', kind: 'file' },
          { name: 'dialog.tsx', kind: 'file' },
        ],
      },
      { name: 'login-form.tsx', kind: 'file' },
    ],
  },
  {
    name: 'lib',
    kind: 'folder',
    items: [{ name: 'utils.ts', kind: 'file' }],
  },
  { name: 'package.json', kind: 'file' },
]

const fileTreeItem = (item: FileTreeItem): Html => {
  const h = html<never>()

  if (item.kind === 'file') {
    return h.button(
      [
        h.Class(
          buttonClassName(
            'h-8 w-full justify-start gap-2 bg-transparent px-2 text-foreground',
          ),
        ),
      ],
      [fileIcon(), h.span([], [item.name])],
    )
  }

  return Collapsible<never>({
    open: item.name === 'components',
    panel: {
      id: `${item.name}-folder`,
      label: item.name,
      keepMounted: true,
    },
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.button(
            [
              ...attributes.trigger,
              h.Class(
                buttonClassName(
                  'group w-full justify-start gap-2 bg-transparent px-2 transition-none hover:bg-accent hover:text-accent-foreground',
                ),
              ),
            ],
            [
              h.span(
                [
                  h.Class(
                    'transition-transform group-data-panel-open/button:rotate-90',
                  ),
                ],
                [chevronRightIcon()],
              ),
              folderIcon(),
              item.name,
            ],
          ),
          attributes.panel.isMounted
            ? h.keyed('div')(
                attributes.panel.isOpen ? 'open' : 'closed',
                [...attributes.panel.root, h.Class('mt-1 ml-5')],
                [
                  h.div(
                    [h.Class('flex flex-col gap-1')],
                    item.items.map(child => fileTreeItem(child)),
                  ),
                ],
              )
            : h.empty,
        ],
      ),
  })
}

export const CollapsibleFileTree = (): Html => {
  const h = html<never>()

  return h.div(
    [
      h.Class(
        'bg-card text-card-foreground mx-auto flex w-full max-w-[16rem] flex-col gap-2 rounded-xl border p-4 shadow-sm',
      ),
    ],
    [
      h.div(
        [h.Class('mb-2 grid grid-cols-2 gap-1 rounded-lg bg-muted p-[3px]')],
        [
          h.button(
            [h.Class('rounded-md bg-background px-2 py-1 text-sm')],
            ['Explorer'],
          ),
          h.button([h.Class('rounded-md px-2 py-1 text-sm')], ['Outline']),
        ],
      ),
      h.div([h.Class('flex flex-col gap-1')], fileTree.map(fileTreeItem)),
    ],
  )
}

export const CollapsibleRtl = (): Html =>
  Collapsible<never>({
    open: false,
    dir: 'rtl',
    className: 'flex w-[350px] flex-col gap-2',
    panel: {
      id: 'rtl-order-details',
      label: 'Order details',
    },
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          h.div(
            [h.Class('flex items-center justify-between gap-4 px-4')],
            [
              h.h4([h.Class('text-sm font-semibold')], ['Order #4189']),
              h.button(
                [
                  ...attributes.trigger,
                  h.Class(buttonClassName('size-8 bg-transparent p-0')),
                ],
                [
                  chevronsIcon(),
                  h.span([h.Class('sr-only')], ['Toggle details']),
                ],
              ),
            ],
          ),
          h.div(
            [
              h.Class(
                'flex items-center justify-between rounded-md border px-4 py-2 text-sm',
              ),
            ],
            [
              h.span([h.Class('text-muted-foreground')], ['Status']),
              h.span([h.Class('font-medium')], ['Shipped']),
            ],
          ),
        ],
      )
    },
  })
