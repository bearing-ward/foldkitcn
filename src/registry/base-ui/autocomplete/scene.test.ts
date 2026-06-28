import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Autocomplete from './index'
import type { AutocompleteItemDescriptor, ViewConfig } from './index'

import { readFileSync } from 'node:fs'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  value: S.String,
  highlightedValue: S.optional(S.String),
  lastOpenReason: Autocomplete.AutocompleteOpenChangeReason,
  lastValueReason: Autocomplete.AutocompleteValueChangeReason,
  lastHighlightReason: Autocomplete.AutocompleteHighlightChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  value: '',
  highlightedValue: undefined,
  lastOpenReason: 'none',
  lastValueReason: 'none',
  lastHighlightReason: 'none',
}

const fruitItems: ReadonlyArray<AutocompleteItemDescriptor> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes', isDisabled: true },
  { value: 'pineapple', label: 'Pineapple' },
]

// MESSAGE

const ChangedAutocompleteOpen = m('ChangedAutocompleteOpen', {
  open: S.Boolean,
  reason: Autocomplete.AutocompleteOpenChangeReason,
})
const ChangedAutocompleteValue = m('ChangedAutocompleteValue', {
  value: S.String,
  label: S.optional(S.String),
  itemValue: S.optional(S.String),
  reason: Autocomplete.AutocompleteValueChangeReason,
})
const ChangedAutocompleteHighlight = m('ChangedAutocompleteHighlight', {
  value: S.optional(S.String),
  reason: Autocomplete.AutocompleteHighlightChangeReason,
  focusSelector: S.optional(S.String),
})
const Message = S.Union([
  ChangedAutocompleteOpen,
  ChangedAutocompleteValue,
  ChangedAutocompleteHighlight,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const firstMatchValue = (
  value: string,
): AutocompleteItemDescriptor['value'] | undefined =>
  Autocomplete.firstFilteredItem({
    value,
    items: fruitItems,
  })?.value

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedAutocompleteOpen: ({ open, reason }) => [
        evo(model, {
          open: () => open,
          highlightedValue: () =>
            open
              ? (model.highlightedValue ?? firstMatchValue(model.value))
              : undefined,
          lastOpenReason: () => reason,
        }),
        [],
      ],
      ChangedAutocompleteValue: ({ value, itemValue, reason }) => [
        evo(model, {
          open: () =>
            reason === 'item-press' || reason === 'keyboard-select'
              ? false
              : value.length > 0,
          value: () => value,
          highlightedValue: () =>
            reason === 'item-press' || reason === 'keyboard-select'
              ? itemValue
              : firstMatchValue(value),
          lastValueReason: () => reason,
        }),
        [],
      ],
      ChangedAutocompleteHighlight: ({ value, reason }) => [
        evo(model, {
          highlightedValue: () => value,
          lastHighlightReason: () => reason,
        }),
        [],
      ],
    }),
  )

// VIEW

const configured = (model: Model): Autocomplete.AutocompleteOptions => ({
  id: 'fruit-autocomplete',
  items: fruitItems,
  open: model.open,
  value: model.value,
  highlightedValue: model.highlightedValue,
  placeholder: 'Search fruit',
})

const viewAutocomplete =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'items' | 'open' | 'toView' | 'value'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()
    const options = configured(model)

    return Autocomplete.view<Message>({
      ...options,
      onOpenChange: change => ChangedAutocompleteOpen(change),
      onValueChange: change => ChangedAutocompleteValue(change),
      onHighlightChange: change => ChangedAutocompleteHighlight(change),
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
            h.div([...attributes.value], [attributes.valueText]),
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
                            h.div([...attributes.arrow.root], []),
                            h.div(
                              [...attributes.empty],
                              attributes.isEmpty ? ['No fruit found.'] : [],
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
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            h.div([...attributes.separator], []),
                          ],
                        ),
                      ],
                    ),
                  ]
                : [],
            ),
            h.p([], [`Open ${model.lastOpenReason}`]),
            h.p([], [`Value ${model.lastValueReason}`]),
            h.p([], [`Highlight ${model.lastHighlightReason}`]),
          ],
        ),
    })
  }

describe('base-ui/autocomplete helpers', () => {
  test('reuses combobox filtering while honoring autocomplete modes', () => {
    expect(
      Autocomplete.filteredItems({
        value: 'blue',
        items: fruitItems,
      }).map(item => item.value),
    ).toStrictEqual(['blueberry'])
    expect(
      Autocomplete.filteredItems({
        value: 'blue',
        mode: 'none',
        items: fruitItems,
      }).map(item => item.value),
    ).toStrictEqual(['apple', 'banana', 'blueberry', 'pineapple'])
    expect(
      Autocomplete.displayValue({
        value: 'ap',
        mode: 'inline',
        highlightedValue: 'apple',
        items: fruitItems,
      }),
    ).toBe('Apple')
  })

  test('exposes only implemented auto highlight schema values', () => {
    expect(
      S.decodeUnknownSync(Autocomplete.AutocompleteAutoHighlight)(true),
    ).toBeTruthy()
    expect(
      S.decodeUnknownSync(Autocomplete.AutocompleteAutoHighlight)(false),
    ).toBeFalsy()
    expect(() =>
      S.decodeUnknownSync(Autocomplete.AutocompleteAutoHighlight)('always'),
    ).toThrow(/boolean/u)
  })

  test('records deferred origin root inline and always-highlight semantics', () => {
    const manifest: {
      readonly parity: {
        readonly acceptedDeviationIds: ReadonlyArray<string>
      }
      readonly deviations: ReadonlyArray<{ readonly id: string }>
    } = JSON.parse(
      readFileSync('registry-src/base-ui/autocomplete/item.json', 'utf-8'),
    )
    const deviationIds = manifest.deviations.map(deviation => deviation.id)

    expect(deviationIds).toContain('base-ui-autocomplete-inline-root-deferred')
    expect(deviationIds).toContain(
      'base-ui-autocomplete-auto-highlight-always-deferred',
    )
    expect(manifest.parity.acceptedDeviationIds).toContain(
      'base-ui-autocomplete-inline-root-deferred',
    )
    expect(manifest.parity.acceptedDeviationIds).toContain(
      'base-ui-autocomplete-auto-highlight-always-deferred',
    )
  })
})

