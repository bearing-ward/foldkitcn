/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as HoverCard from './index'
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

const viewHoverCard =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'open' | 'toView'> &
      Readonly<{ open?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return HoverCard.view<Message>({
      id: 'profile-hover-card',
      open: config.open ?? true,
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.a([...attributes.trigger, h.Href('#profile')], ['Hover Here']),
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
                              [
                                h.div([h.Class('font-semibold')], ['@nextjs']),
                                h.div(
                                  [],
                                  [
                                    'The React Framework - created and maintained by @vercel.',
                                  ],
                                ),
                              ],
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

describe('shadcn/hover-card class helpers', () => {
  test('use the exact origin positioner and content class strings', () => {
    expect(HoverCard.hoverCardPositionerClassName()).toBe('isolate z-50')
    expect(HoverCard.hoverCardContentClassName()).toBe(
      'z-50 w-64 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
    )
    expect(HoverCard.hoverCardContentClassName({ dir: 'rtl' })).toBe(
      'z-50 w-64 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
    )
  })

  test('preserve custom classes', () => {
    expect(
      HoverCard.hoverCardClassName({ className: 'custom-root' }),
    ).toContain('custom-root')
    expect(
      HoverCard.hoverCardPositionerClassName({
        className: 'custom-positioner',
      }),
    ).toContain('custom-positioner')
    expect(
      HoverCard.hoverCardContentClassName({ className: 'custom-content' }),
    ).toContain('custom-content')
  })
})

describe('shadcn/hover-card view', () => {
  test('adds shadcn root, trigger, portal, positioner, and content slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewHoverCard({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="hover-card"]')).toHaveAttr(
          'data-side',
          'bottom',
        ),
        Scene.expect(Scene.role('link', { name: 'Hover Here' })).toHaveAttr(
          'data-slot',
          'hover-card-trigger',
        ),
        Scene.expect(
          Scene.selector('[data-slot="hover-card-portal"]'),
        ).toHaveAttr('data-portal'),
        Scene.expect(
          Scene.selector('#profile-hover-card-positioner'),
        ).toHaveAttr('class', HoverCard.hoverCardPositionerClassName()),
        Scene.expect(
          Scene.selector('[data-slot="hover-card-content"]'),
        ).toHaveAttr('class', HoverCard.hoverCardContentClassName()),
        Scene.expect(
          Scene.selector('[data-slot="hover-card-content"]'),
        ).toHaveAttr('data-side-offset', '4'),
        Scene.expect(
          Scene.selector('[data-slot="hover-card-content"]'),
        ).toHaveAttr('data-align-offset', '4'),
      )
    }).not.toThrow()
  })

  test('passes Base UI disabled, delay, keyboard, RTL, and side attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewHoverCard({
            closeDelay: 100,
            contentClassName: 'flex w-64 flex-col gap-1',
            delay: 10,
            dir: 'rtl',
            isDisabled: true,
            side: 'inline-start',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('link', { name: 'Hover Here' })).toHaveAttr(
          'data-trigger-disabled',
        ),
        Scene.expect(Scene.role('link', { name: 'Hover Here' })).toHaveAttr(
          'data-delay',
          '10',
        ),
        Scene.expect(Scene.role('link', { name: 'Hover Here' })).toHaveAttr(
          'data-close-delay',
          '100',
        ),
        Scene.expect(
          Scene.role('link', { name: 'Hover Here' }),
        ).not.toHaveHandler('mouseenter'),
        Scene.expect(
          Scene.selector('[data-slot="hover-card-content"]'),
        ).toHaveAttr('dir', 'rtl'),
        Scene.expect(
          Scene.selector('[data-slot="hover-card-content"]'),
        ).toHaveAttr('data-side', 'inline-start'),
        Scene.expect(
          Scene.selector('[data-slot="hover-card-content"]'),
        ).toHaveAttr(
          'class',
          HoverCard.hoverCardContentClassName({
            className: 'flex w-64 flex-col gap-1',
            dir: 'rtl',
          }),
        ),
      )
    }).not.toThrow()
  })
})
