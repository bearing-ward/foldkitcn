/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  SelectAlignItem,
  SelectDemo,
  SelectDisabled,
  SelectGroups,
  SelectInvalid,
  SelectRtl,
  SelectScrollable,
} from './examples'
import * as Select from './index'
import type { SelectItemDescriptor, ViewConfig } from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

const fruitItems: ReadonlyArray<SelectItemDescriptor> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'grapes', label: 'Grapes', isDisabled: true },
]

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewSelect =
  (
    config: Omit<ViewConfig<Message>, 'id' | 'items' | 'open' | 'toView'> &
      Readonly<{ open?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Select.view<Message>({
      id: 'profile-select',
      items: fruitItems,
      open: config.open ?? true,
      placeholder: 'Select a fruit',
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button(
              [...attributes.trigger],
              [
                h.span(
                  [...attributes.value],
                  [
                    Select.displayValue({
                      items: fruitItems,
                      placeholder: 'Select a fruit',
                      value: config.value,
                    }),
                  ],
                ),
                Select.chevronDownIcon(attributes.icon),
              ],
            ),
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
                              [...attributes.scrollUp.root],
                              [Select.chevronUpIcon([])],
                            ),
                            h.div(
                              [...attributes.list.root],
                              [
                                h.div(
                                  [...attributes.group],
                                  [
                                    h.div(
                                      [...attributes.groupLabel],
                                      ['Fruits'],
                                    ),
                                    ...attributes.items.map(itemAttributes =>
                                      h.div(
                                        [...itemAttributes.root],
                                        [
                                          h.span(
                                            [...itemAttributes.text],
                                            [itemAttributes.item.label],
                                          ),
                                          h.span(
                                            [...itemAttributes.indicator],
                                            [Select.checkIcon([])],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                h.div([...attributes.separator], []),
                              ],
                            ),
                            h.div(
                              [...attributes.scrollDown.root],
                              [Select.chevronDownIcon([])],
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

describe('shadcn/select class helpers', () => {
  test('exports Effect Schema literals for sizes', () => {
    expect(S.decodeUnknownSync(Select.SelectSize)('sm')).toBe('sm')
  })

  test.each(Select.selectSizeValues)(
    'supports %s trigger size classes',
    size => {
      expect(Select.selectTriggerClassName()).toContain('data-[size=sm]:h-7')
      expect(size).toMatch(/default|sm/u)
    },
  )

  test('uses the exact origin slot class strings for position, value, and group parts', () => {
    expect(Select.selectPositionerClassName()).toBe('isolate z-50')
    expect(Select.selectValueClassName()).toBe('flex flex-1 text-left')
    expect(Select.selectValueClassName({ dir: 'rtl' })).toBe(
      'flex flex-1 text-start',
    )
    expect(Select.selectGroupClassName()).toBe('scroll-my-1 p-1')
  })

  test('uses the exact origin slot class strings for label and separator parts', () => {
    expect(Select.selectLabelClassName()).toBe(
      'px-1.5 py-1 text-xs text-muted-foreground',
    )
    expect(Select.selectSeparatorClassName()).toBe(
      'pointer-events-none -mx-1 my-1 h-px bg-border',
    )
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      Select.selectTriggerClassName({ className: 'custom-select w-24 w-40' }),
    ).toContain('w-40')
    expect(
      Select.selectContentClassName({ className: 'custom-content' }),
    ).toContain('custom-content')
    expect(Select.selectItemClassName({ dir: 'rtl' })).toContain('ps-1.5')
    expect(Select.selectItemIndicatorClassName({ dir: 'rtl' })).toContain(
      'end-2',
    )
  })
})

describe('shadcn/select view', () => {
  test('adds shadcn slots to root, trigger, value, icon, content, group, label, item, separator, and scroll buttons', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSelect({ value: 'banana' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="select"]')).toHaveAttr(
          'data-side',
          'bottom',
        ),
        Scene.expect(Scene.selector('[data-slot="select-trigger"]')).toHaveAttr(
          'data-size',
          'default',
        ),
        Scene.expect(Scene.selector('[data-slot="select-value"]')).toHaveAttr(
          'class',
          Select.selectValueClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="select-icon"]')).toHaveAttr(
          'aria-hidden',
          'true',
        ),
        Scene.expect(Scene.selector('#profile-select-positioner')).toHaveAttr(
          'class',
          Select.selectPositionerClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="select-content"]')).toHaveAttr(
          'class',
          Select.selectContentClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="select-group"]')).toHaveAttr(
          'class',
          Select.selectGroupClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="select-label"]')).toHaveAttr(
          'class',
          Select.selectLabelClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="select-item"]')).toHaveAttr(
          'class',
          Select.selectItemClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="select-separator"]'),
        ).toHaveAttr('class', Select.selectSeparatorClassName()),
        Scene.expect(
          Scene.selector('[data-slot="select-scroll-up-button"]'),
        ).toHaveAttr('class', Select.selectScrollUpClassName()),
        Scene.expect(
          Scene.selector('[data-slot="select-scroll-down-button"]'),
        ).toHaveAttr('class', Select.selectScrollDownClassName()),
      )
    }).not.toThrow()
  })

  test('passes Base UI disabled, invalid, placement, closed force-mounted, and RTL attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSelect({
            align: 'start',
            alignItemWithTrigger: false,
            contentClassName: 'min-w-48',
            dir: 'rtl',
            forceMount: true,
            isDisabled: true,
            isInvalid: true,
            open: false,
            side: 'inline-start',
            sideOffset: 8,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="select"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-slot="select-trigger"]')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(
          Scene.selector('[data-slot="select-trigger"]'),
        ).not.toHaveHandler('click'),
        Scene.expect(Scene.selector('[data-slot="select-content"]')).toHaveAttr(
          'hidden',
        ),
        Scene.expect(Scene.selector('[data-slot="select-content"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-slot="select-content"]')).toHaveAttr(
          'data-side',
          'inline-start',
        ),
        Scene.expect(Scene.selector('[data-slot="select-content"]')).toHaveAttr(
          'data-align',
          'start',
        ),
        Scene.expect(Scene.selector('[data-slot="select-content"]')).toHaveAttr(
          'data-side-offset',
          '8',
        ),
        Scene.expect(Scene.selector('[data-slot="select-content"]')).toHaveAttr(
          'data-align-trigger',
          'false',
        ),
        Scene.expect(Scene.selector('[data-slot="select-content"]')).toHaveAttr(
          'class',
          Select.selectContentClassName({
            className: 'min-w-48',
            dir: 'rtl',
          }),
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/select examples', () => {
  test('exports all dossier examples as renderable Foldkit Html', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SelectDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Fruits')).toExist(),
        Scene.expect(Scene.text('Apple')).toExist(),
      )
      Scene.scene(
        { update, view: () => SelectDisabled() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="select-trigger"]')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
      )
      Scene.scene(
        { update, view: () => SelectGroups() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Vegetables')).toExist(),
      )
      Scene.scene(
        { update, view: () => SelectScrollable() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Australia & Pacific')).toExist(),
      )
      Scene.scene(
        { update, view: () => SelectAlignItem() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-checked', 'true'),
      )
      Scene.scene(
        { update, view: () => SelectInvalid() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Please select a fruit.')).toExist(),
      )
      Scene.scene(
        { update, view: () => SelectRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="select"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/select installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/select',
      '@base-ui-components/react/select',
      '@radix-ui/react-select',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/base-nova/ui/select',
      '@/styles/base-nova/ui-rtl/select',
      '@/styles/base-nova/ui/field',
      '@/styles/base-nova/ui/label',
      '@/styles/base-nova/ui/switch',
      '@/lib/utils',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/select/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    const installableSource = `${indexModule.default}\n${examplesModule.default}`

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/select/index.ts',
      'src/registry/shadcn/select/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSource.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