describe('base-ui/autocomplete view', () => {
  test('renders input-owned value, popup, listbox, empty, data attributes, and ARIA', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewAutocomplete({
            name: 'fruit',
            form: 'search-form',
            openOnInputClick: true,
            side: 'top',
            align: 'end',
            sideOffset: 4,
          }),
        },
        Scene.with({
          ...initialModel,
          open: true,
          value: 'zz',
        }),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'role',
          'combobox',
        ),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'aria-autocomplete',
          'list',
        ),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'aria-expanded',
          'true',
        ),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'aria-controls',
          'fruit-autocomplete-list',
        ),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'name',
          'fruit',
        ),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'form',
          'search-form',
        ),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'data-list-empty',
        ),
        Scene.expect(
          Scene.selector('#fruit-autocomplete-input-group'),
        ).toHaveAttr('data-list-empty'),
        Scene.expect(
          Scene.selector('#fruit-autocomplete-trigger'),
        ).not.toHaveAttr('data-placeholder'),
        Scene.expect(
          Scene.selector('#fruit-autocomplete-positioner'),
        ).toHaveAttr('data-side', 'top'),
        Scene.expect(
          Scene.selector('#fruit-autocomplete-positioner'),
        ).toHaveAttr('data-align', 'end'),
        Scene.expect(Scene.selector('#fruit-autocomplete-list')).toHaveAttr(
          'role',
          'listbox',
        ),
        Scene.expect(Scene.selector('#fruit-autocomplete-empty')).toHaveAttr(
          'aria-live',
          'polite',
        ),
        Scene.expect(Scene.text('No fruit found.')).toExist(),
      )
    }).not.toThrow()
  })

  test('typing filters, highlights the first match, and selects items as input values', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAutocomplete({ openOnInputClick: true }) },
        Scene.with(initialModel),
        Scene.click(Scene.selector('#fruit-autocomplete-input')),
        Scene.expect(Scene.text('Open input-press')).toExist(),
        Scene.type(Scene.selector('#fruit-autocomplete-input'), 'bl'),
        Scene.expect(Scene.text('Value input-change')).toExist(),
        Scene.expect(Scene.role('option', { name: 'Blueberry' })).toExist(),
        Scene.expect(Scene.role('option', { name: 'Apple' })).not.toExist(),
        Scene.expect(
          Scene.selector('#fruit-autocomplete-item-blueberry'),
        ).toHaveAttr('data-highlighted'),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'aria-activedescendant',
          'fruit-autocomplete-item-blueberry',
        ),
        Scene.click(Scene.role('option', { name: 'Blueberry' })),
        Scene.expect(Scene.text('Value item-press')).toExist(),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'value',
          'Blueberry',
        ),
        Scene.expect(Scene.selector('#fruit-autocomplete-value')).toHaveText(
          'Blueberry',
        ),
      )
    }).not.toThrow()
  })

  test('keyboard highlight and selection reuse the combobox navigation engine', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewAutocomplete({}),
        },
        Scene.with({ ...initialModel, open: true, highlightedValue: 'apple' }),
        Scene.keydown(Scene.selector('#fruit-autocomplete-input'), 'ArrowDown'),
        Scene.expect(
          Scene.selector('#fruit-autocomplete-item-banana'),
        ).toHaveAttr('data-highlighted'),
        Scene.expect(Scene.text('Highlight keyboard-navigation')).toExist(),
        Scene.keydown(Scene.selector('#fruit-autocomplete-input'), 'Enter'),
        Scene.expect(Scene.text('Value keyboard-select')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled items are excluded and disabled/read-only states suppress interaction', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAutocomplete({ forceMount: true }) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(Scene.role('option', { name: 'Grapes' })).not.toExist(),
      )
      Scene.scene(
        {
          update,
          view: viewAutocomplete({ isDisabled: true, forceMount: true }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'disabled',
          'true',
        ),
        Scene.expect(
          Scene.selector('#fruit-autocomplete-trigger'),
        ).not.toHaveHandler('click'),
        Scene.expect(
          Scene.selector('#fruit-autocomplete-item-apple'),
        ).not.toHaveHandler('click'),
      )
      Scene.scene(
        { update, view: viewAutocomplete({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'aria-readonly',
          'true',
        ),
        Scene.expect(
          Scene.selector('#fruit-autocomplete-input'),
        ).not.toHaveHandler('input'),
      )
    }).not.toThrow()
  })

  test('inline mode displays the highlighted completion without filtering static items', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewAutocomplete({ mode: 'inline' }),
        },
        Scene.with({
          ...initialModel,
          open: true,
          value: 'ap',
          highlightedValue: 'apple',
        }),
        Scene.expect(Scene.selector('#fruit-autocomplete-input')).toHaveAttr(
          'value',
          'Apple',
        ),
        Scene.expect(Scene.role('option', { name: 'Banana' })).toExist(),
        Scene.expect(
          Scene.selector('#fruit-autocomplete-item-apple'),
        ).not.toHaveAttr('data-selected'),
      )
    }).not.toThrow()
  })
})
