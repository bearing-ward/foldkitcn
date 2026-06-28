/// <reference types="vite/client" />

import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as BaseDialog from '../../base-ui/dialog'
import * as Sheet from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  lastReason: Sheet.SheetChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  lastReason: 'none',
}

// MESSAGE

const ChangedSheet = m('ChangedSheet', {
  open: S.Boolean,
  reason: Sheet.SheetChangeReason,
})
const Message = S.Union([ChangedSheet])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedSheet: ({ open, reason }) => [
        evo(model, {
          open: () => open,
          lastReason: () => reason,
        }),
        [],
      ],
    }),
  )

// VIEW

const viewSheet =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'onOpenChange' | 'open' | 'toView'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return Sheet.view<Message>({
      id: 'profile-sheet',
      open: model.open,
      titleId: 'profile-sheet-title',
      descriptionId: 'profile-sheet-description',
      onOpenChange: change => ChangedSheet(change),
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button([...attributes.trigger], ['Open sheet']),
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
            h.p([], [`Reason ${model.lastReason}`]),
          ],
        ),
    })
  }

describe('shadcn/sheet class helpers', () => {
  test('use the exact origin overlay and content class strings', () => {
    expect(Sheet.sheetOverlayClassName()).toBe(
      'fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs',
    )
    expect(Sheet.sheetContentClassName()).toBe(
      'fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm',
    )
    expect(Sheet.sheetContentClassName({ dir: 'rtl' })).toBe(
      'fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-e data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-s data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm rtl:data-[side=left]:data-ending-style:-translate-x-[-2.5rem] rtl:data-[side=left]:data-starting-style:-translate-x-[-2.5rem] rtl:data-[side=right]:data-ending-style:-translate-x-[2.5rem] rtl:data-[side=right]:data-starting-style:-translate-x-[2.5rem]',
    )
  })

  test('use the exact origin header, footer, title, and description class strings', () => {
    expect(Sheet.sheetHeaderClassName()).toBe('flex flex-col gap-0.5 p-4')
    expect(Sheet.sheetFooterClassName()).toBe('mt-auto flex flex-col gap-2 p-4')
    expect(Sheet.sheetTitleClassName()).toBe(
      'cn-font-heading text-base font-medium text-foreground',
    )
    expect(Sheet.sheetDescriptionClassName()).toBe(
      'text-sm text-muted-foreground',
    )
  })

  test('preserves custom classes through cn helpers', () => {
    expect(Sheet.sheetClassName({ className: 'custom-root' })).toContain(
      'custom-root',
    )
    expect(
      Sheet.sheetOverlayClassName({ className: 'custom-overlay' }),
    ).toContain('custom-overlay')
    expect(
      Sheet.sheetContentClassName({ className: 'custom-content' }),
    ).toContain('custom-content')
    expect(
      Sheet.sheetHeaderClassName({ className: 'custom-header' }),
    ).toContain('custom-header')
    expect(
      Sheet.sheetFooterClassName({ className: 'custom-footer' }),
    ).toContain('custom-footer')
  })

  test('preserves origin close button placement for LTR and RTL', () => {
    expect(Sheet.sheetCloseClassName()).toContain('absolute top-3 right-3')
    expect(Sheet.sheetCloseClassName({ dir: 'rtl' })).toContain(
      'absolute end-3 top-3',
    )
  })
})

