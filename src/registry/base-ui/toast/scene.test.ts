import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import {
  ToastAnchored,
  ToastCustom,
  ToastCustomPosition,
  ToastDeduplicated,
  ToastPromise,
  ToastUndoAction,
  ToastVaryingHeights,
} from './examples'
import * as Toast from './index'

// MODEL

const Model = S.Struct({
  state: Toast.ToastState,
  actionPresses: S.Number,
  closePresses: S.Number,
  lastViewportInteraction: S.optional(Toast.ToastViewportInteractionType),
})
type Model = typeof Model.Type

const initialModel = (state: Toast.ToastState): Model => ({
  state,
  actionPresses: 0,
  closePresses: 0,
  lastViewportInteraction: undefined,
})

// MESSAGE

const PressedToastAction = m('PressedToastAction', {
  press: Toast.ToastActionPress,
})
const RequestedToastClose = m('RequestedToastClose', {
  request: Toast.ToastCloseRequest,
})
const ChangedViewport = m('ChangedViewport', {
  interaction: Toast.ToastViewportInteraction,
})
const ChangedSwipe = m('ChangedSwipe', {
  change: Toast.ToastSwipeChange,
})

const Message = S.Union([
  PressedToastAction,
  RequestedToastClose,
  ChangedViewport,
  ChangedSwipe,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      PressedToastAction: () => [
        evo(model, { actionPresses: value => value + 1 }),
        [],
      ],
      RequestedToastClose: ({ request }) => [
        evo(model, {
          closePresses: value => value + 1,
          state: () => Toast.closeToast(model.state, request),
        }),
        [],
      ],
      ChangedViewport: ({ interaction }) => [
        evo(model, {
          state: () => Toast.applyViewportInteraction(model.state, interaction),
          lastViewportInteraction: () => interaction.type,
        }),
        [],
      ],
      ChangedSwipe: ({ change }) => [
        evo(model, {
          state: () => Toast.updateSwipe(model.state, change),
        }),
        [],
      ],
    }),
  )

// VIEW

const renderToastView =
  (options: Readonly<{ includePlacement?: boolean }> = {}) =>
  (model: Model): Html => {
    const h = html<Message>()

    return Toast.view<Message>({
      id: 'notifications',
      state: model.state,
      onAction: press => PressedToastAction({ press }),
      onClose: request => RequestedToastClose({ request }),
      onSwipeChange: change => ChangedSwipe({ change }),
      onViewportInteraction: interaction => ChangedViewport({ interaction }),
      toView: attributes =>
        h.div(
          [...attributes.provider],
          [
            h.div(
              [...attributes.portal],
              [
                h.div(
                  [...attributes.viewport.root],
                  attributes.toasts.flatMap(toast => [
                    h.div(
                      [...toast.root],
                      [
                        h.div(
                          [...toast.content],
                          [
                            toast.toast.title === undefined
                              ? ''
                              : h.h2([...toast.title], [toast.toast.title]),
                            toast.toast.description === undefined
                              ? ''
                              : h.p(
                                  [...toast.description],
                                  [toast.toast.description],
                                ),
                          ],
                        ),
                        h.div(
                          [],
                          [
                            toast.toast.actionLabel === undefined
                              ? ''
                              : h.button(
                                  [...toast.action],
                                  [toast.toast.actionLabel],
                                ),
                            h.button([...toast.close], ['Dismiss']),
                          ],
                        ),
                        ...(options.includePlacement === true
                          ? [
                              h.div([...toast.positioner.root], ['Positioned']),
                              h.div([...toast.arrow.root], []),
                            ]
                          : []),
                      ],
                    ),
                  ]),
                ),
              ],
            ),
            h.p([], [`Action ${model.actionPresses}`]),
            h.p([], [`Close ${model.closePresses}`]),
            h.p([], [`Paused ${model.state.timersPaused ? 'true' : 'false'}`]),
            h.p(
              [],
              [`Swipe ${model.state.toasts[0]?.swipe?.status ?? 'idle'}`],
            ),
            h.p([], [`Viewport ${model.lastViewportInteraction ?? 'none'}`]),
          ],
        ),
    })
  }

