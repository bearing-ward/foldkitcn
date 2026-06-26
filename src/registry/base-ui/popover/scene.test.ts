import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Popover from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  lastReason: Popover.PopoverChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  lastReason: 'none',
}

// MESSAGE

const ChangedPopover = m('ChangedPopover', {
  open: S.Boolean,
  reason: Popover.PopoverChangeReason,
})

const Message = S.Union([ChangedPopover])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedPopover: ({ open, reason }) => [
        evo(model, {
          open: () => open,
          lastReason: () => reason,
        }),
        [],
      ],
    }),
  )

// VIEW

const viewPopover =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'onOpenChange' | 'open' | 'toView'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return Popover.view<Message>({
      id: 'settings-popover',
      open: model.open,
      titleId: 'settings-title',
      descriptionId: 'settings-description',
      onOpenChange: change => ChangedPopover(change),
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button([...attributes.trigger], ['Open settings']),
            h.div(
              [...attributes.portal],
              attributes.isMounted
                ? [
                    h.div([...attributes.backdrop.root], []),
                    h.div(
                      [...attributes.positioner.root],
                      [
                        h.div(
                          [...attributes.popup.root],
                          [
                            h.div([...attributes.arrow.root], []),
                            h.h2([...attributes.title], ['Settings']),
                            h.p(
                              [...attributes.description],
                              ['Manage settings.'],
                            ),
                            h.button([...attributes.close], ['Close']),
                          ],
                        ),
                      ],
                    ),
                  ]
                : [],
            ),
            h.p([], [`Reason ${model.lastReason}`]),
          ],
        ),
    })
  }

describe('base-ui/popover', () => {
  test('renders trigger, portal, positioner, popup, arrow, title, and description attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewPopover({ side: 'top', align: 'end' }) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).toHaveAttr('aria-haspopup', 'dialog'),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).toHaveAttr('aria-expanded', 'true'),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).toHaveAttr('aria-controls', 'settings-popover-popup'),
        Scene.expect(Scene.selector('#settings-popover-positioner')).toHaveAttr(
          'data-side',
          'top',
        ),
        Scene.expect(Scene.selector('#settings-popover-positioner')).toHaveAttr(
          'data-align',
          'end',
        ),
        Scene.expect(Scene.selector('#settings-popover-popup')).toHaveAttr(
          'popover',
          'manual',
        ),
        Scene.expect(Scene.selector('#settings-popover-popup')).toHaveAttr(
          'role',
          'dialog',
        ),
        Scene.expect(Scene.selector('#settings-popover-popup')).toHaveAttr(
          'data-open',
        ),
        Scene.expect(Scene.selector('#settings-popover-arrow')).toHaveAttr(
          'aria-hidden',
          'true',
        ),
        Scene.expect(Scene.selector('#settings-title')).toHaveText('Settings'),
        Scene.expect(Scene.selector('#settings-description')).toHaveText(
          'Manage settings.',
        ),
      )
    }).not.toThrow()
  })

  test('model-owned open state changes from trigger, close, backdrop, and Escape facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewPopover({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Open settings' })),
        Scene.expect(Scene.selector('#settings-popover-popup')).toHaveAttr(
          'data-open',
        ),
        Scene.expect(Scene.text('Reason trigger-press')).toExist(),
        Scene.click(Scene.role('button', { name: 'Close' })),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).toHaveAttr('aria-expanded', 'false'),
        Scene.expect(Scene.text('Reason close-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewPopover({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.click(Scene.selector('div[role="presentation"]')),
        Scene.expect(Scene.text('Reason outside-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewPopover({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.keydown(Scene.selector('#settings-popover-popup'), 'Escape'),
        Scene.expect(Scene.text('Reason escape-key')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled, force-mounted, and placement states expose attributes and suppress activation', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewPopover({
            alignOffset: 3,
            collisionAvoidance: false,
            collisionPadding: 8,
            forceMount: true,
            isDisabled: true,
            sideOffset: 4,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).not.toHaveHandler('click'),
        Scene.expect(Scene.selector('#settings-popover-popup')).toHaveAttr(
          'hidden',
        ),
        Scene.expect(Scene.selector('#settings-popover-popup')).toHaveAttr(
          'data-side-offset',
          '4',
        ),
        Scene.expect(Scene.selector('#settings-popover-popup')).toHaveAttr(
          'data-align-offset',
          '3',
        ),
        Scene.expect(Scene.selector('#settings-popover-popup')).toHaveAttr(
          'data-collision-avoidance',
          'false',
        ),
        Scene.expect(Scene.selector('#settings-popover-popup')).toHaveAttr(
          'data-collision-padding',
          '8',
        ),
      )
    }).not.toThrow()
  })
})
