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
import * as SonnerExamples from './examples'
import * as Sonner from './index'

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
const ClickedShowPositionToast = m('ClickedShowPositionToast', {
  position: ToastPrimitive.ToastViewportPosition,
})
const ClickedShowTypeToast = m('ClickedShowTypeToast', {
  variant: S.Union([
    S.Literal('default'),
    S.Literal('success'),
    S.Literal('info'),
    S.Literal('warning'),
    S.Literal('error'),
    S.Literal('promise'),
  ]),
})
const PressedToastAction = m('PressedToastAction', {
  press: ToastPrimitive.ToastActionPress,
})
const RequestedToastClose = m('RequestedToastClose', {
  request: ToastPrimitive.ToastCloseRequest,
})
const ResolvedPromiseToast = m('ResolvedPromiseToast', {
  id: S.String,
  result: ToastPrimitive.ToastPromiseState,
})

const TestMessage = S.Union([
  ClickedShowToast,
  ClickedShowDescriptionToast,
  ClickedShowPositionToast,
  ClickedShowTypeToast,
  PressedToastAction,
  RequestedToastClose,
  ResolvedPromiseToast,
])
type Message = typeof TestMessage.Type

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
              id: 'sonner-default',
              title: 'Event has been created',
            }),
        }),
        [],
      ],
      ClickedShowDescriptionToast: () => [
        evo(model, {
          state: () =>
            addToast(model.state, {
              id: 'sonner-description',
              title: 'Event has been created',
              description: 'Monday, January 3rd at 6:00pm',
            }),
        }),
        [],
      ],
      ClickedShowPositionToast: ({ position }) => [
        evo(model, {
          state: () =>
            addToast(model.state, {
              id: `sonner-position-${position}`,
              title: 'Event has been created',
              position:
                SonnerExamples.toastViewportPositionFromPosition(position),
            }),
        }),
        [],
      ],
      ClickedShowTypeToast: ({ variant }) => {
        if (variant === 'promise') {
          return [
            evo(model, {
              state: () =>
                ToastPrimitive.startPromiseToast(model.state, {
                  id: 'sonner-promise',
                  loading: 'Loading...',
                }).state,
            }),
            [],
          ]
        }

        const toastOptions = M.value(variant).pipe(
          M.when('default', () => ({
            id: 'sonner-default-type',
            title: 'Event has been created',
          })),
          M.when('success', () => ({
            id: 'sonner-success',
            title: 'Event has been created',
            type: 'success',
          })),
          M.when('info', () => ({
            id: 'sonner-info',
            title: 'Be at the area 10 minutes before the event time',
            type: 'info',
          })),
          M.when('warning', () => ({
            id: 'sonner-warning',
            title: 'Event start time cannot be earlier than 8am',
            type: 'warning',
          })),
          M.when('error', () => ({
            id: 'sonner-error',
            title: 'Event has not been created',
            type: 'error',
          })),
          M.exhaustive,
        )

        return [
          evo(model, {
            state: () => addToast(model.state, toastOptions),
          }),
          [],
        ]
      },
      PressedToastAction: () => [
        evo(model, {
          actionPresses: presses => presses + 1,
        }),
        [],
      ],
      RequestedToastClose: ({ request }) => [
        evo(model, {
          closePresses: closes => closes + 1,
          state: () => ToastPrimitive.closeToast(model.state, request),
        }),
        [],
      ],
      ResolvedPromiseToast: ({ id, result }) => [
        evo(model, {
          state: () =>
            ToastPrimitive.resolvePromiseToast(model.state, id, result),
        }),
        [],
      ],
    }),
  )

// VIEW

const exampleController = (
  model: Model,
): SonnerExamples.ToastExampleController<Message> => ({
  state: model.state,
  onToastMessage: message => message,
})

const toasterView =
  (
    options: Readonly<{
      theme?: Sonner.SonnerTheme
      viewportPosition?: ToastPrimitive.ToastViewportPosition
    }> = {},
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [h.Class('grid gap-4')],
      [
        Sonner.Toaster<Message>({
          id: 'notifications',
          state: model.state,
          theme: options.theme ?? 'system',
          ...(options.viewportPosition === undefined
            ? {}
            : { viewportPosition: options.viewportPosition }),
          onAction: press => PressedToastAction({ press }),
          onClose: request => RequestedToastClose({ request }),
        }),
        h.p([], [`Action ${model.actionPresses}`]),
        h.p([], [`Close ${model.closePresses}`]),
      ],
    )
  }

const exampleWithToaster =
  (
    view: (controller: SonnerExamples.ToastExampleController<Message>) => Html,
    options: Readonly<{
      theme?: Sonner.SonnerTheme
      viewportPosition?: ToastPrimitive.ToastViewportPosition
    }> = {},
  ) =>
  (model: Model): Html => {
    const h = html<Message>()
    const controller = exampleController(model)

    return h.div(
      [h.Class('grid gap-4')],
      [
        view(controller),
        SonnerExamples.renderSonnerDemoToaster(controller, options),
      ],
    )
  }

