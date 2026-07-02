/// <reference types="vite/client" />

import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as ToastPrimitive from '../../base-ui/toast'
import { ToastStacked } from './examples'
import * as Toast from './index'

// MODEL

const Model = S.Struct({
  state: ToastPrimitive.ToastState,
  actionPresses: S.Number,
  closePresses: S.Number,
  lastViewportInteraction: S.optional(
    ToastPrimitive.ToastViewportInteractionType,
  ),
})
type Model = typeof Model.Type

const initialModel = (state: ToastPrimitive.ToastState): Model => ({
  state,
  actionPresses: 0,
  closePresses: 0,
  lastViewportInteraction: undefined,
})

// MESSAGE

const PressedToastAction = m('PressedToastAction', {
  press: ToastPrimitive.ToastActionPress,
})
const RequestedToastClose = m('RequestedToastClose', {
  request: ToastPrimitive.ToastCloseRequest,
})
const ChangedViewport = m('ChangedViewport', {
  interaction: ToastPrimitive.ToastViewportInteraction,
})

const Message = S.Union([
  PressedToastAction,
  RequestedToastClose,
  ChangedViewport,
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
        evo(model, {
          actionPresses: value => value + 1,
        }),
        [],
      ],
      RequestedToastClose: ({ request }) => [
        evo(model, {
          closePresses: value => value + 1,
          state: () => ToastPrimitive.closeToast(model.state, request),
        }),
        [],
      ],
      ChangedViewport: ({ interaction }) => [
        evo(model, {
          state: () =>
            ToastPrimitive.applyViewportInteraction(model.state, interaction),
          lastViewportInteraction: () => interaction.type,
        }),
        [],
      ],
    }),
  )

// VIEW

const stackedState = (): ToastPrimitive.ToastState =>
  ToastPrimitive.createToastState({
    limit: 3,
    toasts: [
      {
        id: 'stacked-1',
        title: 'Scheduled',
        description: 'Catch up with the design team.',
        actionLabel: 'Undo',
        duration: 5000,
        height: 84,
      },
      {
        id: 'stacked-2',
        title: 'Queued',
        description: 'The next toast sits one card back.',
        duration: 5000,
        height: 92,
      },
      {
        id: 'stacked-3',
        title: 'Ready',
        description: 'Hover or focus the viewport to expand.',
        duration: 5000,
        height: 96,
      },
    ],
  })

const destructiveState = (): ToastPrimitive.ToastState =>
  ToastPrimitive.createToastState({
    toasts: [
      {
        id: 'toast-destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        type: 'error',
        actionLabel: 'Try again',
        duration: 5000,
        height: 96,
      },
    ],
  })

const renderToastView =
  (
    options: Readonly<{
      variant?: Toast.ToastVariant
      stackingStrategy?: ToastPrimitive.ToastStackingStrategy
    }> = {},
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [h.Class('grid gap-4')],
      [
        Toast.Toaster<Message>({
          id: 'notifications',
          state: model.state,
          variant: options.variant,
          stackingStrategy: options.stackingStrategy ?? 'base-ui-shuffle',
          viewportPositioning: 'absolute',
          onAction: press => PressedToastAction({ press }),
          onClose: request => RequestedToastClose({ request }),
          onViewportInteraction: interaction =>
            ChangedViewport({ interaction }),
        }),
        h.p([], [`Action ${model.actionPresses}`]),
        h.p([], [`Close ${model.closePresses}`]),
        h.p([], [`Paused ${model.state.timersPaused ? 'true' : 'false'}`]),
        h.p([], [`Viewport ${model.lastViewportInteraction ?? 'none'}`]),
      ],
    )
  }

