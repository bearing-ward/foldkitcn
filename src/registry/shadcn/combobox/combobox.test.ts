/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import * as Array from 'effect/Array'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  ComboxboxInputGroup,
  ComboboxAutoHighlight,
  ComboboxBasic,
  ComboboxDisabled,
  ComboboxInvalid,
  ComboboxMultiple,
  ComboboxPopup,
  ComboboxRtl,
  ComboboxWithClear,
  ComboboxWithCustomItems,
  ComboboxWithGroupsAndSeparator,
} from './examples'
import * as Combobox from './index'
import type { ComboboxItemDescriptor, ViewConfig } from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

const fruitItems: ReadonlyArray<ComboboxItemDescriptor> = [
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

const viewCombobox =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'inputValue' | 'items' | 'open' | 'toView'
    > &
      Readonly<{ open?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Combobox.view<Message>({
      id: 'profile-combobox',
      items: fruitItems,
      open: config.open ?? true,
      inputValue: '',
      placeholder: 'Select a fruit',
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.div(
              [...attributes.inputGroup],
              [
                h.input([...attributes.input]),
                h.button([...attributes.trigger], ['v']),
                h.button([...attributes.clear], ['x']),
              ],
            ),
            h.div(
              [...attributes.chips],
              attributes.chipItems.map(chip =>
                h.div(
                  [...chip.root],
                  [chip.item.label, h.button([...chip.remove], ['x'])],
                ),
              ),
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
                            h.div([...attributes.empty], []),
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
                                          ...(Array.isReadonlyArrayNonEmpty(
                                            itemAttributes.indicator,
                                          )
                                            ? [
                                                h.span(
                                                  [...itemAttributes.indicator],
                                                  [Combobox.checkIcon([])],
                                                ),
                                              ]
                                            : []),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                h.div([...attributes.separator], []),
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

describe('shadcn/combobox class helpers', () => {
  test('exports Effect Schema style options', () => {
    expect(
      S.decodeUnknownSync(Combobox.ComboboxStyleOptions)({}),
    ).toStrictEqual({})
  })

  test('uses base-nova input, content, list, item, and empty classes', () => {
    expect(Combobox.comboboxInputClassName()).toContain('h-8 w-full')
    expect(Combobox.comboboxContentClassName()).toContain(
      'group/combobox-content',
    )
    expect(Combobox.comboboxListClassName()).toContain('no-scrollbar')
    expect(Combobox.comboboxItemClassName()).toContain(
      'data-highlighted:bg-accent',
    )
    expect(Combobox.comboboxEmptyClassName()).toContain(
      'group-data-empty/combobox-content:flex',
    )
  })

  test('uses base-nova chip classes', () => {
    expect(Combobox.comboboxChipsClassName()).toContain('flex min-h-8')
  })

  test('preserves custom classes and RTL directional class variants', () => {
    expect(
      Combobox.comboboxContentClassName({
        className: 'w-40 w-60',
      }),
    ).toContain('w-60')
    expect(Combobox.comboboxContentClassName({ dir: 'rtl' })).toContain(
      'slide-in-from-start-2',
    )
    expect(Combobox.comboboxItemClassName({ dir: 'rtl' })).toContain('ps-1.5')
    expect(Combobox.comboboxChipClassName({ dir: 'rtl' })).toContain('pe-0')
    expect(Combobox.comboboxChipRemoveClassName({ dir: 'rtl' })).toContain(
      '-ms-1',
    )
  })
})

describe('shadcn/combobox view', () => {
  test('adds slots and classes to input, trigger, content, list, group, item, empty, and clear parts', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCombobox({ showClear: true, value: 'banana' }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="combobox"]')).toHaveAttr(
          'data-selection-mode',
          'single',
        ),
        Scene.expect(Scene.selector('[data-slot="input-group"]')).toHaveAttr(
          'class',
          Combobox.comboboxInputGroupClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="input-group-control"]'),
        ).toHaveAttr('class', Combobox.comboboxInputClassName()),
        Scene.expect(
          Scene.selector('[data-slot="combobox-trigger"]'),
        ).toHaveAttr('class', Combobox.comboboxTriggerClassName()),
        Scene.expect(Scene.selector('[data-slot="combobox-clear"]')).toHaveAttr(
          'class',
          Combobox.comboboxClearClassName(),
        ),
        Scene.expect(Scene.selector('#profile-combobox-positioner')).toHaveAttr(
          'class',
          Combobox.comboboxPositionerClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="combobox-content"]'),
        ).toHaveAttr('class', Combobox.comboboxContentClassName()),
        Scene.expect(Scene.selector('[data-slot="combobox-list"]')).toHaveAttr(
          'class',
          Combobox.comboboxListClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="combobox-label"]')).toHaveAttr(
          'class',
          Combobox.comboboxLabelClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="combobox-item"]')).toHaveAttr(
          'class',
          Combobox.comboboxItemClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="combobox-separator"]'),
        ).toHaveAttr('class', Combobox.comboboxSeparatorClassName()),
      )
    }).not.toThrow()
  })

  test('passes Base UI disabled, invalid, multiple chips, placement, and RTL attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCombobox({
            align: 'end',
            anchorToChips: true,
            dir: 'rtl',
            forceMount: true,
            isDisabled: true,
            isInvalid: true,
            open: false,
            selectionMode: 'multiple',
            side: 'inline-start',
            sideOffset: 8,
            values: ['apple', 'banana'],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="combobox"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(
          Scene.selector('[data-slot="input-group-control"]'),
        ).toHaveAttr('disabled', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="combobox-content"]'),
        ).toHaveAttr('hidden'),
        Scene.expect(
          Scene.selector('[data-slot="combobox-content"]'),
        ).toHaveAttr('data-side', 'inline-start'),
        Scene.expect(
          Scene.selector('[data-slot="combobox-content"]'),
        ).toHaveAttr('data-align', 'end'),
        Scene.expect(
          Scene.selector('[data-slot="combobox-content"]'),
        ).toHaveAttr('data-side-offset', '8'),
        Scene.expect(
          Scene.selector('[data-slot="combobox-content"]'),
        ).toHaveAttr('data-chips', 'true'),
        Scene.expect(Scene.selector('[data-slot="combobox-chips"]')).toHaveAttr(
          'role',
          'toolbar',
        ),
        Scene.expect(Scene.selector('[data-slot="combobox-chip"]')).toHaveAttr(
          'class',
          Combobox.comboboxChipClassName({ dir: 'rtl' }),
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/combobox examples', () => {
  test('exports all dossier examples as renderable Foldkit Html', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => ComboboxBasic() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Next.js')).toExist(),
      )
      Scene.scene(
        { update, view: () => ComboboxWithClear() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="combobox-clear"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => ComboboxWithGroupsAndSeparator() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Americas')).toExist(),
      )
      Scene.scene(
        { update, view: () => ComboxboxInputGroup() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="input-group"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => ComboboxMultiple() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="combobox-chip"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => ComboboxDisabled() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="input-group-control"]'),
        ).toHaveAttr('disabled', 'true'),
      )
      Scene.scene(
        { update, view: () => ComboboxInvalid() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Please select a framework.')).toExist(),
      )
      Scene.scene(
        { update, view: () => ComboboxPopup() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Argentina')).toExist(),
      )
      Scene.scene(
        { update, view: () => ComboboxAutoHighlight() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('#combobox-auto-highlight-item-next'),
        ).toHaveAttr('data-highlighted'),
      )
      Scene.scene(
        { update, view: () => ComboboxWithCustomItems() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Argentina')).toExist(),
      )
      Scene.scene(
        { update, view: () => ComboboxRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('الفئات')).toExist(),
      )
    }).not.toThrow()
  })
})
