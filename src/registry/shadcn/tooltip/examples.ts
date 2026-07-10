import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type { AnchorPositioningMessage } from '../../../utils/anchor-positioning'
import * as Button from '../button'
import * as Kbd from '../kbd'
import { view as Tooltip } from './index'
import type { TooltipOpenChange, TooltipSide } from './index'

export type TooltipExampleController<Message> = Readonly<{
  openFor?: (tooltipId: string, defaultOpen: boolean) => boolean
  onOpenChange?: (tooltipId: string, change: TooltipOpenChange) => Message
  onPositioned?: (message: AnchorPositioningMessage) => Message
}>

const isOpenFor = <Message>(
  controller: TooltipExampleController<Message>,
  tooltipId: string,
  defaultOpen: boolean,
): boolean => controller.openFor?.(tooltipId, defaultOpen) ?? defaultOpen

const iconSave = (): Html => {
  const h = html<never>()

  return h.span(
    [
      h.AriaHidden(true),
      h.DataAttribute('icon', 'inline-start'),
      h.Class('size-4'),
    ],
    ['S'],
  )
}

const tooltipShell = <Message>(
  config: Readonly<{
    id: string
    trigger: ReadonlyArray<Html | string>
    content: ReadonlyArray<Html | string>
    side?: TooltipSide
    dir?: string
    contentClassName?: string
    triggerClassName?: string
    isDisabled?: boolean
    triggerSize?: Button.ButtonSize
    triggerAsSpan?: boolean
  }>,
  controller: TooltipExampleController<Message>,
): Html => {
  const h = html<Message>()
  const { onOpenChange } = controller

  return Tooltip<Message>({
    id: config.id,
    open: isOpenFor(controller, config.id, true),
    ...(onOpenChange === undefined
      ? {}
      : { onOpenChange: change => onOpenChange(config.id, change) }),
    ...(controller.onPositioned === undefined
      ? { positioning: 'static' as const }
      : { onPositioned: controller.onPositioned }),
    side: config.side,
    dir: config.dir,
    contentClassName: config.contentClassName,
    triggerClassName: config.triggerClassName,
    isDisabled: config.isDisabled,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          config.triggerAsSpan === true
            ? h.span(
                [...attributes.trigger, h.Class('inline-block w-fit')],
                [
                  Button.view<Message>({
                    variant: 'outline',
                    isDisabled: config.isDisabled,
                    className: config.triggerClassName,
                    toView: buttonAttributes =>
                      h.button([...buttonAttributes.button], config.trigger),
                  }),
                ],
              )
            : Button.view<Message>({
                variant: 'outline',
                size: config.triggerSize,
                className: config.triggerClassName,
                toView: buttonAttributes =>
                  h.button(
                    [...attributes.trigger, ...buttonAttributes.button],
                    config.trigger,
                  ),
              }),
          h.div(
            [...attributes.portal],
            [
              h.div(
                [...attributes.positioner.root],
                [
                  h.div(
                    [...attributes.popup.root],
                    [
                      h.div([...attributes.viewport.root], config.content),
                      h.div([...attributes.arrow.root], []),
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

export const TooltipDemo = <Message = never>(
  controller: TooltipExampleController<Message> = {},
): Html =>
  tooltipShell(
    {
      id: 'tooltip-demo',
      trigger: ['Hover'],
      content: ['Add to library'],
    },
    controller,
  )

export const TooltipDisabled = <Message = never>(
  controller: TooltipExampleController<Message> = {},
): Html =>
  tooltipShell(
    {
      id: 'tooltip-disabled',
      trigger: ['Disabled'],
      content: ['This feature is currently unavailable'],
      isDisabled: true,
      triggerAsSpan: true,
    },
    controller,
  )

export const TooltipKeyboard = <Message = never>(
  controller: TooltipExampleController<Message> = {},
): Html => {
  const h = html<never>()

  return tooltipShell(
    {
      id: 'tooltip-keyboard',
      trigger: [iconSave()],
      triggerSize: 'icon-sm',
      content: [
        'Save Changes ',
        Kbd.view<never>({
          toView: attributes => h.kbd([...attributes.kbd], ['S']),
        }),
      ],
    },
    controller,
  )
}

const sideTooltip = <Message>(
  side: TooltipSide,
  label: string,
  controller: TooltipExampleController<Message>,
  dir?: string,
): Html =>
  tooltipShell(
    {
      id: `tooltip-${dir ?? 'ltr'}-${side}`,
      trigger: [label],
      content: [dir === 'rtl' ? 'إضافة إلى المكتبة' : 'Add to library'],
      side,
      ...(dir === undefined ? {} : { dir }),
      triggerClassName: 'w-fit capitalize',
    },
    controller,
  )

export const TooltipSides = <Message = never>(
  controller: TooltipExampleController<Message> = {},
): Html => {
  const h = html<never>()
  const sides: ReadonlyArray<TooltipSide> = ['left', 'top', 'bottom', 'right']

  return h.div(
    [h.Class('flex flex-wrap gap-2')],
    sides.map(side => sideTooltip(side, side, controller)),
  )
}

export const TooltipRtl = <Message = never>(
  controller: TooltipExampleController<Message> = {},
): Html => {
  const h = html<never>()
  const physicalSides: ReadonlyArray<TooltipSide> = [
    'left',
    'top',
    'bottom',
    'right',
  ]
  const logicalSides: ReadonlyArray<TooltipSide> = [
    'inline-start',
    'inline-end',
  ]
  const labels: Readonly<Record<TooltipSide, string>> = {
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
          sideTooltip(side, labels[side], controller, 'rtl'),
        ),
      ),
      h.div(
        [h.Class('flex flex-wrap justify-center gap-2')],
        logicalSides.map(side =>
          sideTooltip(side, labels[side], controller, 'rtl'),
        ),
      ),
    ],
  )
}
