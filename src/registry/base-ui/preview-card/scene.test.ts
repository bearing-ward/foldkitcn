import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as PreviewCard from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  activeTriggerId: S.optional(S.String),
  lastReason: PreviewCard.PreviewCardChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  lastReason: 'none',
}

// MESSAGE

const ChangedPreviewCard = m('ChangedPreviewCard', {
  open: S.Boolean,
  reason: PreviewCard.PreviewCardChangeReason,
  activeTriggerId: S.optional(S.String),
})

const Message = S.Union([ChangedPreviewCard])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedPreviewCard: ({ open, reason, activeTriggerId }) => [
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

const viewPreviewCard =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'onOpenChange' | 'open' | 'toView'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return PreviewCard.view<Message>({
      id: 'profile-preview',
      open: model.open,
      activeTriggerId: model.activeTriggerId,
      onOpenChange: change => ChangedPreviewCard(change),
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.a([...attributes.trigger, h.Href('#profile')], ['Open profile']),
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
                            h.div(
                              [...attributes.viewport.root],
                              [
                                h.h3([], ['@base-ui']),
                                h.p([], ['Preview Card primitive']),
                              ],
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
    })
  }

describe('base-ui/preview-card', () => {
  test('renders trigger, portal, backdrop, positioner, popup, viewport, and arrow attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewPreviewCard({
            align: 'end',
            arrowPadding: 9,
            closeDelay: 100,
            delay: 10,
            instant: 'focus',
            isArrowUncentered: true,
            side: 'top',
            sideOffset: 4,
            viewportActivationDirection: 'left up',
          }),
        },
        Scene.with({
          ...initialModel,
          open: true,
          activeTriggerId: 'profile-preview-trigger',
        }),
        Scene.expect(Scene.role('link', { name: 'Open profile' })).toHaveAttr(
          'id',
          'profile-preview-trigger',
        ),
        Scene.expect(Scene.role('link', { name: 'Open profile' })).toHaveAttr(
          'aria-describedby',
          'profile-preview-popup',
        ),
        Scene.expect(Scene.role('link', { name: 'Open profile' })).toHaveAttr(
          'data-delay',
          '10',
        ),
        Scene.expect(Scene.role('link', { name: 'Open profile' })).toHaveAttr(
          'data-close-delay',
          '100',
        ),
        Scene.expect(Scene.role('link', { name: 'Open profile' })).toHaveAttr(
          'data-popup-open',
        ),
        Scene.expect(Scene.selector('div[role="presentation"]')).toHaveAttr(
          'data-open',
        ),
        Scene.expect(Scene.selector('#profile-preview-positioner')).toHaveAttr(
          'data-side',
          'top',
        ),
        Scene.expect(Scene.selector('#profile-preview-positioner')).toHaveAttr(
          'data-align',
          'end',
        ),
        Scene.expect(Scene.selector('#profile-preview-positioner')).toHaveAttr(
          'data-instant',
          'focus',
        ),
        Scene.expect(Scene.selector('#profile-preview-popup')).toHaveAttr(
          'tabIndex',
          '-1',
        ),
        Scene.expect(Scene.selector('#profile-preview-popup')).toHaveAttr(
          'data-open',
        ),
        Scene.expect(Scene.selector('#profile-preview-popup')).toHaveAttr(
          'data-side-offset',
          '4',
        ),
        Scene.expect(Scene.selector('#profile-preview-viewport')).toHaveText(
          '@base-uiPreview Card primitive',
        ),
        Scene.expect(Scene.selector('#profile-preview-viewport')).toHaveAttr(
          'data-activation-direction',
          'left up',
        ),
        Scene.expect(Scene.selector('#profile-preview-arrow')).toHaveAttr(
          'aria-hidden',
          'true',
        ),
        Scene.expect(Scene.selector('#profile-preview-arrow')).toHaveAttr(
          'data-uncentered',
        ),
        Scene.expect(Scene.selector('#profile-preview-arrow')).toHaveAttr(
          'data-side',
          'top',
        ),
      )
    }).not.toThrow()
  })

  test('exposes hover, focus, click, blur, mouseleave, and Escape facts without owning state', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewPreviewCard({}) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('link', { name: 'Open profile' }),
        ).toHaveHandler('mouseenter'),
        Scene.expect(
          Scene.role('link', { name: 'Open profile' }),
        ).toHaveHandler('mouseleave'),
        Scene.focus(Scene.role('link', { name: 'Open profile' })),
        Scene.expect(Scene.selector('#profile-preview-popup')).toHaveAttr(
          'data-open',
        ),
        Scene.expect(Scene.text('Reason trigger-focus')).toExist(),
        Scene.blur(Scene.role('link', { name: 'Open profile' })),
        Scene.expect(Scene.text('Reason trigger-focus')).toExist(),
        Scene.click(Scene.role('link', { name: 'Open profile' })),
        Scene.expect(Scene.text('Reason trigger-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewPreviewCard({}) },
        Scene.with({
          ...initialModel,
          open: true,
          activeTriggerId: 'profile-preview-trigger',
        }),
        Scene.keydown(Scene.selector('#profile-preview-popup'), 'Escape'),
        Scene.expect(Scene.text('Reason escape-key')).toExist(),
      )
    }).not.toThrow()
    expect(
      PreviewCard.focusOpenChange('profile-preview-trigger'),
    ).toStrictEqual({
      open: true,
      reason: 'trigger-focus',
      activeTriggerId: 'profile-preview-trigger',
    })
  })

  test('disabled, force-mounted, detached, viewport, and placement states are deterministic', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewPreviewCard({
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
        Scene.expect(Scene.role('link', { name: 'Open profile' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.role('link', { name: 'Open profile' })).toHaveAttr(
          'data-trigger-disabled',
        ),
        Scene.expect(
          Scene.role('link', { name: 'Open profile' }),
        ).not.toHaveHandler('mouseenter'),
        Scene.expect(
          Scene.role('link', { name: 'Open profile' }),
        ).not.toHaveHandler('focus'),
        Scene.expect(Scene.selector('#profile-preview-positioner')).toHaveAttr(
          'hidden',
        ),
        Scene.expect(Scene.selector('#profile-preview-positioner')).toHaveAttr(
          'inert',
        ),
        Scene.expect(Scene.selector('#profile-preview-positioner')).toHaveAttr(
          'data-anchor-hidden',
        ),
        Scene.expect(Scene.selector('#profile-preview-popup')).toHaveAttr(
          'data-collision-avoidance',
          'false',
        ),
        Scene.expect(Scene.selector('#profile-preview-popup')).toHaveAttr(
          'data-collision-padding',
          '12',
        ),
        Scene.expect(Scene.selector('#profile-preview-popup')).toHaveAttr(
          'data-align-offset',
          '2',
        ),
        Scene.expect(Scene.selector('#profile-preview-viewport')).toHaveAttr(
          'data-transitioning',
        ),
      )
    }).not.toThrow()
  })

  test('commandForOpenChange preserves popup and trigger selectors', () => {
    const openCommand = PreviewCard.commandForOpenChange(
      { id: 'profile-preview' },
      PreviewCard.hoverOpenChange(),
    )
    const closeCommand = PreviewCard.commandForOpenChange(
      {
        id: 'profile-preview',
        triggerSelector: '.restore-target',
      },
      PreviewCard.hoverCloseChange(),
    )

    expect(openCommand.name).toBe('FocusPreviewCard')
    expect(openCommand.args).toStrictEqual({
      selector: '#profile-preview-popup',
    })
    expect(closeCommand.name).toBe('RestorePreviewCardFocus')
    expect(closeCommand.args).toStrictEqual({
      selector: '.restore-target',
    })
  })
})
