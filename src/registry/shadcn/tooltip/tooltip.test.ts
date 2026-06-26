/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Tooltip from './index'
import type { ViewConfig } from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewTooltip =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'open' | 'toView'> &
      Readonly<{ open?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Tooltip.view<Message>({
      id: 'library-tooltip',
      open: config.open ?? true,
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.provider],
          [
            h.div(
              [...attributes.root],
              [
                h.button([...attributes.trigger], ['Hover']),
                h.div(
                  [...attributes.portal],
                  attributes.isMounted
                    ? [
                        h.div(
                          [...attributes.positioner.root],
                          [
                            h.div(
                              [...attributes.popup.root],
                              [
                                h.div(
                                  [...attributes.viewport.root],
                                  ['Add to library'],
                                ),
                                h.div([...attributes.arrow.root], []),
                              ],
                            ),
                          ],
                        ),
                      ]
                    : [],
                ),
              ],
            ),
          ],
        ),
    })
  }

describe('shadcn/tooltip class helpers', () => {
  test('use the exact origin positioner, content, and arrow class strings', () => {
    expect(Tooltip.tooltipPositionerClassName()).toBe('isolate z-50')
    expect(Tooltip.tooltipContentClassName()).toBe(
      'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
    )
    expect(Tooltip.tooltipContentClassName({ dir: 'rtl' })).toBe(
      'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pe-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
    )
    expect(Tooltip.tooltipArrowClassName()).toBe(
      'z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5',
    )
    expect(Tooltip.tooltipArrowClassName({ dir: 'rtl' })).toBe(
      'z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:-start-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:-end-1 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5',
    )
  })

  test('preserve custom classes', () => {
    expect(Tooltip.tooltipClassName({ className: 'custom-root' })).toContain(
      'custom-root',
    )
    expect(
      Tooltip.tooltipPositionerClassName({ className: 'custom-positioner' }),
    ).toContain('custom-positioner')
    expect(
      Tooltip.tooltipContentClassName({ className: 'custom-content' }),
    ).toContain('custom-content')
    expect(
      Tooltip.tooltipArrowClassName({ className: 'custom-arrow' }),
    ).toContain('custom-arrow')
  })
})

describe('shadcn/tooltip view', () => {
  test('adds shadcn provider, root, trigger, content, and arrow slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTooltip({}) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="tooltip-provider"]'),
        ).toHaveAttr('data-delay', '600'),
        Scene.expect(Scene.selector('[data-slot="tooltip"]')).toHaveAttr(
          'data-side',
          'top',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveAttr(
          'data-slot',
          'tooltip-trigger',
        ),
        Scene.expect(Scene.selector('#library-tooltip-positioner')).toHaveAttr(
          'class',
          Tooltip.tooltipPositionerClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="tooltip-content"]'),
        ).toHaveAttr('class', Tooltip.tooltipContentClassName()),
        Scene.expect(
          Scene.selector('[data-slot="tooltip-content"]'),
        ).toHaveAttr('data-side-offset', '4'),
        Scene.expect(Scene.selector('#library-tooltip-arrow')).toHaveAttr(
          'class',
          Tooltip.tooltipArrowClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('passes Base UI disabled, delay, keyboard, RTL, and side attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewTooltip({
            closeDelay: 2,
            contentClassName: 'max-w-sm',
            delay: 10,
            dir: 'rtl',
            isDisabled: true,
            side: 'inline-start',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveAttr(
          'data-trigger-disabled',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveAttr(
          'data-delay',
          '10',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveAttr(
          'data-close-delay',
          '2',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).not.toHaveHandler(
          'mouseenter',
        ),
        Scene.expect(
          Scene.selector('[data-slot="tooltip-content"]'),
        ).toHaveAttr('dir', 'rtl'),
        Scene.expect(
          Scene.selector('[data-slot="tooltip-content"]'),
        ).toHaveAttr('data-side', 'inline-start'),
        Scene.expect(
          Scene.selector('[data-slot="tooltip-content"]'),
        ).toHaveAttr(
          'class',
          Tooltip.tooltipContentClassName({
            className: 'max-w-sm',
            dir: 'rtl',
          }),
        ),
      )
    }).not.toThrow()
  })
})
