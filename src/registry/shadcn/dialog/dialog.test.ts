/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Dialog from './index'
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

const viewDialog =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'open' | 'toView'> &
      Readonly<{ open?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Dialog.view<Message>({
      id: 'profile-dialog',
      open: config.open ?? true,
      titleId: 'profile-dialog-title',
      descriptionId: 'profile-dialog-description',
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button([...attributes.trigger], ['Open profile']),
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
                            h.h2([...attributes.title], ['Edit profile']),
                            h.p(
                              [...attributes.description],
                              ['Make changes to your profile.'],
                            ),
                          ],
                        ),
                        h.div(
                          [...attributes.footer],
                          [h.button([...attributes.close], ['Close'])],
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

describe('shadcn/dialog class helpers', () => {
  test('use the exact origin overlay, content, and RTL content class strings', () => {
    expect(Dialog.dialogOverlayClassName()).toBe(
      'fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
    )
    expect(Dialog.dialogContentClassName()).toBe(
      'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
    )
    expect(Dialog.dialogContentClassName({ dir: 'rtl' })).toBe(
      'fixed start-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm rtl:translate-x-1/2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
    )
  })

  test('use the exact origin header, footer, title, and description class strings', () => {
    expect(Dialog.dialogHeaderClassName()).toBe('flex flex-col gap-2')
    expect(Dialog.dialogFooterClassName()).toBe(
      '-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end',
    )
    expect(Dialog.dialogTitleClassName()).toBe(
      'cn-font-heading text-base leading-none font-medium',
    )
    expect(Dialog.dialogDescriptionClassName()).toBe(
      'text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
    )
  })

  test('use the exact origin close class strings', () => {
    expect(Dialog.dialogCloseClassName()).toBe(
      'group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute top-2 right-2',
    )
    expect(Dialog.dialogCloseClassName({ dir: 'rtl' })).toBe(
      'group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute end-2 top-2',
    )
  })

  test('preserve custom root, overlay, content, header, and footer classes', () => {
    expect(Dialog.dialogClassName({ className: 'custom-root' })).toContain(
      'custom-root',
    )
    expect(
      Dialog.dialogOverlayClassName({ className: 'custom-overlay' }),
    ).toContain('custom-overlay')
    expect(
      Dialog.dialogContentClassName({ className: 'custom-content' }),
    ).toContain('custom-content')
    expect(
      Dialog.dialogHeaderClassName({ className: 'custom-header' }),
    ).toContain('custom-header')
    expect(
      Dialog.dialogFooterClassName({ className: 'custom-footer' }),
    ).toContain('custom-footer')
  })

  test('preserve custom title, description, and close classes', () => {
    expect(
      Dialog.dialogTitleClassName({ className: 'custom-title' }),
    ).toContain('custom-title')
    expect(
      Dialog.dialogDescriptionClassName({ className: 'custom-description' }),
    ).toContain('custom-description')
    expect(
      Dialog.dialogCloseClassName({ className: 'custom-close' }),
    ).toContain('custom-close')
  })
})

describe('shadcn/dialog view', () => {
  test('adds shadcn overlay, content, header, footer, title, description, and close slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewDialog({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="dialog-overlay"]')).toHaveAttr(
          'class',
          Dialog.dialogOverlayClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="dialog-content"]')).toHaveAttr(
          'class',
          Dialog.dialogContentClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="dialog-header"]')).toHaveAttr(
          'class',
          Dialog.dialogHeaderClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="dialog-footer"]')).toHaveAttr(
          'class',
          Dialog.dialogFooterClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="dialog-title"]')).toHaveAttr(
          'class',
          Dialog.dialogTitleClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="dialog-description"]'),
        ).toHaveAttr('class', Dialog.dialogDescriptionClassName()),
        Scene.expect(Scene.role('button', { name: 'Close' })).toHaveAttr(
          'data-slot',
          'dialog-close',
        ),
      )
    }).not.toThrow()
  })

  test('passes Base UI open, modal, disabled, and close attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewDialog({
            isDisabled: true,
            modal: false,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="dialog"]')).toHaveAttr(
          'data-modal',
          'false',
        ),
        Scene.expect(Scene.selector('#profile-dialog')).toHaveAttr(
          'aria-modal',
          'false',
        ),
        Scene.expect(Scene.selector('#profile-dialog')).toHaveAttr('open'),
        Scene.expect(Scene.role('button', { name: 'Open profile' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Close' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/dialog installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/dialog',
      '@base-ui-components/react/dialog',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/base-nova/ui/dialog',
      '@/styles/base-nova/ui-rtl/dialog',
      '@/styles/base-nova/ui/button',
      '@/styles/base-nova/ui/input',
      '@/styles/base-nova/ui/field',
      '@/styles/base-nova/ui/label',
      '@/styles/base-nova/ui-rtl/button',
      '@/styles/base-nova/ui-rtl/input',
      '@/styles/base-nova/ui-rtl/field',
      '@/styles/base-nova/ui-rtl/label',
      '@/lib/utils',
      'shadcn/field',
      'shadcn/input',
      'shadcn/label',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/dialog/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    const installableSource = `${indexModule.default}\n${examplesModule.default}`

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/dialog/index.ts',
      'src/registry/shadcn/dialog/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSource.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