describe('shadcn/toast view', () => {
  test('renders accessible shadcn toast cards with destructive styling', () => {
    expect(() => {
      Scene.scene(
        { update, view: renderToastView({ variant: 'destructive' }) },
        Scene.with(initialModel(destructiveState())),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveAttr('aria-live', 'polite'),
        Scene.expect(
          Scene.role('dialog', { name: 'Uh oh! Something went wrong.' }),
        ).toHaveAttr('data-variant', 'destructive'),
        Scene.expect(
          Scene.text('There was a problem with your request.'),
        ).toExist(),
        Scene.expect(Scene.role('button', { name: 'Try again' })).toExist(),
        Scene.expect(
          Scene.role('button', { name: 'Dismiss notification' }),
        ).toExist(),
        Scene.expect(
          Scene.selector('#notifications-toast-destructive'),
        ).toHaveClass('rounded-md'),
        Scene.expect(
          Scene.selector('#notifications-toast-destructive'),
        ).toHaveClass('shadow-lg'),
        Scene.expect(
          Scene.selector(
            '#notifications-toast-destructive [data-slot="toast-action"]',
          ),
        ).toHaveClass('h-8'),
      )
    }).not.toThrow()
  })

  test('keeps multiple stacked toasts mounted while compact', () => {
    expect(() => {
      Scene.scene(
        { update, view: renderToastView() },
        Scene.with(initialModel(stackedState())),
        Scene.expectAll(Scene.all.role('dialog')).toHaveCount(3),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).not.toHaveAttr('data-expanded'),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveClass('pointer-events-auto'),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveClass('min-h-[var(--toast-frontmost-height)]'),
        Scene.expect(Scene.selector('#notifications-stacked-2')).toHaveAttr(
          'data-stacking-strategy',
          'base-ui-shuffle',
        ),
        Scene.expect(Scene.selector('#notifications-stacked-1')).toHaveClass(
          'absolute',
        ),
        Scene.expect(
          Scene.selector(
            '#notifications-stacked-1 [data-slot="toast-content"]',
          ),
        ).not.toHaveAttr('data-behind'),
        Scene.expect(
          Scene.selector(
            '#notifications-stacked-2 [data-slot="toast-content"]',
          ),
        ).toHaveAttr('data-behind'),
        Scene.expect(
          Scene.selector(
            '#notifications-stacked-3 [data-slot="toast-content"]',
          ),
        ).toHaveAttr('data-behind'),
      )
    }).not.toThrow()
  })

  test('stacked example uses seeded cards only before live interactions', () => {
    const liveStackState = ToastPrimitive.createToastState({
      limit: 3,
      toasts: [
        {
          id: 'live-2',
          title: 'Stacked toast 2',
          description: 'Second live toast.',
          duration: 5000,
          height: 84,
        },
        {
          id: 'live-1',
          title: 'Stacked toast 1',
          description: 'First live toast.',
          duration: 5000,
          height: 84,
        },
      ],
    })

    expect(() => {
      Scene.scene(
        {
          update: (model: ToastPrimitive.ToastState) => [model, []],
          view: state => ToastStacked({ state }),
        },
        Scene.with(liveStackState),
        Scene.expectAll(Scene.all.role('dialog')).toHaveCount(2),
        Scene.expect(Scene.text('Stacked toast 2')).toExist(),
        Scene.expect(Scene.text('Stacked toast 1')).toExist(),
      )
    }).not.toThrow()
  })

  test('hover expands the stack without discarding background toasts', () => {
    expect(() => {
      Scene.scene(
        { update, view: renderToastView() },
        Scene.with(initialModel(stackedState())),
        Scene.hover(Scene.role('region', { name: 'Notifications' })),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveAttr('data-expanded'),
        Scene.expect(Scene.selector('#notifications-stacked-2')).toHaveAttr(
          'data-expanded',
        ),
        Scene.expectAll(Scene.all.role('dialog')).toHaveCount(3),
      )
    }).not.toThrow()
  })

  test('focus pauses timers, expands the stack, and keeps action and close wired', () => {
    expect(() => {
      Scene.scene(
        { update, view: renderToastView() },
        Scene.with(initialModel(stackedState())),
        Scene.focus(Scene.role('region', { name: 'Notifications' })),
        Scene.expect(Scene.text('Paused true')).toExist(),
        Scene.expect(Scene.text('Viewport focus-start')).toExist(),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveAttr('data-expanded'),
        Scene.click(Scene.role('button', { name: 'Undo' })),
        Scene.click(
          Scene.nth(
            Scene.all.role('button', { name: 'Dismiss notification' }),
            0,
          ),
        ),
        Scene.expect(Scene.text('Action 1')).toExist(),
        Scene.expect(Scene.text('Close 1')).toExist(),
        Scene.blur(Scene.role('region', { name: 'Notifications' })),
        Scene.expect(Scene.text('Paused false')).toExist(),
        Scene.expect(Scene.text('Viewport focus-end')).toExist(),
      )
    }).not.toThrow()
  })
})
