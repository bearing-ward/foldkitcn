import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Button from '../button'
import { view as HoverCard } from './index'
import type { HoverCardOpenChange, HoverCardSide } from './index'

export type HoverCardExampleController<Message> = Readonly<{
  openFor?: (hoverCardId: string, defaultOpen: boolean) => boolean
  onOpenChange?: (hoverCardId: string, change: HoverCardOpenChange) => Message
}>

const isOpenFor = <Message>(
  controller: HoverCardExampleController<Message>,
  hoverCardId: string,
  defaultOpen: boolean,
): boolean => controller.openFor?.(hoverCardId, defaultOpen) ?? defaultOpen

const hoverCardShell = <Message>(
  config: Readonly<{
    id: string
    trigger: string
    content: ReadonlyArray<Html | string>
    side?: HoverCardSide
    dir?: string
    contentClassName?: string
    triggerClassName?: string
    triggerVariant?: Button.ButtonVariant
    delay?: number
    closeDelay?: number
  }>,
  controller: HoverCardExampleController<Message>,
): Html => {
  const h = html<Message>()
  const { onOpenChange } = controller

  return HoverCard<Message>({
    id: config.id,
    open: isOpenFor(controller, config.id, true),
    ...(onOpenChange === undefined
      ? {}
      : { onOpenChange: change => onOpenChange(config.id, change) }),
    side: config.side,
    dir: config.dir,
    contentClassName: config.contentClassName,
    delay: config.delay,
    closeDelay: config.closeDelay,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.a(
            [
              ...attributes.trigger,
              h.Href('#'),
              h.Class(
                Button.buttonVariants({
                  variant: config.triggerVariant ?? 'link',
                  className: config.triggerClassName,
                }),
              ),
            ],
            [config.trigger],
          ),
          h.div(
            [...attributes.portal],
            [
              h.div(
                [...attributes.positioner.root],
                [h.div([...attributes.popup.root], config.content)],
              ),
            ],
          ),
        ],
      ),
  })
}

export const HoverCardDemo = <Message = never>(
  controller: HoverCardExampleController<Message> = {},
): Html => {
  const h = html<never>()

  return hoverCardShell(
    {
      id: 'hover-card-demo',
      trigger: 'Hover Here',
      delay: 10,
      closeDelay: 100,
      contentClassName: 'flex w-64 flex-col gap-0.5',
      content: [
        h.div([h.Class('font-semibold')], ['@nextjs']),
        h.div([], ['The React Framework - created and maintained by @vercel.']),
        h.div(
          [h.Class('mt-1 text-xs text-muted-foreground')],
          ['Joined December 2021'],
        ),
      ],
    },
    controller,
  )
}

const sideHoverCard = <Message>(
  side: HoverCardSide,
  label: string,
  controller: HoverCardExampleController<Message>,
  dir?: string,
): Html => {
  const h = html<never>()

  return hoverCardShell(
    {
      id: `hover-card-${dir ?? 'ltr'}-${side}`,
      trigger: label,
      side,
      ...(dir === undefined ? {} : { dir }),
      triggerVariant: 'outline',
      triggerClassName: 'capitalize',
      delay: 100,
      closeDelay: 100,
      content: [
        h.div(
          [h.Class('flex flex-col gap-1')],
          [
            h.h4([h.Class('font-medium')], ['Hover Card']),
            h.p(
              [],
              [`This hover card appears on the ${side} side of the trigger.`],
            ),
          ],
        ),
      ],
    },
    controller,
  )
}

export const HoverCardSides = <Message = never>(
  controller: HoverCardExampleController<Message> = {},
): Html => {
  const h = html<never>()
  const sides: ReadonlyArray<HoverCardSide> = ['left', 'top', 'bottom', 'right']

  return h.div(
    [h.Class('flex flex-wrap justify-center gap-2')],
    sides.map(side => sideHoverCard(side, side, controller)),
  )
}

const rtlHoverCard = <Message>(
  side: HoverCardSide,
  trigger: string,
  dir: string,
  controller: HoverCardExampleController<Message>,
): Html => {
  const h = html<never>()

  return hoverCardShell(
    {
      id: `hover-card-rtl-${side}`,
      trigger,
      side,
      dir,
      triggerVariant: 'outline',
      contentClassName: 'flex w-64 flex-col gap-1',
      delay: 10,
      closeDelay: 100,
      content: [
        h.div([h.Class('font-semibold')], ['سماعات لاسلكية']),
        h.div([h.Class('text-sm text-muted-foreground')], ['٩٩.٩٩ $']),
      ],
    },
    controller,
  )
}

export const HoverCardRtl = <Message = never>(
  controller: HoverCardExampleController<Message> = {},
): Html => {
  const h = html<never>()
  const physicalSides: ReadonlyArray<HoverCardSide> = [
    'left',
    'top',
    'bottom',
    'right',
  ]
  const logicalSides: ReadonlyArray<HoverCardSide> = [
    'inline-start',
    'inline-end',
  ]
  const labels: Readonly<Record<HoverCardSide, string>> = {
    left: 'يسار',
    top: 'أعلى',
    bottom: 'أسفل',
    right: 'يمين',
    'inline-start': 'بداية السطر',
    'inline-end': 'نهاية السطر',
  }

  return h.div(
    [h.Class('grid gap-4'), h.Dir('rtl')],
    [
      h.div(
        [h.Class('flex flex-wrap justify-center gap-2')],
        physicalSides.map(side =>
          rtlHoverCard(side, labels[side], 'rtl', controller),
        ),
      ),
      h.div(
        [h.Class('flex flex-wrap justify-center gap-2')],
        logicalSides.map(side =>
          rtlHoverCard(side, labels[side], 'rtl', controller),
        ),
      ),
    ],
  )
}
