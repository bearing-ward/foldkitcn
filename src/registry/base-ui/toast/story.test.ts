import { Match as M, Schema as S } from 'effect'
import { Story } from 'foldkit'
import type { Command } from 'foldkit'
import { m } from 'foldkit/message'
import { describe, expect, test } from 'vitest'

import * as Toast from './index'

// MODEL

const Model = S.Struct({
  state: Toast.ToastState,
})
type Model = typeof Model.Type

const initialModel = (state: Toast.ToastState): Model => ({
  state,
})

const toToastAddOptions = (options: {
  id: string
  title?: string | undefined
  description?: string | undefined
  type?: string | undefined
  priority?: Toast.ToastPriority | undefined
  duration?: number | undefined
  timeout?: number | undefined
  actionLabel?: string | undefined
  position?: Toast.ToastPosition | undefined
  promiseState?: Toast.ToastPromiseState | undefined
}): Toast.ToastAddOptions => ({
  ...(options.id === undefined ? {} : { id: options.id }),
  ...(options.title === undefined ? {} : { title: options.title }),
  ...(options.description === undefined
    ? {}
    : { description: options.description }),
  ...(options.type === undefined ? {} : { type: options.type }),
  ...(options.priority === undefined ? {} : { priority: options.priority }),
  ...(options.duration === undefined ? {} : { duration: options.duration }),
  ...(options.timeout === undefined ? {} : { timeout: options.timeout }),
  ...(options.actionLabel === undefined
    ? {}
    : { actionLabel: options.actionLabel }),
  ...(options.position === undefined ? {} : { position: options.position }),
  ...(options.promiseState === undefined
    ? {}
    : { promiseState: options.promiseState }),
})

// MESSAGE

const AddedToast = m('AddedToast', {
  options: S.Struct({
    id: S.String,
    title: S.optional(S.String),
    description: S.optional(S.String),
    type: S.optional(S.String),
    priority: S.optional(Toast.ToastPriority),
    duration: S.optional(S.Number),
    timeout: S.optional(S.Number),
    actionLabel: S.optional(S.String),
    position: S.optional(Toast.ToastPosition),
    promiseState: S.optional(Toast.ToastPromiseState),
  }),
})
const ClosedToast = m('ClosedToast', {
  request: Toast.ToastCloseRequest,
})
const RemovedToast = m('RemovedToast', {
  id: S.String,
})
const ChangedViewport = m('ChangedViewport', {
  interaction: Toast.ToastViewportInteraction,
})
const ResolvedPromiseToast = m('ResolvedPromiseToast', {
  id: S.String,
  result: Toast.ToastPromiseState,
})
const ChangedSwipe = m('ChangedSwipe', {
  change: Toast.ToastSwipeChange,
})

const Message = S.Union([
  AddedToast,
  ClosedToast,
  RemovedToast,
  ChangedViewport,
  ResolvedPromiseToast,
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
      AddedToast: ({ options }) => [
        {
          state: Toast.addToast(model.state, toToastAddOptions(options)).state,
        },
        [],
      ],
      ClosedToast: ({ request }) => [
        {
          state: Toast.closeToast(model.state, request),
        },
        [],
      ],
      RemovedToast: ({ id }) => [
        {
          state: Toast.removeToast(model.state, id),
        },
        [],
      ],
      ChangedViewport: ({ interaction }) => [
        {
          state: Toast.applyViewportInteraction(model.state, interaction),
        },
        [],
      ],
      ResolvedPromiseToast: ({ id, result }) => [
        {
          state: Toast.resolvePromiseToast(model.state, id, result),
        },
        [],
      ],
      ChangedSwipe: ({ change }) => [
        {
          state: Toast.updateSwipe(model.state, change),
        },
        [],
      ],
    }),
  )

// TESTS

