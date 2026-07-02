import { Match as M, Schema as S } from 'effect'
import { Story } from 'foldkit'
import type { Command } from 'foldkit'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as ToastPrimitive from '../../base-ui/toast'
import * as Toast from './index'

// MODEL

const Model = S.Struct({
  state: ToastPrimitive.ToastState,
  actionPresses: S.Number,
  closePresses: S.Number,
})
type Model = typeof Model.Type

const initialModel = (state: ToastPrimitive.ToastState): Model => ({
  state,
  actionPresses: 0,
  closePresses: 0,
})

// MESSAGE

const ClickedShowToast = m('ClickedShowToast')
const ClickedShowDescriptionToast = m('ClickedShowDescriptionToast')
const ClickedShowTypeToast = m('ClickedShowTypeToast', {
  variant: S.Union([S.Literal('default'), S.Literal('error')]),
})
const ClickedPerformAction = m('ClickedPerformAction')
const PressedToastAction = m('PressedToastAction', {
  press: ToastPrimitive.ToastActionPress,
})
const RequestedToastClose = m('RequestedToastClose', {
  request: ToastPrimitive.ToastCloseRequest,
})

const Message = S.Union([
  ClickedShowToast,
  ClickedShowDescriptionToast,
  ClickedShowTypeToast,
  ClickedPerformAction,
  PressedToastAction,
  RequestedToastClose,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const addToast = (
  state: ToastPrimitive.ToastState,
  options: ToastPrimitive.ToastAddOptions,
): ToastPrimitive.ToastState => ToastPrimitive.addToast(state, options).state

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ClickedShowToast: () => [
        evo(model, {
          state: () =>
            addToast(model.state, {
              id: 'toast-demo',
              title: 'Scheduled: Catch up',
              description: 'Friday, February 10, 2023 at 5:57 PM',
              actionLabel: 'Undo',
              timeout: 5000,
              height: 84,
            }),
        }),
        [],
      ],
      ClickedShowDescriptionToast: () => [
        evo(model, {
          state: () =>
            addToast(model.state, {
              id: 'toast-simple',
              description: 'Your message has been sent.',
              timeout: 5000,
              height: 64,
            }),
        }),
        [],
      ],
      ClickedShowTypeToast: ({ variant }) => {
        const options = M.value(variant).pipe(
          M.when('default', () => ({
            id: 'toast-title',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
            timeout: 5000,
            height: 84,
          })),
          M.when('error', () => ({
            id: 'toast-destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
            type: 'error',
            actionLabel: 'Try again',
            timeout: 5000,
            height: 96,
          })),
          M.exhaustive,
        )

        return [
          evo(model, {
            state: () => addToast(model.state, options),
          }),
          [],
        ]
      },
      ClickedPerformAction: () => [
        evo(model, {
          state: () =>
            addToast(model.state, {
              id: 'toast-action',
              title: 'Uh oh! Something went wrong.',
              description: 'There was a problem with your request.',
              actionLabel: 'Try again',
              timeout: 5000,
              height: 96,
            }),
        }),
        [],
      ],
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
    }),
  )

describe('shadcn/toast class helpers', () => {
  test('export the shadcn toast class vocabulary', () => {
    expect(Toast.toastProviderClassName()).toContain('toaster')
    expect(Toast.toastViewportClassName()).toContain('pointer-events-auto')
    expect(Toast.toastViewportClassName()).toContain(
      'min-h-[var(--toast-frontmost-height)]',
    )
    expect(Toast.toastClassName()).toContain('absolute')
    expect(Toast.toastClassName()).toContain('rounded-md')
  })

  test('export the shadcn toast action class vocabulary', () => {
    expect(Toast.toastActionClassName()).toContain('h-8')
    expect(Toast.toastCloseClassName()).toContain('opacity-0')
  })
})

describe('shadcn/toast update', () => {
  test('adds toasts, updates matching ids, and applies the visible limit', () => {
    Story.story(
      update,
      Story.with(
        initialModel(
          ToastPrimitive.createToastState({
            limit: 2,
            timeout: 750,
          }),
        ),
      ),
      Story.message(ClickedShowToast()),
      Story.model(model => {
        expect(model.state.toasts).toHaveLength(1)
        expect(model.state.toasts[0]?.title).toBe('Scheduled: Catch up')
        expect(model.state.toasts[0]?.actionLabel).toBe('Undo')
        expect(model.state.toasts[0]?.duration).toBe(5000)
      }),
      Story.message(ClickedShowToast()),
      Story.model(model => {
        expect(model.state.toasts).toHaveLength(1)
        expect(model.state.toasts[0]?.updateKey).toBe(1)
      }),
      Story.message(ClickedShowDescriptionToast()),
      Story.message(ClickedPerformAction()),
      Story.model(model => {
        expect(model.state.toasts).toHaveLength(3)
        expect(model.state.toasts[0]?.id).toBe('toast-action')
        expect(model.state.toasts[2]?.id).toBe('toast-demo')
        expect(model.state.toasts[2]?.limited).toBeTruthy()
      }),
    )
  })

  test('maps the destructive example onto the local toast state', () => {
    Story.story(
      update,
      Story.with(initialModel(ToastPrimitive.createToastState())),
      Story.message(ClickedShowTypeToast({ variant: 'error' })),
      Story.model(model => {
        expect(model.state.toasts).toHaveLength(1)
        expect(model.state.toasts[0]?.type).toBe('error')
        expect(model.state.toasts[0]?.actionLabel).toBe('Try again')
      }),
    )
  })

  test('routes action and close facts back through the parent model', () => {
    Story.story(
      update,
      Story.with(initialModel(ToastPrimitive.createToastState())),
      Story.message(ClickedPerformAction()),
      Story.message(
        PressedToastAction({
          press: {
            id: 'toast-action',
          },
        }),
      ),
      Story.message(
        RequestedToastClose({
          request: ToastPrimitive.closeRequest('toast-action', 'close-button'),
        }),
      ),
      Story.model(model => {
        expect(model.actionPresses).toBe(1)
        expect(model.closePresses).toBe(1)
        expect(model.state.toasts[0]?.transitionStatus).toBe('ending')
      }),
    )
  })
})
