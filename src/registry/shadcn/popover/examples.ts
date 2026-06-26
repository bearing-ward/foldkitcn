import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type { PopoverAlign, PopoverSide } from './index'
import { view as Popover } from './index'

const buttonClassName = (className: string): string =>
  [
    'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
    className,
  ].join(' ')

const inputClassName =
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40'

const popoverShell = (
  config: Readonly<{
    id: string
    trigger: string
    title: string
    description: string
    side?: PopoverSide
    align?: PopoverAlign
    contentClassName?: string
    dir?: string
    body?: ReadonlyArray<Html>
  }>,
): Html => {
  const h = html<never>()

  return Popover<never>({
    id: config.id,
    open: true,
    side: config.side,
    align: config.align,
    dir: config.dir,
    contentClassName: config.contentClassName,
    titleId: `${config.id}-title`,
    descriptionId: `${config.id}-description`,
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
          h.div(
            [...attributes.portal],
            [
              h.div([...attributes.backdrop.root], []),
              h.div(
                [...attributes.positioner.root],
                [
                  h.div(
                    [...attributes.popup.root],
                    [
                      h.div(
                        [...attributes.header],
                        [
                          h.h4([...attributes.title], [config.title]),
                          h.p(
                            [...attributes.description],
                            [config.description],
                          ),
                        ],
                      ),
                      ...(config.body ?? []),
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

const dimensionFields = (): ReadonlyArray<Html> => {
  const h = html<never>()
  const fields: ReadonlyArray<
    Readonly<{ id: string; label: string; value: string }>
  > = [
    { id: 'width', label: 'Width', value: '100%' },
    { id: 'maxWidth', label: 'Max. width', value: '300px' },
    { id: 'height', label: 'Height', value: '25px' },
    { id: 'maxHeight', label: 'Max. height', value: 'none' },
  ]

  return [
    h.div(
      [h.Class('grid gap-2')],
      fields.map(field =>
        h.div(
          [h.Class('grid grid-cols-3 items-center gap-4')],
          [
            h.label([h.Attribute('for', field.id)], [field.label]),
            h.input([
              h.Id(field.id),
              h.Value(field.value),
              h.Class(`${inputClassName} col-span-2 h-8`),
            ]),
          ],
        ),
      ),
    ),
  ]
}

const compactFields = (): ReadonlyArray<Html> => {
  const h = html<never>()

  return [
    h.div(
      [h.Class('grid gap-4')],
      [
        h.div(
          [h.Class('grid grid-cols-2 items-center gap-4')],
          [
            h.label([h.Attribute('for', 'width')], ['Width']),
            h.input([h.Id('width'), h.Value('100%'), h.Class(inputClassName)]),
          ],
        ),
        h.div(
          [h.Class('grid grid-cols-2 items-center gap-4')],
          [
            h.label([h.Attribute('for', 'height')], ['Height']),
            h.input([h.Id('height'), h.Value('25px'), h.Class(inputClassName)]),
          ],
        ),
      ],
    ),
  ]
}

export const PopoverBasic = (): Html =>
  popoverShell({
    id: 'popover-basic',
    trigger: 'Open Popover',
    title: 'Dimensions',
    description: 'Set the dimensions for the layer.',
    align: 'start',
  })

export const PopoverDemo = (): Html => {
  const h = html<never>()

  return popoverShell({
    id: 'popover-demo',
    trigger: 'Open popover',
    title: 'Dimensions',
    description: 'Set the dimensions for the layer.',
    contentClassName: 'w-80',
    body: [
      h.div(
        [h.Class('grid gap-4')],
        [h.div([h.Class('space-y-2')], []), ...dimensionFields()],
      ),
    ],
  })
}

export const PopoverForm = (): Html =>
  popoverShell({
    id: 'popover-form',
    trigger: 'Open Popover',
    title: 'Dimensions',
    description: 'Set the dimensions for the layer.',
    align: 'start',
    contentClassName: 'w-64',
    body: compactFields(),
  })

const alignmentPopover = (align: PopoverAlign, trigger: string): Html =>
  popoverShell({
    id: `popover-align-${align}`,
    trigger,
    title: `Aligned to ${align}`,
    description: `Aligned to ${align}`,
    align,
    contentClassName: 'w-40',
  })

export const PopoverAlignments = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex gap-6')],
    [
      alignmentPopover('start', 'Start'),
      alignmentPopover('center', 'Center'),
      alignmentPopover('end', 'End'),
    ],
  )
}

const rtlPopover = (
  side: PopoverSide,
  trigger: string,
  title: string,
  description: string,
): Html =>
  popoverShell({
    id: `popover-rtl-${side}`,
    trigger,
    title,
    description,
    side,
    dir: 'rtl',
  })

export const PopoverRtl = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('grid gap-4')],
    [
      h.div(
        [h.Class('flex flex-wrap justify-center gap-2')],
        [
          rtlPopover('left', 'Left', 'Dimensions', 'Set the dimensions.'),
          rtlPopover('top', 'Top', 'Dimensions', 'Set the dimensions.'),
          rtlPopover('bottom', 'Bottom', 'Dimensions', 'Set the dimensions.'),
          rtlPopover('right', 'Right', 'Dimensions', 'Set the dimensions.'),
        ],
      ),
      h.div(
        [h.Class('flex flex-wrap justify-center gap-2')],
        [
          rtlPopover(
            'inline-start',
            'Inline Start',
            'Dimensions',
            'Set the dimensions.',
          ),
          rtlPopover(
            'inline-end',
            'Inline End',
            'Dimensions',
            'Set the dimensions.',
          ),
        ],
      ),
    ],
  )
}
