/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { cn } from '../../../utils/cn'
import * as Button from '../button'
import * as AlertDialog from './index'
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

const viewAlertDialog =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'open' | 'toView'> &
      Readonly<{ open?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return AlertDialog.view<Message>({
      id: 'account-alert-dialog',
      open: config.open ?? true,
      titleId: 'account-alert-dialog-title',
      descriptionId: 'account-alert-dialog-description',
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button([...attributes.trigger], ['Show Dialog']),
            h.dialog(
              [...attributes.dialog],
              attributes.isMounted
                ? [
                    h.div([...attributes.backdrop.root], []),
                    h.div(
                      [...attributes.popup.root],
                      [
                        h.div(
                          [...attributes.header],
                          [
                            h.div([...attributes.media], ['!']),
                            h.h2(
                              [...attributes.title],
                              ['Are you absolutely sure?'],
                            ),
                            h.p(
                              [...attributes.description],
                              ['This action cannot be undone.'],
                            ),
                          ],
                        ),
                        h.div(
                          [...attributes.footer],
                          [
                            h.button([...attributes.cancel], ['Cancel']),
                            h.button([...attributes.action], ['Continue']),
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

describe('shadcn/alert-dialog class helpers', () => {
  test('use the exact origin overlay, content, and RTL content class strings', () => {
    expect(AlertDialog.alertDialogOverlayClassName()).toBe(
      'fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
    )
    expect(AlertDialog.alertDialogContentClassName()).toBe(
      'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
    )
    expect(AlertDialog.alertDialogContentClassName({ dir: 'rtl' })).toBe(
      'group/alert-dialog-content fixed start-1/2 top-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm rtl:translate-x-1/2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
    )
  })

  test('use the exact origin header, footer, and media class strings', () => {
    expect(AlertDialog.alertDialogHeaderClassName()).toBe(
      'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
    )
    expect(AlertDialog.alertDialogHeaderClassName({ dir: 'rtl' })).toBe(
      'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-start sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
    )
    expect(AlertDialog.alertDialogFooterClassName()).toBe(
      '-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end',
    )
    expect(AlertDialog.alertDialogMediaClassName()).toBe(
      "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
    )
  })

  test('use the exact origin title and description class strings', () => {
    expect(AlertDialog.alertDialogTitleClassName()).toBe(
      'cn-font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
    )
    expect(AlertDialog.alertDialogDescriptionClassName()).toBe(
      'text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
    )
  })

  test('compose action and cancel classes from shadcn Button variants', () => {
    expect(AlertDialog.alertDialogCancelClassName()).toBe(
      cn(Button.buttonVariants({ variant: 'outline' })),
    )
    expect(AlertDialog.alertDialogActionClassName()).toBe(
      cn(Button.buttonVariants({ variant: 'default' })),
    )
    expect(
      AlertDialog.alertDialogActionClassName({
        variant: 'destructive',
        className: 'custom-action',
      }),
    ).toContain('custom-action')
  })
})

describe('shadcn/alert-dialog view', () => {
  test('adds shadcn slots, forced alert role, size, and classes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAlertDialog({}) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-overlay"]'),
        ).toHaveAttr('class', AlertDialog.alertDialogOverlayClassName()),
        Scene.expect(Scene.role('button', { name: 'Show Dialog' })).toHaveAttr(
          'data-slot',
          'alert-dialog-trigger',
        ),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-content"]'),
        ).toHaveAttr('role', 'alertdialog'),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-content"]'),
        ).toHaveAttr('data-size', 'default'),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-header"]'),
        ).toHaveAttr('class', AlertDialog.alertDialogHeaderClassName()),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-media"]'),
        ).toHaveAttr('class', AlertDialog.alertDialogMediaClassName()),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-footer"]'),
        ).toHaveAttr('class', AlertDialog.alertDialogFooterClassName()),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-title"]'),
        ).toHaveAttr('class', AlertDialog.alertDialogTitleClassName()),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-description"]'),
        ).toHaveAttr('class', AlertDialog.alertDialogDescriptionClassName()),
        Scene.expect(Scene.role('button', { name: 'Cancel' })).toHaveAttr(
          'data-slot',
          'alert-dialog-cancel',
        ),
        Scene.expect(Scene.role('button', { name: 'Continue' })).toHaveAttr(
          'data-slot',
          'alert-dialog-action',
        ),
      )
    }).not.toThrow()
  })

  test('passes forced modality, disabled state, and dismiss restrictions through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewAlertDialog({
            isDisabled: true,
            size: 'sm',
            dir: 'rtl',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="alert-dialog"]')).toHaveAttr(
          'data-modal',
          'true',
        ),
        Scene.expect(Scene.selector('#account-alert-dialog')).toHaveAttr(
          'aria-modal',
          'true',
        ),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-content"]'),
        ).toHaveAttr('data-size', 'sm'),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-content"]'),
        ).toHaveAttr('dir', 'rtl'),
        Scene.expect(Scene.role('button', { name: 'Show Dialog' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Cancel' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(
          Scene.selector('[data-slot="alert-dialog-overlay"]'),
        ).not.toHaveHandler('click'),
      )
    }).not.toThrow()
  })
})

describe('shadcn/alert-dialog installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/alert-dialog',
      '@base-ui-components/react/alert-dialog',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/base-nova/ui/alert-dialog',
      '@/styles/base-nova/ui-rtl/alert-dialog',
      '@/styles/base-nova/ui/button',
      '@/styles/base-nova/ui-rtl/button',
      '@/lib/utils',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/alert-dialog/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    const installableSource = `${indexModule.default}\n${examplesModule.default}`

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/alert-dialog/index.ts',
      'src/registry/shadcn/alert-dialog/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSource.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
