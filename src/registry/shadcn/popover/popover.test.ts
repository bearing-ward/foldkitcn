/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Popover from './index'
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

const viewPopover =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'open' | 'toView'> &
      Readonly<{ open?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Popover.view<Message>({
      id: 'profile-popover',
      open: config.open ?? true,
      titleId: 'profile-popover-title',
      descriptionId: 'profile-popover-description',
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button([...attributes.trigger], ['Open profile']),
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
                              [...attributes.header],
                              [
                                h.h3([...attributes.title], ['Dimensions']),
                                h.p(
                                  [...attributes.description],
                                  ['Set the dimensions for the layer.'],
                                ),
                              ],
                            ),
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

describe('shadcn/popover class helpers', () => {
  test('use the exact origin positioner and content class strings', () => {
    expect(Popover.popoverPositionerClassName()).toBe('isolate z-50')
    expect(Popover.popoverContentClassName()).toBe(
      'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
    )
    expect(Popover.popoverContentClassName({ dir: 'rtl' })).toBe(
      'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
    )
  })

  test('use the exact origin header, title, and description class strings', () => {
    expect(Popover.popoverHeaderClassName()).toBe(
      'flex flex-col gap-0.5 text-sm',
    )
    expect(Popover.popoverTitleClassName()).toBe('font-medium')
    expect(Popover.popoverDescriptionClassName()).toBe('text-muted-foreground')
  })

  test('preserve custom root, positioner, content, and header classes', () => {
    expect(Popover.popoverClassName({ className: 'custom-root' })).toContain(
      'custom-root',
    )
    expect(
      Popover.popoverPositionerClassName({ className: 'custom-positioner' }),
    ).toContain('custom-positioner')
    expect(
      Popover.popoverContentClassName({ className: 'custom-content' }),
    ).toContain('custom-content')
    expect(
      Popover.popoverHeaderClassName({ className: 'custom-header' }),
    ).toContain('custom-header')
  })

  test('preserve custom title and description classes', () => {
    expect(
      Popover.popoverTitleClassName({ className: 'custom-title' }),
    ).toContain('custom-title')
    expect(
      Popover.popoverDescriptionClassName({
        className: 'custom-description',
      }),
    ).toContain('custom-description')
  })
})

describe('shadcn/popover view', () => {
  test('adds shadcn root, trigger, content, header, title, and description slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewPopover({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="popover"]')).toHaveAttr(
          'data-side',
          'bottom',
        ),
        Scene.expect(Scene.role('button', { name: 'Open profile' })).toHaveAttr(
          'data-slot',
          'popover-trigger',
        ),
        Scene.expect(Scene.selector('#profile-popover-positioner')).toHaveAttr(
          'class',
          Popover.popoverPositionerClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="popover-content"]'),
        ).toHaveAttr('class', Popover.popoverContentClassName()),
        Scene.expect(Scene.selector('[data-slot="popover-header"]')).toHaveAttr(
          'class',
          Popover.popoverHeaderClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="popover-title"]')).toHaveAttr(
          'class',
          Popover.popoverTitleClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="popover-description"]'),
        ).toHaveAttr('class', Popover.popoverDescriptionClassName()),
      )
    }).not.toThrow()
  })

  test('passes Base UI open, disabled, and placement attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewPopover({
            align: 'start',
            alignOffset: 2,
            contentClassName: 'w-80',
            isDisabled: true,
            side: 'right',
            sideOffset: 4,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Open profile' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(
          Scene.role('button', { name: 'Open profile' }),
        ).not.toHaveHandler('click'),
        Scene.expect(
          Scene.selector('[data-slot="popover-content"]'),
        ).toHaveAttr('data-side', 'right'),
        Scene.expect(
          Scene.selector('[data-slot="popover-content"]'),
        ).toHaveAttr('data-align', 'start'),
        Scene.expect(
          Scene.selector('[data-slot="popover-content"]'),
        ).toHaveAttr('data-side-offset', '4'),
        Scene.expect(
          Scene.selector('[data-slot="popover-content"]'),
        ).toHaveAttr('data-align-offset', '2'),
        Scene.expect(
          Scene.selector('[data-slot="popover-content"]'),
        ).toHaveAttr(
          'class',
          Popover.popoverContentClassName({ className: 'w-80' }),
        ),
      )
    }).not.toThrow()
  })

  test('passes dir and closed force-mounted state through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewPopover({
            dir: 'rtl',
            forceMount: true,
            open: false,
            side: 'inline-start',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="popover"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(
          Scene.selector('[data-slot="popover-content"]'),
        ).toHaveAttr('dir', 'rtl'),
        Scene.expect(
          Scene.selector('[data-slot="popover-content"]'),
        ).toHaveAttr('hidden'),
        Scene.expect(
          Scene.selector('[data-slot="popover-content"]'),
        ).toHaveAttr('class', Popover.popoverContentClassName({ dir: 'rtl' })),
      )
    }).not.toThrow()
  })
})

describe('shadcn/popover installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/popover',
      '@base-ui-components/react/popover',
      '@radix-ui/react-popover',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/base-nova/ui/popover',
      '@/styles/base-nova/ui-rtl/popover',
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
      'shadcn/label',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/popover/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    const installableSource = `${indexModule.default}\n${examplesModule.default}`

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/popover/index.ts',
      'src/registry/shadcn/popover/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSource.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