describe('base-ui/toast view', () => {
  test('renders the provider, viewport, and toast parts with accessible labels', () => {
    const state = Toast.createToastState({
      toasts: [
        {
          id: 'saved',
          title: 'Saved',
          description: 'Your changes were stored.',
          type: 'success',
          priority: 'low',
          duration: 5000,
          height: 84,
          actionLabel: 'Undo',
        },
      ],
    })

    expect(() => {
      Scene.scene(
        { update, view: renderToastView() },
        Scene.with(initialModel(state)),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveAttr('aria-live', 'polite'),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveAttr('data-position', 'bottom-right'),
        Scene.expect(Scene.role('dialog', { name: 'Saved' })).toHaveAttr(
          'tabIndex',
          '0',
        ),
        Scene.expect(Scene.role('dialog', { name: 'Saved' })).toHaveAttr(
          'aria-labelledby',
          'notifications-saved-title',
        ),
        Scene.expect(Scene.role('dialog', { name: 'Saved' })).toHaveAttr(
          'aria-describedby',
          'notifications-saved-description',
        ),
        Scene.expect(Scene.role('dialog', { name: 'Saved' })).toHaveAttr(
          'data-type',
          'success',
        ),
        Scene.expect(Scene.role('button', { name: 'Undo' })).toHaveAttr(
          'data-type',
          'success',
        ),
        Scene.expect(Scene.role('button', { name: 'Dismiss' })).toHaveAttr(
          'data-type',
          'success',
        ),
      )
    }).not.toThrow()
  })

  test('focus expands the viewport and pauses toast timers', () => {
    const state = Toast.createToastState({
      toasts: [
        {
          id: 'saved',
          title: 'Saved',
          description: 'Your changes were stored.',
          duration: 5000,
          timerStatus: 'running',
        },
      ],
    })

    expect(() => {
      Scene.scene(
        { update, view: renderToastView() },
        Scene.with(initialModel(state)),
        Scene.focus(Scene.role('region', { name: 'Notifications' })),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveAttr('data-expanded'),
        Scene.expect(Scene.role('dialog', { name: 'Saved' })).toHaveAttr(
          'data-expanded',
        ),
        Scene.expect(Scene.text('Paused true')).toExist(),
        Scene.expect(Scene.text('Viewport focus-start')).toExist(),
        Scene.blur(Scene.role('region', { name: 'Notifications' })),
        Scene.expect(Scene.text('Paused false')).toExist(),
        Scene.expect(Scene.text('Viewport focus-end')).toExist(),
      )
    }).not.toThrow()
  })

  test('clicking action and close buttons emits toast facts', () => {
    const state = Toast.createToastState({
      isHovered: true,
      toasts: [
        {
          id: 'undo',
          title: 'File archived',
          description: 'Undo is available for a short time.',
          actionLabel: 'Undo',
          duration: 8000,
          height: 96,
        },
      ],
    })

    expect(() => {
      Scene.scene(
        { update, view: renderToastView() },
        Scene.with(initialModel(state)),
        Scene.click(Scene.role('button', { name: 'Undo' })),
        Scene.click(Scene.role('button', { name: 'Dismiss' })),
        Scene.expect(Scene.text('Action 1')).toExist(),
        Scene.expect(Scene.text('Close 1')).toExist(),
        Scene.expect(
          Scene.role('dialog', { name: 'File archived' }),
        ).toHaveAttr('data-ending-style'),
      )
    }).not.toThrow()
  })

  test('swipe updates movement data and dismisses the toast', () => {
    const swipingState = Toast.createToastState({
      toasts: [
        {
          id: 'swipe-me',
          title: 'Swipe me',
          description: 'Dismiss me with a gesture.',
          duration: 5000,
          swipe: {
            status: 'swiping',
            pointerType: 'touch',
            movementX: 120,
            movementY: 24,
          },
        },
      ],
    })
    const dismissedState = Toast.createToastState({
      toasts: [
        {
          id: 'swipe-me',
          title: 'Swipe me',
          description: 'Dismiss me with a gesture.',
          duration: 5000,
          swipe: {
            status: 'dismissed',
            pointerType: 'touch',
            movementX: 160,
            movementY: 40,
          },
        },
      ],
    })

    expect(() => {
      Scene.scene(
        { update, view: renderToastView() },
        Scene.with(initialModel(swipingState)),
        Scene.expect(Scene.role('dialog', { name: 'Swipe me' })).toHaveAttr(
          'data-swiping',
        ),
        Scene.expect(Scene.text('Swipe swiping')).toExist(),
      )
      Scene.scene(
        { update, view: renderToastView() },
        Scene.with(initialModel(dismissedState)),
        Scene.expect(Scene.text('Swipe dismissed')).toExist(),
        Scene.expect(Scene.role('dialog', { name: 'Swipe me' })).not.toHaveAttr(
          'data-swiping',
        ),
      )
    }).not.toThrow()
  })

  test('exposes placement attributes for anchored toast parts', () => {
    const state = Toast.createToastState({
      toasts: [
        {
          id: 'anchored',
          title: 'Anchored',
          description: 'Position metadata is exposed through data attributes.',
          height: 88,
          position: {
            side: 'top',
            align: 'end',
            sideOffset: 8,
            alignOffset: 2,
            collisionPadding: 6,
            arrowPadding: 4,
            arrowWidth: 12,
            arrowHeight: 6,
            isAnchorHidden: true,
            isArrowUncentered: true,
            positionMethod: 'absolute',
          },
        },
      ],
    })

    expect(() => {
      Scene.scene(
        { update, view: renderToastView({ includePlacement: true }) },
        Scene.with(initialModel(state)),
        Scene.expect(
          Scene.selector('#notifications-anchored-positioner'),
        ).toHaveAttr('data-side', 'top'),
        Scene.expect(
          Scene.selector('#notifications-anchored-positioner'),
        ).toHaveAttr('data-align', 'end'),
        Scene.expect(
          Scene.selector('#notifications-anchored-positioner'),
        ).toHaveAttr('data-anchor-hidden'),
        Scene.expect(
          Scene.selector('#notifications-anchored-positioner'),
        ).toHaveStyle('position', 'absolute'),
        Scene.expect(
          Scene.selector('#notifications-anchored-arrow'),
        ).toHaveAttr('data-uncentered'),
        Scene.expect(
          Scene.selector('#notifications-anchored-arrow'),
        ).toHaveStyle('width', '12px'),
      )
    }).not.toThrow()
  })

  test('renders the documented example exports', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => ToastAnchored() },
        Scene.with(initialModel(Toast.createToastState())),
        Scene.expect(
          Scene.role('button', { name: 'Copy to clipboard' }),
        ).toExist(),
        Scene.expect(Scene.role('button', { name: 'Stacked toast' })).toExist(),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveAttr('data-position', 'bottom-right'),
        Scene.expect(Scene.text('Copied')).not.toExist(),
      )
      Scene.scene(
        { update, view: () => ToastCustomPosition() },
        Scene.with(initialModel(Toast.createToastState())),
        Scene.expect(Scene.role('button', { name: 'Create toast' })).toExist(),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveAttr('data-position', 'top-center'),
        Scene.expect(Scene.text('This is a toast notification.')).not.toExist(),
      )
      Scene.scene(
        { update, view: () => ToastUndoAction() },
        Scene.with(initialModel(Toast.createToastState())),
        Scene.expect(
          Scene.role('button', { name: 'Perform action' }),
        ).toExist(),
        Scene.expect(Scene.text('You can undo this action.')).not.toExist(),
      )
      Scene.scene(
        { update, view: () => ToastPromise() },
        Scene.with(initialModel(Toast.createToastState())),
        Scene.expect(Scene.role('button', { name: 'Run effect' })).toExist(),
        Scene.expect(Scene.text('Waiting for result...')).not.toExist(),
      )
      Scene.scene(
        { update, view: () => ToastCustom() },
        Scene.with(initialModel(Toast.createToastState())),
        Scene.expect(
          Scene.role('button', { name: 'Create custom toast' }),
        ).toExist(),
        Scene.expect(Scene.text('data.userId is 123')).not.toExist(),
      )
      Scene.scene(
        { update, view: () => ToastDeduplicated() },
        Scene.with(initialModel(Toast.createToastState())),
        Scene.expect(Scene.role('button', { name: 'Save draft' })).toExist(),
        Scene.expect(Scene.text('Draft saved')).not.toExist(),
      )
      Scene.scene(
        { update, view: () => ToastVaryingHeights() },
        Scene.with(initialModel(Toast.createToastState())),
        Scene.expect(
          Scene.role('button', { name: 'Create varying height toast' }),
        ).toExist(),
        Scene.expect(Scene.text('Short message.')).not.toExist(),
      )
    }).not.toThrow()
  })
})