describe('shadcn/sheet view', () => {
  test('adds shadcn slots, default side, and classes over Base UI Dialog attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSheet({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(Scene.selector('[data-slot="sheet"]')).toHaveAttr(
          'data-modal',
          'true',
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-overlay"]')).toHaveAttr(
          'class',
          Sheet.sheetOverlayClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-content"]')).toHaveAttr(
          'data-side',
          'right',
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-content"]')).toHaveAttr(
          'class',
          Sheet.sheetContentClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-header"]')).toHaveAttr(
          'class',
          Sheet.sheetHeaderClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-footer"]')).toHaveAttr(
          'class',
          Sheet.sheetFooterClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-title"]')).toHaveAttr(
          'class',
          Sheet.sheetTitleClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="sheet-description"]'),
        ).toHaveAttr('class', Sheet.sheetDescriptionClassName()),
        Scene.expect(Scene.role('button', { name: 'Close' })).toHaveAttr(
          'data-slot',
          'sheet-close',
        ),
      )
    }).not.toThrow()
  })

  test('passes side variants, Base UI modal, disabled, and RTL attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSheet({
            dir: 'rtl',
            isDisabled: true,
            modal: false,
            side: 'left',
          }),
        },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(Scene.selector('[data-slot="sheet"]')).toHaveAttr(
          'data-modal',
          'false',
        ),
        Scene.expect(Scene.selector('#profile-sheet')).toHaveAttr(
          'aria-modal',
          'false',
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-content"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-content"]')).toHaveAttr(
          'data-side',
          'left',
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-content"]')).toHaveAttr(
          'class',
          Sheet.sheetContentClassName({ dir: 'rtl' }),
        ),
        Scene.expect(Scene.role('button', { name: 'Open sheet' })).toHaveAttr(
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

  test('preserves open and closed data attributes through Dialog composition', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSheet({ forceMount: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="sheet-content"]')).toHaveAttr(
          'data-closed',
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-content"]')).toHaveAttr(
          'hidden',
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-overlay"]')).toHaveAttr(
          'data-closed',
        ),
      )
      Scene.scene(
        { update, view: viewSheet({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(Scene.selector('[data-slot="sheet-content"]')).toHaveAttr(
          'data-open',
        ),
        Scene.expect(Scene.selector('[data-slot="sheet-overlay"]')).toHaveAttr(
          'data-open',
        ),
      )
    }).not.toThrow()
  })

  test('model-owned open state changes from trigger, close, and outside press facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSheet({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Open sheet' })),
        Scene.expect(Scene.selector('#profile-sheet')).toHaveAttr('open'),
        Scene.expect(Scene.text('Reason trigger-press')).toExist(),
        Scene.click(Scene.role('button', { name: 'Close' })),
        Scene.expect(Scene.text('Reason close-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewSheet({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.click(Scene.selector('div[role="presentation"]')),
        Scene.expect(Scene.text('Reason outside-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewSheet({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(Scene.selector('#profile-sheet')).toHaveHandler('cancel'),
      )
    }).not.toThrow()
  })

  test('delegates Dialog command helpers, including focus-aware show behavior', () => {
    expect(Sheet.ShowDialog).toBe(BaseDialog.ShowDialog)
    expect(Sheet.CloseDialog).toBe(BaseDialog.CloseDialog)
    expect(Sheet.commandForOpenChange).toBe(BaseDialog.commandForOpenChange)
    expect(Sheet.triggerOpenChange()).toStrictEqual(
      BaseDialog.triggerOpenChange(),
    )
    expect(Sheet.escapeOpenChange()).toStrictEqual(
      BaseDialog.escapeOpenChange(),
    )
  })
})

describe('shadcn/sheet installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/dialog',
      '@base-ui-components/react/dialog',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/base-nova/ui/sheet',
      '@/styles/base-nova/ui-rtl/sheet',
      '@/styles/base-nova/ui/button',
      '@/styles/base-nova/ui-rtl/button',
      '@/styles/base-nova/ui/field',
      '@/styles/base-nova/ui-rtl/field',
      '@/styles/base-nova/ui/input',
      '@/styles/base-nova/ui-rtl/input',
      '@/styles/base-nova/ui/label',
      '@/styles/base-nova/ui-rtl/label',
      '@/lib/utils',
      'shadcn/direction',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/sheet/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    const installableSource = `${indexModule.default}\n${examplesModule.default}`

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/sheet/index.ts',
      'src/registry/shadcn/sheet/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSource.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
