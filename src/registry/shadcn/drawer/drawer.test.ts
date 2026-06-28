/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Drawer from './index'
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

const viewDrawer =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'open' | 'toView'> &
      Readonly<{ open?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Drawer.view<Message>({
      id: 'activity-drawer',
      open: config.open ?? true,
      titleId: 'activity-drawer-title',
      descriptionId: 'activity-drawer-description',
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button([...attributes.trigger], ['Open Drawer']),
            h.dialog(
              [...attributes.dialog],
              attributes.isMounted
                ? [
                    h.div([...attributes.backdrop.root], []),
                    h.div(
                      [...attributes.popup.root],
                      [
                        h.div([...attributes.handle], []),
                        h.div(
                          [...attributes.header],
                          [
                            h.h2([...attributes.title], ['Move Goal']),
                            h.p(
                              [...attributes.description],
                              ['Set your daily activity goal.'],
                            ),
                          ],
                        ),
                        h.div(
                          [...attributes.footer],
                          [h.button([...attributes.close], ['Cancel'])],
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

describe('shadcn/drawer class helpers', () => {
  test('use the exact origin overlay and content class strings', () => {
    expect(Drawer.drawerOverlayClassName()).toBe(
      'fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
    )
    expect(Drawer.drawerContentClassName()).toBe(
      'group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm',
    )
    expect(Drawer.drawerContentClassName({ dir: 'rtl' })).toBe(
      'group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:start-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-e-xl data-[vaul-drawer-direction=left]:border-e data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:end-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-s-xl data-[vaul-drawer-direction=right]:border-s data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm',
    )
  })

  test('use the exact origin handle, header, and footer strings', () => {
    expect(Drawer.drawerHandleClassName()).toBe(
      'mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block',
    )
    expect(Drawer.drawerHeaderClassName()).toBe(
      'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left',
    )
    expect(Drawer.drawerHeaderClassName({ dir: 'rtl' })).toBe(
      'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-start',
    )
    expect(Drawer.drawerFooterClassName()).toBe(
      'mt-auto flex flex-col gap-2 p-4',
    )
  })

  test('use the exact origin title and description strings', () => {
    expect(Drawer.drawerTitleClassName()).toBe(
      'cn-font-heading text-base font-medium text-foreground',
    )
    expect(Drawer.drawerDescriptionClassName()).toBe(
      'text-sm text-muted-foreground',
    )
  })

  test('preserves custom classes through cn helpers', () => {
    expect(Drawer.drawerClassName({ className: 'custom-root' })).toContain(
      'custom-root',
    )
    expect(
      Drawer.drawerOverlayClassName({ className: 'custom-overlay' }),
    ).toContain('custom-overlay')
    expect(
      Drawer.drawerContentClassName({ className: 'custom-content' }),
    ).toContain('custom-content')
    expect(
      Drawer.drawerHeaderClassName({ className: 'custom-header' }),
    ).toContain('custom-header')
    expect(
      Drawer.drawerFooterClassName({ className: 'custom-footer' }),
    ).toContain('custom-footer')
  })
})

describe('shadcn/drawer view', () => {
  test('adds shadcn slots, direction, and classes over Base UI Drawer attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewDrawer({ direction: 'right' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="drawer-overlay"]')).toHaveAttr(
          'class',
          Drawer.drawerOverlayClassName(),
        ),
        Scene.expect(Scene.role('button', { name: 'Open Drawer' })).toHaveAttr(
          'data-slot',
          'drawer-trigger',
        ),
        Scene.expect(Scene.selector('[data-slot="drawer-content"]')).toHaveAttr(
          'data-vaul-drawer-direction',
          'right',
        ),
        Scene.expect(Scene.selector('[data-slot="drawer-content"]')).toHaveAttr(
          'data-placement',
          'right',
        ),
        Scene.expect(Scene.selector('[data-slot="drawer-content"]')).toHaveAttr(
          'class',
          Drawer.drawerContentClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="drawer-header"]')).toHaveAttr(
          'class',
          Drawer.drawerHeaderClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="drawer-footer"]')).toHaveAttr(
          'class',
          Drawer.drawerFooterClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="drawer-title"]')).toHaveAttr(
          'class',
          Drawer.drawerTitleClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="drawer-description"]'),
        ).toHaveAttr('class', Drawer.drawerDescriptionClassName()),
        Scene.expect(Scene.role('button', { name: 'Cancel' })).toHaveAttr(
          'data-slot',
          'drawer-close',
        ),
      )
    }).not.toThrow()
  })

  test('passes Base UI modal, disabled, and RTL attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewDrawer({
            dir: 'rtl',
            direction: 'left',
            isDisabled: true,
            modal: false,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="drawer"]')).toHaveAttr(
          'data-modal',
          'false',
        ),
        Scene.expect(Scene.selector('#activity-drawer')).toHaveAttr(
          'aria-modal',
          'false',
        ),
        Scene.expect(Scene.selector('[data-slot="drawer-content"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-slot="drawer-content"]')).toHaveAttr(
          'class',
          Drawer.drawerContentClassName({ dir: 'rtl' }),
        ),
        Scene.expect(Scene.role('button', { name: 'Open Drawer' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Cancel' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/drawer installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/drawer',
      '@base-ui-components/react/drawer',
      'lucide-react',
      'react',
      'react-dom',
      'recharts',
      "from 'vaul'",
      'from "vaul"',
      '@/components/language-selector',
      '@/hooks/use-media-query',
      '@/styles/base-nova/ui/drawer',
      '@/styles/base-nova/ui-rtl/drawer',
      '@/styles/base-nova/ui/button',
      '@/styles/base-nova/ui/dialog',
      '@/styles/base-nova/ui/input',
      '@/styles/base-nova/ui/label',
      '@/lib/utils',
      'shadcn/dialog',
      'shadcn/input',
      'shadcn/label',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/drawer/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    const installableSource = `${indexModule.default}\n${examplesModule.default}`

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/drawer/index.ts',
      'src/registry/shadcn/drawer/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSource.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