describe('shadcn/sonner class helpers', () => {
  test('exports the theme schema and class canonicalization helpers', () => {
    expect(S.decodeUnknownSync(Sonner.SonnerTheme)('dark')).toBe('dark')
    expect(Sonner.sonnerProviderClassName()).toContain('toaster')
    expect(Sonner.sonnerToastClassName()).toContain('rounded-2xl')
    expect(Sonner.sonnerActionClassName()).toContain('border-input')
    expect(Sonner.sonnerCloseClassName()).toContain('size-8')
  })
})

describe('shadcn/sonner view', () => {
  test('renders a live region with themed provider markup and button styling', () => {
    const state = ToastPrimitive.createToastState({
      toasts: [
        {
          id: 'saved',
          title: 'Saved',
          description: 'Your changes were stored.',
          type: 'success',
          actionLabel: 'Undo',
        },
      ],
    })

    expect(() => {
      Scene.scene(
        { update, view: toasterView({ theme: 'dark' }) },
        Scene.with(initialModel(state)),
        Scene.expect(
          Scene.role('region', { name: 'Notifications' }),
        ).toHaveAttr('aria-live', 'polite'),
        Scene.expect(
          Scene.selector('[data-slot="sonner-provider"]'),
        ).toHaveAttr('data-theme', 'dark'),
        Scene.expect(Scene.selector('[data-slot="sonner-toast"]')).toHaveAttr(
          'class',
          Sonner.sonnerToastClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="sonner-action"]')).toHaveAttr(
          'class',
          Sonner.sonnerActionClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="sonner-close"]')).toHaveAttr(
          'class',
          Sonner.sonnerCloseClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('keeps action and close controls wired through the Foldkit update loop', () => {
    const state = ToastPrimitive.createToastState({
      toasts: [
        {
          id: 'saved',
          title: 'Saved',
          description: 'Your changes were stored.',
          type: 'success',
          actionLabel: 'Undo',
        },
      ],
    })

    expect(() => {
      Scene.scene(
        { update, view: toasterView() },
        Scene.with(initialModel(state)),
        Scene.click(Scene.role('button', { name: 'Undo' })),
        Scene.expect(Scene.text('Action 1')).toExist(),
        Scene.click(Scene.role('button', { name: 'Dismiss notification' })),
        Scene.expect(Scene.role('dialog', { name: 'Saved' })).not.toExist(),
        Scene.expect(Scene.text('Close 1')).toExist(),
      )
    }).not.toThrow()
  })

  test('renders the demo, position, and types examples with interactive triggers', () => {
    expect(() => {
      Scene.scene(
        { update, view: exampleWithToaster(SonnerExamples.SonnerDemo) },
        Scene.with(initialModel(ToastPrimitive.createToastState())),
        Scene.click(Scene.role('button', { name: 'Show Toast' })),
        Scene.expect(
          Scene.role('dialog', { name: 'Event has been created' }),
        ).toExist(),
      )
      Scene.scene(
        {
          update,
          view: exampleWithToaster(SonnerExamples.SonnerPosition),
        },
        Scene.with(initialModel(ToastPrimitive.createToastState())),
        Scene.click(Scene.role('button', { name: 'Top Left' })),
        Scene.expect(Scene.selector('[data-slot="sonner-toast"]')).toExist(),
      )
      Scene.scene(
        { update, view: exampleWithToaster(SonnerExamples.SonnerTypes) },
        Scene.with(initialModel(ToastPrimitive.createToastState())),
        Scene.click(Scene.role('button', { name: 'Promise' })),
        Scene.expect(Scene.text('Loading...')).toExist(),
        Scene.expect(Scene.selector('[data-type="loading"]')).toExist(),
        Scene.expect(Scene.selector('svg.animate-spin')).toExist(),
      )
    }).not.toThrow()
  })
})

describe('shadcn/sonner installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      'sonner',
      'next-themes',
      'lucide-react',
      'react',
      'react-dom',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/sonner/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/sonner/index.ts',
      'src/registry/shadcn/sonner/examples.ts',
    ])
    const installableSource = `${indexModule.default}\n${examplesModule.default}`
    const forbiddenImportPatterns = forbiddenRuntimeSpecifiers.flatMap(
      specifier => [
        `from "${specifier}"`,
        `from '${specifier}'`,
        `import("${specifier}")`,
        `import('${specifier}')`,
      ],
    )

    expect(
      forbiddenImportPatterns.filter(pattern =>
        installableSource.includes(pattern),
      ),
    ).toStrictEqual([])
  })
})
