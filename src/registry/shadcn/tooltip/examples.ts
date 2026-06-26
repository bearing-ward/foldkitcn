import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Button from '../button'
import * as Kbd from '../kbd'
import type { TooltipSide } from './index'
import { view as Tooltip } from './index'

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

const tooltipShell = (
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
): Html => {
  const h = html<never>()

  return Tooltip<never>({
    id: config.id,
    open: true,
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
                  Button.view<never>({
                    variant: 'outline',
                    isDisabled: config.isDisabled,
                    className: config.triggerClassName,
                    toView: buttonAttributes =>
                      h.button([...buttonAttributes.button], config.trigger),
                  }),
                ],
              )
            : Button.view<never>({
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

export const TooltipDemo = (): Html =>
  tooltipShell({
    id: 'tooltip-demo',
    trigger: ['Hover'],
    content: ['Add to library'],
  })

export const TooltipDisabled = (): Html =>
  tooltipShell({
    id: 'tooltip-disabled',
    trigger: ['Disabled'],
    content: ['This feature is currently unavailable'],
    isDisabled: true,
    triggerAsSpan: true,
  })

export const TooltipKeyboard = (): Html => {
  const h = html<never>()

  return tooltipShell({
    id: 'tooltip-keyboard',
    trigger: [iconSave()],
    triggerSize: 'icon-sm',
    content: [
      'Save Changes ',
      Kbd.view<never>({
        toView: attributes => h.kbd([...attributes.kbd], ['S']),
      }),
    ],
  })
}

const sideTooltip = (side: TooltipSide, label: string, dir?: string): Html =>
  tooltipShell({
    id: `tooltip-${dir ?? 'ltr'}-${side}`,
    trigger: [label],
    content: [dir === 'rtl' ? 'إضافة إلى المكتبة' : 'Add to library'],
    side,
    ...(dir === undefined ? {} : { dir }),
    triggerClassName: 'w-fit capitalize',
  })

export const TooltipSides = (): Html => {
  const h = html<never>()
  const sides: ReadonlyArray<TooltipSide> = ['left', 'top', 'bottom', 'right']

  return h.div(
    [h.Class('flex flex-wrap gap-2')],
    sides.map(side => sideTooltip(side, side)),
  )
}

export const TooltipRtl = (): Html => {
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
        physicalSides.map(side => sideTooltip(side, labels[side], 'rtl')),
      ),
      h.div(
        [h.Class('flex flex-wrap justify-center gap-2')],
        logicalSides.map(side => sideTooltip(side, labels[side], 'rtl')),
      ),
    ],
  )
}