describe('base-ui/toast update', () => {
  test('adds toasts, refreshes existing ids, and applies the limit', () => {
    Story.story(
      update,
      Story.with(
        initialModel(
          Toast.createToastState({
            limit: 2,
            timeout: 750,
          }),
        ),
      ),
      Story.message(
        AddedToast({
          options: {
            id: 'saved',
            title: 'Saved',
            description: 'Your changes were stored.',
            type: 'success',
          },
        }),
      ),
      Story.model(model => {
        expect(model.state.toasts).toHaveLength(1)
        expect(model.state.toasts[0]?.title).toBe('Saved')
        expect(model.state.toasts[0]?.duration).toBe(750)
        expect(model.state.toasts[0]?.timerStatus).toBe('running')
      }),
      Story.message(
        AddedToast({
          options: {
            id: 'saved',
            title: 'Saved again',
            description: 'The toast was updated in place.',
            timeout: 1200,
          },
        }),
      ),
      Story.model(model => {
        expect(model.state.toasts).toHaveLength(1)
        expect(model.state.toasts[0]?.title).toBe('Saved again')
        expect(model.state.toasts[0]?.duration).toBe(1200)
        expect(model.state.toasts[0]?.remainingDuration).toBe(1200)
        expect(model.state.toasts[0]?.updateKey).toBe(1)
      }),
      Story.message(
        AddedToast({
          options: {
            id: 'queued',
            title: 'Queued',
          },
        }),
      ),
      Story.message(
        AddedToast({
          options: {
            id: 'third',
            title: 'Third',
          },
        }),
      ),
      Story.model(model => {
        expect(model.state.toasts).toHaveLength(3)
        expect(model.state.toasts[2]?.limited).toBeTruthy()
        expect(model.state.toasts[2]?.transitionStatus).toBe('starting')
      }),
    )
  })

  test('pauses and resumes toast timers when viewport interaction changes', () => {
    Story.story(
      update,
      Story.with(
        initialModel(
          Toast.createToastState({
            toasts: [
              {
                id: 'saved',
                title: 'Saved',
                description: 'Your changes were stored.',
                duration: 5000,
                timerStatus: 'running',
              },
            ],
          }),
        ),
      ),
      Story.message(
        ChangedViewport({
          interaction: {
            type: 'focus-start',
          },
        }),
      ),
      Story.model(model => {
        expect(model.state.timersPaused).toBeTruthy()
        expect(model.state.toasts[0]?.timerStatus).toBe('paused')
      }),
      Story.message(
        ChangedViewport({
          interaction: {
            type: 'focus-end',
          },
        }),
      ),
      Story.model(model => {
        expect(model.state.timersPaused).toBeFalsy()
        expect(model.state.toasts[0]?.timerStatus).toBe('running')
      }),
    )
  })

  test('resolves promise toasts from loading to success', () => {
    Story.story(
      update,
      Story.with(
        initialModel(
          Toast.startPromiseToast(Toast.createToastState(), {
            id: 'upload',
            loading: 'Uploading report',
          }).state,
        ),
      ),
      Story.model(model => {
        expect(model.state.toasts[0]?.type).toBe('loading')
        expect(model.state.toasts[0]?.duration).toBe(0)
      }),
      Story.message(
        ResolvedPromiseToast({
          id: 'upload',
          result: Toast.ToastPromiseSucceeded({
            title: 'Upload complete',
            description: 'The report is ready to share.',
            duration: 5000,
          }),
        }),
      ),
      Story.model(model => {
        expect(model.state.toasts[0]?.type).toBe('success')
        expect(model.state.toasts[0]?.duration).toBe(5000)
        expect(model.state.toasts[0]?.title).toBe('Upload complete')
      }),
    )
  })

  test('closes, removes, and swipes toast state in place', () => {
    Story.story(
      update,
      Story.with(
        initialModel(
          Toast.createToastState({
            toasts: [
              {
                id: 'swipe-me',
                title: 'Swipe me',
                description: 'Dismiss me with a gesture.',
                duration: 5000,
              },
            ],
          }),
        ),
      ),
      Story.message(
        ChangedSwipe({
          change: {
            id: 'swipe-me',
            phase: 'move',
            pointerType: 'touch',
            x: 120,
            y: 24,
          },
        }),
      ),
      Story.model(model => {
        expect(model.state.toasts[0]?.swipe?.status).toBe('swiping')
        expect(model.state.toasts[0]?.swipe?.movementX).toBe(120)
        expect(model.state.toasts[0]?.swipe?.movementY).toBe(24)
      }),
      Story.message(
        ChangedSwipe({
          change: {
            id: 'swipe-me',
            phase: 'end',
            pointerType: 'touch',
            x: 160,
            y: 20,
          },
        }),
      ),
      Story.model(model => {
        expect(model.state.toasts[0]?.swipe?.status).toBe('dismissed')
      }),
      Story.message(
        ClosedToast({
          request: {
            reason: 'close-button',
            id: 'swipe-me',
          },
        }),
      ),
      Story.model(model => {
        expect(model.state.toasts[0]?.transitionStatus).toBe('ending')
        expect(model.state.toasts[0]?.timerStatus).toBe('idle')
      }),
      Story.message(RemovedToast({ id: 'swipe-me' })),
      Story.model(model => {
        expect(model.state.toasts).toHaveLength(0)
      }),
    )
  })
})
