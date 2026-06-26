import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Tooltip from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  activeTriggerId: S.optional(S.String),
  lastReason: Tooltip.TooltipChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  lastReason: 'none',
}

// MESSAGE

const ChangedTooltip = m('ChangedTooltip', {
  open: S.Boolean,
  reason: Tooltip.TooltipChangeReason,
  activeTriggerId: S.optional(S.String),
})

const Message = S.Union([ChangedTooltip])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedTooltip: ({ open, reason, activeTriggerId }) => [
        evo(model, {
          open: () => open,
          activeTriggerId: () => activeTriggerId,
          lastReason: () => reason,
        }),
        [],
      ],
    }),
  )

// VIEW

const viewTooltip =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'onOpenChange' | 'open' | 'toView'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return Tooltip.view<Message>({
      id: 'library-tooltip',
      open: model.open,
      activeTriggerId: model.activeTriggerId,
      onOpenChange: change => ChangedTooltip(change),
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
                h.p([], [`Reason ${model.lastReason}`]),
                h.p([], [`Active ${model.activeTriggerId ?? 'none'}`]),
              ],
            ),
          ],
        ),
    })
  }

describe('base-ui/tooltip', () => {
  test('renders provider, trigger, portal, positioner, popup, viewport, and arrow attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewTooltip({
            align: 'end',
            arrowPadding: 9,
            closeDelay: 3,
            delay: 25,
            instant: 'delay',
            isArrowUncentered: true,
            side: 'bottom',
            sideOffset: 4,
            viewportActivationDirection: 'right down',
          }),
        },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(Scene.selector('[data-provider]')).toHaveAttr(
          'data-delay',
          '600',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveAttr(
          'id',
          'library-tooltip-trigger',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveAttr(
          'aria-describedby',
          'library-tooltip-popup',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveAttr(
          'data-popup-open',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveAttr(
          'data-delay',
          '25',
        ),
        Scene.expect(Scene.selector('#library-tooltip-positioner')).toHaveAttr(
          'data-side',
          'bottom',
        ),
        Scene.expect(Scene.selector('#library-tooltip-positioner')).toHaveAttr(
          'data-align',
          'end',
        ),
        Scene.expect(Scene.selector('#library-tooltip-popup')).toHaveAttr(
          'role',
          'tooltip',
        ),
        Scene.expect(Scene.selector('#library-tooltip-popup')).toHaveAttr(
          'data-open',
        ),
        Scene.expect(Scene.selector('#library-tooltip-popup')).toHaveAttr(
          'data-instant',
          'delay',
        ),
        Scene.expect(Scene.selector('#library-tooltip-popup')).toHaveAttr(
          'data-side-offset',
          '4',
        ),
        Scene.expect(Scene.selector('#library-tooltip-popup')).toHaveText(
          'Add to library',
        ),
        Scene.expect(Scene.selector('#library-tooltip-viewport')).toHaveAttr(
          'data-activation-direction',
          'right down',
        ),
        Scene.expect(Scene.selector('#library-tooltip-arrow')).toHaveAttr(
          'aria-hidden',
          'true',
        ),
        Scene.expect(Scene.selector('#library-tooltip-arrow')).toHaveAttr(
          'data-uncentered',
        ),
        Scene.expect(Scene.selector('#library-tooltip-arrow')).toHaveAttr(
          'data-arrow-padding',
          '9',
        ),
      )
    }).not.toThrow()
  })

  test('exposes hover, focus, click, blur, mouseleave, and Escape facts without owning state', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTooltip({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveHandler(
          'mouseenter',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveHandler(
          'mouseleave',
        ),
        Scene.focus(Scene.role('button', { name: 'Hover' })),
        Scene.expect(Scene.selector('#library-tooltip-popup')).toHaveAttr(
          'data-open',
        ),
        Scene.expect(Scene.text('Reason trigger-focus')).toExist(),
        Scene.blur(Scene.role('button', { name: 'Hover' })),
        Scene.expect(Scene.text('Reason trigger-focus')).toExist(),
        Scene.click(Scene.role('button', { name: 'Hover' })),
        Scene.expect(Scene.text('Reason trigger-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewTooltip({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.keydown(Scene.selector('#library-tooltip-popup'), 'Escape'),
        Scene.expect(Scene.text('Reason escape-key')).toExist(),
      )
    }).not.toThrow()
    expect(Tooltip.focusOpenChange('library-tooltip-trigger')).toStrictEqual({
      open: true,
      reason: 'trigger-focus',
      activeTriggerId: 'library-tooltip-trigger',
    })
  })

  test('disabled, force-mounted, detached, viewport, and placement states are deterministic', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewTooltip({
            activeTriggerId: 'external-trigger',
            alignOffset: 2,
            collisionAvoidance: false,
            collisionPadding: 12,
            forceMount: true,
            isAnchorHidden: true,
            isDisabled: true,
            isViewportTransitioning: true,
            triggerId: 'external-trigger',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).toHaveAttr(
          'data-trigger-disabled',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).not.toHaveHandler(
          'mouseenter',
        ),
        Scene.expect(Scene.role('button', { name: 'Hover' })).not.toHaveHandler(
          'focus',
        ),
        Scene.expect(Scene.selector('#library-tooltip-positioner')).toHaveAttr(
          'hidden',
        ),
        Scene.expect(Scene.selector('#library-tooltip-positioner')).toHaveAttr(
          'data-anchor-hidden',
        ),
        Scene.expect(Scene.selector('#library-tooltip-popup')).toHaveAttr(
          'data-collision-avoidance',
          'false',
        ),
        Scene.expect(Scene.selector('#library-tooltip-popup')).toHaveAttr(
          'data-collision-padding',
          '12',
        ),
        Scene.expect(Scene.selector('#library-tooltip-popup')).toHaveAttr(
          'data-align-offset',
          '2',
        ),
        Scene.expect(Scene.selector('#library-tooltip-viewport')).toHaveAttr(
          'data-transitioning',
        ),
      )
    }).not.toThrow()
  })

  test('commandForOpenChange preserves popup and trigger selectors', () => {
    const openCommand = Tooltip.commandForOpenChange(
      { id: 'library-tooltip' },
      Tooltip.hoverOpenChange(),
    )
    const closeCommand = Tooltip.commandForOpenChange(
      {
        id: 'library-tooltip',
        triggerSelector: '.restore-target',
      },
      Tooltip.hoverCloseChange(),
    )

    expect(openCommand.name).toBe('FocusTooltip')
    expect(openCommand.args).toStrictEqual({
      selector: '#library-tooltip-popup',
    })
    expect(closeCommand.name).toBe('RestoreTooltipFocus')
    expect(closeCommand.args).toStrictEqual({
      selector: '.restore-target',
    })
  })
})
